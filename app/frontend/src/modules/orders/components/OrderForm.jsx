import { useEffect, useState } from 'react';
import { TextInput, Textarea, Select, Checkbox,
         Button, Group, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { reservationService } from '../../../services/backend/reservationService';
import { useAuth } from '../../../context/AuthContext';
import { useUniqueCheck } from '../../../common/hooks/useUniqueCheck';
import UniqueTextField from '../../../common/components/UniqueTextField';


const OrderForm = ({
  orderType,
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  submitLabel,
  disabledFields = [],
}) => {
  
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { 
    isAvailable, 
    isChecking, 
    checkAvailability 
  } = useUniqueCheck('orderNumber', { minLength: 0, maxLength: 30 });
  const { t } = useTranslation(['common', 'orders']);


  useEffect(() => {
    if (orderType === 'dining') {
      setLoadingTables(true);
      reservationService.getActiveTables()
        .then(setTables)
        .catch(() => setTables([]))
        .finally(() => setLoadingTables(false));
    }
  }, [orderType]);

  const form = useForm({
    initialValues: {
      orderNumber: initialValues.orderNumber || '',
      customerName: initialValues.customerName || '',
      notes: initialValues.notes || '',
      drinksOnly: initialValues.drinksOnly || false,
      tableId: initialValues.tableId ? String(initialValues.tableId) : '',
    },
    validate: {
      orderNumber: (v) =>
        v && v.length > 30
          ? t('common:validation.maxLength', { count: 30 })
          : null,
      customerName: (v) =>
        v && v.length > 100
          ? t('common:validation.maxLength', { count: 100 })
          : null,
      notes: (v) =>
        v && v.length > 255
          ? t('common:validation.maxLength', { count: 255 })
          : null,
      tableId: (v) =>
        orderType === 'dining' && !v
          ? t('orders:form.tablePlaceholder')
          : null,
    },
    validateInputOnChange: true,
  });


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAvailability(form.values.orderNumber, initialValues?.orderNumber);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.values.orderNumber]);


  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const dto = {
        orderNumber: values.orderNumber || undefined,
        orderType: orderType === 'bar' ? 'BAR' : 'DINING',
        customerName: values.customerName,
        notes: values.notes,
        employeeId: initialValues.employeeId || user?.id,
      };
      if (orderType === 'bar') {
        dto.drinksOnly = values.drinksOnly;
      }
      if (orderType === 'dining') {
        dto.tableId = Number(values.tableId);
      }
      await onSubmit(dto);
    } 
    catch (err) {
      notifications.show({
        title: t('common:app.error'),
        message: err.message,
        color: 'red',
      });
    } 
    finally {
      setSubmitting(false);
    }
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative', minWidth: 400, minHeight: 200 }}>
      <LoadingOverlay visible={submitting || loadingTables || loading} />
      <UniqueTextField
        label={t('orders:form.orderNumber')}
        placeholder={t('orders:form.orderNumberPlaceholder')}
        isChecking={isChecking}
        isAvailable={isAvailable}
        {...form.getInputProps('orderNumber')}
        mb="md"
        disabled={disabledFields.includes('orderNumber')}
      />
      <TextInput
        label={t('orders:form.customerName')}
        placeholder={t('orders:form.customerNamePlaceholder')}
        maxLength={100}
        {...form.getInputProps('customerName')}
        mb="md"
        disabled={disabledFields.includes('customerName')}
      />
      <Textarea
        label={t('orders:form.notes')}
        placeholder={t('orders:form.notesPlaceholder')}
        maxLength={255}
        autosize
        minRows={2}
        {...form.getInputProps('notes')}
        mb="md"
        disabled={disabledFields.includes('notes')}
      />
      {orderType === 'bar' && (
        <Checkbox
          label={t('orders:form.drinksOnly')}
          {...form.getInputProps('drinksOnly', { type: 'checkbox' })}
          mb="md"
          disabled={disabledFields.includes('drinksOnly')}
        />
      )}
      {orderType === 'dining' && (
        <Select
          label={t('orders:form.table')}
          placeholder={t('orders:form.tablePlaceholder')}
          data={tables.map(table => ({
            value: table.id.toString(),
            label: table.name,
          }))}
          required
          searchable
          nothingfound={t('orders:form.tablePlaceholder')}
          {...form.getInputProps('tableId')}
          mb="md"
          disabled={disabledFields.includes('tableId')}
        />
      )}
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onCancel} disabled={submitting || loading}>
          {t('common:app.cancel')}
        </Button>
        <Button 
          type="submit" 
          loading={submitting || loading}
          disabled={loading || isChecking || isAvailable === false}
        >
          {submitLabel || t('orders:form.create')}
        </Button>
      </Group>
    </form>
  );
};

export default OrderForm;
