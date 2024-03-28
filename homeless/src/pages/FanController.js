import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { Container, Row, Col, Modal, Form, Button} from 'react-bootstrap';
import fanimage from '../asserts/Quạt.jpg';
import './FanController.css';
import OnOffFan from '../components/onoffFan';
import threshold from '../asserts/threshold.png';
import ActivityHistory from '../components/activityHistory';

function FanController() {
  const [showModal, setShowModal] = useState(false);
  const [newDegree, setNewDegree] = useState('');
  const [degree, setDegree] = useState(30); // Initial degree value
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setNewDegree(event.target.value);
  };

  const handleSave = () => {
    const parsedDegree = parseInt(newDegree);
    if (parsedDegree >= 20 && parsedDegree <= 50) {
      setDegree(parsedDegree);
      setShowModal(false);
      setError('');
    } else {
      setError('Ngưỡng nhiệt độ phải nằm trong khoảng từ 20 đến 50 độ.');
    }
  };


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
                  <div className='fansetup position-relative'>
                    <img src={threshold} alt='Threshold' className='img-fluid'/>
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <div className="d-flex flex-column align-items-center">
                        <span className='degree'>{degree}</span>
                        <span className='textdegree'>độ C</span>
                      </div>
                    </div>
                    <a className='fixthreshold' onClick={() => setShowModal(true)}>
                      Chỉnh sửa
                    </a>
                  </div>
                </Col>
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Thay đổi ngưỡng nhiệt độ</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Control
                      type="number"
                      placeholder="Nhập ngưỡng nhiệt độ tự động mới của quạt"
                      value={newDegree}
                      onChange={handleInputChange}
                    />
                    {error && <div className="text-danger">{error}</div>}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                      Lưu
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Row>
              <Row>
                <Col>
                  <a>Lịch sử hoạt động:</a>
                  <ActivityHistory className='historytable'/>
                </Col>
              </Row>
            </Container>
        </div>
    </div>
    
  );
}

export default FanController;
