/**
 * COMPONENTE: PrivacyHero
 * =======================
 * Topo da página de privacidade: bloco ciano com o título, o texto de
 * abertura e a data da última mudança. Duas estrelas de enfeite.
 *
 *   ┌─────────────────────── bloco ciano ───────────────────────┐
 *   │  ★            LGPD · LEI Nº 13.709/2018                   │
 *   │               POLÍTICA DE PRIVACIDADE                 ★   │
 *   │        Aqui você descobre, sem juridiquês, ...            │
 *   │              Última atualização: 19 de nov...             │
 *   └───────────────────────────────────────────────────────────┘
 *
 * - O cabeçalho flutua por cima (ver pages/Privacy.jsx).
 * - Os cards do resumo (PrivacySummary) sobem um pouco por cima da
 *   borda de baixo deste bloco.
 *
 * Props:
 * - intro:     texto de abertura
 * - updatedAt: data da última mudança (texto)
 */

import Art from '../shared/Art'
import './css/PrivacyHero.css'

export default function PrivacyHero({ intro, updatedAt }) {
  return (
    <section className="privacy-hero" aria-labelledby="privacy-title">
      <div className="privacy-hero-inner">
        {/* Estrelas de enfeite (depois viram artes) */}
        <Art size={64} color="black" className="privacy-hero-star privacy-hero-star--left" />
        <Art size={42} color="orange" className="privacy-hero-star privacy-hero-star--right" />

        <p className="privacy-hero-kicker">LGPD · Lei nº 13.709/2018</p>
        <h1 id="privacy-title" className="privacy-hero-title">
          POLÍTICA DE <span className="privacy-hero-title-accent">PRIVACIDADE</span>
        </h1>
        <p className="privacy-hero-text">{intro}</p>
        <p className="privacy-hero-date">
          Última atualização: <strong>{updatedAt}</strong>
        </p>
      </div>
    </section>
  )
}
