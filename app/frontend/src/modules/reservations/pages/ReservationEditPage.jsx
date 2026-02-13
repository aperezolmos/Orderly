import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import ReservationForm from '../components/ReservationForm';
import { useReservations } from '../hooks/useReservations';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const ReservationEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentReservation,
    loading,
    error,
    updateReservation,
    loadReservationById,
    clearError,
  } = useReservations();
  const { t } = useTranslation(['common', 'reservations']);


  useEffect(() => {
    if (id) loadReservationById(Number.parseInt(id));
  }, [id, loadReservationById]);

  const handleSubmit = async (reservationData) => {
    await updateReservation(Number.parseInt(id), reservationData);
    navigate('/reservations', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'reservations');

  const breadcrumbs = [
    { title: t('reservations:management.list'), href: '/reservations' },
    { title: t('reservations:management.edit'), href: `/reservations/${id}/edit` }
  ];
  

  return (
    <FormLayout
      title={t('reservations:management.edit')}
      icon={IconEdit}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <ReservationForm
        reservation={currentReservation}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('reservations:form.update')}
      />
    </FormLayout>
  );
};

export default ReservationEditPage;
