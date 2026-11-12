/**
 * PÁGINA: GamePage (página de UM jogo)
 * ====================================
 * (a página inicial dos jogos, com a vitrine, é a pages/Games.jsx)
 * Modelo (template) usado por todos os jogos, na rota /jogo/:slug.
 *   ex.: /jogo/raizes-de-vidro, /jogo/mare-alta, /jogo/lumen-drift
 *
 * A página lê o slug do endereço e pede os dados do jogo para
 * src/services/games.js, que busca na API (jogos cadastrados pelo painel).
 *
 * Estrutura (de cima para baixo):
 * - Header
 * - GameHero        -> barra colorida com estrela, título, texto e informações
 * - GameCards       -> três imagens, o card do meio com a frase acima
 * - Sobre o jogo    -> bloco de texto centralizado
 * - GameCharacters  -> personagens (silhueta ou imagem + caixa cinza)
 * - GameShowcase    -> "OUTROS PROJETOS": a mesma vitrine da página /jogo,
 *                      com todos os jogos menos o que está aberto
 * - Footer
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/shared/Header'
import GameHero from '../components/Games/Gamehero'
import GameCards from '../components/Games/GameCards'
import GameCharacters from '../components/Games/GameCharacters'
import GameShowcase from '../components/shared/GameShowcase'
import Footer from '../components/shared/Footer'
import { getGame, getGames } from '../services/games'
import '../styles/globals.css'
import '../components/Games/css/Games.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function GamePage() {
  const { slug } = useParams() // lê o slug do endereço (/jogo/<slug>)
  const [data, setData] = useState(null) // { game }
  const [otherGames, setOtherGames] = useState([]) // vitrine "Outros projetos"
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'notfound' | 'error'
  const [error, setError] = useState('')

  // ---------- Busca o jogo sempre que o slug muda ----------
  // (ex.: clicar em "Ver mais" na vitrine de "Outros projetos")
  useEffect(() => {
    let active = true
    setStatus('loading')
    window.scrollTo(0, 0)

    // Vitrine: todos os jogos publicados, menos o que está aberto.
    // Se falhar, a página abre normal, só sem a vitrine.
    getGames()
      .then((list) => active && setOtherGames(list.filter((g) => g.slug !== slug)))
      .catch(() => active && setOtherGames([]))

    getGame(slug)
      .then((result) => {
        if (!active) return
        setData(result)
        setStatus('ready')
        document.title = `${result.game.title} | Trevo Team`
      })
      .catch((err) => {
        if (!active) return
        setError(err.message)
        setStatus(err.status === 404 ? 'notfound' : 'error')
      })
    return () => {
      active = false
    }
  }, [slug])

  // ---------- Carregando, não encontrado ou erro ----------
  if (status !== 'ready') {
    const messages = {
      loading: { title: 'Carregando...', text: '' },
      notfound: { title: 'Jogo não encontrado', text: 'O endereço pode estar errado ou o jogo foi removido.' },
      error: { title: 'Não foi possível abrir o jogo', text: error },
    }
    const { title, text } = messages[status]
    return (
      <div className="games-page">
        <Header />
        <section className="games-status" aria-live="polite">
          <h2>{title}</h2>
          {text && <p>{text}</p>}
          {status !== 'loading' && <Link to="/jogo">Ver todos os jogos</Link>}
        </section>
        <Footer />
      </div>
    )
  }

  // ---------- Monta as seções com os dados do jogo ----------
  const { game } = data

  // Quadro de informações do topo (2 colunas)
  const gameInfo = [
    { label: 'Genre', value: game.genre },
    { label: 'Rating', value: game.rating },
    { label: 'Theme', value: game.theme },
    { label: 'Platform', value: game.platforms.join(', ') },
  ]

  // 3 imagens (vazias = bloco cinza)
  const screenshots = [0, 1, 2].map((i) => ({ id: i, src: game.screenshots?.[i] || '' }))

  // Personagens
  const characters = game.characters.map((character, i) => ({ id: i, ...character }))

  return (
    <div className="games-page">
      {/* ========== CABEÇALHO ========== */}
      <Header />

      {/* ========== HERO DO JOGO ========== */}
      <GameHero
        title={game.title}
        subtitle={game.subtitle}
        text={game.description}
        info={gameInfo}
        color={game.color}
        art={game.art}
        artAlt={game.character}
        backTo="/jogo"
        backLabel="Todos os jogos"
      />

      {/* ========== IMAGENS COM FRASE ========== */}
      <GameCards quote={game.quote} items={screenshots} />

      {/* ========== SOBRE O JOGO ========== */}
      <section className="games-about">
        <h3 className="games-about-title">SOBRE O JOGO</h3>
        <p className="games-about-text">{game.about}</p>
        {game.developer && (
          <p className="games-about-developer">
            Desenvolvido por <strong>{game.developer.name}</strong>
          </p>
        )}
      </section>

      {/* ========== PERSONAGENS ========== */}
      {characters.length > 0 && (
        <GameCharacters title="CONHEÇA OS PERSONAGENS" characters={characters} />
      )}

      {/* ========== OUTROS PROJETOS (vitrine sem o jogo aberto) ========== */}
      {otherGames.length > 0 && <GameShowcase title="OUTROS PROJETOS" games={otherGames} />}

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}