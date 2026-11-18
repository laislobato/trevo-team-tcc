/**
 * PÁGINA: Login
 * =============
 * Entrada do painel da equipe, na rota /login.
 * Não aparece no menu do site: a equipe acessa digitando o endereço.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { Alert, Field } from '../../components/Admin/AdminUI'
import { useAuth } from '../../context/AuthContext'
import '../../styles/globals.css'
import '../../components/Admin/css/Admin.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

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

  useEffect(() => {
    document.title = 'Entrar | Painel Trevo Team'
  }, [])

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
      <main className="login-card">
        <span className="login-star" aria-hidden="true"></span>

        <Link to="/" className="login-brand" aria-label="Trevo Team: voltar para o site">
          <img src={logo} alt="" className="login-logo" />
        </Link>
        <h1 className="login-title">Painel da equipe</h1>
        <p className="login-text">Entre com o e-mail e a senha do seu login.</p>

        <form onSubmit={handleSubmit}>
          <Field label="E-mail">
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Senha">
            <input type="password" autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </Field>

          {error && <Alert tone="error">{error}</Alert>}

          <button type="submit" className="admin-btn admin-btn--primary login-button" disabled={sending}>
            {sending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <Link to="/" className="login-back">← Voltar para o site</Link>
      </main>
    </div>
  )
}