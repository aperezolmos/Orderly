import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Modal, Button, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import ManagementLayout from '../../../common/layouts/ManagementLayout';
import DataTable from '../../../common/components/DataTable';
import { useProducts } from '../hooks/useProducts';


const ProductListPage = () => {
  
  const navigate = useNavigate();
  const { products, loading, deleteProduct, loadProducts } = useProducts();
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
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
        <Button variant="subtle" onClick={() => handleView(product)}>
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
      key: 'createdAt',
      title: t('products:list.created'),
      render: (product) => (
        <Text size="sm">
          {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
        </Text>
      )
    }
  ];
  

  return (
    <>
      <ManagementLayout
        title={t('products:management.title')}
        breadcrumbs={[{ title: t('products:management.list'), href: '/products' }]}
        showCreateButton={true}
        createButtonLabel={t('products:list.newProduct')}
        onCreateClick={() => navigate('/products/new')}
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading && !deleteModalOpened} overlayblur={2} />
            <DataTable
              columns={columns}
              data={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
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
