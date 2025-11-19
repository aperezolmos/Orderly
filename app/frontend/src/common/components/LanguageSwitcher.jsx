import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Tooltip, Menu, Text } from '@mantine/core';
import { IconLanguage, IconCheck } from '@tabler/icons-react';


const LanguageSwitcher = () => {
  
  const { i18n, t } = useTranslation('common');


  const languages = [
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'es', name: t('language.spanish'), flag: '🇪🇸' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Tooltip label={t('language.change')} position="bottom">
          <ActionIcon variant="light" size="lg">
            <IconLanguage size="1.25rem" />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('language.select')}</Menu.Label>
        {languages.map((language) => (
          <Menu.Item
            key={language.code}
            leftSection={<Text size="sm">{language.flag}</Text>}
            rightSection={i18n.language === language.code ? <IconCheck size="1rem" /> : null}
            onClick={() => changeLanguage(language.code)}
          >
            {language.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher;
