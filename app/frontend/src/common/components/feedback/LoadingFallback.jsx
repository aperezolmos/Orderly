import { Box, Stack, Text, Loader, Center } from '@mantine/core';
import { useTranslation } from 'react-i18next';


const LoadingFallback = () => {
  
  const { t } = useTranslation();

  
  return (
    <Box 
      pos="fixed" 
      top={0} 
      left={0} 
      w="100vw" 
      h="100vh" 
      style={{ 
        zIndex: 9999
      }}
    >
      <Center h="100%">
        <Stack align="center" gap="md">
          <Loader size="lg" type="dots" />
          <Text size="md" fw={600}>
            {t('common:app.loading')}
          </Text>
        </Stack>
      </Center>
    </Box>
  );
};

export default LoadingFallback;
