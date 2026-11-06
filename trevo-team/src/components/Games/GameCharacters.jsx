/**
 * COMPONENTE: GameCharacters
 * ==========================
 * Lista de personagens. Cada um tem uma silhueta (preta com laranja),
 * o nome em cima e uma caixa cinza com o texto.
 *
 * Props:
 * - title:      título da seção (com linha ciano)
 * - characters: array de { id, name, text }
 */

import './css/Games.css'
import './css/GameCharacters.css'

export default function GameCharacters({ title = '', characters = [] }) {
  return (
    <section className="game-characters">

      {/* Título com linha ciano (texto à esquerda) */}
      <div className="games-heading">
        <h2 className="games-heading-text">{title}</h2>
        <span className="games-heading-line"></span>
      </div>

      <div className="game-characters-list">
        {characters.map((character) => (
          <article key={character.id} className="game-character">

            {/* Silhueta: fundo preto, cabeça e corpo laranja */}
            <div className="game-character-figure">
              <span className="game-character-head"></span>
              <span className="game-character-body"></span>
            </div>

            {/* Nome em cima, caixa cinza embaixo */}
            <div className="game-character-info">
              <h3 className="game-character-name">{character.name}</h3>
              <div className="game-character-box">
                <p className="game-character-text">{character.text}</p>
              </div>
            </div>

          </article>
        ))}
      </div>

    </section>
  )
}