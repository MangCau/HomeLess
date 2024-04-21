import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Header from './components/Header';
import SideBar from './components/SideBar';
import Welcome from './pages/Welcome';
import Signup from './pages/Signup';
import Display from './components/Display';
import FanController from './pages/FanController';
import LightController from './pages/LightController';
import ProtectedRoute from "./components/ProtectedRoute"
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Signup />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<RegisterAndLogout />} />
        <Route path='/fan' element = {<FanController/>}/>
        <Route path='/light' element= {<LightController/>}/>
        <Route path='/display' element= {<Display/>}/>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
