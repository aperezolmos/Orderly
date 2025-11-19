import React, { useEffect } from 'react';
import { TextInput, Textarea, Button, Group, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const RoleForm = ({ 
  role = null, 
  onSubmit, 
  loading = false,
  submitLabel = "Create Role"
}) => {
  
  const { t } = useTranslationWithLoading(['common', 'roles']);


  const form = useForm({
    initialValues: {
      name: '',
      description: '',
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

  const { setValues } = form;

  // For loading data when the role changes
  useEffect(() => {
    if (role) {
      setValues({
        name: role.name || '',
        description: role.description || '',
      });
    }
    else {
      // Reset for creation
      setValues({
        name: '',
        description: '',
      });
    }
  }, [role, setValues]);

  const handleSubmit = async (values) => {
    await onSubmit(values);
  };


  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading} />
      
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

      <Group position="right">
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
