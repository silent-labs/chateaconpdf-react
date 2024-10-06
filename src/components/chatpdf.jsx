import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, TextField, Button, CircularProgress } from '@material-ui/core';
import { CloudUpload as CloudUploadIcon, Send as SendIcon, FileCopy as FileCopyIcon } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ChatPDF() {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [contextoPDF, setContextoPDF] = useState(null);
  const navigate = useNavigate();

  const manejarCambioArchivo = (evento) => {
    const archivoSeleccionado = evento.target.files[0];
    setArchivo(archivoSeleccionado);
  };

  const manejarCambioMensaje = (evento) => {
    setMensaje(evento.target.value);
  };

  const enviarMensaje = async () => {
    if (mensaje.trim() === '') {
      return;
    }

    const nuevoMensaje = { tipo: 'user', texto: mensaje };
    setMensajes([...mensajes, nuevoMensaje]);
    setMensaje('');

    setCargando(true);
    try {
      const respuesta = await fetch('http://localhost:3002/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensaje, contexto: contextoPDF }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al procesar el mensaje');
      }

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
  
      if (!respuesta.ok) {
        throw new Error('Error al procesar el PDF');
      }
  
      const datos = await respuesta.json();
      setContextoPDF(datos.texto); // Guardar el contexto del PDF
      const mensajeBot = { tipo: 'bot', texto: 'El PDF ha sido procesado. Ahora puedes hacer preguntas sobre el contenido.' };
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
      () => {
        // Opcional: Mostrar una notificación de éxito
        alert('Código copiado al portapapeles');
      },
      (err) => {
        console.error('Error al copiar el texto: ', err);
      }
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Chat con el Bot</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex-1 overflow-auto mb-4">
        {mensajes.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-4 rounded-md ${
              msg.tipo === 'user' 
                ? 'bg-blue-600 text-white ml-auto max-w-[70%]' 
                : 'bg-gray-700 text-gray-200 mr-auto max-w-[70%]'
            }`}
          >
            <div className="flex items-start">
              {msg.tipo === 'user' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A5 5 0 018 16h8a5 5 0 012.879.804M15 12a3 3 0 10-6 0m-2 8h10a2 2 0 002-2v-5a7 7 0 10-14 0v5a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2h.01c1.104 0 2-.895 2-2V4.414c0-.89-1.077-1.337-1.707-.707L12 5.707 9.707 3.707C9.077 3.077 8 3.524 8 4.414V7c0 1.105-.896 2-2 2H7c-1.104 0-2 .896-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2c0-1.104-.896-2-2-2h-5z" />
                </svg>
              )}
              <div className="flex-grow overflow-hidden">
                <ReactMarkdown
                  children={msg.texto}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="mt-2 overflow-x-auto relative">
                          <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={materialDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          />
                          <button
                            onClick={() => copiarAlPortapapeles(String(children))}
                            className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-700 text-white p-1 rounded"
                          >
                            <FileCopyIcon fontSize="small" />
                          </button>
                        </div>
                      ) : (
                        <code className={`${className} bg-gray-800 rounded px-1 py-0.5`} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        {cargando && (
          <div className="flex justify-center items-center mt-4">
            <CircularProgress color="primary" />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="file"
          id="archivo"
          accept=".pdf"
          onChange={manejarCambioArchivo}
          className="hidden"
        />
        <label htmlFor="archivo">
          <Button
            variant="contained"
            color="default"
            startIcon={<CloudUploadIcon />}
            component="span"
          >
            {archivo ? archivo.name : 'Subir PDF'}
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={enviarPDF}
          disabled={cargando || !archivo}
        >
          Enviar PDF
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <TextField
          variant="outlined"
          fullWidth
          value={mensaje}
          onChange={manejarCambioMensaje}
          placeholder="Escribe tu mensaje..."
          disabled={cargando}
          InputProps={{
            style: {
              backgroundColor: '#2d3748',
              color: '#e2e8f0',
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={enviarMensaje}
          disabled={cargando || mensaje.trim() === ''}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}

export default ChatPDF;