import React, { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap"
import api from "../api"

function SmallItems({ type, color, value }) {
    const colors = ["#FF947A", "#3CD856", "#BF83FF"]
    const color_circle = colors[type]
    const str = value
    return (
        <div className="m-3" style={{ backgroundColor: color, width: '33%', height: '30%', borderRadius: '20px' }}>
            <div className="m-3 d-flex flex-column align-items-center" style={{ backgroundColor: color_circle, borderRadius: '50%', width: '50px', height: '50px' }}></div>
            <h4 className="m-3 mb-1">{str}</h4>
        </div>
    )
}
const OnOffFan = () => {
    const [status, setStatus] = useState('')
    const [auto, setAuto] = useState('')
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          await api.get("/api/fan-log/")
          const lastRecordStatus = await api.get('/api/fan/')
          setStatus(lastRecordStatus.data['status'])
          setAuto(lastRecordStatus.data['is_manual'])
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
  
      fetchData()
    }, [])
  
    const handleStatusChange = async () => {
      try {
        const { v4: uuidv4 } = require('uuid')
        const activityResponse = await api.post('/api/fan-log/', {
          id: uuidv4(),
          status: !status,
          log_type: 'status',
        })
        await api.patch('/api/fan/', { status: !status })
        console.log(activityResponse.data)
      } catch (error) {
        console.error('Error toggling status:', error)
      }
      setStatus(prevStatus => !prevStatus)
    }
  
    const handleAutoChange = async () => {
      try {
        const { v4: uuidv4 } = require('uuid')
        const fanAutoLogResponse = await api.post('/api/fan-log/', {
          id: uuidv4(),
          is_manual: !auto,
          log_type: 'auto',
        })
        await api.patch('/api/fan/', { is_manual: !auto })
        console.log(fanAutoLogResponse.data)
      } catch (error) {
        console.error('Error toggling auto status:', error)
      }
      setAuto(prevStatus => !prevStatus)
    }
    
    return (
        <Form.Group className="mb-3">
          <Form.Label className="d-flex justify-content-between align-content-center">
            
            <span>
              <Form.Check 
                type="switch"
                id="status-switch-fan"
                checked={status}
                onChange={handleStatusChange}
              />
            </span>
          </Form.Label>
        </Form.Group>
    )
  }
function MyTable() {
    const [status, setStatus] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [schedules, setSchedules] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchLightStatus()
                await fetchSchedules()
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
        const checkScheduleAndUpdateLight = () => {
            const currentTime = new Date()
            for (const schedule of schedules) {
                const startTimeParts = schedule.start_time.split(':')
                const endTimeParts = schedule.end_time.split(':')
                const startTime = new Date()
                startTime.setHours(startTimeParts[0], startTimeParts[1], startTimeParts[2] || 0, 0)
                const endTime = new Date()
                endTime.setHours(endTimeParts[0], endTimeParts[1], endTimeParts[2] || 0, 0)
                console.log(currentTime >= startTime && currentTime <= endTime)
                    if (currentTime >= startTime && currentTime <= endTime) {
                    if (!status) turnOnLight()
                    return 
                }
            }
        
            if (status) turnOffLight()
        }
        const intervalId = setInterval(checkScheduleAndUpdateLight, 1000)
        return () => clearInterval(intervalId)
    }, [status])
    const turnOnLight = async () => {
        try {
            const { v4: uuidv4 } = require('uuid')
            await api.post('/api/light-log/', {
                id: uuidv4(),
                status: true
            })
            setStatus(true)
        } catch (error) {
            console.error('Error turning on light:', error)
        }
    }
    const fetchSchedules = async () => {
        try {
            const response = await api.get("/api/schedule/")
            setSchedules(response.data)
        } catch (error) {
            console.error('Error fetching schedules:', error)
        }
    }
    const turnOffLight = async () => {
        try {
            const { v4: uuidv4 } = require('uuid')
            await api.post('/api/light-log/', {
                id: uuidv4(),
                status: false
            })
            setStatus(false)
        } catch (error) {
            console.error('Error turning off light:', error)
        }
    }
    

    const fetchLightStatus = async () => {
        try {
            const lastRecordStatus = await api.get('/api/light/')
            setStatus(lastRecordStatus.data['status'])
        } catch (error) {
            console.error('Error fetching light status:', error)
        }
    }
    const handleStatusChange = async () => {
        try {
            const { v4: uuidv4 } = require('uuid')
            const newStatus = !status
            await api.post('/api/light-log/', {
                id: uuidv4(),
                status: newStatus
            })
            setStatus(prevStatus => !prevStatus)
        } catch (error) {
            console.error('Error toggling light status:', error)
        }
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table">
                            <colgroup>
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '25%' }} />
                            </colgroup>
                            <thead className="bg-secondary text-white">
                                <tr>
                                    <th style={{ textDecoration: 'none', color: 'gray' }}>#</th>
                                    <th style={{ textDecoration: 'none', color: 'gray' }}>Name</th>
                                   
                                    <th style={{ textDecoration: 'none', color: 'gray' }}> Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Đèn</td>
                                    
                                    <td>
                                    <Form.Label className="d-flex justify-content-between align-content-center">
                                            
                                            <span>
                                                <Form.Check
                                                    type="switch"
                                                    id="status-switch-light"
                                                    checked={status}
                                                    onChange={handleStatusChange}
                                                />
                                            </span>
                                        </Form.Label>
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Quạt</td>
                                    
                                    <td>
                                        <OnOffFan/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
export function DeviceStatistics() {
    return (
        <div className="mt-0 m-4 bg-white p-4 pb-0" style={{ minWidth: "45%" }}>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4>Thiết bị hiện tại</h4>
                </div>
            </div>
            <MyTable />
        </div>
    )
}

export default function Display({ selectedRange }) {
    const [temperature, setTemperature] = useState('')
    const [humidity, setHumidity] = useState('')
    const [detectHuman, setDetectHuman] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                await api.get("/api/record")
                const latestTemp = await api.get("/api/temperature-record/latest/") 
                const latestHumidity = await api.get("/api/humidity-record/latest/")
                const detectHuman = await api.get("/api/human-detect-record/latest/")
                setTemperature(latestTemp.data)
                setHumidity(latestHumidity.data)
                setDetectHuman(detectHuman.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
        const intervalId = setInterval(fetchData, 1000)
        return () => clearInterval(intervalId)
    }, []) 

    return (
        <div className="mt-0  m-4 bg-white p-4 pb-0 mw-50 me-0" style={{ minWidth: "45%" }}>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4>Thông tin hôm nay</h4>
                </div>
            </div>
            <div className="d-flex justify-content-space-around align-items-center">
                <SmallItems type={0} color="#FFF4DE" value={temperature === '' ? 'Loading..' : `${temperature}°C`}/>
                <SmallItems type={1} color="#DCFCE7" value={humidity === '' ? 'Loading..' : `${humidity}%`}/>
                <SmallItems type={2} color="#F3E8FF" value={detectHuman === '' ? 'Loading..' : (detectHuman === 0 ? "Không có người" : "Có người")} medium="10" diff="2" />
            </div>
        </div>
    )
}
