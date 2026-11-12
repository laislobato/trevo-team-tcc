/**
 * PÁGINA: Games (página inicial dos jogos)
 * ========================================
 * Rota /jogo. Mostra todos os jogos da Trevo Team.
 * A página de cada jogo é o modelo em /jogo/<slug> (pages/GamePage.jsx).
 *
 * Estrutura (de cima para baixo):
 *   Bloco ciano
 *   ├─ Header (versão "flat", sem fundo próprio)
 *   └─ Hero (carrossel de banners, o mesmo da Home)
 *   GameShowcase -> vitrine: personagem de cada jogo; o jogo em foco abre a descrição
 *   GameReviews  -> comentários de jogadores passando, com usuário e plataforma
 *   Footer
 *
 * Os jogos e os comentários vêm de src/services/games.js (hoje uma lista
 * local em src/data/games.js; no futuro, o painel). Os banners ficam em
 * src/data/games.js.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import Hero from '../components/Home/Hero'
import GameShowcase from '../components/shared/GameShowcase'
import GameReviews from '../components/GamesHome/GameReviews'
import { gameBanners } from '../data/games'
import { getGames, getReviews } from '../services/games'
import '../styles/globals.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function Games() {
  const [games, setGames] = useState([])
  const [reviews, setReviews] = useState([])

  // Busca os jogos e os comentários quando a página abre
  useEffect(() => {
    let active = true
    document.title = 'Jogos | Trevo Team'
    Promise.all([getGames(), getReviews()])
      .then(([gameList, reviewList]) => {
        if (!active) return
        setGames(gameList)
        setReviews(reviewList)
      })
      .catch(() => {
        // Se falhar, a página continua aparecendo, só sem a vitrine e os comentários
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="app-container">
      {/* ========== BLOCO CIANO: CABEÇALHO + BANNERS ========== */}
      <div className="home-top">
        <Header flat />
        <Hero banners={gameBanners} label="Jogos em destaque" />
      </div>

      {/* ========== VITRINE DE JOGOS ========== */}
      <GameShowcase title="CONHEÇA NOSSOS JOGOS" games={games} />

      {/* ========== COMENTÁRIOS ========== */}
      {reviews.length > 0 && <GameReviews title="O QUE OS JOGADORES DIZEM" reviews={reviews} />}

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}