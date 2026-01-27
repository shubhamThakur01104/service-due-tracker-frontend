import React, { useState } from 'react';
import {
  Title,
  Text,
  Card,
  Grid,
  Button,
  TextInput,
  Group,
  ActionIcon,
  Table
} from '@mantine/core';
import {
  IconUserPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconPhone,
  IconMail,
  IconMapPin
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useCustomers, useDeleteCustomer } from '../hooks/useCustomers.js';
import { modals } from '@mantine/modals';
import CustomerForm from '../components/CustomerForm';

const Customers = () => {
  const [search, setSearch] = useState('');
  const { data: customers = [], isLoading } = useCustomers();
  const deleteCustomer = useDeleteCustomer();



  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.includes(search) ||
    (customer.email && customer.email.toLowerCase().includes(search.toLowerCase()))
  );

  const openAddCustomerModal = () => {
    modals.open({
      title: 'Add New Customer',
      size: 'lg',
      children: <CustomerForm />,
    });
  };

  const openEditCustomerModal = (customer) => {
    modals.open({
      title: 'Edit Customer',
      size: 'lg',
      children: <CustomerForm customer={customer} />,
    });
  };

  const handleDeleteCustomer = (id, name) => {
    modals.openConfirmModal({
      title: 'Delete Customer',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete customer <strong>{name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteCustomer.mutate(id),
    });
  };

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title order={1} className="text-3xl font-bold text-gray-800">
            Customers
          </Title>
          <Text className="text-gray-600 mt-2">
            Manage your customer database
          </Text>
        </div>
        <Button
          leftSection={<IconUserPlus size={16} />}
          onClick={openAddCustomerModal}
          color="accent"
        >
          Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6">
        <Grid>
          <Grid.Col span={12} md={6}>
            <TextInput
              placeholder="Search customers by name, phone, or email..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* Customers List */}
      <Card shadow="sm" padding="lg" radius="md">
        {isLoading ? (
          <Text>Loading customers...</Text>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20 mt-8">
            <IconUserPlus size={48} className="text-gray-300 mx-auto mb-4" />
            <Title order={3} className="text-gray-500 mb-2">
              {search ? 'No customers found' : 'No customers yet'}
            </Title>
            <Text className="text-gray-500 mb-4">
              {search
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first customer'}
            </Text>
            {!search && (
              <Button
                leftSection={<IconUserPlus size={16} />}
                onClick={openAddCustomerModal}
                color="accent"
                className="mt-4"
              >
                Add Customer
              </Button>
            )}
          </div>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCustomers.map((customer, index) => (
                <Table.Tr key={customer._id}>
                  <Table.Td>
                      <div>
                        <Link to={`/customers/${customer._id}`} className="text-gray-800 no-underline">
                          {customer.name}
                        </Link>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconPhone size={16} className="text-gray-500" />
                        <Text>{customer.phone}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      {customer.email ? (
                        <Group gap="xs">
                          <IconMail size={16} className="text-gray-500" />
                          <Text>{customer.email}</Text>
                        </Group>
                      ) : (
                        <Text className="text-gray-400">No email</Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      <Group gap="xs">
                        <IconMapPin size={16} className="text-gray-500" />
                        <Text size="sm" className="max-w-xs truncate">
                          {formatAddress(customer.address)}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td style={{ padding: '12px', verticalAlign: 'middle' }}>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => openEditCustomerModal(customer)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteCustomer(customer._id, customer.name)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
        )}
      </Card>
    </div>
  );
};

export default Customers;