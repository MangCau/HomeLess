import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from './components/Header';
import SideBar from './components/SideBar';
import Welcome from './pages/Welcome';
import Signup from './pages/Signup';
import Display from './components/Display';
import FanController from './pages/FanController';
import LightController from './pages/LightController';
function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/'>
              <Route index element = {<Welcome/>}/>

              <Route path='/signup' element = {<Signup/>}/>

              <Route path='/fan' element = {<FanController/>}/>

              <Route path='/light' element= {<LightController/>}/>
          </Route>
        </Routes>
      </Router>
    </div>
  )
}
export default App;
