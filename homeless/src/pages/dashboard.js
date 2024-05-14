import React from 'react'
import { Container, Row } from 'react-bootstrap'
import SideBar from '../components/SideBar'
import Header from '../components/Header'
import Display, { DeviceStatistics } from '../components/Display'
import Example from '../components/Chart'
import ChartOfTemp from '../components/ChartOfTemp'
import ChartActive from '../components/ChartActive'

export default function Dashboard() {
    return (
        <div className='mainpage'>
            <Header />
            <div className='mainbody'>
                <SideBar />
                <Container>
                    <Container className="d-flex">
                        <Display />
                        <DeviceStatistics />
                    </Container>
                    <Container className="d-flex mt-5">
                        <div style={{ width: '45%' }}>
                            <Example/>
                        </div>
                        <div style={{ width: '45%' }}>
                            <ChartOfTemp/>
                        </div>
                    </Container>
                    <Container className="d-flex mt-5">
                        <div style={{ width: '45%' }}>
                        <h4 className='ms-5'>Thời gian đèn hoạt động</h4>
                            <ChartActive/>
                        </div>
                        <div style={{ width: '45%' }}>
                        <h4 className='ms-5'>Thời gian quạt hoạt động</h4>
                            <ChartActive/>
                        </div>
                    </Container>
                </Container>
            </div>
        </div>
    )
}
