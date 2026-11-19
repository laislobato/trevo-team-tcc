/**
 * COMPONENTE: PrivacyNav
 * ======================
 * Sumário da política, na coluna da esquerda (fica parado enquanto o
 * texto rola, no computador):
 *
 *   NESTA PÁGINA
 *   ─────────────────────────
 *   01  Quem cuida dos seus dados     <- seção que está na tela: tracinho laranja
 *   02  Que dados usamos e para quê
 *   ...
 *
 * - Cada item leva para a seção (#id).
 * - O item da seção que está na tela fica marcado (e o leitor de tela
 *   ouve "local atual"), conforme a pessoa rola a página.
 * - No celular, o sumário fica em cima do texto, sem ficar parado.
 *
 * Props:
 * - sections: [{ id, title }]
 */

import { useEffect, useMemo, useState } from 'react'
import './css/PrivacyNav.css'

// Distância do topo da tela (px) a partir da qual a seção conta como "na tela"
const TOP_OFFSET = 140

// ===============================================
// SEÇÃO NA TELA (acompanha a rolagem)
// ===============================================

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] || '')

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      // Chegou no fim da página: marca a última seção
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) {
        setActive(ids[ids.length - 1])
        return
      }
      // Senão: a última seção cujo topo já passou da linha
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= TOP_OFFSET) current = id
      }
      setActive(current)
    }

    // No máximo uma conta por quadro (rolar não pesa)
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function PrivacyNav({ sections = [] }) {
  const ids = useMemo(() => sections.map((section) => section.id), [sections])
  const active = useActiveSection(ids)

  return (
    <nav className="privacy-nav" aria-labelledby="privacy-nav-title">
      <p id="privacy-nav-title" className="privacy-nav-title">NESTA PÁGINA</p>
      <ol className="privacy-nav-list">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`privacy-nav-link ${active === section.id ? 'is-active' : ''}`}
              aria-current={active === section.id ? 'location' : undefined}
            >
              <span className="privacy-nav-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
