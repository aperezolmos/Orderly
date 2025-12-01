import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LoadingOverlay } from '@mantine/core';
import FormLayout from '../../../common/layouts/FormLayout';
import DiningTableForm from '../components/DiningTableForm';
import { useDiningTables } from '../hooks/useDiningTables';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const DiningTableCreatePage = () => {

  const navigate = useNavigate();
  const { createTable, loading: createLoading } = useDiningTables();
  const [error, setError] = useState(null);
  const { t, ready, isNamespaceLoading } = useTranslationWithLoading(['common', 'diningTables']);


  if (!ready || isNamespaceLoading) {
    return (
      <FormLayout
        title={t('common:app.loading')}
        breadcrumbs={[]}
        showBackButton={true}
      >
        <Box style={{ height: '200px', position: 'relative' }}>
          <LoadingOverlay visible={true} />
        </Box>
      </FormLayout>
    );
  }

  const handleSubmit = async (tableData) => {
    try {
      setError(null);
      await createTable(tableData);
      navigate('/tables', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const breadcrumbs = [
    { title: t('diningTables:management.list'), href: '/tables' },
    { title: t('diningTables:management.create'), href: '/tables/new' }
  ];
  

  return (
    <FormLayout
      title={t('diningTables:management.create')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={createLoading}
      error={error}
      onClearError={() => setError(null)}
    >
      <DiningTableForm
        onSubmit={handleSubmit}
        loading={createLoading}
        submitLabel={t('diningTables:form.create')}
      />
    </FormLayout>
  );
};

export default DiningTableCreatePage;
