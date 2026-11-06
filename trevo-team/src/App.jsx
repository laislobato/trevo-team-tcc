/**
 * ARQUIVO: App.jsx
 * ================
 * Define as rotas (qual página aparece para cada endereço).
 *
 * Rotas:
 * - /         -> Home (Início)
 * - /jogo     -> Games (página de um jogo)
 * - /sobre    -> About
 * - /contato  -> Contact
 * - qualquer outro endereço -> volta para a Home
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'

// Ajuste estes caminhos se os arquivos estiverem em outra pasta
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Games from './pages/Games'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogo" element={<Games />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />

        {/* Qualquer rota desconhecida volta para a Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}