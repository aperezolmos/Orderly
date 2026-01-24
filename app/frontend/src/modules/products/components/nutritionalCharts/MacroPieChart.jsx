import { PieChart, Pie, Cell, Tooltip, Legend,
        ResponsiveContainer } from 'recharts';


const MacroPieChart = ({ chartData, t }) => {
  
  const { outerData, innerData } = chartData;
  
  
  if (outerData.length === 0) {
    return (
      <div style={{ 
        height: 260, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#999'
      }}>
        {t('common:data.noData')}
      </div>
    );
  }

  
  const translateKey = (key) => {
    const cleanKey = key.replace('_other', '').replace('-only', '').split('-')[0];
    return t(`foods:form.nutritionInfo.${cleanKey}`);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {translateKey(payload[0].payload.name)}
          </p>
          <p style={{ margin: 0 }}>
            {`${payload[0].value.toFixed(2)} g`}
          </p>
        </div>
      );
    }
    return null;
  };
  

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        {/* External level - Main macronutrients */}
        <Pie
          data={outerData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={75}
          paddingAngle={2}
          label={(entry) => `${translateKey(entry.name)}: ${entry.value.toFixed(1)}g`}
          labelLine={false}
        >
          {outerData.map((entry, index) => (
            <Cell key={`outer-${index}`} fill={entry.color} />
          ))}
        </Pie>
        
        {/* Internal level - Submacronutrients */}
        <Pie
          data={innerData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={2}
        >
          {innerData.map((entry, index) => (
            <Cell key={`inner-${index}`} fill={entry.color} />
          ))}
        </Pie>
        
        <Tooltip 
          content={<CustomTooltip />} 
          isAnimationActive={false}
          useTranslate3d={true}
        />
        <Legend 
          formatter={(value, entry) => {
            const translated = translateKey(entry.payload?.name || value);
            return <span style={{ marginLeft: 4 }}>{translated}</span>;
          }}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MacroPieChart;
