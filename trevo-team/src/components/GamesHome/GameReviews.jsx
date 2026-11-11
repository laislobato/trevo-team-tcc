/**
 * COMPONENTE: GameReviews
 * =======================
 * Faixa de comentários de jogadores passando sozinha da direita para a esquerda:
 *
 *   ← [ Steam  "comentário..."  usuário · Jogo ]  [ Xbox  "comentário..." ... ]  ←
 *
 * - Para quando o mouse passa em cima (para dar tempo de ler).
 * - A lista é desenhada duas vezes, assim a faixa "emenda" e nunca acaba.
 * - Quem ativa "reduzir movimento" no sistema vê a faixa parada, com rolagem.
 *
 * Props:
 * - title:   título da seção
 * - reviews: lista de comentários (ver src/data/games.js)
 */

import { PLATFORM_NAMES } from '../../data/games'
import './css/GameReviews.css'

function ReviewCard({ review, hidden = false }) {
  return (
    <li className="review" aria-hidden={hidden || undefined}>
      {/* Plataforma em que a pessoa jogou */}
      <span className={`review-platform review-platform--${review.platform}`}>
        {PLATFORM_NAMES[review.platform]}
      </span>
      <p className="review-text">“{review.text}”</p>
      <div className="review-meta">
        <span className="review-avatar" aria-hidden="true">{review.user.charAt(0).toUpperCase()}</span>
        <div>
          <p className="review-user">{review.user}</p>
          <p className="review-game">{review.game}</p>
        </div>
      </div>
    </li>
  )
}

export default function GameReviews({ title = 'O QUE OS JOGADORES DIZEM', reviews = [] }) {
  // Velocidade constante: quanto mais comentários, mais longa a volta
  const duration = `${reviews.length * 6}s`

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="reviews-title">{title}</h2>

      <div className="reviews-viewport">
        <ul className="reviews-track" style={{ '--reviews-duration': duration }}>
          {reviews.map((review, i) => (
            <ReviewCard key={`a-${i}`} review={review} />
          ))}
          {/* Cópia para a faixa emendar (escondida dos leitores de tela) */}
          {reviews.map((review, i) => (
            <ReviewCard key={`b-${i}`} review={review} hidden />
          ))}
        </ul>
      </div>
    </section>
  )
}
