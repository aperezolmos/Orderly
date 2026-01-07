import { Table } from '@mantine/core';


const MicroTable = ({ data, t, prefix, referenceMap }) => (
  
  <Table striped highlightOnHover withColumnBorders>
    <thead>
      <tr>
        <th>{t(`${prefix}.title`)}</th>
        <th>{t('foods:form.nutritionInfo.value')}</th>
        <th>{t('foods:form.nutritionInfo.reference')}</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(data || {}).map(([key, value]) => (
        <tr key={key}>
          <td>{t(`${prefix}.${key}`)}</td>
          <td>{value != null ? `${value} mg` : '-'}</td>
          <td>{referenceMap?.[key] != null ? `${referenceMap[key]} mg` : '-'}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default MicroTable;
