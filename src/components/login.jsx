import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 opacity-5"></div>
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-3">
              Iniciar sesión
            </h1>
            <p className="text-gray-300 text-lg">
              Accede a tu cuenta para continuar
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Nombre de usuario o correo electrónico
                </label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  required 
                  className="w-full px-3 py-2 bg-gray-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={username || email}
                  onChange={(e) => {
                    if (e.target.value.includes('@')) {
                      setEmail(e.target.value);
                      setUsername('');
                    } else {
                      setUsername(e.target.value);
                      setEmail('');
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  required 
                  className="w-full px-3 py-2 bg-gray-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md hover:shadow-lg border border-white/20"
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;