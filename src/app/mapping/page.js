"use client";

import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import "./style.scss";
import ApiClient from '@/methods/api/apiClient';
import { Modal, Button, Form } from 'react-bootstrap'; // Import React-Bootstrap components

const MapAndSendData = () => {
  const [originalData, setOriginalData] = useState([]);
  const targetKeysInitial = ['affiliate', 'brand', 'campiagn', 'price', 'order_id', 'coupon'];
  const removedKeys = ['_id', 'createdAt', 'updatedAt', 'isDeleted'];

  const [targetKeys, setTargetKeys] = useState(targetKeysInitial);
  const [mappings, setMappings] = useState({});
  const [mappedData, setMappedData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [newTargetKey, setNewTargetKey] = useState(''); // New target key input

  const getData = () => {
    let url = 'gptrack/list';
    ApiClient.get(url).then(res => {
      if (res.success) {
        const data = res?.data?.data;
        setOriginalData(data);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

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

  const handleDrop = (targetKey) => {
    return (event) => {
      event.preventDefault();
      const sourceKey = event.dataTransfer.getData("sourceKey");

      // Ensure a source key is not already mapped to another target key
      if (!mappings[sourceKey]) {
        const targetAlreadyMapped = Object.values(mappings).includes(targetKey);
        if (targetAlreadyMapped) {
          alert(`Target key '${targetKey}' is already mapped!`);
        } else {
          setMappings(prevMappings => ({
            ...prevMappings,
            [sourceKey]: targetKey
          }));
        }
      }
    };
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, sourceKey) => {
    event.dataTransfer.setData("sourceKey", sourceKey);
  };

  const removeMapping = (sourceKey) => {
    setMappings(prevMappings => {
      const newMappings = { ...prevMappings };
      delete newMappings[sourceKey];
      return newMappings;
    });
  };

  const addTargetKey = () => {
    if (newTargetKey.trim() && !targetKeys.includes(newTargetKey.trim())) {
      setTargetKeys(prevKeys => [...prevKeys, newTargetKey.trim()]);
      setNewTargetKey(''); // Clear input field
      setModalOpen(false); // Close the modal
    } else {
      alert('Please enter a unique target key');
    }
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
                className="target-key-item position-relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop(targetKey)}
              >
                <strong>{targetKey}</strong>
                {Object.keys(mappings).map((sourceKey) => {
                  if (mappings[sourceKey] === targetKey) {
                    return (
                      <div key={sourceKey}>
                        <span className="mapped-key">
                          {sourceKey} (Mapped)
                        </span>
                        <button className='remove-btn' onClick={() => removeMapping(sourceKey)}><i class="fa fa-trash text-white" aria-hidden="true"></i></button>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
      <button className='mapping-btns' onClick={() => setModalOpen(true)}>Add Target Key</button>
          </div>
        </div>

        <button  className='mapping-btns' onClick={mapData}>Map Data</button>

        {/* Show the mapping as a thread */}
        {Object.keys(mappings).length > 0 && <h3>Mapped Keys</h3>}
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
            {mappedData.length > 0 && <h3>Mapped Data</h3>}
            <div className="table_section">
              <div className="table-responsive">
                <table className="table table-striped table-width">
                  <thead className="table_head">
                    <tr className="heading_row">
                      {mappedData.length > 0 &&
                        Object.keys(mappedData[0])
                          .filter(key => !removedKeys.includes(key)) // Exclude removed keys
                          .map((key) => (
                            <th key={key} scope="col" className="table_data">
                              {key.charAt(0).toUpperCase() + key.slice(1)} {/* Capitalize the first letter */}
                            </th>
                          ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mappedData.map((item, index) => (
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
            {/* <pre className="json-display"><p>{JSON.stringify(mappedData, null, 2)}</p></pre> */}
          </div>
        )}

        <h3>Source Data</h3>
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

        <button  className='mapping-btns mx-auto mt-3' onClick={sendData}>Send Mapped Data</button>

        {/* React-Bootstrap Modal for adding a new target key */}
        <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Target Key</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           <div className='target-modal my-3'>
           <Form.Control
              type="text"
              value={newTargetKey}
              onChange={(e) => setNewTargetKey(e.target.value)}
              placeholder="Enter new target key"
            />
           </div>
          </Modal.Body>
          <Modal.Footer>
            <Button  className='target-modal-btn' variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button className='target-modal-btn'  variant="primary" onClick={addTargetKey}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default MapAndSendData;
