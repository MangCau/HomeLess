import React from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

function ActivityHistory(){
    return(
        <Form>
            <Row className="align-items-center" style={{ marginTop: '20px' }}>
                <Col sm={3} className="my-1 d-flex align-items-center">
                    <Form.Label htmlFor="inlineFormInputDateFrom" className="mb-0 mr-2" style={{marginRight:'20px'}}>
                        Từ
                    </Form.Label>
                <Form.Control id="inlineFormInputDateFrom" type="date" placeholder="Chọn ngày"/>
                </Col>

                <Col sm={3} className="my-1 d-flex align-items-center">
                    <Form.Label htmlFor="inlineFormInputDateTo" className="mb-0 mr-2" style={{marginRight:'20px'}}>
                        Đến
                    </Form.Label>
                    <Form.Control id="inlineFormInputDateTo" type="date" placeholder="Chọn ngày" />
                </Col>

                <Col xs="auto" className="my-1">
                    <Button type="submit" style={{backgroundColor:'#5D5FEF'}}>OK</Button>
                </Col>
            </Row>
        </Form>

    )
}
export default ActivityHistory;