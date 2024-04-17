import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';

const OnOffFan = () => {
  // State for status
  const [status, setStatus] = useState(false);
  
  // State for mode A
  const [modeA, setModeA] = useState(false);

  const handleStatusChange = () => {
    setStatus(!status);
    console.log('Status:', !status);
  };

  const handleModeAChange = () => {
    setModeA(!modeA);
    console.log('Mode A:', !modeA);
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
