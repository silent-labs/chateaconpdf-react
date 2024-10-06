import React from 'react';
import MenuSidebar from './menu-sidebar';

function Suscripciones() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <MenuSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Planes de Suscripción</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Plan Gratuito */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 border-2 border-blue-500 transform hover:scale-105 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Plan Gratuito</h2>
              <ul className="text-gray-300 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Acceso básico a la plataforma</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> 50 mensajes diarios en Chat con PDF</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> 10 usos diarios en Dashboard</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Soporte por correo electrónico</li>
              </ul>
              <button 
                className="w-full py-3 px-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold"
              >
                Plan Actual
              </button>
            </div>

            {/* Plan de Pago */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 border-2 border-purple-500 transform hover:scale-105 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Plan Premium</h2>
              <ul className="text-gray-300 mb-6 space-y-2">
                <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> Acceso completo a todas las funciones</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> 150 mensajes diarios en Chat con PDF</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> 30 usos diarios en Dashboard</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> Soporte prioritario 24/7</li>
                <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span> Funciones exclusivas</li>
              </ul>
              <p className="text-white mb-4 text-center font-bold text-xl">20€<span className="text-sm font-normal">/mes</span></p>
              <button 
                className="w-full py-3 px-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300 font-semibold"
              >
                Seleccionar Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suscripciones;