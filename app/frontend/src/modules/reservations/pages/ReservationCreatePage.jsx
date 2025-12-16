import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import ReservationForm from '../components/ReservationForm';
import { useReservations } from '../hooks/useReservations';
import { useTranslation } from 'react-i18next';


const ReservationCreatePage = () => {
  
  const navigate = useNavigate();
  const { createReservation, loading: createLoading } = useReservations();
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'reservations']);


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
