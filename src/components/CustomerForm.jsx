import React from 'react';
import { 
  TextInput, 
  Button, 
  Group, 
  Box,
  Title,
  Grid,
  Select
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers.js';
import { modals } from '@mantine/modals';

/**
 * @typedef {Object} CustomerFormProps
 * @property {import('../hooks/useCustomers').Customer} [customer]
 */

const CustomerForm = ({ customer }) => {
  const isEditing = !!customer;
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const form = useForm({
    initialValues: {
      name: customer?.name || '',
      phone: customer?.phone || '',
      email: customer?.email || '',
      address: {
        houseNumber: customer?.address?.houseNumber || '',
        street: customer?.address?.street || '',
        area: customer?.address?.area || '',
        city: customer?.address?.city || '',
        state: customer?.address?.state || '',
        pincode: customer?.address?.pincode || '',
        country: customer?.address?.country || 'India',
      },
    },

    validate: {
      name: (value) => (value.trim() ? null : 'Name is required'),
      phone: (value) => {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!value) return 'Phone number is required';
        if (!phoneRegex.test(value)) return 'Invalid phone number';
        return null;
      },
      email: (value) => {
        if (value && !/^\S+@\S+$/.test(value)) {
          return 'Invalid email';
        }
        return null;
      },
    },
  });

  const handleSubmit = (values) => {
    const customerData = {
      name: values.name.trim(),
      phone: values.phone,
      email: values.email?.trim() || undefined,
      address: {
        houseNumber: values.address.houseNumber?.trim() || undefined,
        street: values.address.street?.trim() || undefined,
        area: values.address.area?.trim() || undefined,
        city: values.address.city?.trim() || undefined,
        state: values.address.state?.trim() || undefined,
        pincode: values.address.pincode?.trim() || undefined,
        country: values.address.country?.trim() || undefined,
      },
    };

    if (isEditing) {
      updateCustomer.mutate(
        { id: customer._id, data: customerData },
        {
          onSuccess: () => {
            modals.closeAll();
          },
        }
      );
    } else {
      createCustomer.mutate(customerData, {
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
          {isEditing ? 'Edit Customer' : 'Add New Customer'}
        </Title>
        
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Full Name"
              placeholder="Enter customer's full name"
              {...form.getInputProps('name')}
              required
            />
          </Grid.Col>
          
          <Grid.Col span={12}>
            <TextInput
              label="Phone Number"
              placeholder="Enter 10-digit phone number"
              {...form.getInputProps('phone')}
              required
            />
          </Grid.Col>
          
          <Grid.Col span={12}>
            <TextInput
              label="Email Address"
              placeholder="Enter email address (optional)"
              {...form.getInputProps('email')}
            />
          </Grid.Col>
          
          <Grid.Col span={12}>
            <Title order={5} className="mb-2 text-gray-700">Address</Title>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="House Number"
              placeholder="Enter house number"
              {...form.getInputProps('address.houseNumber')}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Street"
              placeholder="Enter street name"
              {...form.getInputProps('address.street')}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Area"
              placeholder="Enter area/locality"
              {...form.getInputProps('address.area')}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="City"
              placeholder="Enter city"
              {...form.getInputProps('address.city')}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="State"
              placeholder="Enter state"
              {...form.getInputProps('address.state')}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Pincode"
              placeholder="Enter pincode"
              {...form.getInputProps('address.pincode')}
            />
          </Grid.Col>
          
          <Grid.Col span={12}>
            <TextInput
              label="Country"
              placeholder="Enter country"
              {...form.getInputProps('address.country')}
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
            loading={createCustomer.isPending || updateCustomer.isPending}
          >
            {isEditing ? 'Update Customer' : 'Add Customer'}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default CustomerForm;