import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import api from '../api';

const OnOffFan = () => {
  // State for status
  const [status, setStatus] = useState('');
  
  // State for mode A
  const [modeA, setModeA] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const status = await api.get("/api/activity-log/"); 
            setStatus(status);
            console.log(status.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId);
}, []); 

  const handleStatusChange = async () => {
    try {
      setStatus(!status);
      // Update the activity log
      const activityResponse = await api.post('/api/activity-log/', {
        type: 'fan',
        status: false,
        is_auto: false
      });
      console.log(activityResponse.data);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleModeAChange = async () => {
    try {
      setModeA(!modeA);

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
