/**
 * COMPONENTE: ContactBand
 * =======================
 * Faixa laranja "CONTACT US" com estrela, e logo abaixo uma aba branca
 * com o e-mail de contato e as redes sociais da Trevo Team:
 *
 *   [========  ★ CONTACT US  ========================]
 *   [ ● e-mail          ● ● ● ● ]
 *
 * Props:
 * - title:   texto da faixa
 * - email:   e-mail de contato
 * - socials: lista [{ label, url }]  (as bolinhas mostram a 1ª letra)
 */

import './css/ContactBand.css'

export default function ContactBand({ title = 'CONTACT US', email = '', socials = [] }) {
  return (
    <section className="contact-band" aria-labelledby="contact-band-title">
      {/* 🟧 FAIXA LARANJA */}
      <div className="contact-band-bar">
        <span className="contact-band-star" aria-hidden="true"></span>
        <h2 id="contact-band-title" className="contact-band-title">{title}</h2>
      </div>

      {/* ⬜ ABA BRANCA: E-MAIL E REDES */}
      <div className="contact-band-tab">
        {email && (
          <a href={`mailto:${email}`} className="contact-band-email">
            <span className="contact-band-dot" aria-hidden="true"></span>
            {email}
          </a>
        )}

        <ul className="contact-band-socials">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.url}
                className="contact-band-social"
                aria-label={`Trevo Team no ${social.label}`}
                target="_blank"
                rel="noreferrer"
              >
                {social.label.charAt(0)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
