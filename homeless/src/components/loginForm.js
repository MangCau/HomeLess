import React, { useState } from 'react';
import { Form, FloatingLabel, Button } from 'react-bootstrap';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };
  return (
      <Form onSubmit={handleSubmit}>
        <FloatingLabel controlId="email" label="Email" className="mb-5">
          <Form.Control
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

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
        <Button variant="primary" type="submit">
          <a className='logintext'>Đăng nhập</a>
        </Button>
      </Form>

  );
}

export default LoginForm;
