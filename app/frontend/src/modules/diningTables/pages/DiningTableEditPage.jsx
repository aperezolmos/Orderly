import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormLayout from '../../../common/layouts/FormLayout';
import DiningTableForm from '../components/DiningTableForm';
import { diningTableService } from '../../../services/backend/diningTableService';
import { useTranslation } from 'react-i18next';


const DiningTableEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'diningTables']);


  useEffect(() => {
    const loadTable = async () => {
      try {
        setLoading(true);
        setError(null);
        const tableData = await diningTableService.getTableById(parseInt(id));
        setTable(tableData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading table:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTable();
    }
  }, [id]);

  const handleSubmit = async (tableData) => {
    try {
      setSubmitting(true);
      setError(null);
      await diningTableService.updateTable(parseInt(id), tableData);
      navigate('/tables', { replace: true });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { title: t('diningTables:management.list'), href: '/tables' },
    { title: t('diningTables:management.edit'), href: `/tables/${id}/edit` }
  ];


  if (error && !loading) {
    return (
      <FormLayout
        title={t('diningTables:management.edit')}
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        error={error}
        onClearError={() => setError(null)}
      >
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title={t('diningTables:errors.loadError')}
          color="red"
        >
          <Text mb="md">{t('diningTables:errors.notFound', { id })}</Text>
          <Text size="sm" color="dimmed">
            {t('diningTables:errors.notFoundDetails')}
          </Text>
        </Alert>
      </FormLayout>
    );
  }
  

  return (
    <FormLayout
      title={t('diningTables:management.edit')}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={() => setError(null)}
    >
      <DiningTableForm
        table={table}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel={t('diningTables:form.update')}
      />
    </FormLayout>
  );
};

export default DiningTableEditPage;
