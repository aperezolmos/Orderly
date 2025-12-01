import React from 'react';
import { NumberInput, Group, Divider, Title, Box } from '@mantine/core';
import { useTranslationWithLoading } from '../../../common/hooks/useTranslationWithLoading';


const MineralsFields = ({ form, prefix = 'nutritionInfo.minerals.' }) => {
  const { t } = useTranslationWithLoading(['foods']);
  return (
    <Box>
      <Title order={5} mb="xs">{t('foods:form.minerals')}</Title>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.calcium')} {...form.getInputProps(`${prefix}calcium`)} min={0} />
        <NumberInput label={t('foods:form.iron')} {...form.getInputProps(`${prefix}iron`)} min={0} />
        <NumberInput label={t('foods:form.magnesium')} {...form.getInputProps(`${prefix}magnesium`)} min={0} />
        <NumberInput label={t('foods:form.phosphorus')} {...form.getInputProps(`${prefix}phosphorus`)} min={0} />
      </Group>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.potassium')} {...form.getInputProps(`${prefix}potassium`)} min={0} />
        <NumberInput label={t('foods:form.selenium')} {...form.getInputProps(`${prefix}selenium`)} min={0} />
        <NumberInput label={t('foods:form.sodium')} {...form.getInputProps(`${prefix}sodium`)} min={0} />
        <NumberInput label={t('foods:form.zinc')} {...form.getInputProps(`${prefix}zinc`)} min={0} />
      </Group>
    </Box>
  );
};


const VitaminsFields = ({ form, prefix = 'nutritionInfo.vitamins.' }) => {
  const { t } = useTranslationWithLoading(['foods']);
  return (
    <Box>
      <Title order={5} mb="xs">{t('foods:form.vitamins')}</Title>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.vitaminA')} {...form.getInputProps(`${prefix}vitaminA`)} min={0} />
        <NumberInput label={t('foods:form.vitaminC')} {...form.getInputProps(`${prefix}vitaminC`)} min={0} />
        <NumberInput label={t('foods:form.vitaminD')} {...form.getInputProps(`${prefix}vitaminD`)} min={0} />
        <NumberInput label={t('foods:form.vitaminE')} {...form.getInputProps(`${prefix}vitaminE`)} min={0} />
        <NumberInput label={t('foods:form.vitaminB1')} {...form.getInputProps(`${prefix}vitaminB1`)} min={0} />
      </Group>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.vitaminB2')} {...form.getInputProps(`${prefix}vitaminB2`)} min={0} />
        <NumberInput label={t('foods:form.vitaminB3')} {...form.getInputProps(`${prefix}vitaminB3`)} min={0} />
        <NumberInput label={t('foods:form.vitaminB6')} {...form.getInputProps(`${prefix}vitaminB6`)} min={0} />
        <NumberInput label={t('foods:form.vitaminB9')} {...form.getInputProps(`${prefix}vitaminB9`)} min={0} />
        <NumberInput label={t('foods:form.vitaminB12')} {...form.getInputProps(`${prefix}vitaminB12`)} min={0} />
      </Group>
    </Box>
  );
};


const NutritionInfoForm = ({ form }) => {
  const { t } = useTranslationWithLoading(['foods']);
  return (
    <Box>
      <Title order={4} mb="sm">{t('foods:form.nutritionInfo')}</Title>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.calories')} {...form.getInputProps('nutritionInfo.calories')} min={0} />
        <NumberInput label={t('foods:form.carbohydrates')} {...form.getInputProps('nutritionInfo.carbohydrates')} min={0} />
        <NumberInput label={t('foods:form.fats')} {...form.getInputProps('nutritionInfo.fats')} min={0} />
        <NumberInput label={t('foods:form.fiber')} {...form.getInputProps('nutritionInfo.fiber')} min={0} />
      </Group>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.protein')} {...form.getInputProps('nutritionInfo.protein')} min={0} />
        <NumberInput label={t('foods:form.salt')} {...form.getInputProps('nutritionInfo.salt')} min={0} />
        <NumberInput label={t('foods:form.saturatedFats')} {...form.getInputProps('nutritionInfo.saturatedFats')} min={0} />
        <NumberInput label={t('foods:form.sugars')} {...form.getInputProps('nutritionInfo.sugars')} min={0} />
      </Group>
      <Divider my="md" />
      <MineralsFields form={form} />
      <Divider my="md" />
      <VitaminsFields form={form} />
    </Box>
  );
};

export default NutritionInfoForm;
