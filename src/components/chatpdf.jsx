import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MenuSidebar from './menu-sidebar';

function ChatPDF() {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [contextoPDF, setContextoPDF] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const manejarCambioArchivo = (evento) => {
    const archivoSeleccionado = evento.target.files[0];
    if (archivoSeleccionado && archivoSeleccionado.type === 'application/pdf') {
      setArchivo(archivoSeleccionado);
    } else {
      alert('Por favor, selecciona un archivo PDF.');
    }
  };

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

  const manejarCambioMensaje = (evento) => {
    const nuevoMensaje = evento.target.value.slice(0, 4000);
    setMensaje(nuevoMensaje);
  };

  const enviarMensaje = async () => {
    if (mensaje.trim() === '') return;

    const nuevoMensaje = { tipo: 'user', texto: mensaje };
    setMensajes([...mensajes, nuevoMensaje]);
    setMensaje('');

    setCargando(true);
    try {
      const respuesta = await fetch('http://localhost:3002/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, contexto: contextoPDF }),
      });

      if (!respuesta.ok) throw new Error('Error al procesar el mensaje');

      const datos = await respuesta.json();
      const mensajeBot = { tipo: 'bot', texto: datos.respuesta };
      setMensajes((prevMensajes) => [...prevMensajes, mensajeBot]);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const enviarPDF = async () => {
    if (!archivo) {
      alert('Por favor, selecciona un archivo PDF primero.');
      return;
    }
  
    setCargando(true);
    const formData = new FormData();
    formData.append('pdf', archivo);
  
    try {
      const respuesta = await fetch('http://localhost:3002/extractpdf', {
        method: 'POST',
        body: formData,
      });
  
      if (!respuesta.ok) throw new Error('Error al procesar el PDF');
  
      const datos = await respuesta.json();
      setContextoPDF(datos.texto);
      const mensajeBot = { 
        tipo: 'bot', 
        texto: 'El PDF ha sido procesado correctamente. ¿Qué te gustaría saber sobre su contenido?' 
      };
      setMensajes((prevMensajes) => [...prevMensajes, mensajeBot]);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const copiarAlPortapapeles = useCallback((texto) => {
    navigator.clipboard.writeText(texto).then(
      () => alert('Código copiado al portapapeles'),
      (err) => console.error('Error al copiar el texto: ', err)
    );
  }, []);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  useEffect(() => {
    let recognition;
    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setMensaje(transcript.slice(0, 4000));
      };

      if (isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <MenuSidebar />
      <div className="flex-1 flex flex-col max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-8 text-center">
          Chat con tu PDF
        </h1>
        
        <div className="flex-1 flex flex-col space-y-4">
          {/* PDF Upload Section */}
          {!contextoPDF && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
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
                className={`flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : archivo 
                      ? 'border-teal-500/50 bg-teal-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <svg className={`w-12 h-12 mb-3 ${isDragging ? 'text-blue-400' : archivo ? 'text-teal-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-lg font-medium text-gray-300 mb-2">
                  {archivo ? archivo.name : isDragging ? 'Suelta el archivo aquí' : 'Arrastra un PDF o haz clic para seleccionar'}
                </div>
                <p className="text-sm text-gray-400">Solo archivos PDF</p>
              </label>
              {archivo && (
                <button
                  onClick={enviarPDF}
                  disabled={cargando}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-teal-600"
                >
                  {cargando ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando PDF...
                    </div>
                  ) : 'Procesar PDF'}
                </button>
              )}
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 overflow-y-auto">
            <div className="space-y-4">
              {mensajes.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.tipo === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-200'
                  }`}>
                    <div className="flex items-start">
                      {msg.tipo === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-grow prose prose-invert max-w-none">
                        <ReactMarkdown
                          children={msg.texto}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <div className="relative mt-4">
                                  <div className="absolute top-0 right-0 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-bl">
                                    {match[1]}
                                  </div>
                                  <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={materialDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  />
                                  <button
                                    onClick={() => copiarAlPortapapeles(String(children))}
                                    className="absolute top-8 right-2 text-gray-400 hover:text-white transition-colors duration-200"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {cargando && (
                <div className="flex justify-center">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          {contextoPDF && (
            <div className="relative flex items-center">
              <input
                type="text"
                value={mensaje}
                onChange={manejarCambioMensaje}
                placeholder="Escribe tu pregunta sobre el PDF..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                disabled={cargando}
                onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                maxLength={4000}
              />
              <button
                onClick={toggleListening}
                className={`absolute right-14 p-2 ${isListening ? 'text-red-400' : 'text-blue-400'} hover:text-blue-300 transition-colors duration-200`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button
                onClick={enviarMensaje}
                disabled={cargando || mensaje.trim() === ''}
                className="absolute right-2 p-2 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          )}

          {/* Nuevo input para escribir mensaje con el chatbot */}
          <div className="relative flex items-center mt-4">
            <input
              type="text"
              value={mensaje}
              onChange={manejarCambioMensaje}
              placeholder="Escribe tu mensaje para el chatbot..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              disabled={cargando}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
              maxLength={4000}
            />
            <button
              onClick={enviarMensaje}
              disabled={cargando || mensaje.trim() === ''}
              className="absolute right-2 p-2 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPDF;