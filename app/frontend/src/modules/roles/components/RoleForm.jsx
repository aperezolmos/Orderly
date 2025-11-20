import React, { useEffect, useState } from 'react';
import { TextInput, Textarea, Button, Group, LoadingOverlay, Tabs } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';
import { roleService } from '../../../services/backend/roleService';
import PermissionCheckboxList from './PermissionCheckboxList';


const RoleForm = ({
  role = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Role"
}) => {
  
  const { t } = useTranslationWithLoading(['common', 'roles']);
  const [allPermissions, setAllPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);


  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      permissions: [],
    },
    validate: {
      name: (value) => {
        if (!value) return t('roles:form.nameRequired');
        if (value.length > 50) return t('roles:form.nameMaxLength');
        return null;
      },
      description: (value) => {
        if (value && value.length > 255) return t('roles:form.descriptionMaxLength');
        return null;
      },
    },
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      setPermissionsLoading(true);
      try {
        const perms = await roleService.getAllPermissions();
        setAllPermissions(perms);
      } finally {
        setPermissionsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (role) {
      form.setValues({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions ? role.permissions.map(p => (typeof p === 'string' ? p : p.name || p)) : [],
      });
    } else {
      form.setValues({
        name: '',
        description: '',
        permissions: [],
      });
    }
  }, [role]);

  const handleSubmit = async (values) => {
    await onSubmit({
      name: values.name,
      description: values.description,
      permissions: values.permissions,
    });
  };


  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading} />

      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic">{t('roles:form.basicInfo')}</Tabs.Tab>
          <Tabs.Tab value="permissions">{t('roles:form.permissions')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="basic" pt="xs">
          <TextInput
            label={t('roles:form.name')}
            placeholder={t('roles:form.namePlaceholder')}
            required
            maxLength={50}
            {...form.getInputProps('name')}
            mb="md"
          />

          <Textarea
            label={t('roles:form.description')}
            placeholder={t('roles:form.descriptionPlaceholder')}
            maxLength={255}
            autosize
            minRows={3}
            {...form.getInputProps('description')}
            mb="xl"
          />
        </Tabs.Panel>

        <Tabs.Panel value="permissions" pt="xs">
          <PermissionCheckboxList
            permissions={allPermissions}
            selected={form.values.permissions}
            onChange={(selected) => form.setFieldValue('permissions', selected)}
            loading={permissionsLoading}
            title={t('roles:form.permissions')}
            helpText={t('roles:form.permissionsHelp')}
          />
        </Tabs.Panel>
      </Tabs>

      <Group position="right" mt="xl">
        <Button
          type="submit"
          loading={loading}
          disabled={!form.isDirty()}
        >
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default RoleForm;
