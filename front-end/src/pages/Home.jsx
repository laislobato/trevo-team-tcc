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
import Footer from '../components/shared/Footer'
import { useEffect, useState } from 'react'
import GameShowcase from '../components/shared/GameShowcase'
import GameReviews from '../components/GamesHome/GameReviews'
import { getGames, getReviews } from '../services/games'
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

  const [reviews, setReviews] = useState([])

  // Busca os jogos e os comentários quando a página abre
  useEffect(() => {
    let active = true
    document.title = 'Jogos | Trevo Team'

    getReviews().then((list) => active && setReviews(list))
    getGames()
      .then((list) => active && setGames(list))
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
        <Hero page="home" />
      </div>

      <Testimonials />
      
      {/* <Projects/> */}
      
      <GameShowcase variant="home" title="Nossos Projetos" games={games} />
      
      
      {reviews.length > 0 && <GameReviews title="O QUE OS JOGADORES DIZEM" reviews={reviews} />}
      <Footer />

    </div>
  )
}