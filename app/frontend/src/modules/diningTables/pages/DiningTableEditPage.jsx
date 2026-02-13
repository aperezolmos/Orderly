import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import DiningTableForm from '../components/DiningTableForm';
import { useDiningTables } from '../hooks/useDiningTables';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const DiningTableEditPage = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentTable,
    loading,
    error,
    updateTable,
    loadTableById,
    clearError,
  } = useDiningTables();
  const { t } = useTranslation(['common', 'diningTables']);


  useEffect(() => {
    if (id) loadTableById(Number.parseInt(id));
  }, [id, loadTableById]);

  const handleSubmit = async (tableData) => {
    await updateTable(Number.parseInt(id), tableData);
    navigate('/tables', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'tables');

  const breadcrumbs = [
    { title: t('diningTables:management.list'), href: '/tables' },
    { title: t('diningTables:management.edit'), href: `/tables/${id}/edit` }
  ];
  

  return (
    <FormLayout
      title={t('diningTables:management.edit')}
      icon={IconEdit}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <DiningTableForm
        table={currentTable}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('diningTables:form.update')}
      />
    </FormLayout>
  );
};

export default DiningTableEditPage;
