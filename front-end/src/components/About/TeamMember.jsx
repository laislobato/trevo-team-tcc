/**
 * COMPONENTE: TeamMember
 * ======================
 * Um integrante da Trevo Team na página About:
 *
 *   ╭───────────╮
 *   │   foto    │▌      TECO                <- apelido
 *   │ (no arco) │▌      Luka Antonio Lobato <- nome real
 *   │           │▌      PROGRAMADOR · FRONT <- cargo e função
 *   ╰─[TREVO]───╯▌      descrição...
 *    ▀▀▀▀▀▀▀▀▀▀▀▀       (I) (G) (X)         <- redes (links)
 *
 * - O cartão é um arco colorido (como a vitrine de jogos) com uma sombra
 *   sólida verde-escura deslocada; sem foto, aparece a silhueta padrão.
 * - As bolinhas são as redes da pessoa (até 3), com a primeira letra da rede.
 *
 * Props:
 * - nickname: apelido em destaque (ex.: "TECO")
 * - name:     nome real
 * - role:     cargo e função (ex.: "Programador · Front-end")
 * - text:     descrição
 * - photo:    foto (vazio = silhueta)
 * - socials:  [{ label, url }] (até 3)
 * - color:    cor do arco: 'green' | 'cyan' | 'orange'
 * - reverse:  se true, o cartão fica à direita e o texto à esquerda
 */

import './css/TeamMember.css'

// Cores das bolinhas das redes, na ordem
const SOCIAL_COLORS = ['cyan', 'orange', 'cyan']

export default function TeamMember({
  nickname,
  name,
  role,
  text,
  photo = '',
  socials = [],
  color = 'green',
  reverse = false,
}) {
  return (
    <article className={`team-member ${reverse ? 'team-member--reverse' : ''}`}>

      {/* 🖼️ LADO DA IMAGEM (cartão em arco) */}
      <div className="team-member-visual">
        <div className={`team-member-card team-member-card--${color}`}>
          {photo ? (
            <img className="team-member-photo" src={photo} alt={`Foto de ${name}`} />
          ) : (
            // Silhueta padrão (mesmo desenho da vitrine de jogos)
            <span className="team-member-silhouette" aria-hidden="true">
              <span className="team-member-silhouette-head"></span>
              <span className="team-member-silhouette-body"></span>
            </span>
          )}

          {/* Etiqueta laranja na base, estilo adesivo */}
          <span className="team-member-tag" aria-hidden="true">TREVO TEAM</span>
        </div>
      </div>

      {/* 📝 LADO DO TEXTO */}
      <div className="team-member-info">
        {nickname && <h3 className="team-member-role">{nickname}</h3>}
        <p className="team-member-name">{name}</p>
        {role && <p className="team-member-job">{role}</p>}
        {text && <p className="team-member-text">{text}</p>}

        {/* Redes da pessoa: cada bolinha é um link */}
        {socials.length > 0 && (
          <ul className="team-member-circles" aria-label={`Redes de ${name}`}>
            {socials.slice(0, 3).map((social, i) => (
              <li key={i}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`team-member-circle team-member-circle--${SOCIAL_COLORS[i]}`}
                  aria-label={`${social.label} de ${name}`}
                  title={social.label}
                >
                  {social.label.charAt(0).toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

    </article>
  )
}