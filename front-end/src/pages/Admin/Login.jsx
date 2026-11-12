/**
 * PÁGINA: Login
 * =============
 * Entrada do painel da equipe, na rota /login.
 * Não aparece no menu do site: a equipe acessa digitando o endereço.
 */

import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/globals.css'
import '../../components/Admin/css/Admin.css'

export default function Login() {
  const { login, isLoggedIn, checking } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  // Depois do login, volta para a página que a pessoa tentou abrir (ou /painel)
  const destination = location.state?.from || '/painel'

  if (!checking && isLoggedIn) return <Navigate to={destination} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await login(email, password)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="login-star" aria-hidden="true"></span>

        <Link to="/" className="admin-brand login-brand">
          <span className="admin-brand-circle" aria-hidden="true"></span>
          Trevo Team
        </Link>
        <h1 className="login-title">Painel da equipe</h1>

        <label className="admin-field">
          <span className="admin-label">E-mail</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span className="admin-label">Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p className="admin-alert admin-alert--error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="admin-button admin-button--primary login-button" disabled={sending}>
          {sending ? 'Entrando...' : 'Entrar'}
        </button>

        <Link to="/" className="login-back">← Voltar para o site</Link>
      </form>
    </div>
  )
}
