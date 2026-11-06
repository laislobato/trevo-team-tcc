/**
 * PÁGINA: DeveloperEditor
 * =======================
 * Criar (/painel/desenvolvedoras/nova) ou editar (/painel/desenvolvedoras/:id)
 * uma desenvolvedora: nome, logotipo, descrição, devs ativos,
 * redes sociais (até 6) e integrantes (até 12, com foto).
 */

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import '../../styles/globals.css'

const EMPTY = { name: '', logo: '', description: '', activeDevs: 0, socials: [], members: [] }

export default function DeveloperEditor() {
  const { id } = useParams()
  const isNew = !id
  const { run } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isNew) return
    run((token) => api.admin.getDeveloper(token, id))
      .then((dev) => setForm(dev))
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false))
  }, [id, isNew, run])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  // Listas (redes e integrantes): adicionar, mudar e remover itens
  const addItem = (list, item) => setForm((f) => ({ ...f, [list]: [...f[list], item] }))
  const setItem = (list, index, field, value) =>
    setForm((f) => ({ ...f, [list]: f[list].map((it, i) => (i === index ? { ...it, [field]: value } : it)) }))
  const removeItem = (list, index) => setForm((f) => ({ ...f, [list]: f[list].filter((_, i) => i !== index) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setMessage('')
    setSaving(true)
    const payload = { ...form, activeDevs: Number(form.activeDevs) }
    try {
      await run((token) =>
        isNew ? api.admin.createDeveloper(token, payload) : api.admin.updateDeveloper(token, id, payload),
      )
      navigate('/painel/desenvolvedoras', { state: { message: isNew ? 'Desenvolvedora criada.' : 'Desenvolvedora salva.' } })
    } catch (err) {
      setErrors(err.details || {})
      setMessage(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  const title = isNew ? 'Nova desenvolvedora' : 'Editar desenvolvedora'
  if (loading) {
    return (
      <AdminLayout title={title}>
        <p className="admin-loading">Carregando...</p>
      </AdminLayout>
    )
  }

  // Erro de um item de lista, ex.: errors["members.0.name"]
  const itemError = (list, i, field) => errors[`${list}.${i}.${field}`]

  return (
    <AdminLayout title={title}>
      {message && <p className="admin-alert admin-alert--error" role="alert">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <fieldset className="admin-card">
          <legend className="admin-card-title">Estúdio</legend>
          <div className="admin-grid-2">
            <label className={`admin-field ${errors.name ? 'has-error' : ''}`}>
              <span className="admin-label">Nome</span>
              <input value={form.name} maxLength={100} onChange={(e) => set('name', e.target.value)} required />
              {errors.name && <span className="admin-field-error">{errors.name}</span>}
            </label>
            <label className={`admin-field ${errors.activeDevs ? 'has-error' : ''}`}>
              <span className="admin-label">Devs ativos</span>
              <input type="number" min="0" max="999" value={form.activeDevs} onChange={(e) => set('activeDevs', e.target.value)} />
              {errors.activeDevs && <span className="admin-field-error">{errors.activeDevs}</span>}
            </label>
          </div>
          <label className={`admin-field ${errors.description ? 'has-error' : ''}`}>
            <span className="admin-label">Descrição</span>
            <textarea rows="3" maxLength={600} value={form.description} onChange={(e) => set('description', e.target.value)} />
            {errors.description && <span className="admin-field-error">{errors.description}</span>}
          </label>
          <ImageUpload label="Logotipo" value={form.logo} onChange={(v) => set('logo', v)} small />
        </fieldset>

        {/* ---------- Redes sociais ---------- */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Redes sociais ({form.socials.length}/6)</legend>
          {form.socials.map((social, i) => (
            <div key={i} className="admin-list-row">
              <label className="admin-field">
                <span className="admin-label">Rede</span>
                <input value={social.label} placeholder="Instagram" maxLength={30}
                  onChange={(e) => setItem('socials', i, 'label', e.target.value)} />
                {itemError('socials', i, 'label') && <span className="admin-field-error">{itemError('socials', i, 'label')}</span>}
              </label>
              <label className="admin-field admin-field--grow">
                <span className="admin-label">Link</span>
                <input value={social.url} placeholder="https://..."
                  onChange={(e) => setItem('socials', i, 'url', e.target.value)} />
                {itemError('socials', i, 'url') && <span className="admin-field-error">{itemError('socials', i, 'url')}</span>}
              </label>
              <button type="button" className="admin-button admin-button--ghost" onClick={() => removeItem('socials', i)}
                aria-label={`Remover rede ${social.label || i + 1}`}>
                Remover
              </button>
            </div>
          ))}
          {form.socials.length < 6 && (
            <button type="button" className="admin-button admin-button--light" onClick={() => addItem('socials', { label: '', url: '' })}>
              + Adicionar rede
            </button>
          )}
        </fieldset>

        {/* ---------- Integrantes ---------- */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Integrantes ({form.members.length}/12)</legend>
          {form.members.map((member, i) => (
            <div key={i} className="admin-list-row admin-list-row--member">
              <ImageUpload label="Foto" value={member.photo} onChange={(v) => setItem('members', i, 'photo', v)} small />
              <label className="admin-field">
                <span className="admin-label">Nome</span>
                <input value={member.name} maxLength={60} onChange={(e) => setItem('members', i, 'name', e.target.value)} />
                {itemError('members', i, 'name') && <span className="admin-field-error">{itemError('members', i, 'name')}</span>}
              </label>
              <label className="admin-field">
                <span className="admin-label">Função</span>
                <input value={member.role} maxLength={60} placeholder="Arte, programação..."
                  onChange={(e) => setItem('members', i, 'role', e.target.value)} />
              </label>
              <button type="button" className="admin-button admin-button--ghost" onClick={() => removeItem('members', i)}
                aria-label={`Remover integrante ${member.name || i + 1}`}>
                Remover
              </button>
            </div>
          ))}
          {form.members.length < 12 && (
            <button type="button" className="admin-button admin-button--light"
              onClick={() => addItem('members', { name: '', role: '', photo: '' })}>
              + Adicionar integrante
            </button>
          )}
        </fieldset>

        <div className="admin-form-actions">
          <Link to="/painel/desenvolvedoras" className="admin-button admin-button--ghost">Cancelar</Link>
          <button type="submit" className="admin-button admin-button--primary" disabled={saving}>
            {saving ? 'Salvando...' : isNew ? 'Criar desenvolvedora' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
