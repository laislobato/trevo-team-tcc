/**
 * PÁGINA: Home (Início)
 * ======================
 * Página inicial, na rota /.
 *
 * Estrutura:
 *   Bloco ciano
 *   ├─ Header (versão "flat", sem fundo próprio)
 *   └─ Hero (carrossel de banners)
 *   Testimonials
 *   Projects
 *   [Divisor]
 *   Newsletter
 *   Footer
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
      {/* Bloco ciano: cabeçalho (sem fundo próprio) + carrossel de banners */}
      <div className="home-top">
        <Header flat />
        <Hero />
      </div>

      <Testimonials />
      
      <Projects/>
      
      <div className="section-divider"></div>
      
      <Newsletter />
      <Footer />

    </div>
  )
}