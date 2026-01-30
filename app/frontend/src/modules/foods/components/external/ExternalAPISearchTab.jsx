import { useState } from 'react';
import { Stack, Pagination, Loader, Center, Alert, Group, 
         TextInput, Button, Overlay, Text } from '@mantine/core';
import { IconAlertCircle, IconSearchOff, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useExternalAPISearch } from '../../hooks/useExternalAPISearch';
import ExternalAPIResultsList from './ExternalAPIResultsList';


const ExternalAPISearchTab = () => {
  
  const [query, setQuery] = useState('');
  const {
    results,
    loading,
    error,
    page,
    pageCount,
    search,
    setPage,
    searched,
    creating,
    createFoodFromExternalAPIBarcode,
  } = useExternalAPISearch();
  const { t } = useTranslation(['foods']);


  const handleSearch = (q) => {
    setQuery(q);
    search(q, 1);
  };


  return (
    <div style={{ position: 'relative' }}>
      {creating && (
        <Overlay
          blur={2}
          opacity={0.2}
          color="#6c6c6d"
          zIndex={10}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <Center style={{ flexDirection: 'column', minHeight: 200 }}> 
            <Loader size="lg" />
            <Text mt="md" ta="center">{t('foods:off.creatingFood')}</Text>
          </Center>
        </Overlay>
      )}
      <Stack>
        {/* Search Bar */}
        <Group align="end" gap="xs">
          <TextInput
            label={t('foods:off.searchLabel')}
            placeholder={t('foods:off.searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSearch(query);
            }}
            style={{ flex: 1 }}
            disabled={loading || creating}
          />
          <Button
            leftSection={<IconSearch size={16} />}
            onClick={() => handleSearch(query)}
            loading={loading}
            disabled={!query.trim() || creating}
          >
            {t('foods:off.searchButton')}
          </Button>
        </Group>
        
        {loading && (
          <Center mt="md" p="xl">
            <Loader />
          </Center>
        )}
        
        {!loading && error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title={t('foods:off.errorTitle')}
            color="red"
            mt="md"
          >
            {error}
          </Alert>
        )}
        
        {!loading && searched && results.length === 0 && !error && (
          <Alert
            icon={<IconSearchOff size="1rem" />}
            title={t('foods:off.noResults')}
            color="blue"
            mt="md"
          >
            {t('foods:off.noResults')}
          </Alert>
        )}
        
        {!loading && results.length > 0 && (
          <>
            <ExternalAPIResultsList
              results={results}
              onAdd={async (barcode) => {
                if (!creating) {
                  await createFoodFromExternalAPIBarcode(barcode);
                }
              }}
              disabled={creating}
            />
            {pageCount > 1 && (
              <Center mt="md">
                <Pagination 
                  value={page} 
                  onChange={setPage} 
                  total={pageCount} 
                  disabled={creating}
                  size="sm"
                  radius="md"
                  withEdges
                />
              </Center>
            )}
          </>
        )}
      </Stack>
    </div>
  );
};

export default ExternalAPISearchTab;
