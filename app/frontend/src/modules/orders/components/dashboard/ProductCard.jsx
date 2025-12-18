import { Paper, Text, Group, ActionIcon, Badge } from '@mantine/core';
import { IconShoppingCartPlus, IconChefHat, IconGlass } from '@tabler/icons-react';
import { formatCurrency } from '../../../../utils/formatters';
import { useTranslation } from 'react-i18next';


const ProductCard = ({ product, onSelect }) => {
  
  const { t } = useTranslation(['orders']);


  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'drink':
        return <IconGlass size={16} />;
      case 'food':
        return <IconChefHat size={16} />;
      case 'dessert':
        return <IconShoppingCartPlus size={16} />;
      default:
        return <IconChefHat size={16} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'drink':
        return 'blue';
      case 'food':
        return 'orange';
      case 'dessert':
        return 'pink';
      default:
        return 'gray';
    }
  };

  // TODO: Assuming product.category exists and is 'food', 'drink', etc.
  const categoryKey = product.category ? product.category.toLowerCase() : 'food';

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
        flexDirection: 'column'
      }}
      className="product-card"
      onClick={onSelect}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      <Group justify="apart" align="start" mb="xs">
        <Badge
          leftSection={getCategoryIcon(categoryKey)}
          color={getCategoryColor(categoryKey)}
          variant="light"
        >
          {t(`orders:types.${categoryKey}`, categoryKey)}
        </Badge>
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
      <Group justify="apart" mt="md" style={{ marginTop: 'auto' }}>
        <Text fw={700} size="xl" c="green">
          {formatCurrency(product.price)}
        </Text>
      </Group>
    </Paper>
  );
};

export default ProductCard;
