import React, { useEffect, useState } from 'react';
import { TextInput, NumberInput, Button, Group,
        LoadingOverlay, Tabs, Select } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { reservationService } from '../../../services/backend/reservationService';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';
import { IconUser, IconInfoCircle } from '@tabler/icons-react';


const ReservationForm = ({
  reservation = null,
  onSubmit,
  loading = false,
  submitLabel = "Create Reservation"
}) => {
  
  const { t } = useTranslationWithLoading(['common', 'reservations']);
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);


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
      diningTableId: (value) => !value ? t('reservations:validation.tableRequired') : null,
      numberOfGuests: (value) => !value || value < 1 ? t('reservations:validation.guestsMin') : null,
      reservationDateTime: (value) => !value ? t('reservations:validation.dateRequired') : null,
      estimatedDurationMinutes: (value) => value < 30 || value > 240 ? t('reservations:validation.durationRange') : null,
      guestFirstName: (value) => !value ? t('reservations:validation.guestFirstNameRequired') : null,
      guestLastName: (value) => !value ? t('reservations:validation.guestLastNameRequired') : null,
      guestPhone: (value) => !value ? t('reservations:validation.guestPhoneRequired') : null,
      guestSpecialRequests: (value) => value && value.length > 500 ? t('reservations:validation.specialRequestsMaxLength') : null,
    },
  });

  useEffect(() => {
    const fetchTables = async () => {
      setTablesLoading(true);
      try {
        const activeTables = await reservationService.getActiveTables();
        setTables(activeTables);
      } 
      catch (error) {
        setTables([]);
        console.error('Error:', error);
      } 
      finally {
        setTablesLoading(false);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    if (reservation) {
      form.setValues({
        diningTableId: reservation.diningTableId || '',
        numberOfGuests: reservation.numberOfGuests || 1,
        reservationDateTime: reservation.reservationDateTime ? new Date(reservation.reservationDateTime) : null,
        estimatedDurationMinutes: reservation.estimatedDurationMinutes || 120,
        guestFirstName: reservation.guestFirstName || '',
        guestLastName: reservation.guestLastName || '',
        guestPhone: reservation.guestPhone || '',
        guestSpecialRequests: reservation.guestSpecialRequests || '',
      });
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
          <Tabs.Tab value="basic" icon={<IconInfoCircle size="0.8rem" />}>
            {t('reservations:form.basicInfo')}
          </Tabs.Tab>
          <Tabs.Tab value="guest" icon={<IconUser size="0.8rem" />}>
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
          <TextInput
            label={t('reservations:form.guestSpecialRequests')}
            placeholder={t('reservations:form.guestSpecialRequestsPlaceholder')}
            maxLength={500}
            {...form.getInputProps('guestSpecialRequests')}
            mb="md"
          />
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
