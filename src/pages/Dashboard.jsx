import React from 'react';
import { Title, Text, Card, Grid, Badge, Group, Button, Modal, Table, ActionIcon } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconCalendar, IconUser, IconDeviceAirpods, IconCheck } from '@tabler/icons-react';
import { useCustomers } from '../hooks/useCustomers.js';
import { useUnits, useUnitsNeedingService } from '../hooks/useUnits.js';
import { modals } from '@mantine/modals';
import CustomerForm from '../components/CustomerForm';
import UnitForm from '../components/UnitForm';
import ServiceCompletionModal from '../components/ServiceCompletionModal';

// Helper functions
  const getDaysUntilService = (nextServiceDate) => {
    const today = new Date();
    const serviceDate = new Date(nextServiceDate);
    const diffTime = serviceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getServiceStatus = (days) => {
    if (days < 0) return { color: 'red', text: 'Overdue' };
    if (days === 0) return { color: 'orange', text: 'Due Today' };
    if (days <= 7) return { color: 'yellow', text: 'Due Soon' };
    return { color: 'green', text: 'Scheduled' };
  };

const Dashboard = () => {
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: units = [], isLoading: unitsLoading } = useUnits();
  const { data: unitsDueToday = [], isLoading: unitsTodayLoading } = useUnitsNeedingService('today');
  const { data: unitsDueWeek = [], isLoading: unitsWeekLoading } = useUnitsNeedingService('week');
  const { data: unitsDueMonth = [], isLoading: unitsMonthLoading } = useUnitsNeedingService('month');
  
  // Ensure data is always an array
  const safeUnitsDueToday = Array.isArray(unitsDueToday) ? unitsDueToday : [];
  const safeUnitsDueWeek = Array.isArray(unitsDueWeek) ? unitsDueWeek : [];
  const safeUnitsDueMonth = Array.isArray(unitsDueMonth) ? unitsDueMonth : [];
  
  // Combine all units with customer data
  const allUnitsWithCustomers = React.useMemo(() => {
    if (!units || !customers) return [];
    
    return units.map(unit => {
      const customer = customers.find(c => c._id === unit.customerId);
      return {
        ...unit,
        customerId: customer || unit.customerId // Keep the populated customer data if available
      };
    });
  }, [units, customers]);
  
  // Sort all units by overdue days (descending - most overdue first)
  const allUnitsWithCustomersSorted = React.useMemo(() => {
    return [...allUnitsWithCustomers].sort((a, b) => {
      const daysA = getDaysUntilService(a.nextServiceDate);
      const daysB = getDaysUntilService(b.nextServiceDate);
      
      // Sort by overdue days (most overdue first)
      if (daysA < 0 && daysB < 0) return Math.abs(daysB) - Math.abs(daysA); // Both overdue: more overdue first
      if (daysA < 0 && daysB >= 0) return -1; // A is overdue, B is not: A first
      if (daysA >= 0 && daysB < 0) return 1; // B is overdue, A is not: B first
      
      // Neither is overdue: sort by closest due date
      return daysA - daysB;
    });
  }, [allUnitsWithCustomers]);
  
  // State for modals
  const [customersModalOpened, setCustomersModalOpened] = React.useState(false);
  const [unitsTodayModalOpened, setUnitsTodayModalOpened] = React.useState(false);
  const [unitsWeekModalOpened, setUnitsWeekModalOpened] = React.useState(false);
  const [unitsMonthModalOpened, setUnitsMonthModalOpened] = React.useState(false);
  
  // State for service schedule modals
  const [serviceTodayModalOpened, setServiceTodayModalOpened] = React.useState(false);
  
  // State for service completion modal
  const [serviceCompletionModalOpen, setServiceCompletionModalOpen] = React.useState(false);
  const [selectedUnitForService, setSelectedUnitForService] = React.useState(null);
  

  
  // Error handling



  const openAddCustomerModal = () => {
    modals.open({
      title: 'Add New Customer',
      size: 'lg',
      children: <CustomerForm />,
    });
  };
  
  const openServiceCompletionModal = (unit) => {
    setSelectedUnitForService(unit);
    setServiceCompletionModalOpen(true);
  };

  const openAddUnitModal = () => {
    modals.open({
      title: 'Add New Unit',
      size: 'lg',
      children: <UnitForm />,
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title order={1} className="text-3xl font-bold text-gray-800">
            Dashboard
          </Title>
          <Text className="text-gray-600 mt-2">
            Welcome to your HVAC Service Tracker
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconUser size={16} />}
            onClick={openAddCustomerModal}
            color="accent"
          >
            Add Customer
          </Button>
          <Button
            leftSection={<IconDeviceAirpods size={16} />}
            onClick={openAddUnitModal}
            color="accent"
          >
            Add Unit
          </Button>
        </Group>
      </div>

      {/* Stats Cards */}
      <Grid className="mb-8">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            className="bg-gradient-to-br from-accent-50 to-accent-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCustomersModalOpened(true)}
          >
            <Group>
              <div className="bg-accent-200 p-3 rounded-full">
                <IconUser className="text-accent-600" size={24} />
              </div>
              <div>
                <Text className="text-gray-600 text-sm">Total Customers</Text>
                <Text className="text-2xl font-bold text-gray-800">
                  {customersLoading ? '...' : customers.length}
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            className="bg-gradient-to-br from-red-50 to-red-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setUnitsTodayModalOpened(true)}
          >
            <Group>
              <div className="bg-red-200 p-3 rounded-full">
                <IconCalendar className="text-red-600" size={24} />
              </div>
              <div>
                <Text className="text-gray-600 text-sm">Due Today</Text>
                <Text className="text-2xl font-bold text-gray-800">
                  {unitsTodayLoading ? '...' : safeUnitsDueToday.length}
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            className="bg-gradient-to-br from-orange-50 to-orange-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setUnitsWeekModalOpened(true)}
          >
            <Group>
              <div className="bg-orange-200 p-3 rounded-full">
                <IconCalendar className="text-orange-600" size={24} />
              </div>
              <div>
                <Text className="text-gray-600 text-sm">Due This Week</Text>
                <Text className="text-2xl font-bold text-gray-800">
                  {unitsWeekLoading ? '...' : safeUnitsDueWeek.length}
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setUnitsMonthModalOpened(true)}
          >
            <Group>
              <div className="bg-yellow-200 p-3 rounded-full">
                <IconCalendar className="text-yellow-600" size={24} />
              </div>
              <div>
                <Text className="text-gray-600 text-sm">Due This Month</Text>
                <Text className="text-2xl font-bold text-gray-800">
                  {unitsMonthLoading ? '...' : safeUnitsDueMonth.length}
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>



      {/* Overdue Services Alert */}
      {(() => {
        if (unitsTodayLoading || unitsWeekLoading || unitsMonthLoading) return null;
        
        const allUnits = [...safeUnitsDueToday, ...safeUnitsDueWeek, ...safeUnitsDueMonth];
        const overdueUnits = allUnits.filter(unit => {
          const days = getDaysUntilService(unit.nextServiceDate);
          return days < 0;
        });
        
        return overdueUnits.length > 0 ? (
          <Card shadow="sm" padding="lg" radius="md" className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
            <Group>
              <div className="bg-red-500 p-3 rounded-full">
                <IconCalendar className="text-white" size={24} />
              </div>
              <div className="flex-grow">
                <Title order={3} className="text-red-800 font-semibold">
                  ⚠️ Overdue Services Alert
                </Title>
                <Text className="text-red-700 mt-1">
                  You have {overdueUnits.length} unit{overdueUnits.length !== 1 ? 's' : ''} with overdue service.
                </Text>
              </div>
              <Button 
                variant="outline" 
                color="red" 
                onClick={() => document.getElementById('service-schedule')?.scrollIntoView({behavior: 'smooth'})}
              >
                View Details
              </Button>
            </Group>
          </Card>
        ) : null;
      })()}

      {/* All Units Table */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-8">
        <Title order={2} className="text-xl font-semibold mb-4 text-gray-800">
          All Units Overview
        </Title>
        {unitsLoading ? (
          <Text>Loading...</Text>
        ) : allUnitsWithCustomersSorted.length === 0 ? (
          <Text className="text-gray-600">No units found</Text>
        ) : (
          <div className="overflow-x-auto">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Customer Name</Table.Th>
                  <Table.Th>Contact Number</Table.Th>
                  <Table.Th>Unit Name</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Last Service Date</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Overdue Days</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allUnitsWithCustomersSorted.map((unit) => {
                  const days = getDaysUntilService(unit.nextServiceDate);
                  const status = getServiceStatus(days);
                  
                  const customer = unit.customerId || {};
                  const customerName = customer.name || 'Unknown Customer';
                  const customerPhone = customer.phone || 'N/A';
                  const lastServiceDate = unit.lastServiceDate ? new Date(unit.lastServiceDate).toLocaleDateString() : 'Not recorded';
                  const overdueDays = days < 0 ? Math.abs(days) : 0;
                  
                  return (
                    <Table.Tr key={unit._id}>
                      <Table.Td>
                        {customer._id ? (
                          <Link to={`/customers/${customer._id}`} className="text-accent-600 no-underline">
                            {customerName}
                          </Link>
                        ) : (
                          <Text>{customerName}</Text>
                        )}
                      </Table.Td>
                      <Table.Td>{customerPhone}</Table.Td>
                      <Table.Td>{unit.displayName}</Table.Td>
                      <Table.Td>
                        <Badge color="accent" variant="light">
                          {unit.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{lastServiceDate}</Table.Td>
                      <Table.Td>
                        <Badge color={status.color} variant="light">
                          {status.text}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {days < 0 ? (
                          <Badge color="red" variant="filled">
                            {overdueDays} day{overdueDays !== 1 ? 's' : ''} overdue
                          </Badge>
                        ) : (
                          <Text>-</Text>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* Customers Modal */}
      <Modal
        opened={customersModalOpened}
        onClose={() => setCustomersModalOpened(false)}
        title="All Customers"
        size="xl"
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {customers.map((customer) => (
              <Table.Tr key={customer._id}>
                <Table.Td>{customer.name}</Table.Td>
                <Table.Td>{customer.phone}</Table.Td>
                <Table.Td>{customer.email || 'N/A'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Modal>

      {/* Units Today Modal */}
      <Modal
        opened={unitsTodayModalOpened}
        onClose={() => setUnitsTodayModalOpened(false)}
        title="Units Due Today"
        size="xl"
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Unit Name</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Next Service</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {safeUnitsDueToday.map((unit) => {
              const days = getDaysUntilService(unit.nextServiceDate);
              return (
                <Table.Tr key={unit._id}>
                  <Table.Td>{unit.displayName}</Table.Td>
                  <Table.Td>
                    {unit.customerId?.name ? (
                      <Link to={`/customers/${unit.customerId._id}`} className="text-accent-600 no-underline">
                        {unit.customerId.name}
                      </Link>
                    ) : (
                      <Text>Unknown Customer</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge color="accent" variant="light">
                      {unit.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Text>{new Date(unit.nextServiceDate).toLocaleDateString()}</Text>
                      {days < 0 ? (
                        <Text size="sm" className="text-red-500">
                          ({Math.abs(days)} days overdue)
                        </Text>
                      ) : (
                        <Text size="sm" className="text-green-500">
                          (Due today)
                        </Text>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="light"
                      color="green"
                      onClick={() => openServiceCompletionModal(unit)}
                      title="Register Service Completion"
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Modal>

      {/* Units Week Modal */}
      <Modal
        opened={unitsWeekModalOpened}
        onClose={() => setUnitsWeekModalOpened(false)}
        title="Units Due This Week"
        size="xl"
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Unit Name</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Next Service</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {safeUnitsDueWeek.map((unit) => {
              const days = getDaysUntilService(unit.nextServiceDate);
              const status = getServiceStatus(days);
              return (
                <Table.Tr key={unit._id}>
                  <Table.Td>{unit.displayName}</Table.Td>
                  <Table.Td>
                    {unit.customerId?.name ? (
                      <Link to={`/customers/${unit.customerId._id}`} className="text-accent-600 no-underline">
                        {unit.customerId.name}
                      </Link>
                    ) : (
                      <Text>Unknown Customer</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge color="accent" variant="light">
                      {unit.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{new Date(unit.nextServiceDate).toLocaleDateString()}</Table.Td>
                  <Table.Td>
                    <Badge color={status.color} variant="light">
                      {status.text}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Modal>

      {/* Units Month Modal */}
      <Modal
        opened={unitsMonthModalOpened}
        onClose={() => setUnitsMonthModalOpened(false)}
        title="Units Due This Month"
        size="xl"
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Unit Name</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Next Service</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {allUnitsWithCustomersSorted.map((unit) => {
              const days = getDaysUntilService(unit.nextServiceDate);
              const status = getServiceStatus(days);
              return (
                <Table.Tr key={unit._id}>
                  <Table.Td>{unit.displayName}</Table.Td>
                  <Table.Td>
                    {unit.customerId?.name ? (
                      <Link to={`/customers/${unit.customerId._id}`} className="text-accent-600 no-underline">
                        {unit.customerId.name}
                      </Link>
                    ) : (
                      <Text>Unknown Customer</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge color="accent" variant="light">
                      {unit.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{new Date(unit.nextServiceDate).toLocaleDateString()}</Table.Td>
                  <Table.Td>
                    <Badge color={status.color} variant="light">
                      {status.text}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Modal>

      {/* Service Today Modal */}
      <Modal
        opened={serviceTodayModalOpened}
        onClose={() => setServiceTodayModalOpened(false)}
        title="Units Due Today - Detailed View"
        size="xl"
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Unit Name</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Last Service</Table.Th>
              <Table.Th>Next Service</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {safeUnitsDueToday.map((unit) => {
              const days = getDaysUntilService(unit.nextServiceDate);
              const status = getServiceStatus(days);
              return (
                <Table.Tr key={unit._id}>
                  <Table.Td>{unit.displayName}</Table.Td>
                  <Table.Td>
                    {unit.customerId?.name ? (
                      <Link to={`/customers/${unit.customerId._id}`} className="text-accent-600 no-underline">
                        {unit.customerId.name}
                      </Link>
                    ) : (
                      <Text>Unknown Customer</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge color="accent" variant="light">
                      {unit.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {unit.lastServiceDate ? new Date(unit.lastServiceDate).toLocaleDateString() : 'Not recorded'}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Text>{new Date(unit.nextServiceDate).toLocaleDateString()}</Text>
                      {days < 0 ? (
                        <Text size="sm" className="text-red-500">
                          ({Math.abs(days)} days overdue)
                        </Text>
                      ) : (
                        <Text size="sm" className="text-green-500">
                          (Due today)
                        </Text>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={status.color} variant="light">
                      {status.text}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Modal>

      {selectedUnitForService && (
        <ServiceCompletionModal
          opened={serviceCompletionModalOpen}
          onClose={() => {
            setServiceCompletionModalOpen(false);
            setSelectedUnitForService(null);
          }}
          unit={selectedUnitForService}
        />
      )}


    </div>
  );
};

export default Dashboard;