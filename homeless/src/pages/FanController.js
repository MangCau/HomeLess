import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { Container, Row, Col} from 'react-bootstrap';
import fanimage from '../asserts/Quạt.jpg';
import '../css/FanController.css';
import OnOffFan from '../components/FanSwitch';
import ActivityHistory from '../components/ActivityHistory';
import Threshold from '../components/FanThreshold';

function FanController() {

  return (
    <div className='mainpage'>
        <Header/>
        <div className='mainbody'>
            <SideBar/>
            <Container>
              <Row>
                <Col xs={6}>
                  <div className='fanimage'>
                    <img src={fanimage} alt='Fan' className='img-fluid'/>
                  </div>
                  <div className='fancontroller'>
                    <OnOffFan/>
                  </div>
                </Col>
                <Col xs={6} className="d-flex justify-content-center align-items-center flex-md-row">
                  <Threshold/>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ActivityHistory className='historytable'/>
                </Col>
              </Row>
            </Container>
        </div>
    </div>
    
  );
}

export default FanController;
