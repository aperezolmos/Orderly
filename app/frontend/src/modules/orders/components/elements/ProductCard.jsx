import { Paper, Text, Group, ActionIcon, Badge,
         useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconShoppingCartPlus, IconChefHat, IconGlass } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../../utils/formatters';


const ProductCard = ({ product, onSelect }) => {
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();


  const boxShadowIdle = colorScheme === 'dark' 
    ? '0 4px 6px rgba(0, 0, 0, 0.4)' 
    : theme.shadows.sm;

  const boxShadowHover = colorScheme === 'dark' 
    ? '0 8px 20px rgba(0, 0, 0, 0.8)' 
    : '0 8px 20px rgba(0, 0, 0, 0.15)';
  

  return (
    <Paper
      p="md"
      withBorder
      shadow="sm"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: boxShadowIdle,
      }}
      className="product-card"
      onClick={onSelect}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = boxShadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = boxShadowIdle;
      }}
    >
      <Group justify="flex-start" mb="xs">
        <ActionIcon
          variant="filled"
          color="green"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <IconShoppingCartPlus size={14} />
        </ActionIcon>
      </Group>
      <Text fw={700} size="lg" lineClamp={1} mb="xs">
        {product.name}
      </Text>
      <Text size="sm" c="dimmed" lineClamp={2} style={{ flexGrow: 1 }}>
        {product.description}
      </Text>
      <Group justify="flex-end" mt="md" style={{ marginTop: 'auto' }}>
        <Text fw={700} size="xl" c="green">
          {formatCurrency(product.price)}
        </Text>
      </Group>
    </Paper>
  );
};

export default ProductCard;
