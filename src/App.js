import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import Login from './components/Login'
import NotFound from './components/NotFound'
const App=()=>{
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="*" element={<NotFound/>}/>
    
    </Routes></BrowserRouter>
}
export default App