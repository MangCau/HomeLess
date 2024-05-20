import React, { useState, useEffect } from "react"
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap"
import LightImg from '../asserts/Đèn.jpg'
import LightOn from '../asserts/light-on.png'
import LightOff from '../asserts/light-off.png'
import ActivityHistory from '../components/LightActivityHistory'
import LightSchedule from "../components/LightSchedule"
import api from '../api'

export default function LightController() {
    const [status, setStatus] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [schedules, setSchedules] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchLightStatus()
                await fetchSchedules()
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
        const checkScheduleAndUpdateLight = () => {
            const currentTime = new Date()
            for (const schedule of schedules) {
                const startTimeParts = schedule.start_time.split(':')
                const endTimeParts = schedule.end_time.split(':')
                const startTime = new Date()
                startTime.setHours(startTimeParts[0], startTimeParts[1], startTimeParts[2] || 0, 0)
                const endTime = new Date()
                endTime.setHours(endTimeParts[0], endTimeParts[1], endTimeParts[2] || 0, 0)
                console.log(currentTime >= startTime && currentTime <= endTime)
                    if (currentTime >= startTime && currentTime <= endTime) {
                    if (!status) turnOnLight()
                    return 
                }
            }
        
            if (status) turnOffLight()
        }
        const intervalId = setInterval(checkScheduleAndUpdateLight, 1000)
        return () => clearInterval(intervalId)
    }, [status])
    
    
    const turnOnLight = async () => {
        try {
            const { v4: uuidv4 } = require('uuid')
            await api.post('/api/light-log/', {
                id: uuidv4(),
                status: true
            })
            setStatus(true)
        } catch (error) {
            console.error('Error turning on light:', error)
        }
    }
    
    const turnOffLight = async () => {
        try {
            const { v4: uuidv4 } = require('uuid')
            await api.post('/api/light-log/', {
                id: uuidv4(),
                status: false
            })
            setStatus(false)
        } catch (error) {
            console.error('Error turning off light:', error)
        }
    }
    

    const fetchLightStatus = async () => {
        try {
            const lastRecordStatus = await api.get('/api/light/')
            setStatus(lastRecordStatus.data['status'])
        } catch (error) {
            console.error('Error fetching light status:', error)
        }
    }

    const fetchSchedules = async () => {
        try {
            const response = await api.get("/api/schedule/")
            setSchedules(response.data)
        } catch (error) {
            console.error('Error fetching schedules:', error)
        }
    }

    const handleStatusChange = async () => {
        try {
            const { v4: uuidv4 } = require('uuid')
            const newStatus = !status
            await api.post('/api/light-log/', {
                id: uuidv4(),
                status: newStatus
            })
            setStatus(prevStatus => !prevStatus)
        } catch (error) {
            console.error('Error toggling light status:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (checkScheduleConflicts({ startTime, endTime })) {
            window.alert('Thời gian biểu trùng lặp!')
            return
        }
        const data = {
            start_time: startTime,
            end_time: endTime,
        }
        try {
            const response = await api.post('/api/add-schedule/', data)
            console.log(response)
            setShowModal(false)
        } catch (error) {
            console.error('Error adding schedule:', error)
        }
    }

    const checkScheduleConflicts = (newSchedule) => {
        for (let schedule of schedules) {
            if (newSchedule.startTime >= schedule.start_time && newSchedule.startTime <= schedule.end_time) {
                return true
            }
            if (newSchedule.endTime >= schedule.start_time && newSchedule.endTime <= schedule.end_time) {
                return true
            }
        }
        return false
    }
    

    return (
        <div className='mainpage'>
            <Header />
            <div className='mainbody'>
                <SideBar />
                <Container>
                    <Row>
                        <Col xs={6}>
                            <Container>
                                <div className='fanimage'>
                                    <img src={status ? LightOn : LightOff} alt='Light' className='img-fluid' />
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
                                        <span>Thêm thời gian biểu</span>
                                        <span>
                                            <Button style={{ backgroundColor: '#5D5FEF', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => setShowModal(true)}>
                                                <a className='logintext'>+</a>
                                            </Button>
                                        </span>
                                    </div>
                                </div>
                                <ActivityHistory />
                            </Container>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-center align-items-center">
                            <LightSchedule />
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
                                    <Form.Control
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>TẮT LÚC</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Modal.Footer>
                                    <Button style={{ backgroundColor: '#F37272' }} onClick={() => setShowModal(false)}>Hủy</Button>
                                    <Button type="submit" style={{ backgroundColor: '#5D5FEF' }}>Lưu</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        </div>
    )
}