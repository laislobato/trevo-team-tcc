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
import { useEffect, useState } from 'react'
import GameShowcase from '../components/shared/GameShowcase'
import { getGames } from '../services/games'
import '../styles/globals.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function App() {

    // ===============================================
  // JOGOS DA VITRINE (vêm da API)
  // ===============================================
  const [games, setGames] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getGames()
      .then((list) => active && setGames(list))
      .catch(() => {}) // se a API falhar, a Home abre normal, só sem a vitrine
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [])

  
  
  return (
    <div className="app-container">
      {/* Bloco ciano: cabeçalho (sem fundo próprio) + carrossel de banners */}
      <div className="home-top">
        <Header flat />
        <Hero />
      </div>

      <Testimonials />
      
      {/* <Projects/> */}
      
      <GameShowcase title="Nossos Projetos" games={games} />
      
      <div className="section-divider"></div>
      
      <Newsletter />
      <Footer />

    </div>
  )
}