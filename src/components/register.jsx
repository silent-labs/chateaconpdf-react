import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await fetch('http://localhost:3002/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      navigate('/login');
    } catch (err) {
      setError('Error al registrar. Por favor, inténtalo de nuevo.');
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = 'http://localhost:3001/auth/google';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-3">
              Registrarse
            </h1>
            <p className="text-gray-400 text-lg">
              Crea una nueva cuenta para comenzar
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Nombre de usuario
                </label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  required 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Correo electrónico
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirmar contraseña
                </label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  required 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Registrarse
              </button>
            </form>
            
            <div className="mt-6 flex items-center justify-center">
              <span className="bg-gray-800 px-2 text-sm text-gray-400">O</span>
            </div>
            
            <button 
              onClick={handleGoogleRegister}
              className="mt-6 w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-md"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google logo" className="w-5 h-5" />
              <span>Registrarse con Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;