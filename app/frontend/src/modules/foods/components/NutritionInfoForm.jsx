import { NumberInput, Group, Divider, Title, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const MineralsFields = ({ form, prefix = 'nutritionInfo.minerals.' }) => {
  const { t } = useTranslation(['foods']);
  return (
    <Box>
      <Title order={5} mb="xs">{t('foods:form.minerals.title')}</Title>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.minerals.calcium')} {...form.getInputProps(`${prefix}calcium`)} min={0} />
        <NumberInput label={t('foods:form.minerals.iron')} {...form.getInputProps(`${prefix}iron`)} min={0} />
        <NumberInput label={t('foods:form.minerals.magnesium')} {...form.getInputProps(`${prefix}magnesium`)} min={0} />
        <NumberInput label={t('foods:form.minerals.phosphorus')} {...form.getInputProps(`${prefix}phosphorus`)} min={0} />
      </Group>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.minerals.potassium')} {...form.getInputProps(`${prefix}potassium`)} min={0} />
        <NumberInput label={t('foods:form.minerals.selenium')} {...form.getInputProps(`${prefix}selenium`)} min={0} />
        <NumberInput label={t('foods:form.minerals.sodium')} {...form.getInputProps(`${prefix}sodium`)} min={0} />
        <NumberInput label={t('foods:form.minerals.zinc')} {...form.getInputProps(`${prefix}zinc`)} min={0} />
      </Group>
    </Box>
  );
};


const VitaminsFields = ({ form, prefix = 'nutritionInfo.vitamins.' }) => {
  const { t } = useTranslation(['foods']);
  return (
    <Box>
      <Title order={5} mb="xs">{t('foods:form.vitamins.title')}</Title>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.vitamins.vitaminA')} {...form.getInputProps(`${prefix}vitaminA`)} min={0} />
        <NumberInput label={t('foods:form.vitamins.vitaminC')} {...form.getInputProps(`${prefix}vitaminC`)} min={0} />
        <NumberInput label={t('foods:form.vitamins.vitaminD')} {...form.getInputProps(`${prefix}vitaminD`)} min={0} />
        <NumberInput label={t('foods:form.vitamins.vitaminE')} {...form.getInputProps(`${prefix}vitaminE`)} min={0} />
        <NumberInput label={t('foods:form.vitamins.vitaminB1')} {...form.getInputProps(`${prefix}vitaminB1`)} min={0} />
      </Group>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.vitamins.vitaminB2')} {...form.getInputProps(`${prefix}vitaminB2`)} min={0} />
        <NumberInput label={t('foods:form.vitamins.vitaminB3')} {...form.getInputProps(`${prefix}vitaminB3`)} min={0} />
        <NumberInput label={t('foods:form.vitamins.vitaminB6')} {...form.getInputProps(`${prefix}vitaminB6`)} min={0} />
        <NumberInput label={t('foods:form.vitamins.vitaminB9')} {...form.getInputProps(`${prefix}vitaminB9`)} min={0} />
        <NumberInput label={t('foods:form.vitamins.vitaminB12')} {...form.getInputProps(`${prefix}vitaminB12`)} min={0} />
      </Group>
    </Box>
  );
};


const NutritionInfoForm = ({ form }) => {
  const { t } = useTranslation(['foods']);
  return (
    <Box>
      <Title order={4} mb="sm">{t('foods:form.nutritionInfo.title')}</Title>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.nutritionInfo.calories')} {...form.getInputProps('nutritionInfo.calories')} min={0} />
        <NumberInput label={t('foods:form.nutritionInfo.carbohydrates')} {...form.getInputProps('nutritionInfo.carbohydrates')} min={0} />
        <NumberInput label={t('foods:form.nutritionInfo.fats')} {...form.getInputProps('nutritionInfo.fats')} min={0} />
        <NumberInput label={t('foods:form.nutritionInfo.fiber')} {...form.getInputProps('nutritionInfo.fiber')} min={0} />
      </Group>
      <Group grow mb="md">
        <NumberInput label={t('foods:form.nutritionInfo.protein')} {...form.getInputProps('nutritionInfo.protein')} min={0} />
        <NumberInput label={t('foods:form.nutritionInfo.salt')} {...form.getInputProps('nutritionInfo.salt')} min={0} />
        <NumberInput label={t('foods:form.nutritionInfo.saturatedFats')} {...form.getInputProps('nutritionInfo.saturatedFats')} min={0} />
        <NumberInput label={t('foods:form.nutritionInfo.sugars')} {...form.getInputProps('nutritionInfo.sugars')} min={0} />
      </Group>
      <Divider my="md" />
      <MineralsFields form={form} />
      <Divider my="md" />
      <VitaminsFields form={form} />
    </Box>
  );
};

export default NutritionInfoForm;
