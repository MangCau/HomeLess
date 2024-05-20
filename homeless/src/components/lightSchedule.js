import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import api from '../api'

export default function LightSchedule() {
    const [schedules, setSchedules] = useState([])
    const [showAll, setShowAll] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/api/schedule/")
                setSchedules(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    const handleDeleteSchedule = async (id) => {
        const userConfirmed = window.confirm('Are you sure you want to delete this schedule?');
    
        if (userConfirmed) {
            try {
                await api.post("/api/schedule/", { "id": id });
                setSchedules(schedules.filter(schedule => schedule.id !== id));
                alert('Schedule deleted successfully.');
            } catch (error) {
                console.error('Error deleting schedule:', error);
                alert('Failed to delete the schedule. Please try again.');
            }
        } else {
            alert('Schedule deletion cancelled.');
        }
    }
    
    const visibleSchedules = showAll ? schedules : schedules.slice(0, 5)

    return (
        <Container className="d-flex justify-content-center">
            <Row>
                {visibleSchedules.map((schedule, index) => (
                    <Col key={index} xs={12} style={{ border: '1px solid #ced4da', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                        <Row>
                            <Col xs={12} className="d-flex justify-content-center mb-3">
                                <a style={{ color: '#5D5FEF', fontWeight: 'bold', fontSize: '16px' }}>Mỗi ngày</a>
                            </Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4} className="align-items-center justify-content-center">
                                        <div className="text-center mb-3">
                                            <p>{schedule.start_time}</p>
                                        </div>
                                        <div className="text-center">
                                            <p>{schedule.end_time}</p>
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
                                        <Button style={{ backgroundColor: '#F37272', marginLeft: '5px' }} onClick={() => handleDeleteSchedule(schedule.id)}>
                                            Xóa
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                ))}
                {!showAll && schedules.length > 5 && (
                    <Col xs={12} className="d-flex justify-content-center">
                        <Button onClick={() => setShowAll(true)} style={{ backgroundColor: '#5D5FEF', marginBottom: '20px' }}>Xem thêm</Button>
                    </Col>
                )}
                {showAll && (
                    <Col xs={12} className="d-flex justify-content-center">
                        <Button onClick={() => setShowAll(false)} style={{ backgroundColor: '#5D5FEF', marginBottom: '20px' }}>Thu gọn</Button>
                    </Col>
                )}
            </Row>
        </Container>
    )
}
