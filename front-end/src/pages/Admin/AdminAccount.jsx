/**
 * PÁGINA: AdminAccount
 * ====================
 * Dados do login e troca de senha (/painel/conta).
 * Serve para os dois tipos de login: admin da Trevo e estúdio.
 */

import { useState } from 'react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import '../../styles/globals.css'

export default function AdminAccount() {
  const { run, user, isAdmin } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (next !== confirm) {
      setFeedback({ type: 'error', text: 'A confirmação não é igual à nova senha.' })
      return
    }
    setSaving(true)
    try {
      await run((token) => api.changePassword(token, current, next))
      setFeedback({ type: 'ok', text: 'Senha trocada!' })
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Conta">
      <form className="admin-form admin-form--narrow" onSubmit={handleSubmit}>
        {/* ---------- Dados do login ---------- */}
        <section className="admin-card" aria-labelledby="account-info-title">
          <h2 id="account-info-title" className="admin-card-title">Seu login</h2>
          <p><strong>E-mail:</strong> {user?.email}</p>
          <p>
            <strong>Tipo:</strong>{' '}
            {isAdmin
              ? 'Admin da Trevo (mexe em tudo)'
              : `Login de estúdio · ${user?.developer?.name || ''} (mexe só no que é do estúdio)`}
          </p>
          {!isAdmin && (
            <p className="admin-hint">Para trocar o e-mail do login, fale com a equipe da Trevo.</p>
          )}
        </section>

        <fieldset className="admin-card">
          <legend className="admin-card-title">Trocar senha</legend>

          {feedback.text && (
            <p className={`admin-alert ${feedback.type === 'error' ? 'admin-alert--error' : ''}`} role="status">
              {feedback.text}
            </p>
          )}

          <label className="admin-field">
            <span className="admin-label">Senha atual</span>
            <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </label>
          <label className="admin-field">
            <span className="admin-label">Nova senha</span>
            <input type="password" autoComplete="new-password" minLength={10} value={next} onChange={(e) => setNext(e.target.value)} required />
            <span className="admin-hint">Pelo menos 10 caracteres.</span>
          </label>
          <label className="admin-field">
            <span className="admin-label">Confirmar nova senha</span>
            <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </label>

          <button type="submit" className="admin-button admin-button--primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Trocar senha'}
          </button>
        </fieldset>
      </form>
    </AdminLayout>
  )
}
