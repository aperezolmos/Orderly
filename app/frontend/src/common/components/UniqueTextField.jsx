import { TextInput, Loader, Tooltip } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';


const UniqueTextField = ({ 
  isChecking, 
  isAvailable, 
  value, 
  minLength = 1,
  ...others 
}) => {
  
  const { t } = useTranslation('common');

  const getRightSection = () => {
    if (!value || value.length < minLength) return null;
    if (isChecking) return <Loader size="xs" />;
    if (isAvailable === true) {
      return (
        <Tooltip label={t('common:validation.available')} withArrow>
          <IconCheck size="1rem" color="green" />
        </Tooltip>
      );
    }

    if (isAvailable === false) {
      return (
        <Tooltip label={t('common:validation.unavailable')} withArrow>
          <IconX size="1rem" color="red" />
        </Tooltip>
      );
    }
    return null;
  };


  return (
    <TextInput
      {...others}
      value={value}
      rightSection={getRightSection()}
      rightSectionPointerEvents="all"
    />
  );
};

export default UniqueTextField;
