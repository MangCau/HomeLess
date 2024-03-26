import React, { useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, for example:
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FloatingLabel controlId="email" label="Email" className="mb-5">
          <Form.Control
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{width:'150%'}}
            
          />
        </FloatingLabel>

        <FloatingLabel controlId="pass" label="Mật khẩu">
          <Form.Control
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
        </FloatingLabel>
      </Form>
    </div>
  );
}

export default LoginForm;
