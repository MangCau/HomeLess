import './logoutbutton.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const LogoutConfirmationModal = ({ show, onHide, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận đăng xuất</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc chắn muốn đăng xuất?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Trở về
                </Button>
                <Button variant="primary" className="logoutButton" onClick={onConfirm}>
                    Đăng xuất
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LogoutConfirmationModal;
