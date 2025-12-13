import React, { useEffect, useState } from 'react';
import { TextInput, Textarea, Select, Checkbox, Button, Group, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { reservationService } from '../../../../services/backend/reservationService';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../../../context/useAuth';

const OrderForm = ({
  orderType,
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Crear pedido',
  disabledFields = [],
}) => {
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

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
          ? 'Máx 30 caracteres'
          : null,
      customerName: (v) =>
        v && v.length > 100
          ? 'Máx 100 caracteres'
          : null,
      notes: (v) =>
        v && v.length > 255
          ? 'Máx 255 caracteres'
          : null,
      tableId: (v) =>
        orderType === 'dining' && !v
          ? 'Mesa obligatoria'
          : null,
    },
  });

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
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative', minWidth: 400, minHeight: 200 }}>
      <LoadingOverlay visible={submitting || loadingTables || loading} />
      <TextInput
        label="Número de pedido"
        placeholder="Opcional"
        maxLength={30}
        {...form.getInputProps('orderNumber')}
        mb="md"
        disabled={disabledFields.includes('orderNumber')}
      />
      <TextInput
        label="Nombre del cliente"
        placeholder="Opcional"
        maxLength={100}
        {...form.getInputProps('customerName')}
        mb="md"
        disabled={disabledFields.includes('customerName')}
      />
      <Textarea
        label="Notas"
        placeholder="Notas para cocina/barra"
        maxLength={255}
        autosize
        minRows={2}
        {...form.getInputProps('notes')}
        mb="md"
        disabled={disabledFields.includes('notes')}
      />
      {orderType === 'bar' && (
        <Checkbox
          label="Solo bebidas"
          {...form.getInputProps('drinksOnly', { type: 'checkbox' })}
          mb="md"
          disabled={disabledFields.includes('drinksOnly')}
        />
      )}
      {orderType === 'dining' && (
        <Select
          label="Mesa"
          placeholder="Selecciona una mesa"
          data={tables.map(table => ({
            value: table.id.toString(),
            label: table.name,
          }))}
          required
          searchable
          nothingfound="No hay mesas activas"
          {...form.getInputProps('tableId')}
          mb="md"
          disabled={disabledFields.includes('tableId')}
        />
      )}
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onCancel} disabled={submitting || loading}>Cancelar</Button>
        <Button type="submit" loading={submitting || loading}>{submitLabel}</Button>
      </Group>
    </form>
  );
};

export default OrderForm;
