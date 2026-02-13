import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, Badge, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../common/hooks/usePagination';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import { useFoods } from '../hooks/useFoods';
import { getNavigationConfig } from '../../../utils/navigationConfig';
import AllergensList from '../../products/components/AllergensList';


const FoodListPage = () => {
  
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { foods, loading, deleteFood, loadFoods } = useFoods();
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const pagination = usePagination(foods, DEFAULT_PAGE_SIZE);
  const { t } = useTranslation(['common', 'foods']);


  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

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


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'foods');

  const columns = [
    {
      key: 'id',
      title: t('foods:list.id'),
      render: (food) => <Text weight={500}>#{food.id}</Text>
    },
    {
      key: 'name',
      title: t('foods:list.name'),
      render: (food) => (
        <Button
          variant="transparent"
          color="blue"
          onClick={() => { setSelectedFood(food); openModal(); }}
          style={{ padding: 0, fontWeight: 500 }}
          title={t('common:form.details')}
        >
          {food.name}
        </Button>
      )
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
      key: 'updatedAt',
      title: t('common:list.updated'),
      render: (food) => (
        <Text size="sm">
          {food.updatedAt ? new Date(food.updatedAt).toLocaleString() : 'N/A'}
        </Text>
      )
    }
  ];
  

  return (
    <>
      <ManagementLayout
        title={t('foods:management.title')}
        icon={moduleConfig?.icon}
        iconColor={moduleConfig?.color}
        breadcrumbs={[{ title: t('foods:management.list'), href: '/foods' }]}
        showCreateButton={hasPermission(PERMISSIONS.FOOD_CREATE)}
        createButtonLabel={t('foods:list.newFood')}
        onCreateClick={() => navigate('/foods/new')}
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading && !deleteModalOpened} overlayblur={2} />
            <DataTable
              columns={columns}
              data={pagination.paginatedData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={hasPermission(PERMISSIONS.FOOD_EDIT)}
              canDelete={hasPermission(PERMISSIONS.FOOD_DELETE)}
              loading={loading}
              paginationProps={pagination}
            />
        </div>
        
      </ManagementLayout>

      {/* Food detail modal */}
      <Modal
        opened={modalOpened}
        onClose={() => { closeModal(); setSelectedFood(null); }}
        title={selectedFood?.name}
        centered
        size="md"
        overlayProps={{ blur: 2 }}
      >
        {selectedFood ? (
          <div>
            <Text><b>{t('foods:list.id')}:</b> {selectedFood.id}</Text>
            <Text><b>{t('foods:list.foodGroup')}:</b> {t(`foods:foodGroups.${selectedFood.foodGroup}`)}</Text>
            <Text><b>{t('foods:form.nutriScore')}:</b> {selectedFood.nutritionalMetrics?.nutriScore || '-'}</Text>
            <Text><b>{t('foods:form.novaGroup')}:</b> {selectedFood.nutritionalMetrics?.novaGroup || '-'}</Text>
            <AllergensList 
              allergenInfo={selectedFood.allergenInfo} 
              idSuffix={`food-${selectedFood.id}`}
              defaultOpen={true} 
            />
          </div>
        ) : null}
      </Modal>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('common:modal.titleDelete')}
        size="sm"
      >
        <Text mb="md">
          {t('common:modal.messageDelete', { name: foodToDelete?.name })}
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

export default FoodListPage;
