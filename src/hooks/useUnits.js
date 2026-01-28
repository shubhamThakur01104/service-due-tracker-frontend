import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.js';
import { showNotification } from '@mantine/notifications';

// Types
// Unit, CreateUnitInput, and UpdateUnitInput are defined as JSDoc types
/**
 * @typedef {Object} Unit
 * @property {string} _id
 * @property {string} customerId
 * @property {string} displayName
 * @property {'AC' | 'Heater' | 'Machine' | 'Generator'} type
 * @property {string} [lastServiceDate]
 * @property {string} nextServiceDate
 * @property {number} [serviceIntervalDays]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} CreateUnitInput
 * @property {string} customerId
 * @property {string} displayName
 * @property {'AC' | 'Heater' | 'Machine' | 'Generator'} type
 * @property {string} [lastServiceDate]
 * @property {string} nextServiceDate
 * @property {number} [serviceIntervalDays]
 */

/**
 * @typedef {Object} UpdateUnitInput
 * @property {string} [customerId]
 * @property {string} [displayName]
 * @property {'AC' | 'Heater' | 'Machine' | 'Generator'} [type]
 * @property {string} [lastServiceDate]
 * @property {string} [nextServiceDate]
 * @property {number} [serviceIntervalDays]
 */

// API Functions
const unitApi = {
  getAll: async () => {
    const response = await api.get('/units');
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const data = apiResponse.data || [];
    return data;
  },

  getUnitsNeedingService: async (filter) => {
    try {
      const response = await api.get('/units/due', { params: { filter } });
      // Extract data from APIResponse object - response.data contains the APIResponse wrapper
      const apiResponse = response.data;
      const data = apiResponse.data || [];
      return data;
    } catch (error) {
      console.error(`Units due (${filter}) Error:`, error);
      throw error;
    }
  },

  getUnitsByCustomer: async (customerId) => {
    const response = await api.get(`/units/customer/${customerId}`);
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const data = apiResponse.data || [];
    return data;
  },

  getById: async (id) => {
    const response = await api.get(`/units/${id}`);
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const data = apiResponse.data || [];
    return data;
  },

  create: async (data) => {
    const response = await api.post('/units', data);
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const dataResult = apiResponse.data || [];
    return dataResult;
  },

  update: async (id, data) => {
    const response = await api.put(`/units/${id}`, data);
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const dataResult = apiResponse.data || {};
    return dataResult;
  },

  delete: async (id) => {
    await api.delete(`/units/${id}`);
  },
  
  registerServiceCompletion: async ({ id, serviceDate }) => {
    const response = await api.post(`/units/${id}/service-completion`, { serviceDate });
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const dataResult = apiResponse.data || {};
    return dataResult;
  },
};

// Hooks
export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: unitApi.getAll,
  });
};

export const useUnitsNeedingService = (filter) => {
  return useQuery({
    queryKey: ['units', 'due', filter],
    queryFn: () => unitApi.getUnitsNeedingService(filter),
    onError: (error) => {
      console.error(`useUnitsNeedingService (${filter}) Error:`, error);
    }
  });
};

export const useUnitsByCustomer = (customerId) => {
  return useQuery({
    queryKey: ['units', 'customer', customerId],
    queryFn: () => unitApi.getUnitsByCustomer(customerId),
    enabled: !!customerId,
  });
};

export const useUnit = (id) => {
  return useQuery({
    queryKey: ['units', id],
    queryFn: () => unitApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: unitApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'week'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'month'] });
      showNotification({
        title: 'Success',
        message: 'Unit created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to create unit',
        color: 'red',
      });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => unitApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['units', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['units', 'customer'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'week'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'month'] });
      showNotification({
        title: 'Success',
        message: 'Unit updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to update unit',
        color: 'red',
      });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: unitApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'customer'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'week'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'month'] });
      showNotification({
        title: 'Success',
        message: 'Unit deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to delete unit',
        color: 'red',
      });
    },
  });
};

export const useRegisterServiceCompletion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: unitApi.registerServiceCompletion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['units', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['units', 'customer'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'week'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'month'] });
      showNotification({
        title: 'Success',
        message: 'Service completion registered successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to register service completion',
        color: 'red',
      });
    },
  });
};