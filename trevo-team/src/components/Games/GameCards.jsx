/**
 * COMPONENTE: GameCards
 * =====================
 * Três blocos lado a lado (imagens ou placeholders cinza).
 * O do meio é mais escuro, menor e tem a frase logo acima.
 *
 * Props:
 * - quote: frase acima do bloco do meio
 * - items: array de { id, src }. Se "src" estiver vazio, mostra o bloco cinza.
 */

import './css/GameCards.css'

export default function GameCards({ quote = '', items = [] }) {
  return (
    <section className="game-cards">
      <div className="game-cards-grid">

        {items.map((item, index) => {
          // index 1 = bloco do meio
          const isMiddle = index === 1

          return (
            <div key={item.id} className="game-card-col">
              {isMiddle && <p className="game-cards-quote">{quote}</p>}

              <div className={`game-card ${isMiddle ? 'game-card--dark' : ''}`}>
                {item.src && <img className="game-card-image" src={item.src} alt="" />}
              </div>
            </div>
          )
        })}

      </div>
    </section>
  )
}