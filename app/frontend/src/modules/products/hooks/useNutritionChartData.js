import { useMemo } from 'react';
import { useMantineTheme } from '@mantine/core';


// Fixed color map for each macronutrient
const MACRO_COLORS = {
  carbohydrates: 'red',
  sugars: 'pink',
  protein: 'blue',
  fats: 'orange',
  saturatedFats: 'yellow',
  fiber: 'green'
};


// Macronutrients that will appear in the chart
const SUB_MACRO_RELATIONS = {
  sugars: 'carbohydrates',
  saturatedFats: 'fats'
};

const MAIN_MACROS = ['carbohydrates', 'fats', 'fiber', 'protein'];


export const useNutritionChartData = (nutritionInfo) => {
  
  const theme = useMantineTheme();


  const getMantineColor = (colorName) => {
    const colorMap = {
      red: theme.colors.red[6],
      pink: theme.colors.pink[6],
      blue: theme.colors.blue[6],
      orange: theme.colors.orange[6],
      yellow: theme.colors.yellow[6],
      green: theme.colors.green[6]
    };
    return colorMap[colorName] || theme.colors.gray[6];
  };
  

  // Function to correct inconsistent data
  const correctedData = useMemo(() => {
    if (!nutritionInfo) return null;
    
    const data = { ...nutritionInfo };
    
    // Correct carbohydrates if it is 0 but sugars > 0
    if ((!data.carbohydrates || data.carbohydrates === 0) && data.sugars && data.sugars > 0) {
      data.carbohydrates = data.sugars;
    }
    
    // Correct fats if it is 0 but saturatedFats > 0
    if ((!data.fats || data.fats === 0) && data.saturatedFats && data.saturatedFats > 0) {
      data.fats = data.saturatedFats;
    }
    
    // Ensure the values are numbers
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object') return;
      data[key] = data[key] != null ? Number(data[key]) : 0;
    });
    
    return data;
  }, [nutritionInfo]);


  const chartData = useMemo(() => {
    if (!correctedData) return { outerData: [], innerData: [] };
    
    // Filtrar macronutrientes principales con valor > 0
    const mainMacrosWithValue = MAIN_MACROS
      .map(key => ({
        key,
        value: correctedData[key] || 0,
        color: getMantineColor(MACRO_COLORS[key])
      }))
      .filter(item => item.value > 0);
    
    if (mainMacrosWithValue.length === 0) {
      return { outerData: [], innerData: [] };
    }
    
    // Datos para el nivel exterior (macronutrientes principales)
    const outerData = mainMacrosWithValue.map(item => ({
      name: item.key,
      value: item.value,
      color: item.color,
      fill: item.color,
      key: item.key
    }));
    
    // Datos para el nivel interior (submacronutrientes)
    const innerData = [];
    
    mainMacrosWithValue.forEach(macro => {
      const subMacros = Object.entries(SUB_MACRO_RELATIONS)
        .filter(([, parent]) => parent === macro.key)
        .map(([subKey]) => subKey);
      
      // Encontrar submacronutrientes que pertenecen a este macro
      const relevantSubs = subMacros
        .map(subKey => ({
          key: subKey,
          value: correctedData[subKey] || 0,
          parent: macro.key,
          color: getMantineColor(MACRO_COLORS[subKey])
        }))
        .filter(sub => sub.value > 0);
      
      if (relevantSubs.length > 0) {
        // Añadir submacronutrientes
        relevantSubs.forEach(sub => {
          innerData.push({
            name: sub.key,
            value: sub.value,
            color: sub.color,
            fill: sub.color,
            parent: macro.key,
            key: `${macro.key}-${sub.key}`
          });
        });
        
        // Calcular la porción restante del macro principal
        const subTotal = relevantSubs.reduce((sum, sub) => sum + sub.value, 0);
        const remaining = macro.value - subTotal;
        
        if (remaining > 0) {
          innerData.push({
            name: `${macro.key}_other`,
            value: remaining,
            color: macro.color,
            fill: macro.color,
            parent: macro.key,
            key: `${macro.key}-other`
          });
        }
      } 
      else {
        // Si no hay submacronutrientes, mostrar todo el macro en el nivel interior
        innerData.push({
          name: macro.key,
          value: macro.value,
          color: macro.color,
          fill: macro.color,
          parent: macro.key,
          key: `${macro.key}-only`
        });
      }
    });
    
    return { outerData, innerData };
  }, [correctedData, theme]);


  const tableData = useMemo(() => {
    if (!correctedData) return [];
    
    return [
      {
        key: 'calories',
        value: correctedData.calories != null ? Number(correctedData.calories.toFixed(2)) : null,
        unit: 'kcal'
      },
      {
        key: 'carbohydrates',
        value: correctedData.carbohydrates != null ? Number(correctedData.carbohydrates.toFixed(2)) : null,
        unit: 'g'
      },
      {
        key: 'sugars',
        value: correctedData.sugars != null ? Number(correctedData.sugars.toFixed(2)) : null,
        unit: 'g'
      },
      {
        key: 'protein',
        value: correctedData.protein != null ? Number(correctedData.protein.toFixed(2)) : null,
        unit: 'g'
      },
      {
        key: 'fats',
        value: correctedData.fats != null ? Number(correctedData.fats.toFixed(2)) : null,
        unit: 'g'
      },
      {
        key: 'saturatedFats',
        value: correctedData.saturatedFats != null ? Number(correctedData.saturatedFats.toFixed(2)) : null,
        unit: 'g'
      },
      {
        key: 'fiber',
        value: correctedData.fiber != null ? Number(correctedData.fiber.toFixed(2)) : null,
        unit: 'g'
      },
      {
        key: 'salt',
        value: correctedData.salt != null ? Number(correctedData.salt.toFixed(2)) : null,
        unit: 'g'
      }
    ];
  }, [correctedData]);

  const percentages = useMemo(() => {
    if (!correctedData) return {};
    
    const total = MAIN_MACROS.reduce((sum, key) => sum + (correctedData[key] || 0), 0);
    if (total === 0) return {};
    
    const result = {};
    MAIN_MACROS.forEach(key => {
      result[key] = total > 0 ? ((correctedData[key] || 0) / total * 100).toFixed(1) : 0;
    });
    
    return result;
  }, [correctedData]);


  return {
    chartData,
    tableData,
    percentages,
    correctedData,
    hasData: correctedData && Object.values(correctedData).some(v => 
      typeof v === 'number' && v > 0
    )
  };
};
