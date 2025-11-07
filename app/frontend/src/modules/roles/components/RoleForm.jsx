import React, { useEffect } from 'react';
import { TextInput, Textarea, Button, Group, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';


const RoleForm = ({ 
  role = null, 
  onSubmit, 
  loading = false,
  submitLabel = "Create Role"
}) => {
  
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => {
        if (!value) return 'Name is required';
        if (value.length > 50) return 'Name cannot exceed 50 characters';
        return null;
      },
      description: (value) => {
        if (value && value.length > 255) return 'Description cannot exceed 255 characters';
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
        label="Role Name"
        placeholder="Enter role name"
        required
        maxLength={50}
        {...form.getInputProps('name')}
        mb="md"
      />

      <Textarea
        label="Description"
        placeholder="Enter role description"
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
