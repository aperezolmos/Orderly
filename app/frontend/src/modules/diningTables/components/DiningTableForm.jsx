import { useEffect } from 'react';
import { Textarea, NumberInput, Button, Group, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { useUniqueCheck } from '../../../common/hooks/useUniqueCheck';
import UniqueTextField from '../../../common/components/UniqueTextField';


const DiningTableForm = ({
  table = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Table"
}) => {
  
  const { 
    isAvailable, 
    isChecking, 
    checkAvailability 
  } = useUniqueCheck('diningTableName', { minLength: 1, maxLength: 10 });

  const { t } = useTranslation(['common', 'diningTables']);


  const form = useForm({
    initialValues: {
      name: '',
      capacity: 1,
      locationDescription: '',
    },
    validate: {
      name: (value) => {
        if (!value) return t('common:validation.required');
        if (value.length > 10) return t('common:validation.maxLength', { count: 10 });
        return null;
      },
      capacity: (value) => {
        if (!value || value < 1) return t('common:validation.positive');
        return null;
      },
      locationDescription: (value) => {
        if (value && value.length > 100) return t('common:validation.maxLength', { count: 100 });
        return null;
      },
    },
    validateInputOnChange: true,
  });


  useEffect(() => {
    if (table) {
      form.setValues({
        name: table.name || '',
        capacity: table.capacity || 1,
        locationDescription: table.locationDescription || '',
      });
    }
  }, [table]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability(form.values.name, table?.name);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.values.name]);


  const handleSubmit = async (values) => {
    await onSubmit(values);
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading} />
      <UniqueTextField
        label={t('diningTables:form.name')}
        placeholder={t('diningTables:form.namePlaceholder')}
        required
        isChecking={isChecking}
        isAvailable={isAvailable}
        {...form.getInputProps('name')}
        mb="md"
      />
      <NumberInput
        label={t('diningTables:form.capacity')}
        placeholder={t('diningTables:form.capacityPlaceholder')}
        required
        min={1}
        {...form.getInputProps('capacity')}
        mb="md"
      />
      <Textarea
        label={t('diningTables:form.locationDescription')}
        placeholder={t('diningTables:form.locationDescriptionPlaceholder')}
        autosize
        minRows={3}
        {...form.getInputProps('locationDescription')}
        mb="md"
      />
      <Group justify="flex-end" mt="xl">
        <Button 
          type="submit" 
          loading={loading}
          disabled={loading || isChecking || !isAvailable}
        >
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default DiningTableForm;
