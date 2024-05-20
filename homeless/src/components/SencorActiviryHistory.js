import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import api from '../api';

function LightActivityHistory() {
    const [temperatureLog, setTemperatureLog] = useState([]);
    const [humidityLog, setHumidityLog] = useState([]);
    const [alertLog, setAlertLog] = useState([]);
    const [day, setDay] = useState('1'); // Default to 'all'

    useEffect(() => {
        fetchData(day);
    }, [day]);

    const convertToVietnameseTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' });
    };

    const processLogData = (logData) => {
        const groupedData = {
            temperature: {},
            humidity: {},
            alert: {}
        };

        logData.forEach(logEntry => {
            const vietnameseTime = convertToVietnameseTime(logEntry.timestamp);
            const [date, time] = vietnameseTime.split(', ');

            switch(logEntry.sensor) {
                case 'cam-bien-nhiet-do':
                    if (!groupedData.temperature[date]) {
                        groupedData.temperature[date] = [];
                    }
                    groupedData.temperature[date].push({ time, value: logEntry.value });
                    break;
                case 'cam-bien-do-am':
                    if (!groupedData.humidity[date]) {
                        groupedData.humidity[date] = [];
                    }
                    groupedData.humidity[date].push({ time, value: logEntry.value });
                    break;
                case 'canh-bao':
                    if (!groupedData.alert[date]) {
                        groupedData.alert[date] = [];
                    }
                    groupedData.alert[date].push({ time, value: logEntry.value });
                    break;
                default:
                    break;
            }
        });

        return groupedData;
    };

    const handleSelectChange = (event) => {
        setDay(event.target.value);
    };

    const fetchData = async (selectedDay) => {
        try {
            const endpoint = selectedDay === 'all' ? '/api/record/' : `/api/record/${selectedDay}/`;
            const response = await api.get(endpoint);
            const processedData = processLogData(response.data);
            setTemperatureLog(processedData.temperature);
            setHumidityLog(processedData.humidity);
            setAlertLog(processedData.alert);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderTable = (data, title, unit) => {
        // if (!data || Object.keys(data).length === 0) {
        //     return <p>No data available</p>;
        // }
        
        return (
            <>
            <h5 className=''>{title}</h5>
            <Container className="mt-3 mb-3" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Mốc thời gian - Giá trị ({unit})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data).map(([date, entries]) => (
                            <tr key={date}>
                                <td>{date}</td>
                                <td>
                                {entries.map((entry, index) => (
                                    <div key={index}>
                                        {entry.time} - {entry.value}
                                        {index !== entries.length - 1 && <br />} {/* Add line break if it's not the last entry */}
                                    </div>
                                ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            </>
        );
    };

    return (
        <Container>
            <Form className="mb-3">
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
                        </Form.Select>
                    </Col>
                </Row>
            </Form>
            {renderTable(temperatureLog, 'Cảm biến nhiệt độ', 'độ C')}
            {renderTable(humidityLog, 'Cảm biến độ ẩm', '%')}
            {renderTable(alertLog, 'Cảnh báo', '1/0')}
        </Container>
    );
}


export default LightActivityHistory;
