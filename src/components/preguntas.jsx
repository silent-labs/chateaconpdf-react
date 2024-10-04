import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuSidebar from './menu-sidebar';

function Preguntas() {
  const location = useLocation();
  const { preguntas = [] } = location.state || {}; // Accede a las preguntas desde el estado de React Router
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({}); // Estado para almacenar las respuestas seleccionadas
  const [puntuacion, setPuntuacion] = useState(null);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState([]); // Estado para almacenar las respuestas correctas/incorrectas

  // Manejar la selección de respuestas
  const manejarSeleccionRespuesta = (preguntaIndex, opcion) => {
    setRespuestasSeleccionadas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaIndex]: opcion,
    }));
  };

  // Calcular la puntuación final
  const calcularPuntuacion = () => {
    let aciertos = 0;
    const correctas = [];

    preguntas.forEach((pregunta, index) => {
      if (pregunta.opciones) {
        // Pregunta con opciones (como de opción múltiple o verdadero/falso)
        if (respuestasSeleccionadas[index]?.trim().toLowerCase() === pregunta.respuesta_correcta.trim().toLowerCase()) {
          aciertos++;
          correctas[index] = true;
        } else {
          correctas[index] = false;
        }
      } else {
        // Pregunta abierta: evalúa si la respuesta es correcta
        correctas[index] = respuestasSeleccionadas[index]?.trim().toLowerCase() === pregunta.respuesta?.trim().toLowerCase();
        if (correctas[index]) {
          aciertos++;
        }
      }
    });

    const puntuacionFinal = (aciertos / preguntas.length) * 100;
    setPuntuacion(puntuacionFinal.toFixed(2));
    setRespuestasCorrectas(correctas);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <MenuSidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Examen de Preguntas Generadas</h1>
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          {preguntas.length > 0 ? (
            <>
              {preguntas.map((pregunta, index) => (
                <div key={index} className="mb-6">
                  <p className="text-lg font-medium text-white mb-2">{pregunta.pregunta}</p>
                  <div className="space-y-2">
                    {pregunta.opciones ? (
                      pregunta.opciones.map((opcion, opcionIndex) => (
                        <label key={opcionIndex} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`pregunta-${index}`}
                            value={opcion}
                            onChange={() => manejarSeleccionRespuesta(index, opcion)}
                            checked={respuestasSeleccionadas[index] === opcion}
                            className="form-radio text-blue-600"
                          />
                          <span className="text-gray-300">{opcion}</span>
                        </label>
                      ))
                    ) : (
                      <input
                        type="text"
                        placeholder="Escribe tu respuesta"
                        onChange={(e) => manejarSeleccionRespuesta(index, e.target.value)}
                        value={respuestasSeleccionadas[index] || ''}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                  {respuestasCorrectas.length > 0 && (
                    <p className={`mt-2 text-sm font-semibold ${respuestasCorrectas[index] ? 'text-green-500' : 'text-red-500'}`}>
                      {respuestasCorrectas[index] ? 'Respuesta correcta' : `Respuesta incorrecta. La correcta es: ${pregunta.respuesta_correcta || pregunta.respuesta}`}
                    </p>
                  )}
                </div>
              ))}
              <button
                onClick={calcularPuntuacion}
                className="mt-6 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105"
              >
                Enviar respuestas
              </button>
              {puntuacion !== null && (
                <div className="mt-6 text-center">
                  <p className="text-xl font-bold text-blue-400">Tu puntuación: {puntuacion}%</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-300">No hay preguntas disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Preguntas;