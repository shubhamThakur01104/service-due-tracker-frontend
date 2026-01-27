import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalsProvider } from '@mantine/modals';
import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Units from './pages/Units';
import Import from './pages/Import';
import CustomerDetail from './pages/CustomerDetail';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  primaryColor: 'accent',
  colors: {
    accent: [
      '#ecffae',
      '#d9f783',
      '#c2e06d',
      '#a3c150',
      '#82a131',
      '#6b8a17',
      '#516c02',
      '#3a5200',
      '#233700',
      '#0c1d00',
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
});

function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <ModalsProvider>
          <Notifications position="top-right" />
          <Router>
            <AppShell
              header={{ height: 60 }}
              navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !mobileOpened, desktop: !desktopOpened } }}
              padding="md"
            >
              <AppShell.Header>
                <Group h="100%" px="md">
                  <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                  <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                  <Title order={2}>
                    <span className="text-accent-600">HVAC</span> Service Tracker
                  </Title>
                </Group>
              </AppShell.Header>

              <AppShell.Navbar p="md">
                <div className="space-y-2">
                  <a href="/" className="nav-link">
                    Dashboard
                  </a>
                  <a href="/customers" className="nav-link">
                    Customers
                  </a>
                  <a href="/units" className="nav-link">
                    Units
                  </a>
                  <a href="/import" className="nav-link">
                    Import Data
                  </a>
                </div>
              </AppShell.Navbar>

              <AppShell.Main>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                  <Route path="/units" element={<Units />} />
                  <Route path="/import" element={<Import />} />
                </Routes>
              </AppShell.Main>
            </AppShell>
          </Router>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
