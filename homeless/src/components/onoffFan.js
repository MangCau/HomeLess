import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

const OnOffFan = () => {
  // State for status
  const [status, setStatus] = useState(false);
  
  // State for mode A
  const [modeA, setModeA] = useState(false);

  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="d-flex justify-content-between align-content-center">
            <span>Trạng thái</span>
            <span>
              <Form.Check 
                type="switch"
                id="status-switch"
                checked={status}
                onChange={() => setStatus(!status)}
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
                onChange={() => setModeA(!modeA)}
              />
            </span>
          </Form.Label>
        </Form.Group>
      </Form>
    </div>
  );
};

export default OnOffFan;
