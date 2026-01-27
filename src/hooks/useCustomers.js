import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.js';
import { showNotification } from '@mantine/notifications';

// Types
// Address, Customer, CreateCustomerInput, and UpdateCustomerInput are defined as JSDoc types
/**
 * @typedef {Object} Address
 * @property {string} [houseNumber]
 * @property {string} [street]
 * @property {string} [area]
 * @property {string} [city]
 * @property {string} [state]
 * @property {string} [pincode]
 * @property {string} [country]
 */

/**
 * @typedef {Object} Customer
 * @property {string} _id
 * @property {string} name
 * @property {string} phone
 * @property {string} [email]
 * @property {Address} [address]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} CreateCustomerInput
 * @property {string} name
 * @property {string} phone
 * @property {string} [email]
 * @property {Address} [address]
 */

/**
 * @typedef {Object} UpdateCustomerInput
 * @property {string} [name]
 * @property {string} [phone]
 * @property {string} [email]
 * @property {Address} [address]
 */

// API Functions
const customerApi = {
  getAll: async () => {
    try {
      const response = await api.get('/customers');
      // Extract data from APIResponse object - response.data contains the APIResponse wrapper
      const apiResponse = response.data;
      const data = apiResponse.data || [];
      return data;
    } catch (error) {
      console.error('Customers API Error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const data = apiResponse.data || {};
    return data;
  },

  create: async (data) => {
    const response = await api.post('/customers', data);
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const dataResult = apiResponse.data || {};
    return dataResult;
  },

  update: async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    // Extract data from APIResponse object - response.data contains the APIResponse wrapper
    const apiResponse = response.data;
    const dataResult = apiResponse.data || {};
    return dataResult;
  },

  delete: async (id) => {
    await api.delete(`/customers/${id}`);
  },
};

// Hooks
export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getAll,
    onError: (error) => {
      console.error('Query Error:', error);
    }
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerApi.getById(id),
    enabled: !!id,
  });
};

export const useCustomerById = (id) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'week'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'month'] });
      showNotification({
        title: 'Success',
        message: 'Customer created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to create customer',
        color: 'red',
      });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => customerApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'week'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'month'] });
      showNotification({
        title: 'Success',
        message: 'Customer updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to update customer',
        color: 'red',
      });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'week'] });
      queryClient.invalidateQueries({ queryKey: ['units', 'due', 'month'] });
      showNotification({
        title: 'Success',
        message: 'Customer deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to delete customer',
        color: 'red',
      });
    },
  });
};