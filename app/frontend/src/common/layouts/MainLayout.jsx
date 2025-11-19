import React from 'react';
import { AppShell, Group, Container } from '@mantine/core';
import LanguageSwitcher from '../components/LanguageSwitcher';


const MainLayout = ({ children }) => {

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group justify="space-between" align="center" h="100%">
            <div>
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                MyApp
              </span>
            </div>
            
            <Group>
              <LanguageSwitcher />
              
              {/* ...more elements */}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>


      {/* Main content area */}
      <AppShell.Main>
        <Container size="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
