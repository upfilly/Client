"use client"

import React, { useState } from 'react';
import ColumnMapper from './ColumnMapper'
import axios from 'axios';
import Layout from '../components/global/layout';

const Mapping = () => {
  const [data] = useState([
    { name: 'John', age: 30, email: 'john@example.com' },
    { name: 'Jane', age: 28, email: 'jane@example.com' },
    { name: 'Mike', age: 35, email: 'mike@example.com' },
  ]);
  
  const [columnMapping, setColumnMapping] = useState({
    name: 'fullName',
    age: 'userAge',
    email: 'contactEmail',
  });

  const handleMappingChange = (newMapping) => {
    setColumnMapping(newMapping);
  };

  const handleSendData = async (mappedData) => {
    try {
      const response = await axios.post('https://your-api-endpoint.com/data', mappedData);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  return (<Layout>
    <div className="App">
      <h1>Column Mapper Example</h1>
      <ColumnMapper
        data={data}
        columnMapping={columnMapping}
        onMappingChange={handleMappingChange}
        onSendData={handleSendData}
      />
    </div></Layout>
  );
};

export default Mapping;
