import React from 'react';
import dashboardImage from '../asserts/dashboard_.png';
import fanImage from '../asserts/fan.png';
import lightImage from '../asserts/light.png';
import settingImage from '../asserts/setting.png';
import signoutImage from '../asserts/signout.png';
import logoWhite from '../asserts/logo_white.png';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import '../css/sidebar.css'

function SideBarItem({ img_src, des, onClick }) {
    return (
        <Button variant="white" className="d-flex align-items-center mb-4" onClick={onClick}>
            <img src={img_src} alt="icon" className='sidebaritems'/>
            <p className="mb-0">{des}</p>
        </Button>
    );
}
function Advertisement () {
    return (
        <div className="advertisements mb-1 mt-5">
            <img src={logoWhite} alt="logo" width="40px" height = "40px" className='mb-3'/> 
            <h3>Homeless Pro</h3>
            <p>Được trải nghiệm toàn bộ các tính năng nhà ở thông minh</p>
            <Button variant="light" className="text-5D5FEF">Mua ngay</Button>
        </div>
    )
}
export default function SideBar(){
    return (
        <div className="sidebar-container pt-5 bg-white">
            <div className='col container justify-items-center'>
                <SideBarItem img_src={dashboardImage} des="Dashboard"/><br></br>
                <SideBarItem img_src={fanImage} des="Quạt"/><br></br>
                <SideBarItem img_src={lightImage} des="Đèn"/><br></br>
                <SideBarItem img_src={settingImage} des="Cài đặt"/><br></br>
                <SideBarItem img_src={signoutImage} des="Đăng xuất"/><br></br>
                <Advertisement/>
            </div>
        </div>
    );
}
