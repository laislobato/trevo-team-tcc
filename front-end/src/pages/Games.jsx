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
 * Os jogos e os comentários vêm de src/services/games.js:
 * - jogos: da API (cadastrados pelo painel);
 * - comentários: lista fixa em src/data/games.js.
 * Os banners do topo são montados com os jogos: cada jogo publicado vira
 * um banner (imagem "banner" do jogo) que leva para a página dele.
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
import { getGames, getReviews } from '../services/games'
import '../styles/globals.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

// Banner usado enquanto os jogos carregam (ou se não houver nenhum)
const PLACEHOLDER_BANNERS = [{ image: '', alt: 'Jogos da Trevo Team', link: '' }]

export default function Games() {
  const [games, setGames] = useState([])
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

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

  // Cada jogo vira um banner que leva para a página dele
  const banners = games.length
    ? games.map((game) => ({ image: game.banner, alt: game.title, link: `/jogo/${game.slug}` }))
    : PLACEHOLDER_BANNERS

  return (
    <div className="app-container">
      {/* ========== BLOCO CIANO: CABEÇALHO + BANNERS ========== */}
      <div className="home-top">
        <Header flat />
        <Hero banners={banners} label="Jogos em destaque" />
      </div>

      {/* ========== VITRINE DE JOGOS ========== */}
      <GameShowcase title="CONHEÇA NOSSOS JOGOS" games={games} />
      {error && (
        <p className="games-load-error" role="alert">
          Os jogos não carregaram. {error}
        </p>
      )}

      {/* ========== COMENTÁRIOS ========== */}
      {reviews.length > 0 && <GameReviews title="O QUE OS JOGADORES DIZEM" reviews={reviews} />}

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}