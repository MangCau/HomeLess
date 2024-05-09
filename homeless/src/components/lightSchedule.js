import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button, Form, FormCheck } from "react-bootstrap";
import api from '../api'

export default function LightSchedule() {
    const [schedule, setSchedule] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loopOption, setLoopOption] = useState();
    const [selectedDate, setSelectedDate] = useState();
    const [showAll, setShowAll] = useState(false);
    const [clickedSchedule, setClickedSchedule] = useState(null);
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const schedule = await api.get("/api/schedule/"); 
                setSchedule(schedule.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []); 


    const handleOptionChange = (e) => {
        setLoopOption(e.target.value);
        setSelectedDate('');
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleSubmit = async (e) => {
    };
    

    const handleEdit = (schedule) => {
        setClickedSchedule(schedule);
        setLoopOption(schedule.loops === 'MỘT NGÀY' ? 'oneday' : 'everyday');
        if (schedule.date) {
            const dateParts = schedule.date.split('/');
            const formattedDate = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
            setSelectedDate(formattedDate);
        } else {
            setSelectedDate('');
        }
        setShowModal(true);
    };
    

    const schedules = schedule;

    const visibleSchedules = showAll ? schedules : schedules.slice(0, 5); // Show all schedules if showAll is true, otherwise show only first 5

    return (
        <Container className="d-flex justify-content-center">
            <Row>
                <Col xs={12} className="d-flex justify-content-center">
                    <h2 className='thresholdtitle mb-4 mt-5'>THỜI GIAN BIỂU TỰ ĐỘNG</h2>
                </Col>
                {Array.isArray(visibleSchedules) && visibleSchedules.map((object, index) => (
                    <Col key={index} xs={12} style={{ border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                        <Row>
                            <Col xs={12} className="d-flex justify-content-center mb-3">
                                <a style={{ color: '#5D5FEF', fontWeight: 'bold', fontSize: '16px' }}>{object.everyday ? 'Everyday' : 'Oneday'}</a>
                            </Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4} className="align-items-center justify-content-center">
                                        <div className="text-center mb-3">
                                            <p>{object.start_time}</p>
                                        </div>
                                        <div className="text-center">
                                            <p>{object.end_time}</p>
                                        </div>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="text-center mb-3">
                                            <p style={{color:'#ABA7A7'}}>BẬT ĐÈN</p>
                                        </div>
                                        <div className="text-center">
                                            <p style={{color:'#ABA7A7'}}>TẮT ĐÈN</p>
                                        </div>
                                    </Col>
                                    <Col xs={4} className="justify-content-center align-content-center">
                                        <Button style={{ backgroundColor: '#5D5FEF', marginRight: '5px'}} onClick={() => handleEdit(schedule)}>
                                            <a className='logintext'>Sửa</a>
                                        </Button>
                                        <Button style={{ backgroundColor: '#F37272', marginLeft: '5px' }}>
                                            <a className='logintext'>Xóa</a>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                ))}
                {!showAll && schedules.length > 5 && ( // Show "Xem thêm" button if there are more than 5 schedules and showAll is false
                    <Col xs={12} className="d-flex justify-content-center">
                        <Button onClick={() => setShowAll(true)} style={{ backgroundColor: '#5D5FEF', marginBottom: '20px' }}>Xem thêm</Button>
                    </Col>
                )}
                {showAll && ( // Show "Thu gọn" button if showAll is true
                    <Col xs={12} className="d-flex justify-content-center">
                        <Button onClick={() => setShowAll(false)} style={{ backgroundColor: '#5D5FEF', marginBottom: '20px' }}>Thu gọn</Button>
                    </Col>
                )}
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>SỬA THỜI GIAN TỰ ĐỘNG BẬT/TẮT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>BẬT LÚC</Form.Label>
                            <Form.Control id="ontime" type="time" defaultValue={clickedSchedule?.timeons} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>TẮT LÚC</Form.Label>
                            <Form.Control id="offtime" type="time" defaultValue={clickedSchedule?.timeoffs} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>VÒNG LẶP</Form.Label>
                            <div>
                                <Form.Check inline
                                    type="radio" 
                                    label="Mỗi ngày" 
                                    id="everyday" 
                                    name="loopOption"
                                    value="everyday"
                                    onChange={handleOptionChange}
                                    checked={loopOption === 'everyday'}
                                />
                                <Form.Check inline
                                    type="radio" 
                                    label="Một ngày" 
                                    id="oneday" 
                                    name="loopOption"
                                    value="oneday"
                                    onChange={handleOptionChange}
                                    checked={loopOption === 'oneday'}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CHỌN NGÀY</Form.Label>
                            <Form.Control id="onedayselect" type="date" placeholder="Enter a day for loop" disabled={loopOption === 'everyday'} 
                            defaultValue={selectedDate} required={loopOption === 'oneday'} onChange={handleDateChange}/>
                        </Form.Group>
                        <Modal.Footer>
                            <Button style={{ backgroundColor: '#F37272'}} onClick={() => setShowModal(false)}>Hủy</Button>
                            <Button type="submit" style={{ backgroundColor: '#5D5FEF'}}>Lưu</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

