import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import axios from "axios";
import Swal from 'sweetalert2';

function SignIn() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Usa useNavigate

  const ingresar = async () => {
    if (correo === "" || password === "") {
      Swal.fire({
        title: 'Error!',
        text: 'Ingrese sus credenciales!!',
        icon: 'error',
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        correo,
        password,
      });
      localStorage.setItem("token", response.data.token);

      Swal.fire({
        title: "Bienvenido!",
        text: "Estas de regreso!!",
        icon: "success",
        showConfirmButton: false,
        timer: 1000
      });


      // Redirigir a la página principal o la página que desees
      navigate("/"); // Usa navigate en lugar de history.push
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error al iniciar sesión!!',
        icon: 'error',
      });
    }
  };

  return (
    <div className="d-flex justify-content-center">
    <div className="card">
      <div className="card-body">
        <h2 className="text-center">Iniciar sesión</h2>
        <h3 className="text-center">NUR</h3>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            className="form-control"
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3 text-center">
          <button onClick={ingresar} className="btn btn-primary">
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

export default SignIn;
