import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../common/hooks/usePagination';
import { useAuth } from '../../../context/AuthContext';
import { PERMISSIONS } from '../../../utils/permissions';
import { useProducts } from '../hooks/useProducts';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const ProductListPage = () => {
  
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { products, loading, deleteProduct, loadProducts } = useProducts();
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const pagination = usePagination(products, DEFAULT_PAGE_SIZE);
  const { t } = useTranslation(['common', 'products']);


  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEdit = (product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleView = (product) => {
    navigate(`/products/${product.id}/view`);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      closeDeleteModal();
      setProductToDelete(null);
    }
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'products');

  const columns = [
    {
      key: 'id',
      title: t('products:list.id'),
      render: (product) => <Text weight={500}>#{product.id}</Text>
    },
    {
      key: 'name',
      title: t('products:list.name'),
      render: (product) => (
        <Button 
          variant="transparent"
          color="blue"
          onClick={() => handleView(product)}
          style={{ padding: 0, fontWeight: 500 }}
          title={t('products:management.view')}
        >
          {product.name}
        </Button>
      )
    },
    {
      key: 'price',
      title: t('products:list.price'),
      render: (product) => <Text>{product.price} €</Text>
    },
    {
      key: 'ingredientCount',
      title: t('products:list.ingredientCount'),
      render: (product) => <Text>{product.ingredientCount}</Text>
    },
    {
      key: 'updatedAt',
      title: t('common:list.updated'),
      render: (product) => (
        <Text size="sm">
          {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}
        </Text>
      )
    }
  ];
  

  return (
    <>
      <ManagementLayout
        title={t('products:management.title')}
        icon={moduleConfig?.icon}
        iconColor={moduleConfig?.color}
        breadcrumbs={[{ title: t('products:management.list'), href: '/products' }]}
        showCreateButton={hasPermission(PERMISSIONS.PRODUCT_CREATE)}
        createButtonLabel={t('products:list.newProduct')}
        onCreateClick={() => navigate('/products/new')}
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading && !deleteModalOpened} overlayblur={2} />
            <DataTable
              columns={columns}
              data={pagination.paginatedData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={hasPermission(PERMISSIONS.PRODUCT_EDIT)}
              canDelete={hasPermission(PERMISSIONS.PRODUCT_DELETE)}
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
          {t('common:modal.messageDelete', { name: productToDelete?.name })}
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

export default ProductListPage;
