/**
 * COMPONENTE: Footer
 * ==================
 * Rodapé com duas versões (o CSS mostra uma ou outra):
 *
 * COMPUTADOR
 *   ▬▬▬▬ faixa com as cores da paleta ▬▬▬▬
 *   [ (rede) (rede) (rede) (rede)         Games  Contact Us  About  Blog   ★ ]  <- faixa verde-escura
 *   [ Privacy · © Trevo Team 2026 all rights reserved                         ]  <- faixa branca
 *
 * CELULAR
 *   ╭──────────────────────────────────────╮
 *   │ PRIVACY    (rede)(rede)(rede)(rede) ● │  <- faixa verde-escura, cantos arredondados
 *   │    Games  Contact Us  About  Blog    │  <- caixa branca
 *   │ © Trevo Team 2026 all rights reserved│
 *   ╰──────────────────────────────────────╯
 *
 * Para usar as logos das redes: coloque as imagens em src/assets,
 * importe aqui em cima e preencha o campo "icon" de cada rede.
 *   ex.: import instagramIcon from '../../assets/instagram.svg'
 *        { label: 'Instagram', url: 'https://...', icon: instagramIcon }
 * Sem "icon", a bolinha mostra a primeira letra da rede.
 */

import './css/Footer.css'
import logo from "../../assets/logo.png"

// Páginas do rodapé (mesma ordem do protótipo)
const footerLinks = [
  { label: 'Games', href: '/jogo' },
  { label: 'Contact Us', href: '/contato' },
  { label: 'About', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
]

// Redes sociais da Trevo Team (troque "#" pelos links reais)
const socials = [
  { label: 'Instagram', url: '#', icon: '' },
  { label: 'X', url: '#', icon: '' },
  { label: 'YouTube', url: '#', icon: '' },
  { label: 'Discord', url: '#', icon: '' },
]

// Página da política de privacidade (ainda vai ser criada)
const PRIVACY_URL = '/privacidade'

function FooterNav({ className = '' }) {
  return (
    <nav className={`footer-nav ${className}`} aria-label="Navegação do rodapé">
      {footerLinks.map((link) => (
        <a key={link.href} href={link.href} className="footer-link">
          {link.label}
        </a>
      ))}
    </nav>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* Faixa fina com as cores da paleta (só no computador) */}
      <div className="footer-stripe footer-only-desktop" aria-hidden="true"></div>

      {/* ========== FAIXA VERDE-ESCURA ========== */}
      <div className="footer-bar">
        <div className="footer-inner">
          {/* Celular: link de privacidade fica aqui */}
          <a href={PRIVACY_URL} className="footer-privacy footer-only-mobile">PRIVACY</a>

          {/* Redes sociais */}
          <ul className="footer-socials" aria-label="Redes sociais">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.url}
                  className="footer-social"
                  aria-label={`Trevo Team no ${social.label}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.icon ? <img src={social.icon} alt="" /> : social.label.charAt(0)}
                </a>
              </li>
            ))}
          </ul>

          {/* Computador: páginas na faixa verde + estrela */}
          <FooterNav className="footer-only-desktop" />
          <span className="footer-star footer-only-desktop" aria-hidden="true"></span>

          {/* Celular: círculo verde (lugar da logo) */}
          <img src={logo} alt=""  className="footer-badge footer-only-mobile" aria-hidden="true"></img>
        </div>
      </div>

      {/* ========== FAIXA BRANCA ========== */}
      <div className="footer-bottom">
        <div className="footer-inner">
          {/* Celular: páginas ficam aqui */}
          <FooterNav className="footer-nav--bottom footer-only-mobile" />

          <p className="footer-copyright">
            <span className="footer-only-desktop">
              <a href={PRIVACY_URL} className="footer-privacy-link">Privacy</a> ·{' '}
            </span>
            © Trevo Team {currentYear} all rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}