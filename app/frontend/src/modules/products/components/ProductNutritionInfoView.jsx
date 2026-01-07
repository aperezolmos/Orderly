import { useState } from 'react';
import { Card, Title, Group, Box, Text, Button, Tabs, Stack, Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import MacroPieChart from '../../../common/components/MacroPieChart';
import MacroTable from '../../../common/components/MacroTable';
import MicroTable from '../../../common/components/MicroTable';
import { useNutritionChartData } from '../hooks/useNutritionChartData';
import { REFERENCE_VALUES, REFERENCE_MINERALS,
         REFERENCE_VITAMINS } from '../../../utils/nutritionReferences';


const ProductNutritionInfoView = ({ nutritionInfo }) => {
  
  const [tab, setTab] = useState('macros');
  const [macroView, setMacroView] = useState('chart'); // 'chart' o 'table'
  const { t } = useTranslation(['products', 'foods', 'common']);
  
  const {
    chartData,
    tableData,
    correctedData,
    hasData
  } = useNutritionChartData(nutritionInfo);


  // Add reference values to table data
  const tableDataWithReferences = tableData.map(item => ({
    ...item,
    reference: REFERENCE_VALUES[item.key]
  }));


  if (!nutritionInfo) {
    return (
      <Card shadow="sm" p="md" radius="md" withBorder mb="md">
        <Text color="dimmed" align="center">
          {t('common:data.noData')}
        </Text>
      </Card>
    );
  }


  return (
    <Card shadow="sm" p="md" radius="md" withBorder mb="md">
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="macros">{t('products:nutrition.title')}</Tabs.Tab>
          <Tabs.Tab value="micros">
            {t('foods:form.minerals.title')} + {t('foods:form.vitamins.title')}
          </Tabs.Tab>
        </Tabs.List>
        
        <Tabs.Panel value="macros" pt="xs">
          <Group mb="md">
            <Button
              variant={macroView === 'chart' ? 'filled' : 'outline'}
              color="blue"
              onClick={() => setMacroView('chart')}
              size="xs"
            >
              {t('products:nutrition.chartView')}
            </Button>
            <Button
              variant={macroView === 'table' ? 'filled' : 'outline'}
              color="blue"
              onClick={() => setMacroView('table')}
              size="xs"
            >
              {t('products:nutrition.tableView')}
            </Button>
          </Group>
          
          {macroView === 'chart' ? (
            <Box>
              <Group mb="xs" spacing="md">
                <Badge color="yellow" variant="light">
                  {t('foods:form.nutritionInfo.calories')}:{' '}
                  {correctedData?.calories != null 
                    ? `${Number(correctedData.calories).toFixed(2)} kcal` 
                    : '-'}
                </Badge>
                <Badge color="blue" variant="light">
                  {t('foods:form.nutritionInfo.salt')}:{' '}
                  {correctedData?.salt != null 
                    ? `${Number(correctedData.salt).toFixed(2)} g` 
                    : '-'}
                </Badge>
              </Group>
              
              {hasData ? (
                <Box style={{ minWidth: 300 }}>
                  <MacroPieChart
                    chartData={chartData}
                    t={t}
                  />
                </Box>
              ) : (
                <Text color="dimmed" align="center" mt="md">
                  {t('common:data.noData')}
                </Text>
              )}
              
              <Text size="xs" color="dimmed" mt="xl">
                {t('products:nutrition.pieChartNote')}
              </Text>
            </Box>
          ) : (
            <Box>
              <MacroTable 
                data={tableDataWithReferences} 
                t={t} 
              />
            </Box>
          )}
        </Tabs.Panel>
        
        <Tabs.Panel value="micros" pt="xs">
          <Stack>
            <Title order={5} mb="xs">
              {t('foods:form.minerals.title')}
            </Title>
            <MicroTable
              data={nutritionInfo.minerals}
              t={t}
              prefix="foods:form.minerals"
              referenceMap={REFERENCE_MINERALS}
            />
            
            <Title order={5} mt="md" mb="xs">
              {t('foods:form.vitamins.title')}
            </Title>
            <MicroTable
              data={nutritionInfo.vitamins}
              t={t}
              prefix="foods:form.vitamins"
              referenceMap={REFERENCE_VITAMINS}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};

export default ProductNutritionInfoView;
