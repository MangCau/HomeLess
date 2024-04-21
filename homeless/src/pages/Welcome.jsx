import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import welcomeimg from '../asserts/smarthome.jpg';
import logo from '../asserts/logo.png';
import Navbar from 'react-bootstrap/Navbar';
import '../css/LoginPage.css';

function WelcomePage() {
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
                <a href='/signup' style={{color:'#5D5FEF'}}>Đăng ký</a>
            </div>
        </Col>
      </Row>
    </Container>
  );
}

export default WelcomePage;