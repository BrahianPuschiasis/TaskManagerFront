/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("client_id", import.meta.env.VITE_CLIENT_ID);
    params.append("client_secret", import.meta.env.VITE_CLIENT_SECRET);
    params.append("scope", import.meta.env.VITE_SCOPE);
    params.append("username", username);
    params.append("password", password);
    params.append("grant_type", import.meta.env.VITE_GRANT_TYPE);

    try {
      const tokenResponse = await fetch(
        `${import.meta.env.VITE_KEYCLOAK_HOST}/realms/taskManager/protocol/openid-connect/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        }
      );

      if (!tokenResponse.ok) {
        throw new Error("Error al autenticar al usuario");
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;


      const userInfoResponse = await fetch(
        `${import.meta.env.VITE_KEYCLOAK_HOST}/realms/taskManager/protocol/openid-connect/userinfo`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error("Error al obtener la información del usuario");
      }

      const userInfo = await userInfoResponse.json();
      const userId = userInfo.sub; 


      setError("");

      navigate("/home", { state: { username, token: accessToken, userId } });
    } catch (err) {
      setError("Error al autenticar al usuario: " + err.message);
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={handleSignupRedirect} className="text-blue-500 hover:underline">
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
