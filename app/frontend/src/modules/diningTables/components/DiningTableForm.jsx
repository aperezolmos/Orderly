import React, { useEffect } from 'react';
import { TextInput, NumberInput, Button, Group, LoadingOverlay, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const DiningTableForm = ({
  table = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Table"
}) => {
  
  const { t } = useTranslationWithLoading(['common', 'diningTables']);


  const form = useForm({
    initialValues: {
      name: '',
      capacity: 1,
      locationDescription: '',
    },
    validate: {
      name: (value) => {
        if (!value) return t('diningTables:validation.nameRequired');
        if (value.length > 10) return t('diningTables:validation.nameMaxLength');
        return null;
      },
      capacity: (value) => {
        if (!value || value < 1) return t('diningTables:validation.capacityMin');
        return null;
      },
      locationDescription: (value) => {
        if (value && value.length > 100) return t('diningTables:validation.locationMaxLength');
        return null;
      },
    },
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

  const handleSubmit = async (values) => {
    await onSubmit(values);
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading} />
      <TextInput
        label={t('diningTables:form.name')}
        placeholder={t('diningTables:form.namePlaceholder')}
        required
        maxLength={10}
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
      <TextInput
        label={t('diningTables:form.locationDescription')}
        placeholder={t('diningTables:form.locationDescriptionPlaceholder')}
        maxLength={100}
        {...form.getInputProps('locationDescription')}
        mb="md"
      />
      <Group position="right" mt="xl">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default DiningTableForm;
