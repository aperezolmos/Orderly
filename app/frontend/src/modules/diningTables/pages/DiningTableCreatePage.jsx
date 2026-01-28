import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormLayout from '../../../common/layouts/FormLayout';
import DiningTableForm from '../components/DiningTableForm';
import { useDiningTables } from '../hooks/useDiningTables';
import { getNavigationConfig } from '../../../utils/navigationConfig';


const DiningTableCreatePage = () => {

  const navigate = useNavigate();
  const { createTable, loading, error, clearError } = useDiningTables();
  const { t } = useTranslation(['common', 'diningTables']);


  const handleSubmit = async (tableData) => {
    await createTable(tableData);
    navigate('/tables', { replace: true });
  };


  const moduleConfig = getNavigationConfig(t).find(m => m.id === 'tables');

  const breadcrumbs = [
    { title: t('diningTables:management.list'), href: '/tables' },
    { title: t('diningTables:management.create'), href: '/tables/new' }
  ];
  

  return (
    <FormLayout
      title={t('diningTables:management.create')}
      icon={moduleConfig?.icon}
      iconColor={moduleConfig?.color}
      breadcrumbs={breadcrumbs}
      showBackButton={true}
      loading={loading}
      error={error}
      onClearError={clearError}
    >
      <DiningTableForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={t('diningTables:form.create')}
      />
    </FormLayout>
  );
};

export default DiningTableCreatePage;
