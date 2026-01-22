import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../components/Navbar'; 
import Sidebar from '../components/Sidebar';


const MainLayout = ({ children }) => {
  
  const [opened, { toggle: toggleOpened, close: closeOpened }] = useDisclosure(false);
  const { isAuthenticated } = useAuth();


  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: true },
      }}
      padding="md"
    >
      {/* HEADER (Desktop Navbar) */}
      <AppShell.Header>
        <Navbar opened={opened} toggle={toggleOpened} />
      </AppShell.Header>

      {/* NAVBAR (Sidebar for mobile): only renders when authenticated */}
      {isAuthenticated && (
        <AppShell.Navbar p={0} style={{ zIndex: 101 }}> 
          {/* 'closeOpened' -> when a link is clicked, the menu closes */}
          <Sidebar closeMobile={closeOpened} />
        </AppShell.Navbar>
      )}

      {/* Main content */}
      <AppShell.Main>
        <Container size="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
