import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import logo from '../asserts/logo.png';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import ava from '../asserts/ava.png';
import logout from '../asserts/logout-icon.png';
import LogoutConfirmationModal from './logoutbutton'; 
import Notifications from './notification';

const imageStyle = {
    width: '25px',
    height: '25px',
};

const Header = () => {
    const [notifications, setNotifications] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        setNotifications([
            'New message from John',
            'You have 3 new friend requests',
            'Your order has been shipped',
        ]);
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        console.log("User confirmed logout");
        setShowLogoutModal(false);
    };

    return (
        <Stack direction="horizontal" gap={3} className="justify-content-between">
            <div className="p-0">
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="#"> 
                            <img
                                alt="Logo"
                                src={logo}
                                width="50"
                                height="50"
                                className="d-inline-block align-center"
                            /> 
                            {' '}
                            <a className='homeless'>HomeLess</a>
                        </Navbar.Brand>
                    </Container>
                </Navbar>
            </div>
            <div className="p-2 ms-auto">
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="#">
                            <img
                                alt="Logo"
                                src={ava}
                                width="50"
                                height="50"
                                className="d-inline-block align-center"
                            />
                            {' '}
                            <a>ChaNa</a>
                        </Navbar.Brand>
                    </Container>
                </Navbar>
            </div>
            <div className="p-1">
                <Notifications notifications={notifications} />
            </div>
            <div className="p-3">
                <Button variant="custom" onClick={handleLogout}>
                    <img src={logout} alt="LogoutButton" style={imageStyle}/>
                </Button>
            </div>
            <LogoutConfirmationModal 
                show={showLogoutModal} 
                onHide={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
            />
        </Stack>
    );
};

export default Header;
