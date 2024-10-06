import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Success() {
  const navigate = useNavigate();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3002/verify-subscription', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al verificar la suscripción');
        }

        const data = await response.json();
        if (data.success) {
          setSubscriptionInfo(data.subscription);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudo verificar la suscripción');
      }
    };

    verifySubscription();

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
        {subscriptionInfo && (
          <div className="text-left mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Detalles de la suscripción:</h3>
            <p className="text-gray-300">Tipo: {subscriptionInfo.tipo}</p>
            <p className="text-gray-300">Estado: {subscriptionInfo.estado}</p>
            <p className="text-gray-300">Fecha de inicio: {new Date(subscriptionInfo.fechaInicio).toLocaleDateString()}</p>
            <p className="text-gray-300">Periodo de facturación: {subscriptionInfo.periodoFacturacion}</p>
            <p className="text-gray-300">Monto: {subscriptionInfo.monto} {subscriptionInfo.moneda}</p>
          </div>
        )}
        {error && (
          <p className="text-red-500 mb-6">{error}</p>
        )}
        <p className="text-gray-400">
          Serás redirigido a tu perfil en 5 segundos...
        </p>
      </div>
    </div>
  );
}

export default Success;