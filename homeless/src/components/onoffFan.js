import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import api from '../api';

const OnOffFan = () => {
  const [status, setStatus] = useState('');
  const [modeA, setModeA] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const lastRecordStatus = await api.get("/api/fan/"); 
            setStatus(lastRecordStatus.data['status']);
            setModeA(lastRecordStatus.data['is_manual']);
            if (modeA) {
                const latestTemp = await api.get("/api/temperature-record/latest/"); 
                const temperature = latestTemp.data;

                const thresholdResponse = await api.get("/api/fan/"); 
                const threshold = thresholdResponse.data['threshold'];
                const { v4: uuidv4 } = require('uuid');
                if (temperature < threshold && !status) {
                  await api.post('/api/activity-log/', {
                    id: uuidv4(),
                    type: 'fan',
                    status: true
                  });
                } else if (temperature >= threshold && status) {
                  await api.post('/api/activity-log/', {
                    id: uuidv4(),
                    type: 'fan',
                    status: false
                  });
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
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
