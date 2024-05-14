import React, {useState} from 'react'
import { Container, Row, Col, Form, FloatingLabel, Button} from 'react-bootstrap'
import welcomeimg from '../asserts/smarthome.jpg'
// import LoginForm from '../components/loginForm'
import logo from '../asserts/logo.png'
import Navbar from 'react-bootstrap/Navbar'
import '../css/LoginPage.css'
import { useNavigate } from "react-router-dom"
import api from "../api"

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  // const [phonenum, setPhonenum] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()

    try {
        const res = await api.post("/api/user/register/", { username, email, password })
        console.log(res)
        navigate("/login")
    } catch (error) {
        alert(error)
    } finally {
        setLoading(false)
    }
}
  return (
    <Container fluid>
      <Row>
        <Col md={6} lg={6} className="d-none d-md-block">
          <div className='welcomeimage'>
            <img src={welcomeimg} alt="Welcome" className="img-fluid" /> 
          </div>
          <div className='welcometext'>
            <h1 className='mainwelcometext'>Easy living with your smart home!</h1>
            <a className='subwelcometext'>Get your smart devices in one place and manage all of these with a few taps.</a>
          </div>
        </Col>
        <Col xs={12} md={6} lg={6} className='justify-content-center align-items-center'>
            <div className='formlogin d-flex justify-content-center align-items-center h-100'>
                <Navbar className="bg-white" style={{marginBottom:'50px'}}>
                  <Container>
                    <Navbar.Brand> 
                      <img
                        alt="Logo"
                        src={logo}
                        width="70"
                        height="70"
                        className="d-inline-block align-center"
                      /> 
                      {' '}
                      <span className='homeless'>HomeLess</span>
                    </Navbar.Brand>
                  </Container>
                </Navbar>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel  label="Tên đăng nhập" className="mb-5">
                        <Form.Control
                        type="text"
                        placeholder="Tên đăng nhập"
                        id='account'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} required
                        />
                    </FloatingLabel>
                    {/* <FloatingLabel  label="Số điện thoại" className="mb-5">
                        <Form.Control
                        type="number"
                        placeholder="Số điện thoại"
                        id='phone'
                        value={phonenum}
                        onChange={(e) => setPhonenum(e.target.value)} required
                        />
                    </FloatingLabel> */}
                    <FloatingLabel label="Email" className="mb-5">
                        <Form.Control
                        type="email"
                        placeholder="Email"
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} required
                        />
                    </FloatingLabel>
                    <FloatingLabel  label="Mật khẩu">
                        <Form.Control
                        type="password"
                        placeholder="Mật khẩu"
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} required
                        
                        />
                    </FloatingLabel>

                    <Button variant="primary" type="submit">
                        <a className='logintext'>Đăng ký</a>
                    </Button>
                </Form>
                <a href='/login' style={{color:'#5D5FEF', marginTop:'20px'}}>Đăng nhập</a>
            </div>
        </Col>
      </Row>
    </Container>
  )
}

export default SignupPage
