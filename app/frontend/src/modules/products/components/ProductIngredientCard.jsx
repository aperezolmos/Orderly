import { Card, Group, Text, Box, Image,
        useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { getNutriScoreImage, getNovaImage } from '../../../utils/iconMaps';
import AllergensList from './AllergensList';


const ProductIngredientCard = ({ ingredient }) => {
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();


  const name = ingredient?.foodName || '—';
  const qty = ingredient?.quantityInGrams ?? '-';
  const nutri = ingredient?.nutritionalMetrics?.nutriScore || null;
  const nova = ingredient?.nutritionalMetrics?.novaGroup || null;
  
  const borderStyle = {
    width: '100%',
    boxShadow: colorScheme === 'dark' 
      ? '1px 3px 3px rgba(0, 0, 0, 0.8)'
      : theme.shadows.sm
  };

  return (
    <Card 
      withBorder 
      radius="md" 
      shadow="sm" 
      p="sm" 
      style={borderStyle}
    >
      <Group align="flex-start" wrap="nowrap" justify="space-between" gap="md">
        
        {/* LEFT: Ingredient info + Allergens */}
        <Box style={{ flex: 1, minWidth: 0 }}> 
          <Group align="baseline" gap="xs" mb="xs" wrap="wrap">
            <Text fw={700} size="md" style={{ lineHeight: 1.2 }}>
              {name}
            </Text>
            <Text size="sm" c="dimmed">
              ({qty} g)
            </Text>
          </Group>

          <AllergensList 
            allergenInfo={ingredient?.allergenInfo} 
            idSuffix={`ing-${ingredient?.foodId ?? Math.random()}`} 
          />
        </Box>

        {/* RIGHT: Nutri-Score and NOVA */}
        <Group gap="xs" wrap="nowrap" align="flex-start" style={{ flexShrink: 0 }}>
          <Image 
            src={getNutriScoreImage(nutri)} 
            alt="nutriscore" 
            h={40} 
            w="auto"
            fit="contain" 
          />
          <Image 
            src={getNovaImage(nova)} 
            alt="nova" 
            h={40} 
            w="auto"
            fit="contain" 
          />
        </Group>

      </Group>
    </Card>
  );
};

export default ProductIngredientCard;