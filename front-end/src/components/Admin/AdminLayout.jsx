/**
 * COMPONENTE: AdminLayout
 * =======================
 * Moldura de todas as páginas do painel:
 *
 *   ┌──────────────┬──────────────────────────────────────────────┐
 *   │ Trevo Team   │ Painel › Posts › Editar post   [ações]       │  <- topo
 *   │              ├──────────────────────────────────────────────┤
 *   │ CONTEÚDO     │ Título da página                             │
 *   │  Visão geral │ subtítulo                                    │
 *   │  Posts    12 │                                              │
 *   │  Jogos     3 │ conteúdo                                     │
 *   │ SITE ...     │                                              │
 *   │ [você][sair] │                                              │
 *   └──────────────┴──────────────────────────────────────────────┘
 *
 * O menu muda conforme o login:
 * - admin:   Visão geral · Posts · Jogos · Banners · Página About · Desenvolvedoras · Minha conta
 * - estúdio: Visão geral · Posts · Jogos · Meu estúdio · Minha conta
 * No celular, o menu vira uma gaveta aberta pelo botão ☰.
 *
 * Props:
 * - title:    título da página (também vai para a aba do navegador)
 * - subtitle: linha embaixo do título (opcional)
 * - badge:    etiqueta ao lado do título (opcional)
 * - crumbs:   caminho depois de "Painel", ex.: [{ label: 'Posts', to: '/painel/posts' }, { label: 'Editar post' }]
 * - actions:  botões do topo, à direita (opcional)
 * - dirty:    tem mudança sem salvar? Então os links do menu perguntam antes de sair.
 * - counts:   contagem do menu já conhecida pela página, ex.: { posts: 12 } (opcional)
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  BsBoxArrowRight,
  BsBoxArrowUpRight,
  BsBuilding,
  BsChevronRight,
  BsController,
  BsFileText,
  BsGrid1X2,
  BsImages,
  BsList,
  BsPersonCircle,
  BsWindow,
  BsXLg,
} from 'react-icons/bs'
import logo from '../../assets/logo_inverted.png'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { avatarName, initials } from './adminHelpers'
import './css/Admin.css'

const LEAVE_TEXT = 'Você tem alterações que ainda não foram salvas. Sair mesmo assim?'
const DRAWER_QUERY = '(max-width: 900px)' // igual ao Admin.css: abaixo disso o menu vira gaveta
const isDrawerScreen = () => typeof window !== 'undefined' && window.matchMedia(DRAWER_QUERY).matches

// Contagens do menu: ficam guardadas ao trocar de página (o menu não "pisca")
let countCache = { userId: null, values: {} }

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AdminLayout({ title, subtitle, badge, crumbs = [], actions, dirty = false, counts, children }) {
  const { user, isAdmin, logout, run } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawer, setDrawer] = useState(isDrawerScreen) // tela pequena: menu é gaveta
  const closeRef = useRef(null) // botão "fechar" da gaveta
  const openRef = useRef(null) // botão ☰
  const [fetched, setFetched] = useState(() => (countCache.userId === user?.id ? countCache.values : {}))

  // ---------- Título da aba do navegador ----------
  useEffect(() => {
    document.title = `${title} | Painel Trevo Team`
  }, [title])

  // ---------- Contagens do menu (posts, jogos e desenvolvedoras) ----------
  useEffect(() => {
    let alive = true
    const jobs = [
      run((token) => api.admin.listPosts(token)).then((list) => ['posts', list.length]),
      run((token) => api.admin.listGames(token)).then((list) => ['games', list.length]),
    ]
    if (isAdmin) jobs.push(run((token) => api.admin.listDevelopers(token)).then((list) => ['developers', list.length]))

    Promise.allSettled(jobs).then((results) => {
      const values = { ...(countCache.userId === user?.id ? countCache.values : {}) }
      for (const result of results) if (result.status === 'fulfilled') values[result.value[0]] = result.value[1]
      countCache = { userId: user?.id, values }
      if (alive) setFetched(values)
    })
    return () => {
      alive = false
    }
  }, [run, isAdmin, user?.id])

  // ---------- Tela mudou de tamanho: menu fixo <-> gaveta ----------
  useEffect(() => {
    const media = window.matchMedia(DRAWER_QUERY)
    const onChange = () => {
      setDrawer(media.matches)
      if (!media.matches) setMenuOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // ---------- Gaveta aberta: o foco entra nela e o Esc fecha ----------
  useEffect(() => {
    if (!menuOpen) return undefined
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Fecha a gaveta e devolve o foco para o botão ☰
  function closeMenu() {
    setMenuOpen(false)
    openRef.current?.focus()
  }

  const count = { ...fetched, ...counts }

  // Links internos: com mudança sem salvar, pergunta antes de sair
  const guard = (e) => {
    if (dirty && !window.confirm(LEAVE_TEXT)) {
      e.preventDefault()
      return
    }
    setMenuOpen(false)
  }

  const handleLogout = () => {
    if (dirty && !window.confirm(LEAVE_TEXT)) return
    logout()
    navigate('/login')
  }

  // Pular direto para o conteúdo (teclado)
  const skipToContent = (e) => {
    e.preventDefault()
    document.getElementById('admin-conteudo')?.focus()
  }

  // ---------- Grupos do menu ----------
  const groups = [
    {
      label: 'Conteúdo',
      items: [
        { to: '/painel', label: 'Visão geral', icon: BsGrid1X2, end: true },
        { to: '/painel/posts', label: 'Posts', icon: BsFileText, count: count.posts },
        { to: '/painel/jogos', label: 'Jogos', icon: BsController, count: count.games },
      ],
    },
    isAdmin && {
      label: 'Site',
      items: [
        { to: '/painel/banners', label: 'Banners', icon: BsImages },
        { to: '/painel/sobre', label: 'Página About', icon: BsWindow },
      ],
    },
    isAdmin
      ? {
          label: 'Estúdios',
          items: [{ to: '/painel/desenvolvedoras', label: 'Desenvolvedoras', icon: BsBuilding, count: count.developers }],
        }
      : user?.developerId && {
          label: 'Estúdio',
          items: [{ to: `/painel/desenvolvedoras/${user.developerId}`, label: 'Meu estúdio', icon: BsBuilding }],
        },
    {
      label: 'Conta',
      items: [{ to: '/painel/conta', label: 'Minha conta', icon: BsPersonCircle }],
    },
  ].filter(Boolean)

  const roleName = isAdmin ? 'Admin da Trevo' : user?.developer?.name || 'Estúdio'
  const trail = [{ label: 'Painel', to: '/painel' }, ...crumbs]

  return (
    <div className={`admin ${menuOpen ? 'is-menu-open' : ''}`}>
      <a href="#admin-conteudo" className="admin-skip" onClick={skipToContent}>
        Pular para o conteúdo
      </a>

      {/* ========== MENU LATERAL ========== */}
      <aside className="admin-side" id="admin-menu" aria-label="Menu do painel" inert={drawer && !menuOpen}>
        <div className="admin-side-head">
          <Link to="/painel" className="admin-brand" onClick={guard}>
            <img src={logo} alt="" className="admin-brand-logo" />
            <span className="admin-brand-text">
              <strong>Trevo Team</strong>
              <span className="admin-brand-tag">Painel</span>
            </span>
          </Link>
          <button type="button" className="admin-side-close" ref={closeRef} onClick={closeMenu} aria-label="Fechar menu">
            <BsXLg aria-hidden="true" />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Painel">
          {groups.map((group) => (
            <div key={group.label} className="admin-nav-group">
              <p className="admin-nav-label">{group.label}</p>
              <ul className="admin-nav-list">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.end} className="admin-nav-item" onClick={guard}>
                      <item.icon aria-hidden="true" />
                      <span className="admin-nav-text">{item.label}</span>
                      {item.count != null && (
                        <span className="admin-nav-count">
                          {item.count}
                          <span className="visually-hidden"> no total</span>
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="admin-side-end">
          <Link to="/" target="_blank" rel="noreferrer" className="admin-nav-item">
            <BsBoxArrowUpRight aria-hidden="true" />
            <span className="admin-nav-text">Ver o site</span>
            <span className="visually-hidden">(abre em outra aba)</span>
          </Link>

          {/* Quem está conectado */}
          {user && (
            <div className="admin-user">
              <span className="admin-avatar" aria-hidden="true">
                {initials(avatarName(user, isAdmin))}
              </span>
              <span className="admin-user-text">
                <strong title={user.email}>{user.email}</strong>
                <span className={`admin-role admin-role--${isAdmin ? 'admin' : 'studio'}`}>{roleName}</span>
              </span>
              <button type="button" className="admin-logout" onClick={handleLogout} aria-label="Sair do painel" title="Sair">
                <BsBoxArrowRight aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Fundo escuro atrás da gaveta (celular) */}
      <div className="admin-overlay" onClick={closeMenu} aria-hidden="true"></div>

      {/* ========== TOPO + CONTEÚDO ========== */}
      <div className="admin-main">
        <header className="admin-top">
          <button
            type="button"
            className="admin-menu-btn"
            ref={openRef}
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="admin-menu"
            aria-label="Abrir menu"
          >
            <BsList aria-hidden="true" />
          </button>

          <nav className="admin-crumbs" aria-label="Você está em">
            <ol>
              {trail.map((crumb, i) => {
                const last = i === trail.length - 1
                return (
                  <li key={`${crumb.label}-${i}`} className={last ? 'is-current' : ''}>
                    {i > 0 && <BsChevronRight className="admin-crumb-sep" aria-hidden="true" />}
                    {last || !crumb.to ? (
                      <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
                    ) : (
                      <Link to={crumb.to} onClick={guard}>{crumb.label}</Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>

          {actions && <div className="admin-top-actions">{actions}</div>}
        </header>

        <main id="admin-conteudo" className="admin-content" tabIndex={-1}>
          <div className="admin-head">
            <div className="admin-head-row">
              <h1 className="admin-title">{title}</h1>
              {badge}
            </div>
            {subtitle && <p className="admin-subtitle">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}