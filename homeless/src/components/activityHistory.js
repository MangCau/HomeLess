import React, { useState } from "react";
import { Container, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function ActivityHistory(){
    const currentDate = new Date();
    const [fromdate, setFromDate] = useState(currentDate.toISOString().slice(0,10)); // Set initial fromdate to current date
    const [todate, setToDate] = useState(currentDate.toISOString().slice(0,10)); // Set initial todate to current date
    const [data, setData] = useState([]);

    const handleFromDateChange = (event) => {
        setFromDate(event.target.value);
    };

    const handleToDateChange = (event) => {
        setToDate(event.target.value);
    };

    const generateDateRange = (from, to) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const dates = [];
        const currentDate = new Date(fromDate);

        while (currentDate <= toDate) {
            dates.push(new Date(currentDate).toISOString().slice(0,10));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const selectedFromDate = new Date(fromdate);
        const selectedToDate = new Date(todate);
        const today = new Date();

        if (selectedFromDate > today || selectedToDate > today || selectedFromDate > selectedToDate) {
            alert("Please select a valid date range.");
            return;
        }

        const newData = generateDateRange(fromdate, todate).map(date => ({
            date,
            timestamps: ['07:00', '12:00']  ,
            actions: ['Bật', 'Tắt']
        }));
        setData(newData);
    };

    return(
        <Container>
            <a>Lịch sử hoạt động</a>
            <Form onSubmit={handleSubmit}>
                <Row className="align-items-center justify-content-between" style={{ marginTop: '20px' }}>
                    <Col sm={3} className="my-1 d-flex align-items-center">
                        <Form.Label htmlFor="inlineFormInputDateFrom" className="mb-0 mr-2" style={{marginRight:'20px'}}>
                            Từ
                        </Form.Label>
                        <Form.Control id="fromdate" type="date" placeholder="Chọn ngày" value={fromdate} onChange={handleFromDateChange} />
                    </Col>

                    <Col sm={3} className="my-1 d-flex align-items-center">
                        <Form.Label htmlFor="inlineFormInputDateTo" className="mb-0 mr-2" style={{marginRight:'20px'}}>
                            Đến
                        </Form.Label>
                        <Form.Control id="todate" type="date" placeholder="Chọn ngày" value={todate} onChange={handleToDateChange} />
                    </Col>

                    <Col xs="auto" className="my-1">
                        <Button type="submit" style={{backgroundColor:'#5D5FEF'}}>OK</Button>
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
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>
                                    {item.timestamps.map((timestamp, i) => (
                                        <span key={i}>{timestamp} - {item.actions[i]}{i !== item.timestamps.length - 1 && ', '}</span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
}

export default ActivityHistory;
