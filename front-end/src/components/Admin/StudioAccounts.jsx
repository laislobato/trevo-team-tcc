/**
 * COMPONENTE: StudioAccounts
 * ==========================
 * Bloco "Logins do estúdio" na página de uma desenvolvedora (só o admin vê).
 * Com esses logins, o estúdio entra no painel e mexe só no que é dele:
 * os posts e jogos do estúdio e o perfil do estúdio.
 *
 *   Logins do estúdio                                   2
 *   (@) contato@orvalho.com                  [editar] [apagar]
 *   ┌ - - - - - - - - - - - - - - - - - - - - - - - - - - ┐
 *   | E-mail [          ]  Senha [          ]  [Criar login] |
 *   └ - - - - - - - - - - - - - - - - - - - - - - - - - - ┘
 *
 * Props:
 * - developerId: estúdio dono dos logins
 * - id:          id do bloco (as abas do editor rolam até ele)
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { BsPencil, BsPersonCircle, BsTrash } from 'react-icons/bs'
import { Alert, Field, Section } from './AdminUI'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './css/Admin.css'

const EMPTY = { email: '', password: '' }

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function StudioAccounts({ developerId, id }) {
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

  // Enter num campo = clicar no botão do bloco (sem enviar o formulário da desenvolvedora)
  const onEnter = (fn) => (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      fn()
    }
  }

  return (
    <Section id={id} title="Logins do estúdio" note={loading ? '' : String(accounts.length)}>
      <p className="admin-muted admin-gap">
        Quem entra com estes logins só vê e edita os posts, os jogos e o perfil deste estúdio.
      </p>

      {feedback.text && (
        <Alert tone={feedback.type === 'error' ? 'error' : 'ok'} onClose={() => setFeedback({ type: '', text: '' })}>
          {feedback.text}
        </Alert>
      )}

      {loading && <p className="admin-loading">Carregando logins...</p>}
      {!loading && accounts.length === 0 && <p className="admin-muted admin-gap">Este estúdio ainda não tem login.</p>}

      {/* ---------- Lista de logins ---------- */}
      <ul className="admin-accounts">
        {accounts.map((account) =>
          editing?.id === account.id ? (
            // Linha em modo edição
            <li key={account.id} className="admin-account admin-account--editing">
              <Field label="E-mail" error={errors.email}>
                <input type="email" value={editing.email} autoComplete="off"
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })} onKeyDown={onEnter(handleSave)} />
              </Field>
              <Field label="Nova senha" error={errors.password}>
                <input type="password" value={editing.password} autoComplete="new-password" placeholder="vazio = continua a mesma"
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })} onKeyDown={onEnter(handleSave)} />
              </Field>
              <div className="admin-account-buttons">
                <button type="button" className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
                  Salvar
                </button>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setErrors({}) }}>
                  Cancelar
                </button>
              </div>
            </li>
          ) : (
            // Linha normal
            <li key={account.id} className="admin-account">
              <span className="admin-account-icon" aria-hidden="true"><BsPersonCircle /></span>
              <span className="admin-account-email">{account.email}</span>
              <div className="admin-row-actions">
                <button type="button" className="admin-icon-btn" title="Editar" aria-label={`Editar login ${account.email}`}
                  onClick={() => { setEditing({ id: account.id, email: account.email, password: '' }); setErrors({}) }}>
                  <BsPencil aria-hidden="true" />
                </button>
                <button type="button" className="admin-icon-btn admin-icon-btn--danger" title="Apagar"
                  aria-label={`Apagar login ${account.email}`} onClick={() => handleDelete(account)}>
                  <BsTrash aria-hidden="true" />
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {/* ---------- Criar login ---------- */}
      {!editing && (
        <div className="admin-account-new">
          <Field label="E-mail do novo login" error={errors.email}>
            <input type="email" value={newAccount.email} autoComplete="off" placeholder="contato@estudio.com"
              onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })} onKeyDown={onEnter(handleCreate)} />
          </Field>
          <Field label="Senha" error={errors.password}>
            <input type="password" value={newAccount.password} autoComplete="new-password" placeholder="pelo menos 10 caracteres"
              onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })} onKeyDown={onEnter(handleCreate)} />
          </Field>
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleCreate} disabled={saving}>
            Criar login
          </button>
        </div>
      )}
    </Section>
  )
}