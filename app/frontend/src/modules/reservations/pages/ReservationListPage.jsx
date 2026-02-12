import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../common/hooks/usePagination';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import { useReservations } from '../hooks/useReservations';
import { getNavigationConfig } from '../../../utils/navigationConfig';
import StatusButton from '../../../common/components/StatusButton';


const ReservationListPage = () => {
  
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { 
    reservations, 
    loading,
    loadReservations,
    deleteReservation, 
    updateReservationStatus
  } = useReservations();
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const pagination = usePagination(reservations, DEFAULT_PAGE_SIZE);
  const { t } = useTranslation(['common', 'reservations']);


  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleEdit = (reservation) => {
    navigate(`/reservations/${reservation.id}/edit`);
  };

  const handleDelete = (reservation) => {
    setReservationToDelete(reservation);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (reservationToDelete) {
      await deleteReservation(reservationToDelete.id);
      closeDeleteModal();
      setReservationToDelete(null);
    }
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'reservations');

  const columns = [
    {
      key: 'id',
      title: t('reservations:list.id'),
      render: (r) => <Text weight={500}>#{r.id}</Text>
    },
    {
      key: 'diningTableName',
      title: t('reservations:list.diningTable'),
      render: (r) => <Text>{r.diningTableName}</Text>
    },
    {
      key: 'status',
      title: t('reservations:list.status'),
      render: (reservation) => (
        <StatusButton
          module="reservations"
          currentStatus={reservation.status}
          size="sm"
          onChange={(newStatus) => updateReservationStatus(reservation.id, newStatus)}
          disabled={loading}
          readOnly={!hasPermission(PERMISSIONS.RESERVATION_EDIT)}
        />
      ),
    },
    {
      key: 'guest',
      title: t('reservations:list.guest'),
      render: (r) => (
        <Group>
          <IconUser size="1rem" />
          <Text>{[r.guestFirstName, r.guestLastName].filter(Boolean).join(' ')}</Text>
        </Group>
      )
    },
    {
      key: 'numberOfGuests',
      title: t('reservations:list.numberOfGuests'),
      render: (r) => <Text>{r.numberOfGuests}</Text>
    },
    {
      key: 'reservationDateTime',
      title: t('reservations:list.reservationDateTime'),
      render: (r) => (
        <Text size="sm">
          {r.reservationDateTime ? new Date(r.reservationDateTime).toLocaleString() : 'N/A'}
        </Text>
      )
    }
  ];

  
  return (
    <>
      <ManagementLayout
        title={t('reservations:management.title')}
        icon={moduleConfig?.icon}
        iconColor={moduleConfig?.color}
        breadcrumbs={[{ title: t('reservations:management.list'), href: '/reservations' }]}
        showCreateButton={true}
        createButtonLabel={t('reservations:list.newReservation')}
        onCreateClick={() => navigate('/reservations/new')}
        createButtonDisabled={!hasPermission(PERMISSIONS.RESERVATION_CREATE)}
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading && !deleteModalOpened} overlayblur={2} />
            <DataTable
              columns={columns}
              data={pagination.paginatedData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={hasPermission(PERMISSIONS.RESERVATION_EDIT)}
              canDelete={hasPermission(PERMISSIONS.RESERVATION_DELETE)}
              loading={loading}
              paginationProps={pagination}
            />
        </div>
      </ManagementLayout>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('common:modal.titleDelete')}
        size="sm"
      >
        <Text mb="md">
          {t('common:modal.messageDeleteWithId', { id: reservationToDelete?.id })}
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={closeDeleteModal}>
            {t('common:modal.cancel')}
          </Button>
          <Button color="red" onClick={confirmDelete} loading={loading}>
            {t('common:modal.confirm')}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default ReservationListPage;
