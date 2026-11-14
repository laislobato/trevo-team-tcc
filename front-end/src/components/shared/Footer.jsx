/**
 * COMPONENTE: Footer
 * ==================
 * Rodapé verde-escuro, de ponta a ponta da tela:
 *
 *   [logo_full]          Quick Links     Contact us              Join Newsletter
 *   texto da Trevo       Games           (●) e-mail              [ Email        (→) ]
 *   (●)(●)(●)(●)         Contact Us      (●) telefone                  ★ (arte)
 *                        About
 *                        Blog
 *   ──────────────────────────────────────────────────────────────────────────
 *                © Trevo Team 2026 all rights reserved      FAQ  Privacy  Terms & Condition
 *
 * No celular as colunas ficam uma embaixo da outra.
 *
 * Ícones das redes e do contato: SocialIcon (escolhe pelo nome ou pelo link).
 * Arte do rodapé (hoje uma estrela): veja FOOTER_ART logo abaixo
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useState } from 'react'
import Art from './Art'
import SocialIcon from './SocialIcon'
import logoFull from '../../assets/logo_full.png'
import './css/Footer.css'

// ⭐ ARTE DO RODAPÉ: troque a estrela pela arte quando ela existir
//   import footerArt from '../../assets/arte-footer.png'
//   const FOOTER_ART = footerArt
const FOOTER_ART = ''

// ===============================================
// CONTEÚDO (troque pelos dados reais)
// ===============================================

const ABOUT_TEXT =
  'Publisher indie que divulga e financia jogos independentes, do primeiro protótipo ao lançamento.'

// Redes sociais da Trevo Team (troque "#" pelos links reais)
const socials = [
  { label: 'Instagram', url: '#' },
  { label: 'X', url: '#' },
  { label: 'YouTube', url: '#' },
  { label: 'Discord', url: '#' },
]

// Páginas do site
const quickLinks = [
  { label: 'Games', href: '/jogo' },
  { label: 'Contact Us', href: '/contato' },
  { label: 'About', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
]

// Contato (EXEMPLO: troque pelo e-mail e telefone reais)
const contacts = [
  { label: 'E-mail', text: 'contato@gmail.com', href: 'mailto:contato@gmail.com' },
  { label: 'Telefone', text: '+14 99119 8597', href: 'tel:+14991198597' },
]

// Links da linha de baixo (Privacy e Terms ainda vão ser criadas)
const legalLinks = [
  { label: 'FAQ', href: '/blog?aba=faq' }, // abre o blog direto na aba FAQ
  { label: 'Privacy', href: '/privacidade' },
  { label: 'Terms & Condition', href: '/termos' },
]

/** Bolinha laranja com o ícone na cor do rodapé */
function IconCircle({ label, url }) {
  return (
    <span className="footer-icon" aria-hidden="true">
      <SocialIcon label={label} url={url} />
    </span>
  )
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Newsletter: por enquanto só confirma na tela (ainda não há envio para o backend)
  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* ========== COLUNAS ========== */}
        <div className="footer-columns">
          {/* ---------- 1. Logo, texto e redes ---------- */}
          <div className="footer-col footer-brand">
            <a href="/" className="footer-logo-link" aria-label="Trevo Team, página inicial">
              <img src={logoFull} alt="Trevo Team" className="footer-logo" />
            </a>
            <p className="footer-about">{ABOUT_TEXT}</p>
            <ul className="footer-socials" aria-label="Redes sociais">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.url} className="footer-social" target="_blank" rel="noreferrer"
                    aria-label={`Trevo Team no ${social.label}`}>
                    <IconCircle label={social.label} url={social.url} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- 2. Quick Links ---------- */}
          <nav className="footer-col" aria-labelledby="footer-links-title">
            <h2 id="footer-links-title" className="footer-title">Quick Links</h2>
            <ul className="footer-list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-link">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- 3. Contact us ---------- */}
          <div className="footer-col">
            <h2 className="footer-title">Contact us</h2>
            <ul className="footer-list">
              {contacts.map((contact) => (
                <li key={contact.label}>
                  <a href={contact.href} className="footer-link footer-contact">
                    <IconCircle label={contact.label} url={contact.href} />
                    <span className="visually-hidden">{contact.label}: </span>
                    {contact.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- 4. Newsletter + arte ---------- */}
          <div className="footer-col footer-newsletter">
            <h2 className="footer-title">Join Newsletter</h2>
            <form className="footer-form" onSubmit={handleSubscribe}>
              <label htmlFor="footer-email" className="visually-hidden">Seu e-mail</label>
              <input id="footer-email" type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" aria-label="Inscrever na newsletter">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            <p className="footer-form-status" role="status">
              {subscribed ? '✓ E-mail inscrito!' : ''}
            </p>

            {/* ⭐ Arte (hoje uma estrela; ver FOOTER_ART no topo do arquivo) */}
            <Art src={FOOTER_ART} size={84} color="gray" className="footer-art" />
          </div>
        </div>

        {/* ========== LINHA DE BAIXO ========== */}
        <div className="footer-bottom">
          <p className="footer-copyright">© Trevo Team {currentYear} all rights reserved</p>
          <ul className="footer-legal">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="footer-link">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}