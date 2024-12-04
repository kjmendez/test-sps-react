import UserService from "../services/UserService";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'bootstrap';  // Para trabajar con modales
import 'bootstrap/dist/css/bootstrap.min.css';  // Asegúrate de incluir los estilos de Bootstrap

import Swal from 'sweetalert2';

function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [correo, setCorreo] = useState('');
  const [nombres, setNombres] = useState('');
  const [type, setType] = useState('');
  const [password, setPassword] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);

  const obtenerDatos = useCallback(async () => {
    try { 
      const data = await UserService.list();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        expirado();
      }
    }
  }, []);

  useEffect(() => {
    obtenerDatos();
  }, [obtenerDatos]);

  const registrar = async () => {
    if (!nombres || !correo || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios',
      });
      return;
    }

    const datos = {
      correo,
      nombres,
      type,
      password,
    };

    try {
      await UserService.create(datos);
      obtenerDatos();
      cerrarModal();
      Swal.fire('Éxito!', 'Usuario agregado correctamente.', 'success');
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      Swal.fire('Error!', 'No se pudo agregar el usuario.', 'error');
    }
  };

  const actualizar = async () => {
    if (nombres === '' || correo === '' || password === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios',
      });
      return;
    }

    const datos = {
      correo,
      nombres,
      type,
      password,
    };

    try {
      await UserService.update(seleccionado.email, datos);
      obtenerDatos();
      reset();
      cerrarModal();
    } catch (error) {
      console.error(error);
    }
  };

  const seleccionar = (item) => {
    setSeleccionado(item);
    setCorreo(item.correo);
    setNombres(item.nombre);
    setType(item.type);
    abrirModal();
  };

  const eliminar = async (item) => {
    try {
      console.log(item);
      setCorreo(item.correo);
      const confirm = await Swal.fire({
        title: '¿Estás seguro de querer eliminar a ' + item.nombre + '?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
      });

      if (confirm.isConfirmed) {
        await UserService.delete(item.email);
        obtenerDatos();
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    setCorreo('');
    setNombres('');
    setType('');
    setPassword('');
    setSeleccionado(null);
  };
  const abrirModal = () => {
    const myModalEl = document.getElementById('modalUsuario');
    const modal = new Modal(myModalEl);
    modal.show();
  };

  const cerrarModal = () => {
    const myModalEl = document.getElementById('modalUsuario');
    const modal = Modal.getInstance(myModalEl);
    if (modal) {
      modal.hide();
    }
  };
  const expirado = () => {
    Swal.fire({
      icon: 'error',
      title: 'Sesión expirada',
      text: 'Debes iniciar sesión',
      timer: 1500,
    });
    window.location.href = '/Home';
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5 className="card-title">Usuarios</h5>
            </div>
            <div className="col-md-6 text-end">
              <button
                type="button"
                className="btn btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#modalUsuario"
              >
                <i className="fa fa-plus"></i> Nuevo
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nombres</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((item) => (
                  <tr key={item.email}>
                    <td>{item.email}</td>
                    <td>{item.nombre}</td>
                    <td>{item.type}</td>
                    <td>
                      <button onClick={() => seleccionar(item)} className="btn btn-warning btn-sm me-2">
                        <i className="fa fa-edit">Modificar</i>
                      </button>
                      <button onClick={() => eliminar(item)} className="btn btn-danger btn-sm">
                        <i className="fa fa-edit">Eliminar</i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="modalUsuario" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Datos del usuario
              </h1>
              <button
                type="button"
                onClick={reset}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="needs-validation"   noValidate>
              <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nombres" className="form-label">
                  Nombres
                </label>
                <input type="text" className="form-control" placeholder="Nombre" value={nombres} onChange={(e) => setNombres(e.target.value)}/>
              </div>

              <div className="mb-3">
                <label htmlFor="tipo" className="form-label">
                  Tipo
                </label>
                <input
                  type="text"
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  id="tipo"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="correo" className="form-label">
                  Correo
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)} 
                  id="correo"
                  className="form-control"
                  placeholder="example@example.com"
                />
              </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input type="password" className="form-control" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={reset}
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
                {seleccionado ? (
                  <button
                  type="button"
                  onClick={actualizar}
                  className="btn btn-primary"
                >
                  Actualizar
                </button> 
                ) : (
                  <button
                  type="button"
                  onClick={registrar}
                  className="btn btn-primary">
                  Guardar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
