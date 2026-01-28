import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Group, Text, Box, Stack } from '@mantine/core';


const MacroPieChart = ({ chartData, t }) => {
  
  const { outerData, innerData } = chartData;
  
  
  if (outerData.length === 0) {
    return (
      <Box h={260} display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text c="dimmed">{t('common:data.noData')}</Text>
      </Box>
    );
  }

  
  const allLegendItems = [];
  outerData.forEach(item => {
    allLegendItems.push({ name: item.name, color: item.color });
  });
  
  innerData.forEach(item => {
    if (item.isOther || (!item.isSub && outerData.some(outer => outer.name === item.name))) return;
    allLegendItems.push({ name: item.name, color: item.color });
  });

  const translateKey = (key) => {
    const cleanKey = key.replace('_other', '').replace('-only', '').split('-')[0];
    if (key.includes('_other')) {
      const mainKey = key.replace('_other', '');
      return `${t(`foods:form.nutritionInfo.${mainKey}`)} (${t('common:app.others')})`;
    }
    return t(`foods:form.nutritionInfo.${cleanKey}`);
  };

  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box 
          style={{
            backgroundColor: 'var(--mantine-color-body)', 
            padding: '10px',
            border: `1px solid var(--mantine-color-gray-4)`,
            borderRadius: 'var(--mantine-radius-md)',
            boxShadow: 'var(--mantine-shadow-md)',
          }}
        >
          <Text fw={700} size="sm">{translateKey(data.name)}</Text>
          <Text size="xs">{`${data.value.toFixed(2)} g`}</Text>
        </Box>
      );
    }
    return null;
  };

  const renderCustomLegend = () => (
    <Stack gap="xs" mt="xl" align="center">
      <Group justify="center" gap="sm">
        {allLegendItems.map((entry, index) => (
          <Group key={`legend-${index}`} gap={6}>
            <Box
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: entry.color,
              }}
            />
            <Text size="xs" fw={500}>
              {translateKey(entry.name)}
            </Text>
          </Group>
        ))}
      </Group>
    </Stack>
  );


  return (
    <ResponsiveContainer width="99%" height={350}>
      <PieChart>
        {/* External level - Main macronutrients */}
        <Pie
          data={outerData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="90%" 
          innerRadius="70%"
          paddingAngle={2}
        >
          {outerData.map((entry, index) => (
            <Cell key={`outer-${index}`} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        
        {/* Internal level - Submacronutrients */}
        <Pie
          data={innerData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="65%"
          paddingAngle={2}
        >
          {innerData.map((entry, index) => (
            <Cell key={`inner-${index}`} fill={entry.fill} stroke="none" />
          ))}
        </Pie>
        
        <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
        <Legend content={renderCustomLegend} verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MacroPieChart;
