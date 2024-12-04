import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

function Home() {
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div>
      <h3>SPS REACT TEST</h3>
      <a href="/users"><span className="card-subtitle">Usuarios</span></a>
      <br></br>
      <button onClick={handleLogout}>
        <i>Cerrar sesión</i> 
      </button>
    </div>
  );
}

export default Home;

