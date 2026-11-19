/**
 * COMPONENTE: ContactHero
 * =======================
 * Topo da página Contact, no mesmo esquema do topo do Sobre:
 * arte de rascunho no fundo (some no branco embaixo), título preto,
 * subtítulo laranja logo abaixo e um texto curto. Duas estrelas de enfeite.
 *
 *   ┌──────────── arte de fundo (raios laranja) ────────────┐
 *   │   ★              FALE COM A GENTE                      │
 *   │            ONDE OS INDIES CRIAM RAÍZES   (laranja)     │
 *   │          Parcerias, suporte ou imprensa...         ★   │
 *   └────────────────────────────────────────────────────────┘
 *
 * - O cabeçalho flutua por cima da arte (ver pages/Contact.jsx).
 * - PROVISÓRIO: a arte é a mesma do Sobre, com a cor puxada para laranja
 *   (filtro no CSS). Quando tiver a arte própria da Contact, passe na prop
 *   "background" e apague o "filter" em .contact-hero-bg.
 * - As estrelas são o componente Art: troque por artes com a prop "src".
 *
 * Props:
 * - title:      título (padrão: "FALE COM A GENTE")
 * - subtitle:   frase laranja embaixo do título
 * - text:       texto curto de apresentação
 * - background: imagem de fundo (padrão: arte do Sobre)
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import Art from '../shared/Art'
import aboutArt from '../../assets/about-hero-orange.png'
import './css/ContactHero.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function ContactHero({
  title = 'FALE COM A GENTE',
  subtitle = 'ONDE OS INDIES CRIAM RAÍZES',
  text = '',
  background = aboutArt,
}) {
  return (
    <section className="contact-hero" aria-labelledby="contact-hero-title">
      {/* ========== ARTE DE FUNDO (só enfeite) ========== */}
      <img className="contact-hero-bg" src={background} alt="" aria-hidden="true" />

      <div className="contact-hero-inner">
        {/* Estrelas de enfeite (depois viram artes) */}
        <Art size={70} color="black" className="contact-hero-star contact-hero-star--left" />
        <Art size={46} color="orange" className="contact-hero-star contact-hero-star--right" />

        {/* ========== TÍTULO ========== */}
        <h1 id="contact-hero-title" className="contact-hero-title">{title}</h1>
        {subtitle && <p className="contact-hero-subtitle">{subtitle}</p>}
        {text && <p className="contact-hero-text">{text}</p>}
      </div>
    </section>
  )
}
