import React, { useState } from 'react';
import {
  Title,
  Text,
  Card,
  Button,
  TextInput,
  Group,
  ActionIcon,
  Table,
  Badge,
  Select
} from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  IconDeviceAirpods,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconUser,
  IconCalendar
} from '@tabler/icons-react';
import {
  useUnits,
  useDeleteUnit
} from '../hooks/useUnits.js';
import { modals } from '@mantine/modals';
import UnitForm from '../components/UnitForm';

const Units = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(null);

  const { data: units = [], isLoading: unitsLoading } = useUnits();
  const deleteUnit = useDeleteUnit();

  // Type filters for filterOptions
  const types = ['AC', 'Heater', 'Machine', 'Generator'];

  // Filter function that now handles both criteria
  const filteredUnits = units.filter((unit) =>
    (!search ||
      ((unit.customerId?.name || '').toLowerCase()
        .includes(search.toLowerCase()) ||
        unit.displayName.toLowerCase().includes(search.toLowerCase()))) &&
    (!selectedType || unit.type === selectedType)
  );

  // Get units based on selected type
  const getUnitsForTab = () => {
    let unitsToReturn = filteredUnits;
    
    // Sort units by next service date (nearest first)
    return unitsToReturn.sort((a, b) => {
      const dateA = new Date(a.nextServiceDate);
      const dateB = new Date(b.nextServiceDate);
      return dateA - dateB; // Ascending order - nearest dates first
    });
  };

  const openAddUnitModal = () => {
    modals.open({
      title: 'Add New Unit',
      size: 'lg',
      children: <UnitForm />,
    });
  };

  const openEditUnitModal = (unit) => {
    modals.open({
      title: 'Edit Unit',
      size: 'lg',
      children: <UnitForm unit={unit} />,
    });
  };

  const handleDeleteUnit = (id, name) => {
    modals.openConfirmModal({
      title: 'Delete Unit',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete unit <strong>{name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUnit.mutate(id),
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



  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-12">
        <div>
          <Title order={1} className="text-3xl font-bold text-gray-800">
            Units
          </Title>
          <Text className="text-gray-600 mt-2">
            Manage your HVAC units and equipment
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openAddUnitModal}
          color="accent"
          className="ml-4"
        >
          Add Unit
        </Button>
      </div>

      {/* Search and Filters */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6">
        <Group className="flex-wrap gap-4">
          <TextInput
            placeholder="Search by customer name or unit name..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="flex-grow max-w-md"
          />
          <Select
            placeholder="Filter by type"
            data={['All', ...types]}
            value={selectedType || 'All'}
            onChange={(value) => setSelectedType(value === 'All' ? null : value)}
            className="min-w-[200px]"
          />
        </Group>
      </Card>

      {/* Units List */}
      <Card shadow="sm" padding="lg" radius="md">
        {unitsLoading ? (
          <Text>Loading units...</Text>
        ) : filteredUnits.length === 0 ? (
          <div className="text-center py-20 mt-8">
            <IconDeviceAirpods size={48} className="text-gray-300 mx-auto mb-4" />
            <Title order={3} className="text-gray-500 mb-2">
              {search || selectedType ? 'No units found' : 'No units yet'}
            </Title>
            <Text className="text-gray-500 mb-4">
              {search || selectedType
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first unit'}
            </Text>
            {!search && !selectedType && (
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openAddUnitModal}
                color="accent"
                className="mt-4"
              >
                Add Unit
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Unit Name</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Last Service</Table.Th>
                  <Table.Th>Next Service</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {getUnitsForTab().map((unit) => {
                  const days = getDaysUntilService(unit.nextServiceDate);
                  const status = getServiceStatus(days);

                  return (
                    <Table.Tr key={unit._id}>
                      <Table.Td>
                        <div className="flex items-center">
                          <div className="bg-accent-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                            <IconDeviceAirpods size={20} className="text-accent-600" />
                          </div>
                          <div>
                            <Text className="font-medium">{unit.displayName}</Text>
                            <Text size="sm" className="text-gray-500">
                              Added {new Date(unit.createdAt).toLocaleDateString()}
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
                        <Group gap="xs">
                          <IconUser size={16} className="text-gray-500" />
                          {unit.customerId ? (
                            <Link to={`/customers/${unit.customerId._id}`} className="text-accent-600 no-underline">
                              <Text>{unit.customerId.name}</Text>
                            </Link>
                          ) : (
                            <Text>Unknown Customer</Text>
                          )}
                        </Group>
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
                        {days < 0 ? (
                          <Text size="sm" className="text-red-500">
                            ({Math.abs(days)} days overdue)
                          </Text>
                        ) : days === 0 ? (
                          <Text size="sm" className="text-orange-500">
                            (Due today)
                          </Text>
                        ) : (
                          <Text size="sm" className="text-gray-500">
                            (in {days} days)
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Badge color={status.color} variant="light">
                          {status.text}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => openEditUnitModal(unit)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleDeleteUnit(unit._id, unit.displayName)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Units;