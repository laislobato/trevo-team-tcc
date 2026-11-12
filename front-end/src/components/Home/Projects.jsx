/**
 * COMPONENTE: Projects
 * ====================
 * Seção que exibe os projetos realizados pela Trevo Team
 * 
 * Design:
 * - Círculo preto SOBREPOSTO na caixa cinza
 * - Caixa cinza com fundo verde na base (rodapé)
 * - Layout compacto e visual
 * 
 * Contém:
 * - Título e subtítulo
 * - Descrição dos projetos
 * - Grid com cards de projetos
 * 
 * Cada card contém:
 * - Círculo preto (sobreposto)
 * - Caixa cinza com nome + descrição
 * - Fundo verde na base
 */

import './css/Projects.css'

export default function Projects() {
  // Array com dados dos projetos (fácil adicionar mais)
  const projects = [
    {
      id: 1,
      name: 'NOME',
      description: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone'
    },
    {
      id: 2,
      name: 'NOME',
      description: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone'
    },
    {
      id: 3,
      name: 'NOME',
      description: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone Lorem Ipsum Ipsone'
    }
  ]

  return (
    <section className="projects">
      {/* 📋 HEADER DA SEÇÃO */}
      <div className="projects-header">
        <h2 className="projects-title">PROJETOS</h2>
        <p className="projects-subtitle">Lorem Ipsum Ipsone Lorem Ipsum Ipsone</p>
      </div>

      {/* 🎯 GRID DE PROJETOS */}
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            
            {/* Círculo preto (sobreposto) */}
            <div className="project-circle"></div>

            {/* Caixa do projeto (cinza + verde) */}
            <div className="project-box">
              {/* Informações do projeto */}
              <div className="project-content">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-description">
                  {project.description}
                </p>
              </div>

              {/* Barra verde no rodapé */}
              <div className="project-footer-bar"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 📝 DESCRIÇÃO ABAIXO DOS CARDS */}
      <p className="projects-description">
        *Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Mauris facilisis porttitor ullamcorper. In pretium nec est 
        at tempus. Duis quis lacus at elit maximus mollis.
      </p>
    </section>
  )
}