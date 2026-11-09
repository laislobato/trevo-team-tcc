/**
 * COMPONENTE: Footer
 * ==================
 * Rodapé compacto em duas faixas:
 *
 *   [● Trevo Team]                         Home  Games  About  Contact Us  Blog
 *   © 2026 Trevo Team...          contato@trevoteam.com · (11) 9 0000-0000 · São Paulo, SP
 *
 * No celular, cada parte fica centralizada uma embaixo da outra.
 */

import './css/Footer.css'
import logo from "../../assets/logo.png"

// Páginas do rodapé (mesma ordem do menu)
const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Games', href: '/jogo' },
  { label: 'About', href: '/sobre' },
  { label: 'Contact Us', href: '/contato' },
  { label: 'Blog', href: '/blog' },
]

// Contato (provisório)
const contactItems = [
  { label: 'contato@trevoteam.com', href: 'mailto:contato@trevoteam.com' },
  { label: '(11) 9 0000-0000', href: 'tel:+5511900000000' },
  { label: 'São Paulo, SP' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* ========== FAIXA DE CIMA: logo + páginas ========== */}
      <div className="footer-bar">
        <div className="footer-inner">
          <a href="/" className="footer-logo-section" aria-label="Trevo Team: página inicial">
            <img src={logo} alt="" className="footer-logo-img" />
            <span className="footer-logo-text">Trevo Team</span>
          </a>

          <nav className="footer-nav" aria-label="Navegação do rodapé">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="footer-link">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ========== FAIXA DE BAIXO: copyright + contato ========== */}
      <div className="footer-bottom">
        <div className="footer-inner">
          <p className="footer-copyright">
            © {currentYear} Trevo Team. Todos os direitos reservados.
          </p>

          <ul className="footer-contact" aria-label="Contato">
            {contactItems.map((item) =>
              <li key={item.label}>
                {item.href ? <a href={item.href}>{item.label}</a> : item.label}
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  )
}