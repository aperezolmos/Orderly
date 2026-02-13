import { Table } from '@mantine/core';
import { formatValue } from '../../../../utils/formatters';


const MicroTable = ({ data, t, prefix, referenceMap }) => {
  
  const getRowBg = (value, reference) => {
    if (!value || !reference) return undefined;
    if (value > reference) return 'var(--mantine-color-red-light)';
    if (value > reference * 0.8) return 'var(--mantine-color-yellow-light)';
    return undefined;
  };

  return (
    <Table.ScrollContainer minWidth={350}>
      <Table striped highlightOnHover withTableBorder horizontalSpacing="sm" layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '50%' }}>{t(`${prefix}.title`)}</Table.Th>
            <Table.Th style={{ width: '25%' }}>{t('foods:form.nutritionInfo.value')}</Table.Th>
            <Table.Th style={{ width: '25%' }}>{t('foods:form.nutritionInfo.reference')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(data || {}).map(([key, value]) => {
            const reference = referenceMap?.[key];
            return (
              <Table.Tr 
                key={key} 
                bg={getRowBg(value, reference)}
              >
                <Table.Td fw={500}>{t(`${prefix}.${key}`)}</Table.Td>
                <Table.Td>{value === null ? '-' : `${formatValue(value)} mg`}</Table.Td>
                <Table.Td c="dimmed">
                  {reference === null ? '-' : `${reference} mg`}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default MicroTable;
