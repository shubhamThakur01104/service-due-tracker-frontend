import React from 'react';
import { 
  TextInput, 
  Button, 
  Group, 
  Box,
  Title,
  Grid,
  Select,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useCreateUnit, useUpdateUnit } from '../hooks/useUnits.js';
import { useCustomers } from '../hooks/useCustomers.js';
import { modals } from '@mantine/modals';
import dayjs from 'dayjs';

/**
 * @typedef {Object} UnitFormProps
 * @property {import('../hooks/useUnits').Unit} [unit]
 */

const UnitForm = ({ unit }) => {
  const isEditing = !!unit;
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const { data: customers = [] } = useCustomers();
  
  // Helper function to get customer ID regardless of whether it's populated or not
  const getCustomerId = (unit) => {
    if (!unit) return '';
    if (typeof unit.customerId === 'object' && unit.customerId._id) {
      return unit.customerId._id;
    }
    return unit.customerId || '';
  };

  const customerOptions = customers.map(customer => ({
    value: customer._id,
    label: `${customer.name} (${customer.phone})`,
  }));

  const typeOptions = [
    { value: 'AC', label: 'Air Conditioner' },
    { value: 'Heater', label: 'Heater' },
    { value: 'Machine', label: 'Machine' },
    { value: 'Generator', label: 'Generator' },
  ];

  const form = useForm({
    initialValues: {
      customerId: getCustomerId(unit),
      displayName: unit?.displayName || '',
      type: unit?.type || 'AC',
      lastServiceDate: unit?.lastServiceDate ? new Date(unit.lastServiceDate) : null,
      nextServiceDate: unit?.nextServiceDate ? new Date(unit.nextServiceDate) : new Date(),
      serviceIntervalDays: unit?.serviceIntervalDays || 90,
    },

    validate: {
      customerId: (value) => (value ? null : 'Customer is required'),
      displayName: (value) => (value.trim() ? null : 'Unit name is required'),
      type: (value) => (value ? null : 'Unit type is required'),
      nextServiceDate: (value) => (value ? null : 'Next service date is required'),
    },
  });

  // Function to automatically calculate next service date
  const calculateNextServiceDate = (lastServiceDate, serviceIntervalDays) => {
    if (!lastServiceDate || !serviceIntervalDays) return null;
    
    const lastDate = new Date(lastServiceDate);
    const intervalDays = parseInt(serviceIntervalDays);
    
    if (isNaN(lastDate.getTime()) || isNaN(intervalDays) || intervalDays <= 0) return null;
    
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + intervalDays);
    
    return nextDate;
  };
  
  // Handle changes to last service date or service interval days to auto-calculate next service date
  React.useEffect(() => {
    const lastServiceDate = form.values.lastServiceDate;
    const serviceIntervalDays = form.values.serviceIntervalDays;
    
    // Only auto-calculate if both values are present
    if (lastServiceDate && serviceIntervalDays) {
      const calculatedNextDate = calculateNextServiceDate(lastServiceDate, serviceIntervalDays);
      if (calculatedNextDate) {
        // Only update if nextServiceDate hasn't been manually set or if it differs from calculated
        if (!unit || !unit.nextServiceDate || 
            new Date(unit.nextServiceDate).getTime() !== new Date(calculatedNextDate).getTime()) {
          form.setFieldValue('nextServiceDate', calculatedNextDate);
        }
      }
    }
  }, [form.values.lastServiceDate, form.values.serviceIntervalDays]);
  
  const handleSubmit = (values) => {
    const unitData = {
      customerId: values.customerId,
      displayName: values.displayName.trim(),
      type: values.type,
      lastServiceDate: values.lastServiceDate ? dayjs(values.lastServiceDate).toISOString() : undefined,
      nextServiceDate: dayjs(values.nextServiceDate).toISOString(),
      serviceIntervalDays: values.serviceIntervalDays,
    };

    if (isEditing) {
      updateUnit.mutate(
        { id: unit._id, data: unitData },
        {
          onSuccess: () => {
            modals.closeAll();
          },
        }
      );
    } else {
      createUnit.mutate(unitData, {
        onSuccess: () => {
          modals.closeAll();
          form.reset();
        },
      });
    }
  };

  return (
    <Box className="w-full">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title order={3} className="mb-4 text-gray-800">
          {isEditing ? 'Edit Unit' : 'Add New Unit'}
        </Title>
        
        <Grid>
          <Grid.Col span={12}>
            <Select
              label="Customer"
              placeholder="Select customer"
              data={customerOptions}
              {...form.getInputProps('customerId')}
              required
            />
          </Grid.Col>
          
          <Grid.Col span={12}>
            <TextInput
              label="Unit Name"
              placeholder="Enter unit display name (e.g., Living Room AC)"
              {...form.getInputProps('displayName')}
              required
            />
          </Grid.Col>
          
          <Grid.Col span={12}>
            <Select
              label="Unit Type"
              placeholder="Select unit type"
              data={typeOptions}
              {...form.getInputProps('type')}
              required
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DatePickerInput
              label="Last Service Date"
              placeholder="Select last service date"
              value={form.values.lastServiceDate}
              onChange={(date) => form.setFieldValue('lastServiceDate', date)}
              clearable
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DatePickerInput
              label="Next Service Date"
              placeholder="Select next service date"
              {...form.getInputProps('nextServiceDate')}
              required
            />
          </Grid.Col>
          
          <Grid.Col span={12}>
            <TextInput
              label="Service Interval (Days)"
              placeholder="Enter service interval in days"
              type="number"
              min={1}
              {...form.getInputProps('serviceIntervalDays')}
            />
          </Grid.Col>
        </Grid>
        
        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={() => modals.closeAll()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="accent"
            loading={createUnit.isPending || updateUnit.isPending}
          >
            {isEditing ? 'Update Unit' : 'Add Unit'}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default UnitForm;