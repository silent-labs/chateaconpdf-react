import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuSidebar from './menu-sidebar';

function Dashboard() {
  const [archivo, setArchivo] = useState(null);
  const [numPreguntas, setNumPreguntas] = useState(5);
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (archivo) {
      setProgreso(0);
    }
  }, [archivo]);

  const manejarCambioArchivo = (evento) => {
    const archivoSeleccionado = evento.target.files[0];
    setArchivo(archivoSeleccionado);
    setProgreso(0);
  };

  const manejarCambioNumPreguntas = (evento) => {
    setNumPreguntas(Number(evento.target.value));
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
        onUploadProgress: (event) => {
          if (event.lengthComputable) {
            const porcentajeProgreso = Math.round((event.loaded * 100) / event.total);
            setProgreso(porcentajeProgreso);
          }
        },
      });

      setProgreso(70);

      if (!respuesta.ok) {
        throw new Error('Error al procesar el PDF');
      }

      const datos = await respuesta.json();
      const preguntasArray = Array.isArray(datos.preguntas) ? datos.preguntas : [];

      // Asegúrate de que solo se pasen el número de preguntas especificado
      const preguntasLimitadas = preguntasArray.slice(0, numPreguntas);

      setProgreso(100);
      navigate('/preguntas', { state: { preguntas: preguntasLimitadas } });
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
      setProgreso(0);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <MenuSidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Dashboard</h1>
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md mx-auto">
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
                  {archivo ? `${archivo.name} (${(archivo.size / 1024).toFixed(2)} KB)` : 'Seleccionar archivo PDF'}
                </label>
              </div>
              {archivo && (
                <p className="text-sm text-gray-400 mt-2">Archivo seleccionado: {archivo.name} ({(archivo.size / 1024).toFixed(2)} KB)</p>
              )}
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
                disabled={cargando}
              />
            </div>
            {cargando && (
              <div className="w-full bg-gray-700 rounded-md overflow-hidden h-4 mb-4">
                <div
                  className="bg-blue-600 h-full text-center text-xs font-medium text-white leading-none"
                  style={{ width: `${progreso}%` }}
                >{`${progreso}%`}</div>
              </div>
            )}
            <button
              onClick={generarPreguntas}
              type="button"
              disabled={cargando}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </div>
              ) : (
                'Generar Preguntas'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;