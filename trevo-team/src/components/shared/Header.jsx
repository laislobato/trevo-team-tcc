/**
 * COMPONENTE: Header
 * ==================
 * Topo de todas as páginas.
 *
 * Computador:
 *   [Logo]  ..................................  [Games  About  Contact  Blog]
 *
 * Celular:
 *   [Logo]          [ - - - ]   <- os 3 tracinhos ficam à DIREITA do logo
 *   (ao clicar nos tracinhos, os links descem em lista logo abaixo)
 *
 * "isOpen" guarda se o menu do celular está aberto ou fechado.
 * No computador o botão dos tracinhos fica escondido pelo CSS.
 */

import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './css/Header.css'
import logo from "../../assets/logo.png"

// Itens do menu: "to" é a rota definida no App.jsx
const navItems = [
  { label: 'Games', to: '/jogo', end: true },
  { label: 'About', to: '/sobre' },
  { label: 'Contact', to: '/contato' },
  { label: 'Blog', to: '/blog' },
]

export default function Header() {
  // false = menu fechado | true = menu aberto (só faz efeito no celular)
  const [isOpen, setIsOpen] = useState(false)

  // Abre ou fecha o menu ao clicar nos tracinhos
  const toggleMenu = () => setIsOpen((open) => !open)

  // Fecha o menu (usado ao clicar em um link ou no logo)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="header">
      <div className="header-wrapper">

        {/* 🔝 GRUPO ESQUERDO: tracinhos (celular) + logo */}
        <div className="header-brand">

          {/* 🟢 LOGO (clicar leva para a Home) */}
          <Link to="/" className="header-logo-section" onClick={closeMenu}>
            <img src={logo} alt="" className="header-logo-img" />
            <h1 className="header-logo-text">Trevo Team</h1>
          </Link>

                    {/* ☰ OS 3 TRACINHOS (só aparecem no celular) */}
          <button
            type="button"
            className={`header-menu-toggle ${isOpen ? 'is-open' : ''}`}
            onClick={toggleMenu}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
            aria-controls="header-nav"
          >
            <span className="header-menu-bar"></span>
            <span className="header-menu-bar"></span>
            <span className="header-menu-bar"></span>
          </button>

        </div>

        {/* 🔗 MENU DE NAVEGAÇÃO
            - Computador: sempre visível, em linha
            - Celular: só aparece quando "is-open" está ativo */}
        <nav
          id="header-nav"
          className={`header-nav ${isOpen ? 'is-open' : ''}`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="header-nav-link"
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  )
}