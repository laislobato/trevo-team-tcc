/**
 * COMPONENTE: ProtectedRoute
 * ==========================
 * Envolve as páginas do painel. Sem login, manda para /login
 * (e depois do login volta para a página que a pessoa tentou abrir).
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, checking } = useAuth()
  const location = useLocation()

  if (checking) return <p className="admin-loading">Conferindo o login...</p>
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
