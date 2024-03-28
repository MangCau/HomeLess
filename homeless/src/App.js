import React from 'react';
import './App.css';
import Header from './components/Header';
import Login from './pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar';
import FanController from './pages/FanController';
function App() {
  return (
    <div className='App'>
      <FanController/>
    </div>
  )
}
export default App;
