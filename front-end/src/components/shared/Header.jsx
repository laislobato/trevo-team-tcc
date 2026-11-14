/**
 * COMPONENTE: Header
 * ==================
 * Topo de todas as páginas: uma barra centralizada (não vai de ponta a
 * ponta), verde-acinzentada, com os cantos de baixo arredondados.
 *
 * Computador:
 *   ╭──────────────────────────────────────────────────────────────────────╮
 *   │ [logo_full]        GAMES | CONTACT US | ABOUT | BLOG |  (●) (●) (●)  │
 *   ╰──────────────────────────────────────────────────────────────────────╯
 *
 * Celular:
 *   [logo_full]                                   [ ☰ ]
 *   (ao clicar nos tracinhos, as páginas e as redes descem em lista)
 *
 * Props:
 * - flat: true = a barra FLUTUA por cima do carrossel de banners (Home e /jogo).
 *         Sem ela, a barra fica no topo da página, empurrando o conteúdo.
 *
 * Para usar as logos das redes: coloque as imagens em src/assets, importe aqui
 * e preencha o campo "icon" (ex.: import instagramIcon from '../../assets/instagram.svg').
 */

import { Fragment, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
// ⚠️ Confira a extensão do arquivo na pasta assets (.png, .svg ou .webp)
import logoFull from '../../assets/logo_full.png'
import './css/Header.css'

// Páginas do menu: "to" é a rota definida no App.jsx
const navItems = [
  { label: 'Games', to: '/jogo', end: true },
  { label: 'Contact Us', to: '/contato' },
  { label: 'About', to: '/sobre' },
  { label: 'Blog', to: '/blog' },
]

// Redes sociais (troque "#" pelos links reais e preencha "icon" com a logo)
const socials = [
  { label: 'Instagram', url: '#', icon: '' },
  { label: 'X', url: '#', icon: '' },
  { label: 'Discord', url: '#', icon: '' },
]

export default function Header({ flat = false }) {
  // false = menu fechado | true = menu aberto (só faz efeito no celular)
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen((open) => !open)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className={`header ${flat ? 'header--flat' : ''}`}>
      <div className="header-wrapper">

        {/* 🔝 LOGO (leva para a Home) + TRACINHOS (só no celular) */}
        <div className="header-brand">
          <Link to="/" className="header-logo" onClick={closeMenu} aria-label="Trevo Team: página inicial">
            <img src={logoFull} alt="Trevo Team" className="header-logo-img" />
          </Link>

          <button
            type="button"
            className={`header-menu-toggle ${isOpen ? 'is-open' : ''}`}
            onClick={toggleMenu}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
            aria-controls="header-menu"
          >
            <span className="header-menu-bar"></span>
            <span className="header-menu-bar"></span>
            <span className="header-menu-bar"></span>
          </button>
        </div>

        {/* 🔗 PÁGINAS + REDES
            - Computador: sempre visível, em linha
            - Celular: só aparece quando "is-open" está ativo */}
        <div id="header-menu" className={`header-menu ${isOpen ? 'is-open' : ''}`}>
          <nav className="header-nav" aria-label="Menu principal">
            {navItems.map((item) => (
              <Fragment key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className="header-nav-link"
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
                {/* Tracinho vertical "|" depois de cada página */}
                <span className="header-nav-separator" aria-hidden="true"></span>
              </Fragment>
            ))}
          </nav>

          <ul className="header-socials" aria-label="Redes sociais">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.url}
                  className="header-social"
                  aria-label={`Trevo Team no ${social.label}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.icon && <img src={social.icon} alt="" />}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </header>
  )
}