import React from 'react';
import { useParams } from 'react-router-dom';
import { Title, Text, Card, Grid, Group, Badge, Table, Modal } from '@mantine/core';
import { IconUser, IconPhone, IconMail, IconMapPin, IconDeviceAirpods, IconCalendar } from '@tabler/icons-react';
import { useCustomerById } from '../hooks/useCustomers.js';
import { useUnitsByCustomer } from '../hooks/useUnits.js';
import { Link } from 'react-router-dom';
import { modals } from '@mantine/modals';

const CustomerDetail = () => {
  const { id } = useParams();
  const { data: customer, isLoading: customerLoading, error: customerError } = useCustomerById(id);
  const { data: units, isLoading: unitsLoading, error: unitsError } = useUnitsByCustomer(id);
  
  const [selectedUnit, setSelectedUnit] = React.useState(null);
  
  const openUnitDetails = (unit) => {
    setSelectedUnit(unit);
    modals.open({
      title: `Unit Details - ${unit.displayName}`,
      size: 'md',
      children: (
        <div className="space-y-4">
          <div>
            <Text fw={500} size="sm" className="text-gray-600">Unit Name</Text>
            <Text>{unit.displayName}</Text>
          </div>
          <div>
            <Text fw={500} size="sm" className="text-gray-600">Type</Text>
            <Text>{unit.type}</Text>
          </div>
          <div>
            <Text fw={500} size="sm" className="text-gray-600">Service Interval</Text>
            <Text>{unit.serviceIntervalDays ? `${unit.serviceIntervalDays} days` : 'Not set'}</Text>
          </div>
          <div>
            <Text fw={500} size="sm" className="text-gray-600">Last Service Date</Text>
            <Text>
              {unit.lastServiceDate 
                ? new Date(unit.lastServiceDate).toLocaleDateString() 
                : 'Not recorded'}
            </Text>
          </div>
          <div>
            <Text fw={500} size="sm" className="text-gray-600">Next Service Date</Text>
            <Text>{new Date(unit.nextServiceDate).toLocaleDateString()}</Text>
          </div>
          <div>
            <Text fw={500} size="sm" className="text-gray-600">Days Until Next Service</Text>
            <Text>
              {(() => {
                const days = getDaysUntilService(unit.nextServiceDate);
                if (days < 0) return `${Math.abs(days)} days overdue`;
                if (days === 0) return 'Due today';
                return `In ${days} days`;
              })()}
            </Text>
          </div>
        </div>
      ),
    });
  };

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

  if (customerLoading || unitsLoading) {
    return <Text>Loading...</Text>;
  }

  if (customerError) {
    return <Text>Error loading customer: {customerError.message}</Text>;
  }

  if (unitsError) {
    return <Text>Error loading units: {unitsError.message}</Text>;
  }

  if (!customer) {
    return <Text>Customer not found</Text>;
  }

  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    const parts = [
      address.houseNumber,
      address.street,
      address.area,
      address.city,
      address.state,
      address.pincode,
      address.country
    ].filter(Boolean);
    return parts.join(', ') || 'No address provided';
  };

  return (
    <div className="p-4">
      <Link to="/customers" className="text-accent-600 no-underline mb-4 inline-block">
        ← Back to Customers
      </Link>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title order={1} className="text-3xl font-bold text-gray-800">
              {customer.name}
            </Title>
            <Text className="text-gray-600 mt-2">
              Customer Details & Units
            </Text>
          </div>
        </div>

        {/* Customer Info Card */}
        <Card shadow="sm" padding="lg" radius="md" className="mb-6">
          <Grid>
            <Grid.Col span={12} md={6}>
              <div className="flex items-center mb-4">
                <div className="bg-accent-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <IconUser size={20} className="text-accent-600" />
                </div>
                <div>
                  <Text className="text-gray-500 text-sm">Name</Text>
                  <Text className="font-medium">{customer.name}</Text>
                </div>
              </div>
            </Grid.Col>
            
            <Grid.Col span={12} md={6}>
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <IconPhone size={20} className="text-blue-600" />
                </div>
                <div>
                  <Text className="text-gray-500 text-sm">Phone</Text>
                  <Text className="font-medium">{customer.phone}</Text>
                </div>
              </div>
            </Grid.Col>
            
            <Grid.Col span={12} md={6}>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <IconMail size={20} className="text-green-600" />
                </div>
                <div>
                  <Text className="text-gray-500 text-sm">Email</Text>
                  <Text className="font-medium">{customer.email || 'Not provided'}</Text>
                </div>
              </div>
            </Grid.Col>
            
            <Grid.Col span={12} md={6}>
              <div className="flex items-center">
                <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <IconMapPin size={20} className="text-yellow-600" />
                </div>
                <div>
                  <Text className="text-gray-500 text-sm">Address</Text>
                  <Text className="font-medium">{formatAddress(customer.address)}</Text>
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Units Section */}
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex justify-between items-center mb-6">
            <Title order={2} className="text-xl font-semibold text-gray-800">
              Associated Units
            </Title>
            <Text className="text-gray-600">
              {units?.length || 0} {units?.length === 1 ? 'Unit' : 'Units'}
            </Text>
          </div>

          {units && units.length > 0 ? (
            <div className="overflow-x-auto">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Unit Name</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Service Interval</Table.Th>
                    <Table.Th>Last Service</Table.Th>
                    <Table.Th>Next Service</Table.Th>
                    <Table.Th>Days Remaining</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {units.map((unit) => {
                    const days = getDaysUntilService(unit.nextServiceDate);
                    const status = getServiceStatus(days);
                    
                    return (
                      <Table.Tr key={unit._id}>
                        <Table.Td>
                          <div className="flex items-center">
                            <div className="bg-accent-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                              <IconDeviceAirpods size={16} className="text-accent-600" />
                            </div>
                            <div>
                              <Text 
                                className="font-medium text-accent-600 cursor-pointer hover:underline"
                                onClick={() => openUnitDetails(unit)}
                              >
                                {unit.displayName}
                              </Text>
                              <Text size="sm" className="text-gray-500">
                                Click for details
                              </Text>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge color="accent" variant="light">
                            {unit.type}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text>
                            {unit.serviceIntervalDays ? 
                              `${unit.serviceIntervalDays} days` : 
                              'Not set'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text>
                            {unit.lastServiceDate ? new Date(unit.lastServiceDate).toLocaleDateString() : 'Not recorded'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <IconCalendar size={16} className="text-gray-500" />
                            <Text>
                              {new Date(unit.nextServiceDate).toLocaleDateString()}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center gap-2">
                            {days < 0 ? (
                              <>
                                <Badge color="red" variant="filled" size="sm">
                                  OVERDUE
                                </Badge>
                                <Text size="sm" className="text-red-600 font-medium">
                                  {Math.abs(days)} day{Math.abs(days) !== 1 ? 's' : ''}
                                </Text>
                              </>
                            ) : days === 0 ? (
                              <>
                                <Badge color="orange" variant="filled" size="sm">
                                  DUE TODAY
                                </Badge>
                                <Text size="sm" className="text-orange-600 font-medium">
                                  Urgent
                                </Text>
                              </>
                            ) : days <= 7 ? (
                              <>
                                <Badge color="yellow" variant="filled" size="sm">
                                  DUE SOON
                                </Badge>
                                <Text size="sm" className="text-yellow-700 font-medium">
                                  {days} day{days !== 1 ? 's' : ''}
                                </Text>
                              </>
                            ) : (
                              <>
                                <Badge color="green" variant="filled" size="sm">
                                  SCHEDULED
                                </Badge>
                                <Text size="sm" className="text-green-600 font-medium">
                                  {days} day{days !== 1 ? 's' : ''}
                                </Text>
                              </>
                            )}
                          </div>
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
            </div>
          ) : (
            <div className="text-center py-12">
              <IconDeviceAirpods size={48} className="text-gray-300 mx-auto mb-4" />
              <Title order={3} className="text-gray-500 mb-2">
                No Units Found
              </Title>
              <Text className="text-gray-500">
                This customer doesn't have any associated units yet.
              </Text>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetail;