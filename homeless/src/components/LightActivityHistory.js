import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import api from '../api';

function LightActivityHistory() {
    const [log, setLog] = useState([]);
    const [day, setDay] = useState('1'); // Default to 'all'

    useEffect(() => {
        fetchData(day);
    }, [day]);

    const convertToVietnameseTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
    };

    const processLogData = (logData) => {
        const groupedData = {};

        logData.forEach(logEntry => {
            const vietnameseTime = convertToVietnameseTime(logEntry.timestamp);
            const [date, time] = vietnameseTime.split(', ');
            const action = logEntry.status ? 'Bật' : 'Tắt';

            if (!groupedData[date]) {
                groupedData[date] = {
                    date,
                    timestamps: [],
                    actions: []
                };
            }

            groupedData[date].timestamps.push(time);
            groupedData[date].actions.push(action);
        });

        return Object.values(groupedData);
    };

    const handleSelectChange = (event) => {
        setDay(event.target.value);
    };

    const fetchData = async (selectedDay) => {
        try {
            const endpoint = selectedDay === 'all' ? '/api/light-log/' : `/api/light-log/${selectedDay}/`;
            const response = await api.get(endpoint);
            const processedData = processLogData(response.data);
            setLog(processedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        // <Container fluid>
        <>
            <a>Lịch sử hoạt động</a>
            <Form>
                <Row className="align-items-center justify-content-between" style={{ marginTop: '20px' }}>
                    <Col sm={12} className="my-1 d-flex align-items-center">
                        <Form.Select value={day} onChange={handleSelectChange}>
                            <option value="1">Hôm nay</option>
                            <option value="2">2 ngày</option>
                            <option value="7">1 tuần</option>
                            <option value="14">2 tuần</option>
                            <option value="24">3 tuần</option>
                            <option value="30">1 tháng</option>
                            <option value="120">4 tháng</option>
                            <option value="240">8 tháng trước</option>
                            <option value="365">1 năm trước</option>
                            <option value="all">Tất cả</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Form>
            <Container className="mt-3 mb-3" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Mốc thời gian - Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {log.map((item, index) => (
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>
                                    {item.timestamps.map((time, i) => (
                                        <span key={i}>{time} - {item.actions[i]}{i !== item.timestamps.length - 1 && ', '}</span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        {/* </Container> */}
        </>
    );
}

export default LightActivityHistory;
