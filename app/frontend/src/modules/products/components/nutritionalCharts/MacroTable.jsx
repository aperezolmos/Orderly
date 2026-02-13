import { Table } from '@mantine/core';
import { formatValue } from '../../../../utils/formatters'


const MacroTable = ({ data, t }) => {
  
  const getRowBg = (value, reference) => {
    if (!value || !reference) return undefined;
    if (value > reference) return 'var(--mantine-color-red-light)';
    if (value > reference * 0.8) return 'var(--mantine-color-yellow-light)';
    return undefined;
  };


  return (
    <Table.ScrollContainer minWidth={500}>
      <Table striped highlightOnHover withTableBorder horizontalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('foods:form.nutritionInfo.title')}</Table.Th>
            <Table.Th>{t('foods:form.nutritionInfo.value')}</Table.Th>
            <Table.Th>{t('foods:form.nutritionInfo.reference')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row) => (
            <Table.Tr 
              key={row.key} 
              bg={getRowBg(row.value, row.reference)}
            >
              <Table.Td fw={500}>{t(`foods:form.nutritionInfo.${row.key}`)}</Table.Td>
              <Table.Td>
                {row.value === null ? '-' : `${formatValue(row.value)} ${row.unit}`}
              </Table.Td>
              <Table.Td c="dimmed">
                {row.reference === null ? '-' : `${row.reference} ${row.unit}`}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default MacroTable;
