/**
 * COMPONENTE: StudioAccounts
 * ==========================
 * Bloco "Logins do estúdio" na página de uma desenvolvedora (só o admin vê).
 * Com esses logins, o estúdio entra no painel e mexe só no que é dele:
 * os posts e jogos do estúdio e o perfil do estúdio.
 *
 *   Logins do estúdio
 *   contato@orvalho.com            [Editar] [Apagar]
 *   ---------------------------------------------
 *   E-mail [          ]  Senha [          ]  [Criar login]
 *
 * Props:
 * - developerId: estúdio dono dos logins
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './css/Admin.css'

const EMPTY = { email: '', password: '' }

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function StudioAccounts({ developerId }) {
  const { run } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newAccount, setNewAccount] = useState(EMPTY) // formulário "Criar login"
  const [editing, setEditing] = useState(null) // { id, email, password } do login sendo editado
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  // ---------- Carrega os logins do estúdio ----------
  useEffect(() => {
    run((token) => api.admin.listAccounts(token, developerId))
      .then(setAccounts)
      .catch((err) => setFeedback({ type: 'error', text: err.message }))
      .finally(() => setLoading(false))
  }, [developerId, run])

  /** Roda uma ação, mostra a mensagem e os erros de cada campo */
  const act = async (fn, okText) => {
    setErrors({})
    setFeedback({ type: '', text: '' })
    setSaving(true)
    try {
      await fn()
      setFeedback({ type: 'ok', text: okText })
      return true
    } catch (err) {
      setErrors(err.details || {})
      setFeedback({ type: 'error', text: err.message })
      return false
    } finally {
      setSaving(false)
    }
  }

  // ---------- Criar ----------
  const handleCreate = async () => {
    await act(async () => {
      const account = await run((token) => api.admin.createAccount(token, { ...newAccount, developerId }))
      setAccounts((list) => [...list, account])
      setNewAccount(EMPTY)
    }, 'Login criado. Passe o e-mail e a senha para o estúdio.')
  }

  // ---------- Editar (e-mail e, se preencher, nova senha) ----------
  const handleSave = async () => {
    const ok = await act(async () => {
      const account = await run((token) =>
        api.admin.updateAccount(token, editing.id, { email: editing.email, password: editing.password }),
      )
      setAccounts((list) => list.map((a) => (a.id === account.id ? account : a)))
    }, editing.password ? 'Login salvo com a nova senha.' : 'Login salvo.')
    if (ok) setEditing(null)
  }

  // ---------- Apagar ----------
  const handleDelete = async (account) => {
    if (!window.confirm(`Apagar o login ${account.email}? Ele perde o acesso ao painel na hora.`)) return
    await act(async () => {
      await run((token) => api.admin.deleteAccount(token, account.id))
      setAccounts((list) => list.filter((a) => a.id !== account.id))
    }, `Login ${account.email} apagado.`)
  }

  // Enter num campo = clicar no botão do formulário (sem enviar o formulário da desenvolvedora)
  const onEnter = (fn) => (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      fn()
    }
  }

  return (
    <section className="admin-card" aria-labelledby="studio-accounts-title">
      <h2 id="studio-accounts-title" className="admin-card-title">Logins do estúdio ({accounts.length})</h2>
      <p className="admin-hint">
        Quem entra com estes logins só vê e edita os posts, os jogos e o perfil deste estúdio.
      </p>

      {feedback.text && (
        <p className={`admin-alert ${feedback.type === 'error' ? 'admin-alert--error' : ''}`} role="status">
          {feedback.text}
        </p>
      )}

      {loading && <p className="admin-loading">Carregando logins...</p>}
      {!loading && accounts.length === 0 && <p className="admin-empty">Este estúdio ainda não tem login.</p>}

      {/* ---------- Lista de logins ---------- */}
      <ul className="admin-accounts">
        {accounts.map((account) =>
          editing?.id === account.id ? (
            // Linha em modo edição
            <li key={account.id} className="admin-list-row">
              <label className={`admin-field admin-field--grow ${errors.email ? 'has-error' : ''}`}>
                <span className="admin-label">E-mail</span>
                <input type="email" value={editing.email} autoComplete="off"
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })} onKeyDown={onEnter(handleSave)} />
                {errors.email && <span className="admin-field-error">{errors.email}</span>}
              </label>
              <label className={`admin-field admin-field--grow ${errors.password ? 'has-error' : ''}`}>
                <span className="admin-label">Nova senha</span>
                <input type="password" value={editing.password} autoComplete="new-password" placeholder="vazio = continua a mesma"
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })} onKeyDown={onEnter(handleSave)} />
                {errors.password && <span className="admin-field-error">{errors.password}</span>}
              </label>
              <button type="button" className="admin-button admin-button--primary" onClick={handleSave} disabled={saving}>
                Salvar
              </button>
              <button type="button" className="admin-button admin-button--ghost" onClick={() => { setEditing(null); setErrors({}) }}>
                Cancelar
              </button>
            </li>
          ) : (
            // Linha normal
            <li key={account.id} className="admin-account">
              <span className="admin-account-email">{account.email}</span>
              <div className="admin-table-actions">
                <button type="button" className="admin-button admin-button--light"
                  onClick={() => { setEditing({ id: account.id, email: account.email, password: '' }); setErrors({}) }}>
                  Editar
                </button>
                <button type="button" className="admin-button admin-button--danger" onClick={() => handleDelete(account)}>
                  Apagar
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {/* ---------- Criar login ---------- */}
      {!editing && (
        <div className="admin-list-row admin-account-new">
          <label className={`admin-field admin-field--grow ${errors.email ? 'has-error' : ''}`}>
            <span className="admin-label">E-mail do novo login</span>
            <input type="email" value={newAccount.email} autoComplete="off" placeholder="contato@estudio.com"
              onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })} onKeyDown={onEnter(handleCreate)} />
            {errors.email && <span className="admin-field-error">{errors.email}</span>}
          </label>
          <label className={`admin-field admin-field--grow ${errors.password ? 'has-error' : ''}`}>
            <span className="admin-label">Senha</span>
            <input type="password" value={newAccount.password} autoComplete="new-password" placeholder="pelo menos 10 caracteres"
              onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })} onKeyDown={onEnter(handleCreate)} />
            {errors.password && <span className="admin-field-error">{errors.password}</span>}
          </label>
          <button type="button" className="admin-button admin-button--primary" onClick={handleCreate} disabled={saving}>
            Criar login
          </button>
        </div>
      )}
    </section>
  )
}
