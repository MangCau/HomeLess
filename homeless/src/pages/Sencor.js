import React from 'react'
import { Container, Row } from 'react-bootstrap'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import ActivityHistory from '../components/SencorActiviryHistory'


export default function Setting() {
    return (
        <div className='mainpage'>
            <Header />
            <div className='mainbody'>
                <SideBar />
                <ActivityHistory/>
            </div>
        </div>
    )
}
