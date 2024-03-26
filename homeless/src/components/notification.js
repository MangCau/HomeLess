
import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import noti from '../asserts/noti-icon.png';

const imageStyle = {
    width: '25px',
    height: '25px',
};

const DropdownComponent = ({ notifications }) => {
    return (
        <DropdownButton id="dropdown-basic-button" title={<img src={noti} alt="NotiButton" style={imageStyle}/>}  variant="custom">
            {notifications.map((notification, index) => (
                <Dropdown.Item key={index}>{notification}</Dropdown.Item>
            ))}
        </DropdownButton>
    );
};

export default DropdownComponent;
