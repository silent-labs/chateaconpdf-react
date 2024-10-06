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
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <MenuSidebar />
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Perfil de Usuario</h1>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  type="email"
                  name="email"
                  value={editedInfo.email}
                  onChange={handleInputChange}
                  label="Email"
                />
                <InputField
                  type="text"
                  name="username"
                  value={editedInfo.username}
                  onChange={handleInputChange}
                  label="Nombre de usuario"
                />
                <InputField
                  type="password"
                  name="currentPassword"
                  value={editedInfo.currentPassword}
                  onChange={handleInputChange}
                  label="Contraseña actual"
                />
                <InputField
                  type="password"
                  name="newPassword"
                  value={editedInfo.newPassword}
                  onChange={handleInputChange}
                  label="Nueva contraseña"
                />
                <InputField
                  type="password"
                  name="confirmPassword"
                  value={editedInfo.confirmPassword}
                  onChange={handleInputChange}
                  label="Confirmar nueva contraseña"
                />
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button type="submit" color="blue">Guardar cambios</Button>
                  <Button type="button" color="gray" onClick={() => setIsEditing(false)}>Cancelar</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <InfoSection label="Email" value={userInfo.email} />
                <InfoSection label="Nombre de usuario" value={userInfo.username} />
                <InfoSection
                  label="Fecha de registro"
                  value={new Date(userInfo.createdAt).toLocaleDateString()}
                />
                
                <div className="mt-12">
                  <h2 className="text-2xl font-semibold text-white mb-6">Información de Suscripción</h2>
                  {subscriptionInfo && subscriptionInfo.tipo ? (
                    <div className="bg-gray-700 rounded-xl p-6 space-y-4">
                      <InfoSection label="Tipo de suscripción" value={subscriptionInfo.tipo} />
                      <InfoSection label="Estado" value={subscriptionInfo.estado} />
                      <InfoSection
                        label="Fecha de inicio"
                        value={subscriptionInfo.fechaInicio ? new Date(subscriptionInfo.fechaInicio).toLocaleDateString() : 'No disponible'}
                      />
                      <InfoSection label="Periodo de facturación" value={subscriptionInfo.periodoFacturacion} />
                      <InfoSection
                        label="Monto"
                        value={subscriptionInfo.monto && subscriptionInfo.moneda ? `${subscriptionInfo.monto} ${subscriptionInfo.moneda}` : 'No disponible'}
                      />
                      <div className="mt-6">
                        <Button onClick={handleManageSubscription} color="green">
                          Manejar Suscripción
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-600 text-white p-6 rounded-xl shadow-lg">
                      <h3 className="text-xl font-semibold mb-2">¡No tienes una suscripción activa!</h3>
                      <p className="mb-4">Mejora tu experiencia suscribiéndote a nuestro servicio premium.</p>
                      <Button onClick={() => navigate('/suscripcion')} color="blue">
                        Obtener Suscripción
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <Button onClick={() => setIsEditing(true)} color="blue">Editar perfil</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ type, name, value, onChange, label }) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="block w-full px-4 py-3 rounded-lg bg-gray-700 border-2 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      placeholder=" "
    />
    <label
      htmlFor={name}
      className="absolute text-sm text-gray-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
    >
      {label}
    </label>
  </div>
);

const InfoSection = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <p className="mt-1 text-lg text-white">{value}</p>
  </div>
);

const Button = ({ children, color, ...props }) => {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    gray: "bg-gray-600 hover:bg-gray-700"
  };

  return (
    <button
      className={`${colors[color]} text-white px-6 py-3 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-${color}-500`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Profile;