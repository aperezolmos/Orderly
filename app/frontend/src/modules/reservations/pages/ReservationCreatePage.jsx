import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LoadingOverlay } from '@mantine/core';
import FormLayout from '../../../common/layouts/FormLayout';
import ReservationForm from '../components/ReservationForm';
import { useReservations } from '../hooks/useReservations';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const ReservationCreatePage = () => {
  
  const navigate = useNavigate();
  const { createReservation, loading: createLoading } = useReservations();
  const [error, setError] = useState(null);
  const { t, ready, isNamespaceLoading } = useTranslationWithLoading(['common', 'reservations']);


  if (!ready || isNamespaceLoading) {
    return (
      <FormLayout
        title={t('common:app.loading')}
        breadcrumbs={[]}
        showBackButton={true}
      >
        <Box style={{ height: '200px', position: 'relative' }}>
          <LoadingOverlay visible={true} />
        </Box>
      </FormLayout>
    );
  }

  const handleSubmit = async (reservationData) => {
    try {
      setError(null);
      await createReservation(reservationData);
      navigate('/reservations', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const breadcrumbs = [
    { title: t('reservations:management.list'), href: '/reservations' },
    { title: t('reservations:management.create'), href: '/reservations/new' }
  ];
  

  return (
    <FormLayout
      title={t('reservations:management.create')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={createLoading}
      error={error}
      onClearError={() => setError(null)}
    >
      <ReservationForm
        onSubmit={handleSubmit}
        loading={createLoading}
        submitLabel={t('reservations:form.create')}
      />
    </FormLayout>
  );
};

export default ReservationCreatePage;
