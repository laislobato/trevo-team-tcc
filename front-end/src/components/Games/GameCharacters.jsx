/**
 * COMPONENTE: GameCharacters
 * ==========================
 * Lista de personagens. Cada um tem um arco (com a imagem ou a silhueta),
 * o nome em cima e uma caixa cinza com o texto.
 *
 *          ▄█▄        <- a imagem SAI pelo topo do arco
 *        ╭─███─╮  Nome
 *        │ ███ │ ┌──────────────────┐
 *        │ ███ │ │ texto do         │
 *        │ ███ │ │ personagem...    │
 *        └─────┘ └──────────────────┘
 *
 * - A imagem fica presa na base do arco e passa do topo (e um pouco dos
 *   lados, se a arte for larga).
 *   Para o efeito ficar bom, use imagem com FUNDO TRANSPARENTE (PNG).
 * - A caixa do texto tem pelo menos a altura do arco: assim os nomes ficam
 *   todos na mesma altura e o texto cabe sem empurrar o nome para cima.
 *
 * FUNDO DO ARCO (constante BACKGROUND, logo abaixo):
 * - 'jogo'   -> cor principal do jogo (a mesma da barra do topo da página)
 * - 'escuro' -> preto, como era antes
 *
 * Props:
 * - title:      título da seção (com linha ciano)
 * - characters: array de { id, name, text, image }
 *               "image" vazio = silhueta padrão
 * - color:      cor principal do jogo ('cyan' | 'green' | 'orange')
 */

import './css/Games.css'
import './css/GameCharacters.css'

// ===============================================
// OPÇÃO: FUNDO DO ARCO
// ===============================================
// 'jogo' = cor principal do jogo | 'escuro' = preto (como era antes)
const BACKGROUND = 'jogo'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function GameCharacters({ title = '', characters = [], color = 'orange' }) {
  // Classe do fundo: game-character-figure--green, --cyan, --orange ou --escuro
  const background = BACKGROUND === 'jogo' ? color : 'escuro'

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

            {/* Arco com a imagem (que sai pelo topo) ou a silhueta */}
            <div className={`game-character-figure game-character-figure--${background}`}>
              {character.image ? (
                <img className="game-character-image" src={character.image} alt="" />
              ) : (
                <>
                  <span className="game-character-head"></span>
                  <span className="game-character-body"></span>
                </>
              )}
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