/**
 * PÁGINA: GamesHome (página inicial dos jogos)
 * ============================================
 * Rota /jogos. Mostra todos os jogos da Trevo Team.
 * A página de cada jogo continua sendo o modelo em /jogo (pages/Games.jsx).
 *
 * Estrutura (de cima para baixo):
 *   Bloco ciano
 *   ├─ Header (versão "flat", sem fundo próprio)
 *   └─ Hero (carrossel de banners, o mesmo da Home)
 *   GameShowcase -> vitrine: personagem de cada jogo; o jogo em foco abre a descrição
 *   GameReviews  -> comentários de jogadores passando, com usuário e plataforma
 *   Footer
 *
 * Os dados (banners, jogos e comentários) ficam em src/data/games.js.
 */

import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import Hero from '../components/Home/Hero'
import GameShowcase from '../components/GamesHome/GameShowcase'
import GameReviews from '../components/GamesHome/GameReviews'
import { gameBanners, games, reviews } from '../data/games'
import '../styles/globals.css'

export default function GamesHome() {
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
      <GameReviews title="O QUE OS JOGADORES DIZEM" reviews={reviews} />

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}
