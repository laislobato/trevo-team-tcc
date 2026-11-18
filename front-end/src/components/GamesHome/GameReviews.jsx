/**
 * COMPONENTE: GameReviews
 * =======================
 * Faixa de comentários de jogadores passando sozinha da direita para a esquerda:
 *
 *   ← [ Steam  "comentário..."  usuário · Jogo ]  [ Xbox  "comentário..." ... ]  ←
 *
 * - Dá para arrastar a faixa com o mouse ou com o dedo, para os dois lados.
 *   Ao soltar, ela continua um pouco no embalo e depois volta a andar sozinha.
 * - Para quando o mouse passa em cima (para dar tempo de ler) e volta aos poucos.
 * - Pelo teclado: Tab até a faixa e setas ← → para passar os comentários.
 * - A lista é desenhada mais de uma vez, assim a faixa "emenda" e nunca acaba.
 * - Quem ativa "reduzir movimento" no sistema vê a faixa parada
 *   (ainda dá para arrastar e usar as setas).
 *
 * Como funciona: a posição da faixa (em px) fica guardada numa ref e é
 * atualizada a cada quadro (requestAnimationFrame), sem re-renderizar o React.
 * Quando a faixa anda o tamanho de uma lista inteira, a posição volta
 * o mesmo tanto, e como as cópias são iguais, não dá para perceber.
 *
 * Props:
 * - title:   título da seção
 * - reviews: lista de comentários (ver src/data/games.js)
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useRef, useState } from 'react'
import { PLATFORM_NAMES } from '../../data/games'
import { prefersReducedMotion } from '../../services/acessibilidade'
import './css/GameReviews.css'

// ===============================================
// AJUSTES DO MOVIMENTO
// ===============================================

const SECONDS_PER_CARD = 6 // velocidade sozinha: cada card leva ~6s para passar
const FRICTION = 0.95 // embalo depois de soltar (mais perto de 1 = desliza mais)
const MAX_FLING = 2.5 // velocidade máxima do embalo (px por milissegundo)
const DRAG_THRESHOLD = 4 // px que o dedo anda antes de contar como arraste


// ===============================================
// CARD DO COMENTÁRIO
// ===============================================

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

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function GameReviews({ title = 'O QUE OS JOGADORES DIZEM', reviews = [] }) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [copies, setCopies] = useState(2) // quantas vezes a lista é desenhada
  const [dragging, setDragging] = useState(false) // só para o cursor "mãozinha fechada"

  // Tudo que muda a cada quadro fica aqui (não precisa re-renderizar)
  const motion = useRef({
    offset: 0, // posição da faixa em px (0 ou negativa)
    loop: 0, // largura de uma lista inteira (com o espaço entre os cards)
    step: 0, // largura de um card + espaço (usada pelas setas)
    speed: 0, // velocidade atual sozinha (px/ms), sobe e desce suave
    fling: 0, // embalo depois de soltar (px/ms)
    glide: 0, // distância que falta andar por causa das setas (px)
    hover: false,
    focus: false,
    drag: null, // { id, startX, startOffset, lastX, lastTime, moved }
  })

  // ========== MEDIDAS (tamanho da lista e quantas cópias cabem) ==========
  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || reviews.length === 0) return undefined

    const measure = () => {
      const cards = track.children
      if (cards.length <= reviews.length) return
      // Distância entre o 1º card da lista e o 1º card da cópia
      const loop = cards[reviews.length].offsetLeft - cards[0].offsetLeft
      const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : loop
      const m = motion.current
      m.loop = loop
      m.step = step
      // Cópias suficientes para cobrir a tela inteira (tela larga + poucos comentários)
      const needed = loop > 0 ? Math.max(2, Math.ceil(viewport.clientWidth / loop) + 1) : 2
      setCopies((current) => (current === needed ? current : needed))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    return () => observer.disconnect()
  }, [reviews.length, copies])

  // ========== MOVIMENTO (a cada quadro) ==========
  useEffect(() => {
    if (reviews.length === 0) return undefined
    const m = motion.current
    let frame = 0
    let last = performance.now()

    const tick = (now) => {
      const dt = Math.min(now - last, 50) // aba volta do fundo: não dá "pulo"
      last = now

      if (!m.drag) {
        // Velocidade sozinha: para no hover/foco e volta aos poucos
        const target = prefersReducedMotion() || m.hover || m.focus || !m.loop ? 0 : m.step / (SECONDS_PER_CARD * 1000)
        m.speed += (target - m.speed) * (1 - Math.pow(0.9, dt / 16.7))
        m.offset -= m.speed * dt

        // Embalo depois de soltar
        if (m.fling !== 0) {
          m.offset += m.fling * dt
          m.fling *= Math.pow(FRICTION, dt / 16.7)
          if (Math.abs(m.fling) < 0.01) m.fling = 0
        }

        // Setas do teclado: anda até o próximo card, freando no fim
        if (m.glide !== 0) {
          const part = m.glide * (1 - Math.pow(0.82, dt / 16.7))
          const move = Math.abs(m.glide) < 0.5 ? m.glide : part
          m.offset += move
          m.glide -= move
        }
      }

      // Emenda: mantém a posição entre -loop e 0
      if (m.loop > 0) {
        while (m.offset <= -m.loop) m.offset += m.loop
        while (m.offset > 0) m.offset -= m.loop
      }

      if (trackRef.current) trackRef.current.style.transform = `translate3d(${m.offset}px, 0, 0)`
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reviews.length])

  // ========== ARRASTAR (mouse e dedo) ==========
  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return // só o botão esquerdo
    const m = motion.current
    m.focus = false // usou o mouse/dedo: a pausa do teclado deixa de valer
    m.fling = 0
    m.glide = 0
    m.drag = {
      id: e.pointerId,
      startX: e.clientX,
      startOffset: m.offset,
      lastX: e.clientX,
      lastTime: performance.now(),
      moved: false,
    }
  }

  const handlePointerMove = (e) => {
    const m = motion.current
    const drag = m.drag
    if (!drag || drag.id !== e.pointerId) return

    const dx = e.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      drag.moved = true
      setDragging(true)
      // Continua recebendo o movimento mesmo se o ponteiro sair da faixa
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }

    const now = performance.now()
    const elapsed = Math.max(now - drag.lastTime, 1)
    // Velocidade do arraste (suavizada), usada para o embalo ao soltar
    m.fling = 0.7 * ((e.clientX - drag.lastX) / elapsed) + 0.3 * m.fling
    drag.lastX = e.clientX
    drag.lastTime = now
    m.offset = drag.startOffset + dx
    m.speed = 0
  }

  const handlePointerEnd = (e) => {
    const m = motion.current
    const drag = m.drag
    if (!drag || drag.id !== e.pointerId) return

    // Soltou parado (mais de 80ms sem mexer): sem embalo
    const still = performance.now() - drag.lastTime > 80
    m.fling = !drag.moved || still || e.type === 'pointercancel' ? 0 : Math.max(-MAX_FLING, Math.min(MAX_FLING, m.fling))
    m.drag = null
    setDragging(false)
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  // ========== MOUSE EM CIMA (pausa) ==========
  // Só o mouse: no celular, tocar na faixa não deve deixá-la parada
  const handleHover = (e, inside) => {
    if (e.pointerType === 'mouse') motion.current.hover = inside
  }

  // ========== TECLADO (setas) ==========
  const handleKeyDown = (e) => {
    const m = motion.current
    if (!m.step) return
    m.focus = true // usando o teclado: a faixa fica parada enquanto tiver o foco
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      m.glide -= m.step // próximo comentário
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      m.glide += m.step // comentário anterior
    }
  }

  // Foco pelo teclado para a faixa (o clique do mouse não conta)
  const handleFocus = (e) => {
    let keyboard = true
    try {
      keyboard = e.currentTarget.matches(':focus-visible')
    } catch {
      keyboard = true
    }
    motion.current.focus = keyboard
  }

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="reviews-title">{title}</h2>

      <div
        ref={viewportRef}
        className={`reviews-viewport${dragging ? ' is-dragging' : ''}`}
        role="region"
        aria-label="Comentários de jogadores. Arraste ou use as setas para passar."
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerEnter={(e) => handleHover(e, true)}
        onPointerLeave={(e) => handleHover(e, false)}
        onFocus={handleFocus}
        onBlur={() => (motion.current.focus = false)}
        onKeyDown={handleKeyDown}
      >
        <ul ref={trackRef} className="reviews-track">
          {Array.from({ length: copies }, (_, copy) =>
            reviews.map((review, i) => (
              // Só a 1ª lista é lida pelo leitor de tela; as cópias são só para emendar
              <ReviewCard key={`${copy}-${i}`} review={review} hidden={copy > 0} />
            )),
          )}
        </ul>
      </div>
    </section>
  )
}