import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Signup from './pages/Signup'
import FanController from './pages/FanController'
import LightController from './pages/LightController'
import ProtectedRoute from "./components/ProtectedRoute"
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Dashboard from './pages/dashboard'
import Setting from './pages/Setting'

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/fan" 
          element={
            <ProtectedRoute>
              <FanController />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/light" 
          element={
            <ProtectedRoute>
              <LightController />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/setting" 
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
