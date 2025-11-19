import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group } from '@mantine/core';


const LanguageSwitcher = () => {
  const { i18n } = useTranslation();


  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  

  return (
    <Group>
      <Button
        variant={i18n.language === 'en' ? 'filled' : 'outline'}
        size="xs"
        onClick={() => changeLanguage('en')}
      >
        EN
      </Button>
      <Button
        variant={i18n.language === 'es' ? 'filled' : 'outline'}
        size="xs"
        onClick={() => changeLanguage('es')}
      >
        ES
      </Button>
    </Group>
  );
};

export default LanguageSwitcher;
