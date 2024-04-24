import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import api from '../api';
import { apiKey } from '../constants';

const OnOffFan = () => {
  const [status, setStatus] = useState('');
  const [modeA, setModeA] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        try {
            await api.get("/api/activity-log/")
            const lastRecordStatus = await api.get("/api/fan/"); 
            if (status !== '') {
              // console.log('Fan ' + lastRecordStatus.data.status)
              // console.log('Status before ' + status)
              if (status !== lastRecordStatus.data.status) {
                try {
                  const value = lastRecordStatus.data.status ? 1 : 0;
                  const data = {
                    value: value,
                  };
                  const response = await fetch(`https://io.adafruit.com/api/v2/homeless_da01/feeds/cong-tac-quat/data`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-AIO-Key": apiKey,
                    },
                    body: JSON.stringify(data),
                  });
              
                  if (response.ok) {
                    console.log("Data updated successfully");
                  } else {
                    console.error("Failed to update data:", response.statusText);
                  }
                } catch (error) {
                  console.error("Error updating data:", error);
                }
              }
            }

            setStatus(lastRecordStatus.data['status']);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
        
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [status]);

  const handleStatusChange = async () => {
    try {
      const { v4: uuidv4 } = require('uuid');
      const activityResponse = await api.post('/api/activity-log/', {
        id: uuidv4(),
        type: 'fan',
        status: !status
      });
      console.log(activityResponse.data);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleModeAChange = async () => {
    try {
      const response = await api.patch('/api/fan/', { is_manual: !modeA });
      console.log(response.data);
      setModeA(!modeA)
      const value = !modeA ? 1 : 0;
      const data = {
        value: value,
      };
      await fetch(`https://io.adafruit.com/api/v2/homeless_da01/feeds/mode-fan/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": apiKey,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error toggling modeA:', error);
    }
  };
  return (
    <Container>
      <Form.Group className="mb-3">
        <Form.Label className="d-flex justify-content-between align-content-center">
          <span>Trạng thái</span>
          <span>
            <Form.Check 
              type="switch"
              id="status-switch-fan"
              checked={status}
              onChange={handleStatusChange}
            />
          </span>
        </Form.Label>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="d-flex justify-content-between align-content-center">
          <span>Trạng thái tự động (Auto)</span>
          <span>
            <Form.Check 
              type="switch"
              id="modeA-switch"
              checked={modeA}
              onChange={handleModeAChange}
            />
          </span>
        </Form.Label>
      </Form.Group>
    </Container>
  );
};

export default OnOffFan;
