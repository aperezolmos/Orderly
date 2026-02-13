import { useEffect, useState } from 'react';
import { TextInput, Textarea, NumberInput, Button, Group,
        LoadingOverlay, Tabs, Select, Alert, Text } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { diningTableService } from '../../../services/backend/diningTableService';
import { useTranslation } from 'react-i18next';
import { IconUser, IconInfoCircle, IconAlertCircle } from '@tabler/icons-react';


const ReservationForm = ({
  reservation = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Reservation"
}) => {
  
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const { t } = useTranslation(['common', 'reservations']);


  const form = useForm({
    initialValues: {
      diningTableId: '',
      numberOfGuests: 1,
      reservationDateTime: null,
      estimatedDurationMinutes: 120,
      guestFirstName: '',
      guestLastName: '',
      guestPhone: '',
      guestSpecialRequests: '',
    },
    validate: {
      diningTableId: (value) => (value ? null : t('common:validation.required')),
      numberOfGuests: (value) => !value || value < 1 ? t('common:validation.positive') : null,
      reservationDateTime: (value) => {
        if (!value) return t('common:validation.required');
        if (value <= new Date()) return t('reservations:validation.futureDate');
        return null;
      },
      estimatedDurationMinutes: (value) => value < 30 || value > 240 
        ? t('reservations:validation.durationRange', { minDuration: 30, maxDuration: 240 }) : null,
      guestFirstName: (value) => (value ? null : t('common:validation.required')),
      guestLastName: (value) => (value ? null : t('common:validation.required')),
      guestPhone: (value) => (value ? null : t('common:validation.required')),
      guestSpecialRequests: (value) => value && value.length > 500 ? t('common:validation.maxLength', { count: 500 }) : null,
    },
    validateInputOnChange: true,
  });

  useEffect(() => {
    setTablesLoading(true);
    diningTableService.getActiveTables()
      .then(setTables)
      .finally(() => setTablesLoading(false));
  }, []);

  useEffect(() => {
    if (reservation) {
      form.setValues({
        diningTableId: reservation.diningTableId?.toString() || '',
        numberOfGuests: reservation.numberOfGuests || 1,
        reservationDateTime: reservation.reservationDateTime ? new Date(reservation.reservationDateTime) : null,
        estimatedDurationMinutes: reservation.estimatedDurationMinutes || 120,
        guestFirstName: reservation.guestFirstName || '',
        guestLastName: reservation.guestLastName || '',
        guestPhone: reservation.guestPhone || '',
        guestSpecialRequests: reservation.guestSpecialRequests || '',
      });
      form.resetDirty();
    }
  }, [reservation]);

  const formatLocalDateTime = (value) => {
    return new Date(value).toLocaleString('sv-SE').replace(' ', 'T');
  };

  const handleSubmit = async (values) => {
    await onSubmit({
        ...values,
        reservationDateTime: values.reservationDateTime
        ? formatLocalDateTime(values.reservationDateTime)
        : null,
    });
  };


  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={loading || tablesLoading} />
      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic" leftSection={<IconInfoCircle size="0.8rem" />}>
            {t('common:form.basicInfo')}
          </Tabs.Tab>
          <Tabs.Tab value="guest" leftSection={<IconUser size="0.8rem" />}>
            {t('reservations:form.guestInfo')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="basic" pt="xs">
          <Select
            label={t('reservations:form.diningTable')}
            placeholder={t('reservations:form.diningTablePlaceholder')}
            data={tables.map(table => ({
              value: table.id.toString(),
              label: table.name
            }))}
            required
            searchable
            nothingfound={t('reservations:form.noTables')}
            {...form.getInputProps('diningTableId')}
            mb="md"
          />
          <NumberInput
            label={t('reservations:form.numberOfGuests')}
            placeholder={t('reservations:form.numberOfGuestsPlaceholder')}
            required
            min={1}
            {...form.getInputProps('numberOfGuests')}
            mb="md"
          />
          <DateTimePicker
            label={t('reservations:form.reservationDateTime')}
            placeholder={t('reservations:form.reservationDateTimePlaceholder')}
            required
            {...form.getInputProps('reservationDateTime')}
            mb="md"
            minDate={new Date()}
          />
          <NumberInput
            label={t('reservations:form.estimatedDurationMinutes')}
            placeholder={t('reservations:form.estimatedDurationMinutesPlaceholder')}
            min={30}
            max={240}
            step={15}
            {...form.getInputProps('estimatedDurationMinutes')}
            mb="md"
          />

          <Alert icon={<IconAlertCircle size="1rem" />} color="blue" mb="md">
            <Text size="sm">{t('reservations:form.requiredFieldsInfo')}</Text>
          </Alert>
        </Tabs.Panel>

        <Tabs.Panel value="guest" pt="xs">         
          <Group grow mb="md">
            <TextInput
              label={t('reservations:form.guestFirstName')}
              placeholder={t('reservations:form.guestFirstNamePlaceholder')}
              required
              maxLength={100}
              {...form.getInputProps('guestFirstName')}
            />
            <TextInput
              label={t('reservations:form.guestLastName')}
              placeholder={t('reservations:form.guestLastNamePlaceholder')}
              required
              maxLength={100}
              {...form.getInputProps('guestLastName')}
            />
          </Group>
          <TextInput
            label={t('reservations:form.guestPhone')}
            placeholder={t('reservations:form.guestPhonePlaceholder')}
            required
            maxLength={100}
            {...form.getInputProps('guestPhone')}
            mb="md"
          />
          <Textarea
            label={t('reservations:form.guestSpecialRequests')}
            placeholder={t('reservations:form.guestSpecialRequestsPlaceholder')}
            maxLength={500}
            autosize
            minRows={3}
            {...form.getInputProps('guestSpecialRequests')}
            mb="md"
          />

          <Alert icon={<IconAlertCircle size="1rem" />} color="blue" mb="md">
            <Text size="sm">{t('reservations:form.requiredFieldsInfo')}</Text>
          </Alert>
        </Tabs.Panel>
      </Tabs>
      <Group position="right" mt="xl">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </Group>
    </form>
  );
};

export default ReservationForm;
