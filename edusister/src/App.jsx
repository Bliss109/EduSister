// App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup'


const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/loginsignup' || location.pathname === '/loginsignup';

  return (
    <>
       {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/loginsignup' element={<LoginSignup />} /> 
        
      </Routes>
    </>
  );
};

export default App;