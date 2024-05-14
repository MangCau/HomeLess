import React from 'react'
import { Container, Row } from 'react-bootstrap'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import Display, { DeviceStatistics } from '../components/Display'
import Example from '../components/Chart'
import ChartOfTemp from '../components/ChartOfTemp'
import ChartActive from '../components/ChartActive'

export default function Setting() {
    return (
        <div className='mainpage'>
            <Header />
            <div className='mainbody'>
                <SideBar />
            </div>
        </div>
    )
}
