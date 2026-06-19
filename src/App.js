import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ReferralDetail from './components/ReferralDetail'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

const App=()=>{
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login/>}/>
    
      <Route path="*" element={<NotFound />} />

    
    </Routes>
    </BrowserRouter>
}
export default App;
