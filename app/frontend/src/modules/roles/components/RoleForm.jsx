import { useEffect, useState, useRef, useMemo } from 'react';
import { TextInput, Textarea, Button, Group, LoadingOverlay, Tabs } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import PermissionCheckboxList from './PermissionCheckboxList';
import { useUniqueCheck } from '../../../common/hooks/useUniqueCheck';
import UniqueTextField from '../../../common/components/UniqueTextField';
import { useRoles } from '../hooks/useRoles';


const RoleForm = ({
  role = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Role"
}) => {
  
  const { loadAllPermissions, allPermissions, permissionsLoading } = useRoles();
  const { 
    isAvailable, 
    isChecking, 
    checkAvailability 
  } = useUniqueCheck('roleName', { minLength: 1, maxLength: 50 });
  const { t } = useTranslation(['common', 'roles']);


  const [permissions, setPermissions] = useState([]);
  const initialPermissionsRef = useRef([]);


  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => {
        if (!value) return t('common:validation.required');
        if (value.length > 50) return t('common:validation.maxLength', { count: 50 });
        return null;
      },
      description: (value) => {
        if (value?.length > 255) return t('common:validation.maxLength', { count: 255 });
        return null;
      },
    },
    validateInputOnChange: true,
  });

  
  useEffect(() => {
    loadAllPermissions();
  }, [loadAllPermissions]);

  useEffect(() => {
    if (role) {
      form.setInitialValues({
        name: role.name || '',
        description: role.description || '',
      });
      form.setValues({
        name: role.name || '',
        description: role.description || '',
      });
      
      const perms = role.permissions?.map(p => (typeof p === 'string' ? p : p.name)) || [];
      setPermissions(perms);
      initialPermissionsRef.current = perms;
    } 
    else {
      form.reset();
      setPermissions([]);
      initialPermissionsRef.current = [];
    }
  }, [role]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability(form.values.name, role?.name);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.values.name]);


  const isPermissionsDirty = useMemo(() => {
    const start = [...initialPermissionsRef.current].sort().join(',');
    const current = [...permissions].sort().join(',');
    return start !== current;
  }, [permissions]);

  const isFormDirty = form.isDirty() || isPermissionsDirty;


  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      description: values.description, 
      permissions: permissions,
    });
  };


  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading || permissionsLoading} />

      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic">{t('common:form.basicInfo')}</Tabs.Tab>
          <Tabs.Tab value="permissions">{t('roles:form.permissions')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="basic" pt="md">
          <UniqueTextField
            label={t('roles:form.name')}
            placeholder={t('roles:form.namePlaceholder')}
            required
            isChecking={isChecking}
            isAvailable={isAvailable}
            {...form.getInputProps('name')}
            mb="md"
          />
          <Textarea
            label={t('roles:form.description')}
            placeholder={t('roles:form.descriptionPlaceholder')}
            autosize
            minRows={3}
            {...form.getInputProps('description')}
          />
        </Tabs.Panel>

        <Tabs.Panel value="permissions" pt="md">
          <PermissionCheckboxList
            permissions={allPermissions}
            selected={permissions}
            onChange={setPermissions}
            loading={permissionsLoading}
          />
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="xl">
        <Button
          type="submit"
          loading={loading}
          disabled={loading || isChecking || !isFormDirty || !isAvailable}
        >
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default RoleForm;
