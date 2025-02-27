/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
