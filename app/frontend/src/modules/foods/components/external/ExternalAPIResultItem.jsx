import { Card, Group, Image, Text, Button, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const NO_IMAGE_PLACEHOLDER =
  'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';


const ExternalAPIResultItem = ({ product, onAdd, disabled }) => {
  
  const { t } = useTranslation(['foods']);

  const imageUrl = product.image_url || NO_IMAGE_PLACEHOLDER;
  const brands = product.brands || t('foods:off.noBrand');
  const name = product.product_name || t('foods:off.noName');


  const handleAdd = () => {
    if (onAdd && !disabled) {
      onAdd(product.code);
    }
  };
  

  return (
    <Card withBorder radius="md" shadow="xs" p="sm">
      <Group align="center" gap="md" wrap="nowrap" style={{ width: '100%' }}>
        <Box style={{ 
          width: 80, 
          height: 80, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0,
          backgroundColor: '#93969918',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Image
            src={imageUrl}
            alt={name}
            width="100%"
            height="100%"
            fit="contain"
            fallbackSrc={NO_IMAGE_PLACEHOLDER}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Box style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <Text 
            fw={600} 
            size="md" 
            style={{ 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block'
            }}
          >
            {name}
          </Text>
          <Text 
            size="sm" 
            c="dimmed"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block'
            }}
          >
            {brands}
          </Text>
        </Box>

        <Button 
          variant="light" 
          color="green" 
          onClick={handleAdd}
          style={{ flexShrink: 0, minWidth: 'fit-content' }}
          disabled={disabled}
        >
          {t('foods:off.addButton')}
        </Button>
      </Group>
    </Card>
  );
};

export default ExternalAPIResultItem;
