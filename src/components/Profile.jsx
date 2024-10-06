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
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [userResponse, subscriptionResponse] = await Promise.all([
          fetch('http://localhost:3002/user-info', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:3002/subscription-info', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!userResponse.ok || !subscriptionResponse.ok) {
          throw new Error('Error al obtener la información del usuario o la suscripción');
        }

        const userData = await userResponse.json();
        const subscriptionData = await subscriptionResponse.json();

        setUserInfo(userData);
        setSubscriptionInfo(subscriptionData);
        setEditedInfo({
          email: userData.email,
          username: userData.username,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudo cargar la información del usuario o la suscripción');
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
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Actualizar nombre de usuario
      if (editedInfo.username !== userInfo.username) {
        const usernameResponse = await fetch('http://localhost:3002/update-user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ newUsername: editedInfo.username })
        });

        if (!usernameResponse.ok) {
          throw new Error('Error al actualizar el nombre de usuario');
        }
      }

      // Actualizar email
      if (editedInfo.email !== userInfo.email) {
        const emailResponse = await fetch('http://localhost:3002/update-email', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ newEmail: editedInfo.email })
        });

        if (!emailResponse.ok) {
          throw new Error('Error al actualizar el email');
        }
      }

      // Actualizar contraseña
      if (editedInfo.currentPassword && editedInfo.newPassword) {
        if (editedInfo.newPassword !== editedInfo.confirmPassword) {
          setError('Las contraseñas nuevas no coinciden');
          return;
        }

        const passwordResponse = await fetch('http://localhost:3002/update-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword: editedInfo.currentPassword,
            newPassword: editedInfo.newPassword
          })
        });

        if (!passwordResponse.ok) {
          throw new Error('Error al actualizar la contraseña');
        }
      }

      // Actualizar la información del usuario en el estado
      setUserInfo(prev => ({
        ...prev,
        email: editedInfo.email,
        username: editedInfo.username
      }));

      setIsEditing(false);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo actualizar la información del usuario');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/create-billing-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al crear la sesión de facturación');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo abrir el portal de facturación');
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
                  name="currentPassword"
                  id="currentPassword"
                  value={editedInfo.currentPassword}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-md bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder=" "
                />
                <label htmlFor="currentPassword" className="absolute text-sm text-gray-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">Contraseña actual</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={editedInfo.newPassword}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-md bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder=" "
                />
                <label htmlFor="newPassword" className="absolute text-sm text-gray-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2">Nueva contraseña</label>
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
                <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Información de Suscripción</h2>
                {subscriptionInfo ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Tipo de suscripción</label>
                      <p className="mt-1 text-lg text-white">{subscriptionInfo.tipo}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Estado</label>
                      <p className="mt-1 text-lg text-white">{subscriptionInfo.estado}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Fecha de inicio</label>
                      <p className="mt-1 text-lg text-white">
                        {new Date(subscriptionInfo.fechaInicio).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Periodo de facturación</label>
                      <p className="mt-1 text-lg text-white">{subscriptionInfo.periodoFacturacion}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">Monto</label>
                      <p className="mt-1 text-lg text-white">
                        {subscriptionInfo.monto} {subscriptionInfo.moneda}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleManageSubscription}
                        className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-200"
                      >
                        Manejar Suscripción
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">No hay información de suscripción disponible</p>
                )}
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