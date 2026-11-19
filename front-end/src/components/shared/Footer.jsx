/**
 * COMPONENTE: Footer
 * ==================
 * Rodapé do site, tudo centralizado:
 *
 *   ─────────────╮      (logo)      ╭─────────────   <- arco branco "mordendo"
 *    degradê     ╰──── ● ● ● ● ─────╯                   o topo da faixa verde
 *    verde        GAMES | CONTACT US | ABOUT | BLOG | FAQ | PRIVACY
 *                  © Trevo Team 2026 all rights reserved
 *
 * - A logo fica no arco, saindo para cima da faixa.
 * - MASCOTE (arte futura): fica ATRÁS da logo, segurando ela, com uma
 *   plaquinha "Newsletter" na outra mão para a pessoa se inscrever.
 *   Por enquanto é só um <img> invisível no lugar dela (ver MASCOT_ART).
 * - As bolinhas vermelhas são as redes sociais; o ícone fica da cor
 *   do verde-escuro do rodapé.
 *
 * Para trocar textos e links, edite as constantes abaixo.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import SocialIcon from './SocialIcon'
import logo from '../../assets/logo.png'
import logoDark from '../../assets/logo_inverted.png' // versão para o modo escuro e o alto contraste
import './css/Footer.css'

// ===============================================
// ARTE DO MASCOTE (atrás da logo)
// ===============================================
// Quando a arte existir:
//   import mascotArt from '../../assets/mascote-footer.png'
//   const MASCOT_ART = mascotArt
// Enquanto estiver vazio, o <img> fica no lugar, mas invisível.
const MASCOT_ART = ''

// Imagem transparente de 1px (o <img> invisível precisa de algum "src")
const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

// ===============================================
// CONTEÚDO (troque pelos dados reais)
// ===============================================

// Redes sociais da Trevo Team (troque "#" pelos links reais)
const socials = [
  { label: 'Instagram', url: '#' },
  { label: 'X', url: '#' },
  { label: 'YouTube', url: '#' },
  { label: 'Discord', url: '#' },
]

// Páginas ("href" = rota do App.jsx)
const links = [
  { label: 'Games', href: '/jogo' },
  { label: 'Contact Us', href: '/contato' },
  { label: 'About', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/blog?aba=faq' }, // abre o blog direto na aba FAQ
  { label: 'Privacy', href: '/privacidade' },
]

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* ========== LOGO (com o mascote atrás) ========== */}
      <div className="footer-brand">
        {/* Mascote segurando a logo (invisível até a arte existir) */}
        <img
          className={`footer-mascot ${MASCOT_ART ? '' : 'footer-mascot--empty'}`}
          src={MASCOT_ART || BLANK_IMAGE}
          alt=""
          aria-hidden="true"
        />

        <a href="/" className="footer-logo-link" aria-label="Trevo Team, página inicial">
          <img src={logo} alt="Trevo Team" className="footer-logo logo-light" />
          <img src={logoDark} alt="Trevo Team" className="footer-logo logo-dark" />
        </a>
      </div>

      {/* ========== REDES SOCIAIS ========== */}
      <ul className="footer-socials" aria-label="Redes sociais">
        {socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.url}
              className="footer-social"
              target="_blank"
              rel="noreferrer"
              aria-label={`Trevo Team no ${social.label}`}
            >
              <SocialIcon label={social.label} url={social.url} />
            </a>
          </li>
        ))}
      </ul>

      {/* ========== PÁGINAS ========== */}
      <nav aria-label="Links do rodapé">
        <ul className="footer-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="footer-link">{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ========== COPYRIGHT ========== */}
      <p className="footer-copyright">© Trevo Team {currentYear} all rights reserved</p>
    </footer>
  )
}