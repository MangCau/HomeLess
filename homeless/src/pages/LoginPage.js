import React, {useState} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import welcomeimg from '../asserts/smarthome.jpg';
import LoginForm from '../components/loginForm';
import logo from '../asserts/logo.png';
import Navbar from 'react-bootstrap/Navbar';
import './LoginPage.css';

function LoginPage() {
  return (
    <Container fluid>
      <Row>
        <Col xs={6}>
          <div className='welcomeimage'>
            <img src={welcomeimg} alt="Welcome" className="img-fluid" /> 
          </div>
          <div className='welcometext'>
            <h1 className='mainwelcometext'>Easy living with your smart home!</h1>
            <a className='subwelcometext'>Get your smart devices in one place and manage all of these with a few taps.</a>
          </div>
        </Col>
        <Col xs={6}>
            <div className='formlogin d-flex justify-content-center align-items-center h-100'>
                <Navbar className="bg-body-tertiary" style={{marginBottom:'50px'}}>
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
                <LoginForm/>
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
