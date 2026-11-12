/**
 * COMPONENTE: GameShowcase
 * ========================
 * Carrossel de jogos centralizado. O jogo em foco fica SEMPRE no meio da tela,
 * aberto: personagem à esquerda e a descrição ao lado. Os vizinhos aparecem
 * menores nas laterais, mostrando só o personagem.
 *
 *   [anterior]   ‹   [ personagem | nome, descrição... Ver mais → ]   ›   [próximo]
 *
 * O carrossel "dá a volta": depois do último jogo vem o primeiro de novo.
 *
 * Como trocar de jogo:
 * - setas ‹ › (ou as setas ← → do teclado);
 * - clicar no jogo da lateral;
 * - no celular, arrastar o dedo para o lado.
 *
 * Como funciona por dentro: cada card recebe um "offset" (distância até o
 * centro): 0 = no meio, -1 = à esquerda, 1 = à direita. O CSS usa esse número
 * para empurrar o card para o lado (transform) e para abrir ou fechar o card.
 *
 * Usado em duas páginas:
 * - /jogo         -> todos os jogos ("CONHEÇA NOSSOS JOGOS")
 * - /jogo/<slug>  -> os outros jogos, sem o que está aberto ("OUTROS PROJETOS")
 *
 * Poucos jogos:
 * - 2 jogos: a lista é repetida por dentro ([A, B, A, B]) para as duas
 *   laterais terem um card; as bolinhas continuam mostrando só 2.
 * - 1 jogo: só o card do meio, sem setas e sem bolinhas.
 *
 * Props:
 * - title: título da seção
 * - games: lista de jogos (vem da API, via src/services/games.js)
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './css/GameShowcase.css'

/** Personagem: imagem do jogo ou o desenho padrão (silhueta) */
function Character({ game }) {
  return (
    <div className={`showcase-character showcase-character--${game.color}`}>
      {game.characterImage ? (
        <img src={game.characterImage} alt="" />
      ) : (
        <span className="showcase-silhouette" aria-hidden="true">
          <span className="showcase-silhouette-head"></span>
          <span className="showcase-silhouette-body"></span>
        </span>
      )}
    </div>
  )
}

/**
 * Distância de um card até o centro, "dando a volta" na lista.
 * Com 3 jogos e o 1º no centro: 1º -> 0, 2º -> 1 (direita), 3º -> -1 (esquerda).
 */
function getOffset(index, active, total) {
  let offset = (((index - active) % total) + total) % total
  if (offset > total / 2) offset -= total
  return offset
}

export default function GameShowcase({ title = 'CONHEÇA NOSSOS JOGOS', games = [] }) {
  const [active, setActive] = useState(0) // posição do card do meio na lista "cards"
  const previousActive = useRef(0)
  const touchStartX = useRef(null)

  const total = games.length // jogos de verdade
  // Com 2 jogos, repete a lista para ter um card em cada lateral
  const cards = total === 2 ? [...games, ...games] : games
  const count = cards.length // cards desenhados
  const hasControls = total > 1 // setas, bolinhas, arrastar e teclado
  const current = active % Math.max(total, 1) // jogo de verdade que está no meio

  const goTo = (index) => setActive(((index % count) + count) % count)

  /** Bolinha clicada: vai para a cópia do jogo que está mais perto do meio */
  const goToGame = (gameIndex) => {
    const copies = cards.map((_, i) => i).filter((i) => i % total === gameIndex)
    const nearest = copies.reduce((best, i) =>
      Math.abs(getOffset(i, active, count)) < Math.abs(getOffset(best, active, count)) ? i : best,
    )
    goTo(nearest)
  }

  // Lista de jogos nova (ex.: abriu outro jogo): volta para o primeiro
  useEffect(() => {
    setActive(0)
    previousActive.current = 0
  }, [games])

  // Lembra qual era o jogo anterior (usado para detectar o card que "dá a volta")
  useEffect(() => {
    previousActive.current = active
  }, [active])

  // Setas do teclado quando o foco está dentro do carrossel
  const handleKeyDown = (e) => {
    if (!hasControls) return
    if (e.key === 'ArrowLeft') goTo(active - 1)
    if (e.key === 'ArrowRight') goTo(active + 1)
  }

  // Arrastar no celular: mais de 50px para o lado troca de jogo
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || !hasControls) return
    const distance = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(distance) > 50) goTo(active + (distance < 0 ? 1 : -1))
    touchStartX.current = null
  }

  if (total === 0) return null

  return (
    <section
      className="showcase"
      aria-labelledby="showcase-title"
      aria-roledescription="carrossel"
      onKeyDown={handleKeyDown}
    >
      <h2 id="showcase-title" className="showcase-title">{title}</h2>

      <div className="showcase-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <ul className="showcase-track">
          {cards.map((game, index) => {
            const offset = getOffset(index, active, count)
            const previousOffset = getOffset(index, previousActive.current, count)
            const isCenter = offset === 0
            const isVisible = Math.abs(offset) <= 1
            // Card que pula de uma ponta para a outra: troca de lugar sem animação
            // (senão ele atravessaria a tela por trás do card do meio)
            const isJumping = Math.abs(offset - previousOffset) > 1

            const classes = [
              'showcase-card',
              isCenter ? 'is-center' : 'is-side',
              !isVisible && 'is-hidden',
              isJumping && 'is-jumping',
            ].filter(Boolean).join(' ')

            return (
              <li
                key={`${game.slug}-${index}`}
                className={classes}
                style={{ '--offset': offset }}
                onClick={() => !isCenter && goTo(index)}
                aria-hidden={!isCenter}
                title={isCenter ? undefined : `Ver ${game.title}`}
              >
                <Character game={game} />

                {/* Descrição: só aparece no card do meio */}
                <div className="showcase-info">
                  <div className="showcase-info-inner">
                    <p className="showcase-genre">{game.genre}</p>
                    <h3 className="showcase-game">{game.title}</h3>
                    <p className="showcase-character-name">{game.character}</p>
                    <p className="showcase-text">{game.description}</p>
                    <p className="showcase-platforms">{game.platforms.join(' · ')}</p>
                    <Link to={`/jogo/${game.slug}`} className="showcase-link" tabIndex={isCenter ? 0 : -1}>
                      Ver mais →
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Setas: ficam entre o card do meio e os das laterais.
            O ícone é desenhado em SVG, com pontas arredondadas */}
        {hasControls && (
          <>
            <button type="button" className="showcase-arrow showcase-arrow--prev" onClick={() => goTo(active - 1)}
              aria-label="Jogo anterior">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="showcase-arrow showcase-arrow--next" onClick={() => goTo(active + 1)}
              aria-label="Próximo jogo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Bolinhas: mostram qual jogo está no meio (uma por jogo de verdade) */}
      {hasControls && (
        <div className="showcase-dots">
          {games.map((game, index) => (
            <button
              key={game.slug}
              type="button"
              className={`showcase-dot ${index === current ? 'is-active' : ''}`}
              onClick={() => goToGame(index)}
              aria-label={`Mostrar ${game.title}`}
              aria-current={index === current}
            />
          ))}
        </div>
      )}

      {/* Aviso para leitores de tela quando o jogo muda */}
      <p className="visually-hidden" aria-live="polite">
        {`Jogo ${current + 1} de ${total}: ${games[current]?.title || ''}`}
      </p>
    </section>
  )
}