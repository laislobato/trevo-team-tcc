/**
 * COMPONENTE: HoloCard
 * ====================
 * Cartão com efeito de "carta holográfica" (tipo carta de Pokémon):
 * ao passar o mouse, o cartão inclina para o lado do mouse, e por cima
 * aparecem um brilho de arco-íris e um reflexo de luz que acompanham o mouse.
 *
 *   mouse no canto de cima à direita  ->  esse canto "afunda" e o brilho vai para lá
 *
 * Como usar: troque a <div> do cartão por <HoloCard>, com a mesma className.
 *
 *   <HoloCard className="team-member-card team-member-card--green">
 *     <img ... />
 *   </HoloCard>
 *
 * Camadas (ver css/HoloCard.css):
 * - .holo-foil:  arco-íris que desliza conforme o mouse (o "holográfico")
 * - .holo-glare: reflexo branco redondo embaixo do mouse
 * Elas ficam por cima da imagem, com o mesmo arredondado do cartão.
 *
 * - Só com mouse/caneta (no celular não tem "passar o mouse").
 * - Quem ativa "reduzir movimento" no sistema vê o brilho, mas o cartão não inclina.
 * - A inclinação é aplicada direto no style (não re-renderiza o React).
 *
 * Props:
 * - className: classes do cartão
 * - maxTilt:   inclinação máxima em graus (padrão: 14)
 * - lift:      quanto o cartão "sobe" em px com o mouse em cima (padrão: 4)
 * - children:  conteúdo do cartão
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../services/acessibilidade'
import './css/HoloCard.css'


// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function HoloCard({ className = '', maxTilt = 14, lift = 4, children }) {
  const cardRef = useRef(null)
  const frame = useRef(0) // pedido de quadro pendente (requestAnimationFrame)
  const point = useRef(null) // última posição do mouse

  // Cancela o quadro pendente se o componente sair da tela
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  // Aplica a inclinação e o brilho para a posição atual do mouse
  const update = () => {
    frame.current = 0
    const card = cardRef.current
    if (!card || !point.current) return

    const rect = card.getBoundingClientRect()
    // Posição do mouse dentro do cartão: 0 (esquerda/topo) até 1 (direita/baixo)
    const x = Math.min(Math.max((point.current.x - rect.left) / rect.width, 0), 1)
    const y = Math.min(Math.max((point.current.y - rect.top) / rect.height, 0), 1)

    // Brilho e reflexo (porcentagens usadas no CSS)
    card.style.setProperty('--holo-x', `${(x * 100).toFixed(1)}%`)
    card.style.setProperty('--holo-y', `${(y * 100).toFixed(1)}%`)
    // Quanto mais perto da borda, mais forte o brilho
    const edge = Math.min(Math.hypot(x - 0.5, y - 0.5) * 2, 1)
    card.style.setProperty('--holo-edge', edge.toFixed(3))

    // Inclinação: o lado do mouse afunda
    if (!prefersReducedMotion()) {
      const rotateX = ((0.5 - y) * 2 * maxTilt).toFixed(2)
      const rotateY = ((x - 0.5) * 2 * maxTilt).toFixed(2)
      card.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease'
      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(-${lift}px, -${lift}px)`
    }
  }

  // ========== MOUSE ==========
  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return
    point.current = { x: e.clientX, y: e.clientY }
    cardRef.current?.classList.add('is-holo')
    // No máximo uma atualização por quadro
    if (!frame.current) frame.current = requestAnimationFrame(update)
  }

  const handlePointerLeave = () => {
    const card = cardRef.current
    point.current = null
    cancelAnimationFrame(frame.current)
    frame.current = 0
    if (!card) return
    card.classList.remove('is-holo')
    // Volta devagar para a posição normal e depois devolve o controle ao CSS
    card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease'
    card.style.transform = ''
  }

  return (
    <div
      ref={cardRef}
      className={`holo ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Camadas do brilho (só enfeite) */}
      <span className="holo-foil" aria-hidden="true"></span>
      <span className="holo-glare" aria-hidden="true"></span>

      {children}
    </div>
  )
}