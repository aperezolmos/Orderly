import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import ReservationForm from '../components/ReservationForm';
import { useReservations } from '../hooks/useReservations';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const ReservationCreatePage = () => {
  
  const navigate = useNavigate();
  const { createReservation, loading, error, clearError } = useReservations();
  const { t } = useTranslation(['common', 'reservations']);


  const handleSubmit = async (reservationData) => {
    await createReservation(reservationData);
    navigate('/reservations', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'reservations');

  const breadcrumbs = [
    { title: t('reservations:management.list'), href: '/reservations' },
    { title: t('reservations:management.create'), href: '/reservations/new' }
  ];
  

  return (
    <FormLayout
      title={t('reservations:management.create')}
      icon={moduleConfig?.icon}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <ReservationForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('reservations:form.create')}
      />
    </FormLayout>
  );
};

export default ReservationCreatePage;
