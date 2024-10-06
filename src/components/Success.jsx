import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/profile');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 items-center justify-center">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 max-w-md w-full text-center">
        <svg className="mx-auto h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-3xl font-bold text-white mb-4">¡Pago exitoso!</h2>
        <p className="text-gray-300 mb-6">
          Gracias por tu suscripción. Tu pago ha sido procesado correctamente.
        </p>
        <p className="text-gray-400">
          Serás redirigido a tu perfil en 5 segundos...
        </p>
      </div>
    </div>
  );
}

export default Success;