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

function SideBarItem({ img_src, des }) {
    return (
        <div className="d-flex align-items-center mb-4">
            <img src={img_src} alt="icon" className='sidebaritems'/>
            <p className="mb-0">{des}</p>
        </div>
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
        <div className="sidebar-container">
            <ButtonGroup vertical>
                <SideBarItem img_src={dashboardImage} des="Dashboard"/>
                <SideBarItem img_src={fanImage} des="Quạt"/>
                <SideBarItem img_src={lightImage} des="Đèn"/>
                <SideBarItem img_src={settingImage} des="Cài đặt"/>
                <SideBarItem img_src={signoutImage} des="Đăng xuất"/>
                <Advertisement/>
            </ButtonGroup>
        </div>
    );
}
