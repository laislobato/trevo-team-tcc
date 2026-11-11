/**
 * COMPONENTE: GameHero
 * ====================
 * Bloco principal da página do jogo.
 *
 * Layout (desktop):
 *   [barra ciano com estrela]   [TÍTULO]
 *                               [subtítulo]
 *                               [texto]
 *                               [Genre]   [Rating]
 *                               [Theme]   [Platform]
 *
 * Props:
 * - title:    título grande
 * - subtitle: frase curta abaixo do título
 * - text:     parágrafo descritivo
 * - info:     array de { label, value }
 * - color:    cor da barra ('cyan' | 'green' | 'orange'), a mesma cor do
 *             personagem do jogo na vitrine. Padrão: ciano.
 */

import './css/GameHero.css'

export default function GameHero({
  title = 'TITULO',
  subtitle = '',
  text = '',
  info = [],
  color = 'cyan',
}) {
  return (
    <section className="game-hero">
      <div className="game-hero-inner">

        {/* 🟦 BARRA COLORIDA COM A ESTRELA */}
        <div className={`game-hero-bar game-hero-bar--${color}`}>
          <span className="game-hero-star"></span>
        </div>

        {/* 📝 CONTEÚDO */}
        <div className="game-hero-content">
          <h1 className="game-hero-title">{title}</h1>
          <p className="game-hero-subtitle">{subtitle}</p>
          <p className="game-hero-text">{text}</p>

          {/* Grid de informações do jogo */}
          <dl className="game-hero-info">
            {info.map((item) => (
              <div key={item.label} className="game-hero-info-item">
                <dt className="game-hero-info-label">{item.label}</dt>
                <dd className="game-hero-info-value">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </section>
  )
}