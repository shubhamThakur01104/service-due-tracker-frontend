import React, { useState } from 'react';
import {
  Modal,
  Button,
  Group,
  Box,
  Title,
  Text,
  Alert
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useRegisterServiceCompletion } from '../hooks/useUnits.js';
import dayjs from 'dayjs';

/**
 * @typedef {Object} ServiceCompletionModalProps
 * @property {boolean} opened
 * @property {Function} onClose
 * @property {import('../hooks/useUnits').Unit} unit
 */

const ServiceCompletionModal = ({ opened, onClose, unit }) => {
  const [serviceDate, setServiceDate] = useState(new Date());
  const [error, setError] = useState('');
  
  const registerServiceCompletion = useRegisterServiceCompletion();

  const handleSave = async () => {
    if (!unit) {
      setError('Unit is required');
      return;
    }

    try {
      await registerServiceCompletion.mutateAsync({
        id: unit._id,
        serviceDate: dayjs(serviceDate).toISOString()
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register service completion');
    }
  };

  if (!unit) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Register Service for ${unit.displayName}`}
      size="md"
    >
      <Box>
        <Title order={4} mb="md">Service Details</Title>
        
        {error && (
          <Alert title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}
        
        <Text mb="sm">
          <strong>Customer:</strong> {unit.customerId?.name || 'N/A'}
        </Text>
        
        <Text mb="sm">
          <strong>Unit Type:</strong> {unit.type}
        </Text>
        
        <Text mb="sm">
          <strong>Current Service Interval:</strong> {unit.serviceIntervalDays || 'Not Set'} days
        </Text>
        
        <Text mb="sm">
          <strong>Last Service Date:</strong> {unit.lastServiceDate 
            ? new Date(unit.lastServiceDate).toLocaleDateString() 
            : 'Never'}
        </Text>
        
        <Text mb="sm">
          <strong>Current Next Service Date:</strong> {unit.nextServiceDate 
            ? new Date(unit.nextServiceDate).toLocaleDateString() 
            : 'Not Set'}
        </Text>
        
        <DatePickerInput
          label="Service Date"
          placeholder="Select service date"
          value={serviceDate}
          onChange={setServiceDate}
          maxDate={new Date()}
          required
          mt="md"
        />
        
        <Text size="sm" color="dimmed" mt="xs">
          After saving, the next service date will be automatically calculated based on the service interval.
        </Text>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            loading={registerServiceCompletion.isPending}
          >
            Register Service
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};

export default ServiceCompletionModal;