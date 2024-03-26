import React from 'react';
import './App.css';
import Header from './components/Header';
import Login from './pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/SideBar';
function App() {
  return (
    <div className='App'>
      <Header/>
      <SideBar/>
    </div>
  )
}
export default App;
