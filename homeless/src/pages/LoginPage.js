import React, {useState} from 'react';
import { Container, Row, Col, Form, FloatingLabel, Button} from 'react-bootstrap';
import welcomeimg from '../asserts/smarthome.jpg';
// import LoginForm from '../components/loginForm';
import logo from '../asserts/logo.png';
import Navbar from 'react-bootstrap/Navbar';
import '../css/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };
  return (
    <Container fluid>
      <Row>
        <Col md={6} lg={6} className="d-none d-md-block">
          <div className='welcomeimage'>
            <img src={welcomeimg} alt="Welcome" className="img-fluid" /> 
          </div>
          <div className='welcometext'>
            <h1 className='mainwelcometext'>Easy living with your smart home!</h1>
            <a className='subwelcometext'>Get your smart devices in one place and manage all of these with a few taps.</a>
          </div>
        </Col>
        <Col xs={12} md={6} lg={6} className='justify-content-center align-items-center'>
            <div className='formlogin d-flex justify-content-center align-items-center h-100'>
                <Navbar className="bg-white" style={{marginBottom:'50px'}}>
                  <Container>
                    <Navbar.Brand> 
                      <img
                        alt="Logo"
                        src={logo}
                        width="70"
                        height="70"
                        className="d-inline-block align-center"
                      /> 
                      {' '}
                      <a className='homeless'>HomeLess</a>
                    </Navbar.Brand>
                  </Container>
                </Navbar>
                <Form onSubmit={handleSubmit}>
                  <FloatingLabel controlId="email" label="Email" className="mb-5">
                    <Form.Control
                      type="email"
                      placeholder="Nhập email của bạn"
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}

                    />
                  </FloatingLabel>

                  <FloatingLabel controlId="pass" label="Mật khẩu">
                    <Form.Control
                      type="password"
                      placeholder="Mật khẩu"
                      id='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      
                    />
                  </FloatingLabel>
                  <Button variant="primary" type="submit">
                    <a className='logintext'>Đăng nhập</a>
                  </Button>
                </Form>
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
