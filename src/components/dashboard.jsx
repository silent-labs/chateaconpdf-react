import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuSidebar from './menu-sidebar';

function Dashboard() {
  const [archivo, setArchivo] = useState(null);
  const [numPreguntas, setNumPreguntas] = useState(5);
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3002/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token inválido');
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    verificarToken();
  }, [navigate]);

  useEffect(() => {
    if (archivo) {
      setProgreso(0);
    }
  }, [archivo]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setArchivo(droppedFile);
    } else {
      alert('Por favor, arrastra solo archivos PDF.');
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const manejarCambioArchivo = (evento) => {
    const archivoSeleccionado = evento.target.files[0];
    if (archivoSeleccionado && archivoSeleccionado.type === 'application/pdf') {
      setArchivo(archivoSeleccionado);
    } else {
      alert('Por favor, selecciona un archivo PDF.');
      evento.target.value = null;
    }
  };

  const manejarCambioNumPreguntas = (evento) => {
    const nuevoValor = Number(evento.target.value);
    setNumPreguntas(Math.min(20, Math.max(1, nuevoValor)));
  };

  const generarPreguntas = async () => {
    if (!archivo) {
      alert('Por favor, selecciona un archivo PDF primero.');
      return;
    }

    setCargando(true);
    setProgreso(10);

    const formData = new FormData();
    formData.append('pdf', archivo);
    formData.append('numPreguntas', numPreguntas);

    try {
      const respuesta = await fetch('http://localhost:3002/extractpdf', {
        method: 'POST',
        body: formData,
      });

      if (!respuesta.ok) {
        throw new Error('Error al procesar el PDF');
      }

      setProgreso(70);

      const datos = await respuesta.json();
      const preguntasArray = Array.isArray(datos.preguntas) ? datos.preguntas : [];

      if (preguntasArray.length === 0) {
        throw new Error('No se pudieron generar preguntas a partir del PDF.');
      }

      setProgreso(100);
      navigate('/preguntas', { state: { preguntas: preguntasArray } });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
      setProgreso(0);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <MenuSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-3">
              Generador de Preguntas
            </h1>
            <p className="text-gray-400 text-lg">
              Sube un PDF y genera preguntas automáticamente
            </p>
          </div>
          
          {/* Main Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <form className="space-y-8">
              {/* File Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Archivo PDF
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
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex items-center justify-center px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : archivo 
                          ? 'border-teal-500/50 bg-teal-500/10' 
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {archivo ? (
                        <>
                          <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <div className="text-sm text-gray-300">
                            {archivo.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {(archivo.size / 1024).toFixed(2)} KB
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setArchivo(null);
                            }}
                            className="mt-2 text-sm text-red-400 hover:text-red-300"
                          >
                            Eliminar archivo
                          </button>
                        </>
                      ) : (
                        <>
                          <svg className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <div className="text-sm font-medium text-gray-300">
                            {isDragging ? 'Suelta el archivo aquí' : 'Arrastra un PDF o haz clic para seleccionar'}
                          </div>
                          <div className="text-xs text-gray-400">
                            Solo archivos PDF
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Number of Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    Número de preguntas
                  </label>
                  <div className="group relative">
                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="absolute bottom-full mb-2 right-0 w-32 bg-gray-700 text-xs text-gray-300 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Máximo 20 preguntas
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={numPreguntas}
                  onChange={manejarCambioNumPreguntas}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>1</span>
                  <span className="text-teal-400 font-medium">{numPreguntas}</span>
                  <span>20</span>
                </div>
              </div>

              {/* Progress Bar */}
              {cargando && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progreso}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-400">
                    Generando preguntas... {progreso}%
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generarPreguntas}
                disabled={!archivo || cargando}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {cargando ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </div>
                ) : 'Generar Preguntas'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;