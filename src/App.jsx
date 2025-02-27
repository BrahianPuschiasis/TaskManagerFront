/* eslint-disable no-unused-vars */

import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

function App() {
  return (
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
  );
}

export default App;

