/**
 * COMPONENTE: Footer
 * ==================
 * Rodapé da página com informações e links
 * 
 * Contém:
 * - Informações da empresa
 * - Links de navegação
 * - Links de redes sociais (futuro)
 * - Copyri ght
 */

import './css/Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Links do footer
  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Games', href: '/jogo' },
    { label: 'About', href: '/sobre' },
    { label: 'Contact Us', href: '/contato' },
    { label: 'Blog', href: '/blog' }
  ]

  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Seção esquerda - Logo e descrição */}
        <div className="footer-section footer-section-about">
          <div className="footer-logo-section">
            <div className="footer-logo-circle"></div>
            <h3 className="footer-logo-text">Trevo Team</h3>
          </div>
          <p className="footer-description">
            Transformando ideias em realidade através de tecnologia e inovação.
          </p>
        </div>

        {/* Seção central - Links */}
        <div className="footer-section footer-section-links">
          <h4 className="footer-section-title">NAVEGAÇÃO</h4>
          <nav className="footer-nav">
            {footerLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Seção direita - Contato (futuro) */}
        <div className="footer-section footer-section-contact">
          <h4 className="footer-section-title">CONTATO</h4>
          <p className="footer-contact-info">
            📧 contato@trevoteam.com<br/>
            📱 (11) 9 0000-0000<br/>
            📍 São Paulo, SP
          </p>
        </div>
      </div>

      {/* Linha divisora */}
      <div className="footer-divider"></div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>
          © {currentYear} Trevo Team. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}