/**
 * COMPONENTE: ProtectedRoute
 * ==========================
 * Envolve as páginas do painel. Sem login, manda para /login
 * (e depois do login volta para a página que a pessoa tentou abrir).
 *
 * Props:
 * - adminOnly: página só da equipe da Trevo (ex.: lista de desenvolvedoras).
 *              Um login de estúdio que abrir o endereço volta para /painel.
 *
 * Isto só esconde as telas: quem garante a permissão de verdade é a API,
 * que recusa (erro 403) qualquer pedido que o login não pode fazer.
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, checking } = useAuth()
  const location = useLocation()

  if (checking) return <p className="admin-loading">Conferindo o login...</p>
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (adminOnly && !isAdmin) {
    return <Navigate to="/painel" replace state={{ message: 'Essa página é só da equipe da Trevo.' }} />
  }
  return children
}