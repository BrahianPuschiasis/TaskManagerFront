import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import Task from "../components/Task.jsx";

const Home = () => {
  const location = useLocation();
  const { username, token, userId } = location.state || {}; 
  const { t } = useTranslation(); 

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        {t('home.welcome', { username: username })} 
      </h1>
      {token && userId ? (
        <Task userId={userId} token={token} />
      ) : (
        <p className="text-center text-red-500">{t('home.error')}</p> 
      )}
    </div>
  );
};

export default Home;
