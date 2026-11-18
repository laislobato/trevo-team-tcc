/**
 * PÁGINA: AdminAccount
 * ====================
 * Dados do login e troca de senha (/painel/conta).
 * Serve para os dois tipos de login: admin da Trevo e estúdio.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useState } from 'react'
import { BsKey, BsPersonCircle } from 'react-icons/bs'
import AdminLayout from '../../components/Admin/AdminLayout'
import { Alert, Field, Section } from '../../components/Admin/AdminUI'
import { avatarName, initials } from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import '../../styles/globals.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

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

  const roleName = isAdmin ? 'Admin da Trevo' : user?.developer?.name || 'Estúdio'

  return (
    <AdminLayout title="Minha conta" subtitle="Dados do seu login e troca de senha." crumbs={[{ label: 'Minha conta' }]}>
      <div className="admin-stack admin-narrow">
        {/* ---------- Dados do login ---------- */}
        <Section title="Seu login" icon={BsPersonCircle}>
          <div className="admin-profile admin-gap">
            <span className="admin-avatar" aria-hidden="true">
              {initials(avatarName(user, isAdmin))}
            </span>
            <div className="admin-profile-text">
              <strong>{user?.email}</strong>
              <span className={`admin-role admin-role--${isAdmin ? 'admin' : 'studio'}`}>{roleName}</span>
            </div>
          </div>
          <p className="admin-muted">
            {isAdmin
              ? 'Admin da Trevo: mexe em tudo do painel.'
              : `Login de estúdio: mexe só no que é do ${user?.developer?.name || 'estúdio'}. Para trocar o e-mail do login, fale com a equipe da Trevo.`}
          </p>
        </Section>

        {/* ---------- Trocar senha ---------- */}
        <Section title="Trocar senha" icon={BsKey}>
          {feedback.text && (
            <Alert tone={feedback.type === 'error' ? 'error' : 'ok'} onClose={() => setFeedback({ type: '', text: '' })}>
              {feedback.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Field label="Senha atual">
              <input type="password" autoComplete="current-password" value={current}
                onChange={(e) => setCurrent(e.target.value)} required />
            </Field>
            <div className="admin-grid-2">
              <Field label="Nova senha" hint="Pelo menos 10 caracteres.">
                <input type="password" autoComplete="new-password" minLength={10} value={next}
                  onChange={(e) => setNext(e.target.value)} required />
              </Field>
              <Field label="Confirmar nova senha">
                <input type="password" autoComplete="new-password" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} required />
              </Field>
            </div>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Trocar senha'}
            </button>
          </form>
        </Section>
      </div>
    </AdminLayout>
  )
}