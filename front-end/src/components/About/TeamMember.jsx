/**
 * COMPONENTE: TeamMember
 * ======================
 * Um membro da equipe: cartão cinza com bolinha preta em cima,
 * retângulo laranja embaixo, e no outro lado o texto + 3 bolinhas.
 *
 * Props:
 * - role:    cargo/grupo em destaque (ex: "TECO")
 * - name:    nome da pessoa
 * - text:    descrição
 * - circles: array com 3 cores ('cyan' ou 'orange') para as bolinhas de baixo
 * - reverse: se true, a imagem fica à direita e o texto à esquerda
 */

import './css/TeamMember.css'

export default function TeamMember({
  role,
  name,
  text,
  circles = ['cyan', 'orange', 'cyan'],
  reverse = false,
}) {
  return (
    <article className={`team-member ${reverse ? 'team-member--reverse' : ''}`}>

      {/* 🖼️ LADO DA IMAGEM (cartão cinza) */}
      <div className="team-member-visual">
        <div className="team-member-card">
          {/* Bolinha preta sobreposta no topo */}
          <span className="team-member-avatar"></span>

          {/* Retângulo laranja pequeno na base */}
          <span className="team-member-tag"></span>
        </div>
      </div>

      {/* 📝 LADO DO TEXTO */}
      <div className="team-member-info">
        <h3 className="team-member-role">{role}</h3>
        <p className="team-member-name">{name}</p>
        <p className="team-member-text">{text}</p>

        {/* Três bolinhas coloridas */}
        <div className="team-member-circles">
          {circles.map((color, i) => (
            <span
              key={i}
              className={`team-member-circle team-member-circle--${color}`}
            ></span>
          ))}
        </div>
      </div>

    </article>
  )
}