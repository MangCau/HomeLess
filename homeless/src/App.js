import React from 'react';
import './App.css';
import Header from './components/Header';
import Login from './pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar';
import Display from './components/Display';
import FanController from './pages/FanController';
import LightController from './pages/LightController';
function App() {
  return (
    <div className='App'>
      {/* <Header/>
      <div className='d-flex bg-light'>
        <SideBar/>
        <Display/>
      </div> */}
      <LightController/>
      {/* <FanController/> */}
    </div>
  )
}
export default App;
