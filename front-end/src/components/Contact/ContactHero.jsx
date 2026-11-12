/**
 * COMPONENTE: ContactHero
 * =======================
 * Banner ciano do topo da página Contact Us:
 *
 *   [quadrado verde com estrelas]  TREVO TEAM          frase curta
 *   [  frase de efeito          ]  TREVO TEAM (borrado)
 *                                  TREVO TEAM (borrado)
 *
 * A primeira linha do título fica por cima do quadrado verde;
 * as duas linhas borradas ficam por trás dele.
 *
 * Props:
 * - title:   texto grande repetido (padrão: TREVO TEAM)
 * - tagline: frase curta à direita
 * - phrase:  frase de efeito no canto do quadrado verde
 */

import './css/ContactHero.css'

export default function ContactHero({
  title = 'TREVO TEAM',
  tagline = '',
  phrase = '',
}) {
  return (
    <section className="contact-hero">
      <div className="contact-hero-inner">

        {/* 🟩 QUADRADO VERDE COM ESTRELAS */}
        <div className="contact-hero-square" aria-hidden="true">
          <span className="contact-hero-star contact-hero-star--top"></span>
          <span className="contact-hero-star contact-hero-star--left"></span>
          <span className="contact-hero-star contact-hero-star--bottom"></span>
        </div>

        {/* 🔠 TÍTULO REPETIDO (só a 1ª linha é lida pelo leitor de tela) */}
        <h2 className="contact-hero-title">
          <span className="contact-hero-line">{title}</span>
          <span className="contact-hero-line contact-hero-line--blur" aria-hidden="true">{title}</span>
          <span className="contact-hero-line contact-hero-line--blur" aria-hidden="true">{title}</span>
        </h2>

        {/* 💬 FRASES */}
        {tagline && <p className="contact-hero-tagline">{tagline}</p>}
        {phrase && <p className="contact-hero-phrase">{phrase}</p>}
      </div>
    </section>
  )
}
