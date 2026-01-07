import { Table } from '@mantine/core';


const MacroTable = ({ data, t }) => (
  
  <Table striped highlightOnHover withColumnBorders>
    <thead>
      <tr>
        <th>{t('foods:form.nutritionInfo.title')}</th>
        <th>{t('foods:form.nutritionInfo.value')}</th>
        <th>{t('foods:form.nutritionInfo.reference')}</th>
      </tr>
    </thead>
    <tbody>
      {data.map(row => (
        <tr key={row.key}>
          <td>{t(`foods:form.nutritionInfo.${row.key}`)}</td>
          <td>{row.value != null ? `${row.value} ${row.unit}` : '-'}</td>
          <td>{row.reference != null ? `${row.reference} ${row.unit}` : '-'}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default MacroTable;
