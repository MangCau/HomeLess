import React, {useState} from 'react';
import { Container, Row, Col, Form, FloatingLabel, Button} from 'react-bootstrap';
import welcomeimg from '../asserts/smarthome.jpg';
import logo from '../asserts/logo.png';
import Navbar from 'react-bootstrap/Navbar';
import '../css/LoginPage.css';
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
        const res = await api.post("/api/token/", { username, password })
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/")
    } catch (error) {
        alert(error)
    } finally {
        setLoading(false)
    }
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
                      <span className='homeless'>HomeLess</span>
                    </Navbar.Brand>
                  </Container>
                </Navbar>
                <Form onSubmit={handleSubmit}>
                  <FloatingLabel label="Username" className="mb-5">
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      id='usernamelogin'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel  label="Mật khẩu">
                    <Form.Control
                      type="password"
                      placeholder="Mật khẩu"
                      id='passwordlogin'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      
                    />
                  </FloatingLabel>
                  <Button variant="primary" type="submit">
                    <a className='logintext'>Đăng nhập</a>
                  </Button>
                </Form>
                <a href='/signup' style={{color:'#5D5FEF', marginTop:'20px'}}>Đăng ký</a>
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
