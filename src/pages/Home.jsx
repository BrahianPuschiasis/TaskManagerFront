import React from "react";
import { useLocation } from "react-router-dom";
import Task from "../components/Task.jsx";

const Home = () => {
  const location = useLocation();
  const { username, token, userId } = location.state || {}; 

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Bienvenido, {username}</h1>
      {token && userId ? (
        <Task userId={userId} token={token} />
      ) : (
        <p className="text-center text-red-500">No se pudo obtener la información del usuario</p>
      )}
    </div>
  );
};

export default Home;
