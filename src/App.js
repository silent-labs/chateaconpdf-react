import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Preguntas from './components/preguntas';
import ChatPDF from './components/chatpdf';
import Register from './components/register';
import ProtectedRoute from './components/ProtectedRoute';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
