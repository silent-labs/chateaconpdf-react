import React from 'react';

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className='text-3xl font-bold text-blue-400 mb-6 text-center'>Iniciar sesión</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Correo electrónico:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Iniciar sesión
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400">O</p>
        </div>
        
        <button 
          className="mt-4 w-full py-2 px-4 bg-white hover:bg-gray-100 rounded-md text-gray-800 font-semibold transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google logo" className="w-5 h-5 mr-2" />
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}

export default Login;