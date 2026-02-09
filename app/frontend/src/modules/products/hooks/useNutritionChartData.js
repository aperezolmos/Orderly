import { useMemo } from 'react';
import { useMantineTheme } from '@mantine/core';


// Fixed color map for each macronutrient
const MACRO_COLORS = {
  carbohydrates: 'blue',
  sugars: 'cyan',
  protein: 'orange',
  fats: 'red',
  saturatedFats: 'pink',
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


  const getMantineColor = (colorName, isOther = false) => {
    
    const colorFamily = theme.colors[colorName] || theme.colors.gray;
    
    if (isOther) return colorFamily[3]; 
    return colorFamily[6];
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
    
    // Filter main macronutrients with a value > 0
    const mainMacrosWithValue = MAIN_MACROS
      .map(key => ({
        key,
        value: correctedData[key] || 0,
        color: getMantineColor(MACRO_COLORS[key]),
        hasSubs: false
      }))
      .filter(item => item.value > 0);
    
    if (mainMacrosWithValue.length === 0) {
      return { outerData: [], innerData: [] };
    }
    
    // Data for the external level (main macronutrients)
    const outerData = mainMacrosWithValue.map(item => ({
      name: item.key,
      value: item.value,
      color: item.color,
      fill: item.color,
      key: item.key,
      hasSubs: false,
      isMain: true
    }));
    
    // Data for the internal level (sub-macronutrients)
    const innerData = [];
    const macrosWithSubs = new Set();
    
    mainMacrosWithValue.forEach(macro => {
      const subMacros = Object.entries(SUB_MACRO_RELATIONS)
        .filter(([, parent]) => parent === macro.key)
        .map(([subKey]) => subKey);
      
      // Find sub-macronutrients that belong to this macro
      const relevantSubs = subMacros
        .map(subKey => ({
          key: subKey,
          value: correctedData[subKey] || 0,
          parent: macro.key,
          color: getMantineColor(MACRO_COLORS[subKey])
        }))
        .filter(sub => sub.value > 0);
      
      if (relevantSubs.length > 0) {
        macrosWithSubs.add(macro.key);
        
        relevantSubs.forEach(sub => {
          innerData.push({
            name: sub.key,
            value: sub.value,
            color: sub.color,
            fill: sub.color,
            parent: macro.key,
            key: `${macro.key}-${sub.key}`,
            isSub: true,
            isMain: false
          });
        });
        
        // Calculate the remaining portion of the main macro
        const subTotal = relevantSubs.reduce((sum, sub) => sum + sub.value, 0);
        const remaining = macro.value - subTotal;
        
        if (remaining > 0) {
          innerData.push({
            name: `${macro.key}_other`,
            value: remaining,
            color: getMantineColor(MACRO_COLORS[macro.key], true), 
            fill: getMantineColor(MACRO_COLORS[macro.key], true),
            parent: macro.key,
            key: `${macro.key}-other`,
            isSub: true,
            isOther: true
          });
        }
      } 
      else {
        // If there are no sub-macronutrients, show all macronutrients at the inner level
        innerData.push({
          name: macro.key,
          value: macro.value,
          color: macro.color,
          fill: macro.color,
          parent: macro.key,
          key: `${macro.key}-only`,
          isSub: false,
          isMain: false
        });
      }
    });
    
    // Mark which macros have subportions
    outerData.forEach(item => {
      item.hasSubs = macrosWithSubs.has(item.key);
    });
    
    return { 
      outerData, 
      innerData,
      macrosWithSubs: Array.from(macrosWithSubs)
    };
  }, [correctedData, theme]);


  const tableData = useMemo(() => {
    if (!correctedData) return [];
    
    return [
      {
        key: 'calories',
        value: correctedData.calories === null ? null : Number(correctedData.calories.toFixed(2)),
        unit: 'kcal'
      },
      {
        key: 'carbohydrates',
        value: correctedData.carbohydrates === null ? null : Number(correctedData.carbohydrates.toFixed(2)),
        unit: 'g'
      },
      {
        key: 'sugars',
        value: correctedData.sugars === null ? null : Number(correctedData.sugars.toFixed(2)),
        unit: 'g'
      },
      {
        key: 'protein',
        value: correctedData.protein === null ? null : Number(correctedData.protein.toFixed(2)),
        unit: 'g'
      },
      {
        key: 'fats',
        value: correctedData.fats === null ? null : Number(correctedData.fats.toFixed(2)),
        unit: 'g'
      },
      {
        key: 'saturatedFats',
        value: correctedData.saturatedFats === null ? null : Number(correctedData.saturatedFats.toFixed(2)),
        unit: 'g'
      },
      {
        key: 'fiber',
        value: correctedData.fiber === null ? null : Number(correctedData.fiber.toFixed(2)),
        unit: 'g'
      },
      {
        key: 'salt',
        value: correctedData.salt === null ? null : Number(correctedData.salt.toFixed(2)),
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
