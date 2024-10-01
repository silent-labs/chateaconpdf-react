import React, { useState } from 'react';

function Dashboard() {
  const [archivo, setArchivo] = useState(null);
  const [numPreguntas, setNumPreguntas] = useState(5);
  const [preguntas, setPreguntas] = useState([]);

  const manejarCambioArchivo = (evento) => {
    setArchivo(evento.target.files[0]);
  };

  const manejarCambioNumPreguntas = (evento) => {
    setNumPreguntas(evento.target.value);
  };

  const generarPreguntas = async () => {
    // Aquí iría la lógica para enviar el archivo a la IA y generar preguntas
    // Por ahora, simularemos la generación de preguntas
    const preguntasGeneradas = Array(parseInt(numPreguntas)).fill().map((_, i) => `Pregunta ${i + 1}`);
    setPreguntas(preguntasGeneradas);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Dashboard</h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="archivo" className="block text-sm font-medium text-gray-300 mb-2">
              Subir archivo PDF:
            </label>
            <div className="relative">
              <input
                type="file"
                id="archivo"
                accept=".pdf"
                onChange={manejarCambioArchivo}
                className="hidden"
              />
              <label
                htmlFor="archivo"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {archivo ? archivo.name : 'Seleccionar archivo PDF'}
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="numPreguntas" className="block text-sm font-medium text-gray-300 mb-2">
              Número de preguntas a generar:
            </label>
            <input
              type="number"
              id="numPreguntas"
              value={numPreguntas}
              onChange={manejarCambioNumPreguntas}
              min="1"
              max="20"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={generarPreguntas}
            type="button"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Generar Preguntas
          </button>
        </form>
        {preguntas.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-blue-400">Preguntas generadas:</h2>
            <ul className="list-disc pl-5 text-gray-300">
              {preguntas.map((pregunta, index) => (
                <li key={index}>{pregunta}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;