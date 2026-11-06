/**
 * ARQUIVO: App.jsx
 * ================
 * Componente principal da aplicação
 * 
 * Responsabilidades:
 * - Importar e renderizar todos os componentes
 * - Estrutura geral da página
 * - Importar estilos globais
 * 
 * Estrutura:
 *   Header
 *   └─ Hero
 *   └─ Services
 *   └─ [Divider]
 *   └─ Projects
 *   └─ Footer (futuro)
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import '../styles/globals.css'
import Header from '../components/shared/Header'
import Hero from '../components/Home/Hero'
import Projects from '../components/Home/Projects'
import Testimonials from '../components/Home/Testimonials'
import Newsletter from '../components/shared/Newsletter'
import Footer from '../components/shared/Footer'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function App() {
  return (
    <div className="app-container">
      {/* Cabeçalho com navegação */}
      <Header />

      {/* Seção principal com frases e CTA */}
      <Hero />

      <Testimonials />
      
      <Projects/>
      
      <div className="section-divider"></div>
      
      <Newsletter />
      <Footer />

    </div>
  )
}