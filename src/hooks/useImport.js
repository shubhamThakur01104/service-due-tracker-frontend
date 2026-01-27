import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { showNotification } from '@mantine/notifications';

// API Functions
const importApi = {
  importCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Hooks
export const useImportCSV = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: importApi.importCSV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      showNotification({
        title: 'Success',
        message: 'Data imported successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to import data',
        color: 'red',
      });
    },
  });
};