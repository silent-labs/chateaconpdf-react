import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Profile from './components/Profile';
import Suscripciones from './components/Suscripciones';
import Success from './components/Success';
// Importa otros componentes necesarios

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/suscripciones" element={<Suscripciones />} />
        <Route path="/success" element={<Success />} />
        {/* Agrega otras rutas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
