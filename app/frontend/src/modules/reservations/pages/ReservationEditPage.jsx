import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormLayout from '../../../common/layouts/FormLayout';
import ReservationForm from '../components/ReservationForm';
import { reservationService } from '../../../services/backend/reservationService';
import { useTranslation } from 'react-i18next';


const ReservationEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'reservations']);


  useEffect(() => {
    const loadReservation = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reservationService.getReservationById(parseInt(id));
        setReservation(data);
      } 
      catch (err) {
        setError(err.message);
      } 
      finally {
        setLoading(false);
      }
    };
    if (id) loadReservation();
  }, [id]);

  const handleSubmit = async (reservationData) => {
    try {
      setSubmitting(true);
      setError(null);
      await reservationService.updateReservation(parseInt(id), reservationData);
      navigate('/reservations', { replace: true });
    } 
    catch (err) {
      setError(err.message);
      throw err;
    } 
    finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { title: t('reservations:management.list'), href: '/reservations' },
    { title: t('reservations:management.edit'), href: `/reservations/${id}/edit` }
  ];


  if (error && !loading) {
    return (
      <FormLayout
        title={t('reservations:management.edit')}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={() => setError(null)}
      >
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title={t('reservations:errors.loadError')}
          color="red"
        >
          <Text mb="md">{t('reservations:errors.notFound', { id })}</Text>
          <Text size="sm" color="dimmed">
            {t('reservations:errors.notFoundDetails')}
          </Text>
        </Alert>
      </FormLayout>
    );
  }
  

  return (
    <FormLayout
      title={t('reservations:management.edit')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={() => setError(null)}
    >
      <ReservationForm
        reservation={reservation}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel={t('reservations:form.update')}
      />
    </FormLayout>
  );
};

export default ReservationEditPage;
