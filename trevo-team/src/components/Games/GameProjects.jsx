/**
 * COMPONENTE: GameProjects
 * ========================
 * "Outros projetos": cards em arco com bolinha preta sobreposta.
 * O título fica à direita, com a linha ciano à esquerda.
 *
 * Props:
 * - title:    título da seção
 * - projects: array de { id, name, text }
 */

import './css/Games.css'
import './css/GameProjects.css'

export default function GameProjects({ title = '', projects = [] }) {
  return (
    <section className="game-projects">

      {/* Título à direita, linha ciano à esquerda */}
      <div className="games-heading games-heading--reverse">
        <h2 className="games-heading-text">{title}</h2>
        <span className="games-heading-line"></span>
      </div>

      <div className="game-projects-grid">
        {projects.map((project) => (
          <article key={project.id} className="game-project-card">

            {/* Bolinha preta sobreposta */}
            <span className="game-project-avatar"></span>

            {/* Caixa em arco com nome e texto */}
            <div className="game-project-box">
              <h3 className="game-project-name">{project.name}</h3>
              <p className="game-project-text">{project.text}</p>
            </div>

          </article>
        ))}
      </div>

    </section>
  )
}