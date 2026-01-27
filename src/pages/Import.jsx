import React, { useState } from 'react';
import { 
  Title, 
  Text, 
  Card, 
  Button, 
  FileInput, 
  List,
  ThemeIcon,
  Alert,
  Grid
} from '@mantine/core';
import { 
  IconUpload, 
  IconFileSpreadsheet, 
  IconInfoCircle, 
  IconCheck, 
  IconDownload
} from '@tabler/icons-react';
import { useImportCSV } from '../hooks/useImport.js';
import { modals } from '@mantine/modals';

const Import = () => {
  const [file, setFile] = useState(null);
  const importCSV = useImportCSV();

  const handleImport = () => {
    if (!file) {
      modals.open({
        title: 'No File Selected',
        children: (
          <Text>Please select a CSV file to import.</Text>
        ),
      });
      return;
    }

    importCSV.mutate(file, {
      onSuccess: () => {
        setFile(null);
      },
    });
  };

  const downloadTemplate = () => {
    const csvContent = `name,phone,displayName,type,nextServiceDate,email,houseNumber,street,city,state,pincode,lastServiceDate
John Doe,9876543210,Living Room AC,AC,2023-04-15,john@example.com,123,Main Street,New York,NY,10001,2023-01-15
Jane Smith,9876543211,Backup Generator,Generator,2023-05-01,jane@example.com,456,Elm Street,Los Angeles,CA,90001,2023-02-01`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'hvac_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <div className="mb-8">
        <Title order={1} className="text-3xl font-bold text-gray-800">
          Import Data
        </Title>
        <Text className="text-gray-600 mt-2">
          Upload CSV files to import customers and units data
        </Text>
      </div>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" className="h-full">
            <Title order={2} className="text-xl font-semibold mb-4 text-gray-800">
              <IconFileSpreadsheet className="inline mr-2" size={24} />
              Upload CSV File
            </Title>
            
            <FileInput
              label="Select CSV file"
              placeholder="Choose a file"
              accept=".csv"
              value={file}
              onChange={setFile}
              className="mb-6"
            />

            <Button
              leftSection={<IconUpload size={16} />}
              onClick={handleImport}
              disabled={!file}
              loading={importCSV.isPending}
              fullWidth
              size="lg"
              color="accent"
            >
              Import Data
            </Button>

            {file && (
              <Alert 
                variant="light" 
                color="blue" 
                title="File Selected" 
                className="mt-4"
                icon={<IconInfoCircle />}
              >
                <Text size="sm" className="mt-1">
                  <strong>File:</strong> {file.name}
                </Text>
                <Text size="sm">
                  <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                </Text>
              </Alert>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" className="h-full">
            <Title order={2} className="text-xl font-semibold mb-4 text-gray-800">
              <IconInfoCircle className="inline mr-2" size={24} />
              Import Instructions
            </Title>
            
            <Text className="mb-4 text-gray-700">
              Your CSV file should contain the following columns:
            </Text>
            
            <List
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon color="accent" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
              className="mb-6"
            >
              <List.Item><strong>Required Fields:</strong> name, phone, displayName, type, nextServiceDate</List.Item>
              <List.Item><strong>Optional Fields:</strong> email, houseNumber, street, city, state, pincode, lastServiceDate</List.Item>
            </List>

            <Button
              leftSection={<IconDownload size={16} />}
              onClick={downloadTemplate}
              variant="outline"
              fullWidth
              color="accent"
            >
              Download Template CSV
            </Button>
          </Card>
        </Grid.Col>
      </Grid>

      <Card shadow="sm" padding="lg" radius="md" className="mt-6">
        <Title order={2} className="text-xl font-semibold mb-4 text-gray-800">
          Important Notes
        </Title>
        
        <List spacing="sm" size="sm" className="text-gray-700">
          <List.Item>
            <strong>Column Order:</strong> name, phone, displayName, type, nextServiceDate, email, houseNumber, street, city, state, pincode, lastServiceDate
          </List.Item>
          <List.Item>
            <strong>Required Fields:</strong> name, phone, displayName, type, nextServiceDate
          </List.Item>
          <List.Item>
            <strong>Unit Types:</strong> Must be one of AC, Heater, Machine, Generator
          </List.Item>
          <List.Item>
            <strong>Date Format:</strong> Use YYYY-MM-DD format (e.g., 2023-04-15)
          </List.Item>
          <List.Item>
            <strong>Customers First:</strong> Customers are created/updated before units
          </List.Item>
        </List>
      </Card>
    </div>
  );
};

export default Import;