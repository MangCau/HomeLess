import React, { useState, useEffect } from "react";
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import LightImg from '../asserts/Đèn.jpg';
import ActivityHistory from '../components/activityHistory';
import LightSchedule from "../components/lightSchedule";
import api from '../api';
import { apiKey } from '../constants';

export default function LightController () {
    const [status, setStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loopOption, setLoopOption] = useState('everyday');
    const [selectedDate, setSelectedDate] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await api.get("/api/activity-log/")
                const lastRecordStatus = await api.get("/api/light/"); 
                if (status !== '') {
                if (status !== lastRecordStatus.data.status) {
                    try {
                    const value = lastRecordStatus.data.status ? 1 : 0;
                    const data = {
                        value: value,
                    };
                    const response = await fetch(`https://io.adafruit.com/api/v2/homeless_da01/feeds/cong-tac-den/data`, {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        "X-AIO-Key": apiKey,
                        },
                        body: JSON.stringify(data),
                    });
                
                    if (response.ok) {
                        console.log("Data updated successfully");
                    } else {
                        console.error("Failed to update data:", response.statusText);
                    }
                    } catch (error) {
                    console.error("Error updating data:", error);
                    }
                }
                }
                setStatus(lastRecordStatus.data['status']);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            try {
                const scheduleResponse = await api.get("/api/schedule/");
                const schedules = scheduleResponse.data;
                const currentTime = new Date();
                const currentHour = currentTime.getHours();
                const currentMinute = currentTime.getMinutes();
                schedules.forEach((schedule, key) => {
                    const start_time = schedule.start_time;
                    const end_time = schedule.end_time;
                    // Ensure startTime and end_time are defined
                    if (start_time && end_time) {
                        // Split the start and end times into hours and minutes
                        const startTime = start_time.split(":");
                        const startHour = parseInt(startTime[0]);
                        const startMinute = parseInt(startTime[1]);
                        
                        const end_timeParts = end_time.split(":");
                        const endHour = parseInt(end_timeParts[0]);
                        const endMinute = parseInt(end_timeParts[1]);
                        // Check if the current time is within the schedule's time range
                        console.log('Current hour: ' + currentHour + ':' + currentMinute);
                        console.log('Start hour: ' + startHour + ':' + startMinute);
                        console.log('End hour: ' + endHour + ':' + endMinute);
                        if (
                            (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
                            (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute))
                        ) {
                            (async () => {
                                const lastRecordStatus = await api.get("/api/light/");
                                if (lastRecordStatus.data.status === false) {

                                    const { v4: uuidv4 } = require('uuid');
                                    try {
                                        // Make the API call
                                        const activityResponse = await api.post('/api/activity-log/', {
                                            id: uuidv4(),
                                            type: 'light',
                                            status: true
                                        });
                                        console.log('Turn on light automatically');
                                    } catch (error) {
                                        console.error('Error toggling light status:', error);
                                    }
                                }
                            })();
                        } else {
                            (async () => {
                                const lastRecordStatus = await api.get("/api/light/");
                                if (lastRecordStatus.data.status === true) {
                                    const { v4: uuidv4 } = require('uuid');
                                    try {
                                        // Make the API call
                                        const activityResponse = await api.post('/api/activity-log/', {
                                            id: uuidv4(),
                                            type: 'light',
                                            status: false
                                        });
                                        console.log('Turn off light automatically');
                                    } catch (error) {
                                        console.error('Error toggling light status:', error);
                                    }
                                }
                            })();
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();    
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [status]); 

    const handleOptionChange = (e) => {
        setLoopOption(e.target.value);
        setSelectedDate('');
    };
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleStatusChange = async () => {
        try {
          const { v4: uuidv4 } = require('uuid');
            await api.post('/api/activity-log/', {
            id: uuidv4(),
            type: 'light',
            status: !status
          });
        } catch (error) {
          console.error('Error toggling status:', error);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const ontime = document.getElementById('ontime').value;
        const offtime = document.getElementById('offtime').value;
        const selectedOption = loopOption;
        const selectedDay = loopOption === 'oneday' ? document.getElementById('onedayselect').value : '';
        const data = {
            start_time: ontime,
            end_time: offtime,
            everyday: selectedOption === 'everyday',
        };
    
        // if (selectedOption === 'oneday') {
        //     data['selected_day'] = selectedDay;
        // }
    
        try {
            const response = await api.post('/api/schedule/', data);
            console.log(response);
        } catch (error) {
            console.error('Error adding schedule:', error);
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
                            <Container>
                                <div className='fanimage'>
                                    <img src={LightImg} alt='Light' className='img-fluid'/>
                                </div>
                                <div className='fancontroller mt-5'>
                                    <Form.Group className="">
                                        <Form.Label className="d-flex justify-content-between align-content-center">
                                        <span>Trạng thái</span>
                                        <span>
                                            <Form.Check 
                                            type="switch"
                                            id="status-switch-light"
                                            checked={status}
                                            onChange={handleStatusChange}
                                            />
                                        </span>
                                        </Form.Label>
                                    </Form.Group>
                                    <div className="d-flex justify-content-center justify-content-between align-items-center mb-4">
                                        <span>Thời gian biểu tự động bật/tắt</span>
                                        <span>
                                            <Button style={{ backgroundColor: '#5D5FEF', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => setShowModal(true)}>
                                                <a className='logintext'>+</a>
                                            </Button>
                                        </span>
                                    </div>
                                </div>
                            </Container>
                        <ActivityHistory/>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-center align-items-center">
                            <LightSchedule/>
                        </Col>
                    </Row>
                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>THÊM THỜI GIAN TỰ ĐỘNG BẬT/TẮT</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>BẬT LÚC</Form.Label>
                                        <Form.Control id="ontime" type="time" placeholder="Enter time to turn on light" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>TẮT LÚC</Form.Label>
                                        <Form.Control id="offtime" type="time" placeholder="Enter time to turn off light" required />
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
                                        <Form.Control id="onedayselect" type="date" placeholder="Enter a day for loop" 
                                        disabled={loopOption === 'everyday'} value={selectedDate} 
                                        required={loopOption === 'oneday'} onChange={handleDateChange}/>
                                    </Form.Group>
                                    <Modal.Footer>
                                        <Button style={{ backgroundColor: '#F37272'}} onClick={() => setShowModal(false)}>Hủy</Button>
                                        <Button type="submit" style={{ backgroundColor: '#5D5FEF'}}>Lưu</Button>
                                    </Modal.Footer>
                                </Form>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        </div>
    )
}