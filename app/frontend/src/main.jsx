import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import './index.css';

import './i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import App from './App.jsx';


const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Open Sans, sans-serif',
  headings: {
    fontFamily: 'Greycliff CF, sans-serif',
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider 
      theme={theme} 
      withNormalizeCSS 
      withGlobalStyles
      defaultColorScheme="light"
    >
      <ModalsProvider>
        <Notifications />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>
);
