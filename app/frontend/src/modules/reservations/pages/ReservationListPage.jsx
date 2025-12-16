import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash, IconUser } from '@tabler/icons-react';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { useReservations } from '../hooks/useReservations';
import { useTranslation } from 'react-i18next';


const ReservationListPage = () => {
  
  const navigate = useNavigate();
  const { reservations, loading, deleteReservation } = useReservations();
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const { t } = useTranslation(['common', 'reservations']);


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
      render: (r) => (
        <Badge color={r.status === 'CONFIRMED' ? 'blue' : r.status === 'SEATED' ? 'green' : r.status === 'COMPLETED' ? 'gray' : 'red'}>
          {t(`reservations:status.${r.status}`)}
        </Badge>
      )
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
        breadcrumbs={[{ title: t('reservations:management.list'), href: '/reservations' }]}
        showCreateButton={true}
        createButtonLabel={t('reservations:list.newReservation')}
        onCreateClick={() => navigate('/reservations/new')}
      >
        <DataTable
          columns={columns}
          data={reservations}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </ManagementLayout>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('reservations:deleteModal.title')}
        size="sm"
      >
        <Text mb="md">
          {t('reservations:deleteModal.message', { id: reservationToDelete?.id })}
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={closeDeleteModal}>
            {t('reservations:deleteModal.cancel')}
          </Button>
          <Button color="red" onClick={confirmDelete} loading={loading}>
            {t('reservations:deleteModal.confirm')}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default ReservationListPage;
