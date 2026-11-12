/**
 * ARQUIVO: main.jsx
 * =================
 * Ponto de entrada da aplicação React
 * 
 * Responsabilidades:
 * - Renderizar o App.jsx
 * - Montar no elemento #root do HTML
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Monta a aplicação no elemento com id 'root' do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)