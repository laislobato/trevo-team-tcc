/**
 * COMPONENTE: PostDeveloper
 * =========================
 * Seção "Developed By" da página do post:
 *
 *   [ card do estúdio: logo, nome, devs ativos, texto, redes ]   [ integrante 1 (foto) ]
 *                                                                [ integrante 2 (foto) ]
 *                                                                [ integrante 3 (foto) ]
 *
 * Props:
 * - developer: { name, logo, activeDevs, description, socials, members }
 */

import SocialIcon from '../shared/SocialIcon'
import './css/PostDeveloper.css'

export default function PostDeveloper({ developer }) {
  if (!developer) return null

  return (
    <section className="post-developer" aria-labelledby="post-developer-title">
      <h3 id="post-developer-title" className="post-developer-heading">Developed By</h3>

      <div className="post-developer-grid">
        {/* 🏢 CARD DO ESTÚDIO */}
        <div className="post-developer-card">
          <div className="post-developer-top">
            <span className="post-developer-logo">
              {developer.logo && <img src={developer.logo} alt={`Logotipo de ${developer.name}`} />}
            </span>
            <div>
              <p className="post-developer-name">{developer.name}</p>
              <p className="post-developer-devs">Active Devs • {developer.activeDevs}</p>
            </div>
          </div>

          <p className="post-developer-text">{developer.description}</p>

          {/* Redes sociais (bolinhas que ficam por cima da borda de baixo).
              O ícone vem do nome da rede ou do link cadastrado no painel. */}
          <div className="post-developer-socials">
            {developer.socials.map((social) => (
              <a
                key={`${social.label}-${social.url}`}
                href={social.url}
                className="post-developer-social"
                aria-label={`${developer.name} no ${social.label}`}
                target="_blank"
                rel="noreferrer"
              >
                <SocialIcon label={social.label} url={social.url} />
              </a>
            ))}
          </div>
        </div>

        {/* 👥 INTEGRANTES */}
        <ul className="post-developer-members">
          {developer.members.map((member) => (
            <li key={member.name} className="post-developer-member">
              <div>
                <p className="post-developer-member-name">{member.name}</p>
                <p className="post-developer-member-role">{member.role}</p>
              </div>
              <span className="post-developer-member-photo">
                {member.photo && <img src={member.photo} alt="" />}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}