/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Signup = () => {
  const [adminToken, setAdminToken] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener el token de administrador
    const fetchAdminToken = async () => {
      const params = new URLSearchParams();
      params.append('client_id', 'taskManager-backEnd');
      params.append('client_secret', '**********');
      params.append('scope', 'openid');
      params.append('username', 'admin');
      params.append('password', 'admin');
      params.append('grant_type', 'password');

      try {
        const response = await fetch('http://localhost:8080/realms/taskManager/protocol/openid-connect/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        });

        if (!response.ok) {
          throw new Error('Error al obtener el token');
        }

        const data = await response.json();
        setAdminToken(data.access_token);
      } catch (error) {
        setError('No se pudo obtener el token de administrador');
      }
    };

    fetchAdminToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!username || !email || !firstName || !lastName || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const userData = {
      username,
      email,
      firstName,
      lastName,
      enabled: true,
      emailVerified: false,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    };

    try {
      const response = await fetch('http://localhost:8080/admin/realms/taskManager/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Usuario registrado exitosamente');
        navigate('/'); 
        // Limpiar campos
        setUsername('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
      } else {
        throw new Error('Error al registrar el usuario');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Formulario de Registro</h2>
        
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-medium">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-medium">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Registrar Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
