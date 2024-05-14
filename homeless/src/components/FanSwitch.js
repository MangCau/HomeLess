import React, { useState, useEffect } from 'react'
import { Container, Form } from 'react-bootstrap'
import api from '../api'
import { apiKey } from '../constants'

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
    <Container>
      <Form.Group className="mb-3">
        <Form.Label className="d-flex justify-content-between align-content-center">
          <span>Trạng thái</span>
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
      <Form.Group className="mb-3">
        <Form.Label className="d-flex justify-content-between align-content-center">
          <span>Trạng thái tự động (Auto)</span>
          <span>
            <Form.Check 
              type="switch"
              id="auto-switch"
              checked={auto}
              onChange={handleAutoChange}
            />
          </span>
        </Form.Label>
      </Form.Group>
    </Container>
  )
}

export default OnOffFan
