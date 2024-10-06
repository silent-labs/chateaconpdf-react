import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuSidebar from './menu-sidebar';

function Profile() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    createdAt: ''
  });
  const [editedInfo, setEditedInfo] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3002/user-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener la información del usuario');
        }

        const data = await response.json();
        setUserInfo(data);
        setEditedInfo({
          email: data.email,
          username: data.username,
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudo cargar la información del usuario');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editedInfo.password !== editedInfo.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedInfo)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la información del usuario');
      }

      const updatedData = await response.json();
      setUserInfo(updatedData);
      setIsEditing(false);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo actualizar la información del usuario');
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <MenuSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Perfil de Usuario</h1>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={editedInfo.email}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-md bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder=" "
                />
                <label htmlFor="email" className="absolute text-sm text-gray-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">Email</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={editedInfo.username}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-md bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder=" "
                />
                <label htmlFor="username" className="absolute text-sm text-gray-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">Nombre de usuario</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={editedInfo.password}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-md bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder=" "
                />
                <label htmlFor="password" className="absolute text-sm text-gray-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">Nueva contraseña</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={editedInfo.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-md bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder=" "
                />
                <label htmlFor="confirmPassword" className="absolute text-sm text-gray-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">Confirmar nueva contraseña</label>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200">Guardar cambios</button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition duration-200">Cancelar</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <p className="mt-1 text-lg text-white">{userInfo.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Nombre de usuario</label>
                <p className="mt-1 text-lg text-white">{userInfo.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Fecha de registro</label>
                <p className="mt-1 text-lg text-white">
                  {new Date(userInfo.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200">Editar perfil</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;