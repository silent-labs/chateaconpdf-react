import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold">Mi App</div>
          <div>
            <Link to="/login" className="text-gray-300 hover:text-white mr-4">Iniciar sesión</Link>
            <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Registrarse</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8">
            <span className="block">Bienvenido a nuestra plataforma de</span>
            <span className="block text-blue-500">Inteligencia Artificial</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Genera preguntas automáticamente y chatea con tus documentos PDF
          </p>
          <div className="space-x-4">
            <Link to="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
              Ir al Dashboard
            </Link>
            <Link to="/chatpdf" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
              Probar Chat PDF
            </Link>
          </div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Generador de Preguntas"
            description="Sube un PDF y genera preguntas automáticamente basadas en su contenido."
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <FeatureCard
            title="Chat con PDF"
            description="Interactúa con tus documentos PDF a través de un chat inteligente."
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
          />
          <FeatureCard
            title="Análisis de Documentos"
            description="Obtén insights valiosos de tus documentos de forma rápida y eficiente."
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
        </div>
      </section>

      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2023 Mi App. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center">
      <div className="text-blue-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default Home;
