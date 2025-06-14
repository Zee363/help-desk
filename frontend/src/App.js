import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Header from './components/Header';
import AdminSidebar from './components/AdminSidebar';
import TicketStats from './pages/TicketStats';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
     <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/header' element={<Header />} />
      <Route path='/admin/sidebar' element={<AdminSidebar />} />
      <Route path='/ticket/stats' element={<TicketStats />} />
      <Route path='/admin/dashboard' element={<Dashboard />} />
      <Route path='/user/dashboard' element={<UserDashboard />} />
     </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
