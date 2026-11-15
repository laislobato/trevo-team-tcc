/**
 * COMPONENTE: AboutHero
 * =====================
 * Topo da página About: arte de fundo (rascunho com raios verdes),
 * título "SOBRE NÓS" e 2 cards levemente inclinados.
 *
 *   ┌──────────────── arte de fundo (some no branco embaixo) ───────────────┐
 *   │                            SOBRE NÓS                                  │
 *   │     ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾╱   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲                                │
 *   │    │   imagem 1    │   │   imagem 2    │                               │
 *   │    ╱______________╱     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲                               │
 *   │       TÍTULO 1               TÍTULO 2                                 │
 *   │      SUBTÍTULO 1            SUBTÍTULO 2   (laranja)                   │
 *   │    texto...               texto...                                    │
 *   └───────────────────────────────────────────────────────────────────────┘
 *    ───────────────────────────── <> ────────────────────────────────────
 *
 * - Os cards vêm do painel (Painel → Página About; só o admin da Trevo altera).
 * - Sem imagem, o card fica branco (lugar da foto).
 * - O cabeçalho flutua por cima da parte de cima da arte (ver About.jsx).
 *
 * Para trocar a arte de fundo: substitua src/assets/about-hero.webp
 * (ou importe outra imagem em BACKGROUND).
 *
 * Props:
 * - title: título da seção (padrão: "SOBRE NÓS")
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import background from '../../assets/about-hero.png'
import { api } from '../../services/api'
import './css/Abouthero.css'

const BACKGROUND = background

// Enquanto carrega: 2 cards vazios (a página não "pula" quando os dados chegam)
const LOADING_CARDS = [{ id: 'carregando-1' }, { id: 'carregando-2' }]

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AboutHero({ title = 'SOBRE NÓS' }) {
  const [cards, setCards] = useState(null) // null = carregando

  // Busca os cards quando a página abre
  useEffect(() => {
    let active = true
    api
      .getAboutCards()
      .then((list) => active && setCards(list))
      .catch(() => active && setCards([])) // sem a API: mostra só o título
    return () => {
      active = false
    }
  }, [])

  const loading = cards === null

  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      {/* ========== ARTE DE FUNDO (só enfeite) ========== */}
      <img className="about-hero-bg" src={BACKGROUND} alt="" aria-hidden="true" />

      <div className="about-hero-inner">
        {/* ========== TÍTULO ========== */}
        <h1 id="about-hero-title" className="about-hero-title">{title}</h1>

        {/* ========== CARDS ========== */}
        <ul className="about-hero-cards" aria-busy={loading}>
          {(loading ? LOADING_CARDS : cards).map((card) => (
            <li key={card.id} className="about-card">
              {/* Moldura branca inclinada com a imagem */}
              <div className="about-card-frame">
                {card.image && <img className="about-card-image" src={card.image} alt="" />}
              </div>

              {card.title && <h2 className="about-card-title">{card.title}</h2>}
              {card.subtitle && <p className="about-card-subtitle">{card.subtitle}</p>}
              {card.text && <p className="about-card-text">{card.text}</p>}
            </li>
          ))}
        </ul>
      </div>

      {/* ========== DIVISÓRIA COM "<>" (enfeite) ========== */}
      <div className="about-hero-divider" aria-hidden="true">
        <span className="about-hero-divider-icon">&lt;&gt;</span>
      </div>
    </section>
  )
}