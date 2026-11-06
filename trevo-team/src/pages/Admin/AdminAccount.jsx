/**
 * PÁGINA: AdminAccount
 * ====================
 * Troca de senha da conta da equipe (/painel/conta).
 */

import { useState } from 'react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import '../../styles/globals.css'

export default function AdminAccount() {
  const { run } = useAuth()
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
