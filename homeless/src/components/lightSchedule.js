import React, { useState } from "react";
import { Container, Row, Col, Modal, Button, Form, FormCheck } from "react-bootstrap";

export default function LightSchedule() {
    const [showModal, setShowModal] = useState(false);
    const [loopOption, setLoopOption] = useState();
    const [selectedDate, setSelectedDate] = useState();
    const [showAll, setShowAll] = useState(false);
    const [clickedSchedule, setClickedSchedule] = useState(null);
    

    const handleOptionChange = (e) => {
        setLoopOption(e.target.value);
        setSelectedDate('');
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ontime = document.getElementById('ontime').value;
        const offtime = document.getElementById('offtime').value;
        const selectedOption = loopOption;
        const selectedDay = loopOption === 'oneday' ? document.getElementById('onedayselect').value : '';
    
        // Prepare the data to send in the request body
        const data = {
            start_time: ontime,
            end_time: offtime,
            everyday: selectedOption === 'everyday',
        };
    
        // If the selected option is 'oneday', include the selected day in the data
        if (selectedOption === 'oneday') {
            data['selected_day'] = selectedDay;
        }
    
        try {
            // Send a POST request to the API endpoint
            const response = await fetch('/api/schedule/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            // Check if the request was successful
            if (response.ok) {
                // Schedule added successfully
                console.log('Schedule added successfully');
                setShowModal(false);
                // Optionally, you can perform additional actions here
            } else {
                // Handle errors if the request fails
                console.error('Failed to add schedule:', response.statusText);
                // Optionally, you can display an error message to the user
            }
        } catch (error) {
            console.error('Error adding schedule:', error);
            // Optionally, you can display an error message to the user
        }
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
    

    const schedules = [
    ];

    const visibleSchedules = showAll ? schedules : schedules.slice(0, 5); // Show all schedules if showAll is true, otherwise show only first 5

    return (
        <Container className="d-flex justify-content-center">
            <Row>
                <Col xs={12} className="d-flex justify-content-center">
                    <h2 className='thresholdtitle mb-4 mt-5'>THỜI GIAN BIỂU TỰ ĐỘNG</h2>
                </Col>
                {visibleSchedules.map((schedule, index) => (
                    <Col key={index} xs={12} style={{ border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                        <Row>
                            <Col xs={12} className="d-flex justify-content-center mb-3">
                                <a style={{ color: '#5D5FEF', fontWeight: 'bold', fontSize: '16px' }}>- {schedule.loops} - {schedule.date}</a>
                            </Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4} className="align-items-center justify-content-center">
                                        <div className="text-center mb-3">
                                            <p>{schedule.timeons}</p>
                                        </div>
                                        <div className="text-center">
                                            <p>{schedule.timeoffs}</p>
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

