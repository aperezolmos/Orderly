import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, Badge, Box, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { useFoods } from '../hooks/useFoods';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const FoodListPage = () => {
  
  const navigate = useNavigate();
  const { foods, loading, deleteFood } = useFoods();
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const { t, ready, isNamespaceLoading } = useTranslationWithLoading(['common', 'foods']);


  if (!ready || isNamespaceLoading) {
    return (
      <ManagementLayout
        title={t('common:app.loading')}
        breadcrumbs={[]}
      >
        <Box style={{ height: '200px', position: 'relative' }}>
          <LoadingOverlay visible={true} />
        </Box>
      </ManagementLayout>
    );
  }

  const handleEdit = (food) => {
    navigate(`/foods/${food.id}/edit`);
  };

  const handleDelete = (food) => {
    setFoodToDelete(food);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (foodToDelete) {
      await deleteFood(foodToDelete.id);
      closeDeleteModal();
      setFoodToDelete(null);
    }
  };

  const columns = [
    {
      key: 'id',
      title: t('foods:list.id'),
      render: (food) => <Text weight={500}>#{food.id}</Text>
    },
    {
      key: 'name',
      title: t('foods:list.name'),
      render: (food) => <Text>{food.name}</Text>
    },
    {
      key: 'foodGroup',
      title: t('foods:list.foodGroup'),
      render: (food) => (
        <Badge size="sm" variant="light">
          {t(`foods:foodGroups.${food.foodGroup}`)}
        </Badge>
      )
    },
    {
      key: 'servingWeightGrams',
      title: t('foods:list.servingWeightGrams'),
      render: (food) => (
        <Text size="sm">
          {food.servingWeightGrams ? `${food.servingWeightGrams} g` : '-'}
        </Text>
      )
    },
    {
      key: 'createdAt',
      title: t('foods:list.created'),
      render: (food) => (
        <Text size="sm">
          {food.createdAt ? new Date(food.createdAt).toLocaleDateString() : 'N/A'}
        </Text>
      )
    }
  ];
  

  return (
    <>
      <ManagementLayout
        title={t('foods:management.title')}
        breadcrumbs={[{ title: t('foods:management.list'), href: '/foods' }]}
        showCreateButton={true}
        createButtonLabel={t('foods:list.newFood')}
        onCreateClick={() => navigate('/foods/new')}
      >
        <DataTable
          columns={columns}
          data={foods}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </ManagementLayout>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('foods:deleteModal.title')}
        size="sm"
      >
        <Text mb="md">
          {t('foods:deleteModal.message', { name: foodToDelete?.name })}
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={closeDeleteModal}>
            {t('foods:deleteModal.cancel')}
          </Button>
          <Button color="red" onClick={confirmDelete} loading={loading}>
            {t('foods:deleteModal.confirm')}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default FoodListPage;
