/**
 * COMPONENTE: GameHero
 * ====================
 * Bloco principal da página do jogo.
 *
 * Layout (desktop):
 *   ┌─header──────────────────────────────────┐
 *   └──┬────┬─────────────────────────────────┘
 *      │    │      [TÍTULO]
 *    ╔═╧════╧═╗    [subtítulo]
 *    ║  arte  ║    [texto]
 *    ╚═╤════╤═╝    [Genre]   [Rating]
 *      │    │      [Theme]   [Platform]
 *      └────┘
 *   A barra colorida começa colada no header e a arte do jogo
 *   (imagem do personagem) é maior que a barra: sai para os dois lados.
 *   Sem imagem, aparece uma estrela no lugar.
 *
 * Props:
 * - title:    título grande
 * - subtitle: frase curta abaixo do título
 * - text:     parágrafo descritivo
 * - info:     array de { label, value }
 * - color:    cor da barra ('cyan' | 'green' | 'orange'), a mesma cor do
 *             personagem do jogo na vitrine. Padrão: ciano.
 * - art:      imagem da arte do jogo (vazio = estrela). Fica melhor com PNG
 *             de fundo transparente, para a arte "sair" da barra.
 * - artAlt:   descrição da arte (ex.: nome do personagem)
 */

import './css/GameHero.css'

export default function GameHero({
  title = 'TITULO',
  subtitle = '',
  text = '',
  info = [],
  color = 'cyan',
  art = '',
  artAlt = '',
}) {
  return (
    <section className="game-hero">
      <div className="game-hero-inner">

        {/* 🟦 BARRA COLORIDA COM A ARTE DO JOGO (ou a estrela) */}
        <div className={`game-hero-bar game-hero-bar--${color}`}>
          {art ? (
            <img className="game-hero-art" src={art} alt={artAlt} />
          ) : (
            <span className="game-hero-star" aria-hidden="true"></span>
          )}
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