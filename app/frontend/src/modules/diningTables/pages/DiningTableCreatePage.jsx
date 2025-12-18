import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../../../common/layouts/FormLayout';
import DiningTableForm from '../components/DiningTableForm';
import { useDiningTables } from '../hooks/useDiningTables';
import { useTranslation } from 'react-i18next';


const DiningTableCreatePage = () => {

  const navigate = useNavigate();
  const { createTable, loading: createLoading } = useDiningTables();
  const [error, setError] = useState(null);
  const { t } = useTranslation(['common', 'diningTables']);


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
