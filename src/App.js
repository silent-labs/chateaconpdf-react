import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Preguntas from './components/preguntas';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
