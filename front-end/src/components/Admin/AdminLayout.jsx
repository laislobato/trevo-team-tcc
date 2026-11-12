/**
 * COMPONENTE: AdminLayout
 * =======================
 * Moldura de todas as páginas do painel:
 *
 *   [● Trevo Team · Painel]   [Posts] [Jogos] [Desenvolvedoras] [Conta]   [Ver site] [Sair]
 *   -----------------------------------------------------------------------------------
 *   título da página                                              [botão de ação]
 *   Conectado como ... · Admin da Trevo | Estúdio X
 *   conteúdo
 *
 * O menu muda conforme o login:
 * - admin:  Posts · Jogos · Desenvolvedoras · Conta
 * - estúdio: Posts · Jogos · Meu estúdio · Conta
 *
 * Props:
 * - title:   título da página
 * - actions: botões à direita do título (opcional)
 */

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './css/Admin.css'

export default function AdminLayout({ title, actions, children }) {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin">
      <header className="admin-bar">
        <Link to="/painel" className="admin-brand">
          <span className="admin-brand-circle" aria-hidden="true"></span>
          Trevo Team <span className="admin-brand-tag">Painel</span>
        </Link>

        {/* ---------- Menu (muda para admin ou estúdio) ---------- */}
        <nav className="admin-nav" aria-label="Painel">
          <NavLink to="/painel" end className="admin-nav-link">Posts</NavLink>
          <NavLink to="/painel/jogos" className="admin-nav-link">Jogos</NavLink>
          {isAdmin ? (
            <NavLink to="/painel/desenvolvedoras" className="admin-nav-link">Desenvolvedoras</NavLink>
          ) : (
            user?.developerId && (
              <NavLink to={`/painel/desenvolvedoras/${user.developerId}`} className="admin-nav-link">
                Meu estúdio
              </NavLink>
            )
          )}
          <NavLink to="/painel/conta" className="admin-nav-link">Conta</NavLink>
        </nav>

        <div className="admin-bar-end">
          <Link to="/" className="admin-nav-link" target="_blank" rel="noreferrer">Ver site ↗</Link>
          <button type="button" className="admin-button admin-button--ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-title-row">
          <div>
            <h1 className="admin-title">{title}</h1>
            {user && (
              <p className="admin-user">
                Conectado como {user.email} ·{' '}
                <span className={`admin-role admin-role--${isAdmin ? 'admin' : 'studio'}`}>
                  {isAdmin ? 'Admin da Trevo' : user.developer?.name || 'Estúdio'}
                </span>
              </p>
            )}
          </div>
          {actions && <div className="admin-actions">{actions}</div>}
        </div>
        {children}
      </main>
    </div>
  )
}