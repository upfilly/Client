"use client";

import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import "./style.scss";
import ApiClient from '@/methods/api/apiClient';
const MapAndSendData = () => {
  // const originalData = [
  //   { id: 1, name: 'John', email: 'john@example.com' },
  //   { id: 2, name: 'Jane', email: 'jane@example.com' }
  // ];
  const [originalData, setOriginalData] = useState([]);
  const targetKeys = ['affiliate','brand','campiagn','price','order_id','coupon'];
  const removedKeys = ['_id','createdAt','updatedAt','isDeleted'];

  // Initial empty mapping state
  const [mappings, setMappings] = useState({});
  const [mappedData, setMappedData] = useState([]);

  const getData = () => {
    let url = 'gptrack/list'
    ApiClient.get(url).then(res => {
      if (res.success) {
        const data = res?.data?.data
        setOriginalData(data)
      }
    })
  }

  useEffect(()=>{
    getData()
  },[])

  const mapData = () => {
    const newData = originalData.map(item => {
      let mappedItem = {};
      for (const sourceKey in item) {
        const targetKey = mappings[sourceKey];
        if (targetKey) {
          mappedItem[targetKey] = item[sourceKey];
        }
      }
      return mappedItem;
    });
    setMappedData(newData);
  };

  // Function to send data (simulated)
  const sendData = () => {
    console.log('Mapped Data Sent:', mappedData);
    alert('Mapped Data Sent to API (simulated)');
  };

  const allKeys = [
    ...new Set(
      originalData.flatMap(item => {
        return Object.keys(item).filter(key => !removedKeys.includes(key));
      })
    )
  ];
  

  // Handle dropping of keys into the target area
  const handleDrop = (targetKey) => {
    return (event) => {
      event.preventDefault();
      const sourceKey = event.dataTransfer.getData("sourceKey");
      if (!mappings[sourceKey]) {
        setMappings(prevMappings => ({
          ...prevMappings,
          [sourceKey]: targetKey
        }));
      }
    };
  };

  // Allow the dragged item to be dropped
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle the drag event for the source keys
  const handleDragStart = (event, sourceKey) => {
    event.dataTransfer.setData("sourceKey", sourceKey);
  };

  return (
    <Layout>
  
   <div className="mapping-wrapper">
        <h3 className='mt-2 mb-3'>Mapping Keys</h3>

        <div className="mapping-container">
          {/* Left column: Source keys */}
          <div className="mapping-column source-column">
            <h4>Source Keys</h4>
            {allKeys.map((sourceKey, index) => (
              <div
                key={index}
                className="source-key-item"
                draggable
                onDragStart={(e) => handleDragStart(e, sourceKey)}
              >
                <strong>{sourceKey}</strong>
              </div>
            ))}
          </div>

          {/* Arrow between columns */}
          <div className="arrow-column">
            <span className="arrow">➔</span>
          </div>

          {/* Right column: Target keys */}
          <div className="mapping-column target-column">
            <h4>Target Keys</h4>
            {targetKeys.map((targetKey, index) => (
              <div
                key={index}
                className="target-key-item"
                onDragOver={handleDragOver}
                onDrop={handleDrop(targetKey)}
              >
                <strong>{targetKey}</strong>
                {mappings[targetKey] && (
                  <div>
                    <span className="mapped-key">
                      {mappings[targetKey]} (Mapped)
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button onClick={mapData}>Map Data</button>

        {/* Show the mapping as a thread */}
        {Object.keys(mappings).length > 0 && <h3>Keys</h3>}
        <div>
          {Object.keys(mappings).length > 0 && (
            <pre className="mapping-display">
              {JSON.stringify(mappings, null, 2)}
            </pre>
          )}
        </div>

        {/* Display mapped data */}
        {mappedData.length > 0 && (
          <div>
            <h3>Mapped Data as JSON</h3>
            <pre className="json-display">{JSON.stringify(mappedData, null, 2)}</pre>
          </div>
        )}

        <h3>Original Data</h3>
        <div className="table_section">
          <div className="table-responsive">
            <table className="table table-striped table-width">
              <thead className="table_head">
                <tr className="heading_row">
                  {originalData.length > 0 &&
                    Object.keys(originalData[0])
                      .filter(key => !removedKeys.includes(key)) // Exclude removed keys
                      .map((key) => (
                        <th key={key} scope="col" className="table_data">
                          {key.charAt(0).toUpperCase() + key.slice(1)} {/* Capitalize the first letter */}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody>
                {originalData.map((item, index) => (
                  <tr className="data_row" key={index}>
                    {Object.keys(item)
                      .filter(key => !removedKeys.includes(key)) // Exclude removed keys
                      .map((key) => (
                        <td key={key} className="table_data">
                          {item[key]}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <button onClick={sendData}>Send Mapped Data</button>
      </div>
  
    </Layout>
  );
};

export default MapAndSendData;
