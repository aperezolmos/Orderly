import { Accordion, Group, Text, Box, Badge, Image } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { getAllergenIcon, UNKNOWN_ALLERGEN_ICON } from '../../../utils/iconMaps'; 
import { ALLERGENS } from '../../../utils/foodEnums'; 


const normalizeAllergens = (allergenInfo) => {
  if (!allergenInfo) return [];
  if (Array.isArray(allergenInfo)) return allergenInfo;
  if (Array.isArray(allergenInfo.allergens)) return allergenInfo.allergens;
  if (Array.isArray(allergenInfo.list)) return allergenInfo.list;
  if (typeof allergenInfo === 'object') {
    const vals = allergenInfo.allergens || allergenInfo.list || Object.values(allergenInfo);
    return Array.isArray(vals) ? vals : [];
  }
  return [];
};

const AllergenItem = ({ code }) => {

  const { t } = useTranslation(['foods']);
  
  const allergenDef = ALLERGENS.find(a => a.value === code);
  const translatedLabel = allergenDef ? t(allergenDef.label) : code;
  const iconSrc = getAllergenIcon(code);


  return (
    <Group wrap="nowrap" gap="xs" align="center" style={{ width: '100%' }}>
      <Box 
        style={{ 
          width: 24, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: '50%'
        }}
      >
        <Image 
          src={iconSrc} 
          alt={translatedLabel} 
          width={22} 
          height={22} 
          fit="contain"
          fallbackSrc={UNKNOWN_ALLERGEN_ICON} 
        />
      </Box>
      <Text size="sm" c="dimmed" style={{ lineHeight: 1.2 }}>
        {translatedLabel}
      </Text>
    </Group>
  );
};


const AllergensList = ({ allergenInfo, idSuffix = 'default' }) => {
  
  const { t } = useTranslation(['foods']);
  
  const allergens = normalizeAllergens(allergenInfo);
  const accordionId = `allergens-${idSuffix}`;


  return (
    <Accordion 
      variant="filled"
      chevronPosition="left" 
      radius="sm" 
      styles={{ 
        item: { border: 'none', backgroundColor: 'transparent' },
        control: { padding: '0px', height: '30px', '&:hover': { backgroundColor: 'transparent' } },
        content: { padding: '8px 0 0 0' },
        chevron: { marginLeft: '6px' }
      }}
    >
      <Accordion.Item value={accordionId}>
        <Accordion.Control>
          <Group gap="xs">
            <Text size="xs" fw={500} tt="uppercase" c="dimmed">{t('foods:allergens.form.title')}</Text>
            <Badge 
              color={allergens.length ? 'red' : 'gray'} 
              variant={allergens.length ? 'light' : 'outline'} 
              size="xs"
            >
              {allergens.length || '0'}
            </Badge>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {allergens.length ? allergens.map((code, idx) => (
              <AllergenItem key={`${code}-${idx}`} code={code} />
            )) : (
              <Text size="xs" c="dimmed" fs="italic">{t('foods:allergens.form.noAllergens')}</Text>
            )}
          </Box>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default AllergensList;