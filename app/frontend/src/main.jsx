import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import App from './App.jsx'

import './index.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/modals/styles.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <ModalsProvider>
        <Notifications />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
)
