import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Preguntas from './components/preguntas';
import ChatPDF from './components/chatpdf';
import './index.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<h1>Página de inicio</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preguntas" element={<Preguntas />} />
          <Route path="/chatpdf" element={<ChatPDF />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
