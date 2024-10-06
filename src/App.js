import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Profile from './components/Profile';
import Dashboard from './components/dashboard';
import Preguntas from './components/preguntas';
import ChatPDF from './components/chatpdf';
import ProtectedRoute from './components/ProtectedRoute';
import Suscripciones from './components/Suscripciones';
import Success from './components/Success';
import './index.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<h1>Página de inicio</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/preguntas" 
            element={
              <ProtectedRoute>
                <Preguntas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chatpdf" 
            element={
              <ProtectedRoute>
                <ChatPDF />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/suscripcion" 
            element={
              <ProtectedRoute>
                <Suscripciones />
              </ProtectedRoute>
            } 
          />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
