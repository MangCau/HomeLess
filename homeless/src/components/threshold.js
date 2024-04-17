import React, {useState} from "react";
import {Col, Row, Image, Modal, Form, Button, Container} from 'react-bootstrap';
import thresholdimg from '../asserts/threshold.png';

export default function Threshold () {
    const [showModal, setShowModal] = useState(false);
    const [newDegree, setNewDegree] = useState('');
    const [degree, setDegree] = useState(30); // Initial degree value
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setNewDegree(event.target.value);
    };
    
    const handleSave = (event) => {
        event.preventDefault();
        const parsedDegree = parseInt(newDegree);
        if (parsedDegree >= 20 && parsedDegree <= 50) {
            setDegree(parsedDegree);
            setShowModal(false);
            setError('');
            console.log("Threshold value changed:", parsedDegree);
        } else {
            setError('Ngưỡng nhiệt độ phải nằm trong khoảng từ 20 đến 50 độ.');
        }
    };
    return (
        <Container>
            <div className='fansetup position-relative'>
                <a className='thresholdtitle mb-2'>NGƯỠNG BẬT/TẮT QUẠT TỰ ĐỘNG</a>
                <img src={thresholdimg} alt='Threshold' className='img-fluid'/>
                <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="d-flex flex-column align-items-center mt-3">
                        <span className='degree'>{degree}</span>
                        <span className='textdegree'>độ C</span>
                    </div>
                </div>
                <p className='fixthreshold' onClick={() => setShowModal(true)}>Chỉnh sửa</p>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Thay đổi ngưỡng nhiệt độ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSave}>
                            <Form.Control
                                id="threshold"
                                type="number"
                                placeholder="Nhập ngưỡng nhiệt độ tự động mới của quạt"
                                value={newDegree}
                                onChange={handleInputChange}
                            />
                            {error && <div className="text-danger">{error}</div>}
                            <Modal.Footer>
                                <Button style={{ backgroundColor: '#F37272' }} onClick={() => setShowModal(false)}>Hủy</Button>
                                <Button type="submit" style={{ backgroundColor: '#5D5FEF' }}>Lưu</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
            </Modal>
        </Container>
    )
}