/**
 * PÁGINA: DeveloperEditor
 * =======================
 * Criar (/painel/desenvolvedoras/nova) ou editar (/painel/desenvolvedoras/:id)
 * uma desenvolvedora: nome, logotipo, descrição, devs ativos,
 * redes sociais (até 6) e integrantes (até 12, com foto).
 *
 * - Admin: edita qualquer desenvolvedora e, embaixo, cria os logins do
 *   estúdio (componente StudioAccounts).
 * - Estúdio: esta página vira "Meu estúdio" e só abre o estúdio dele.
 * - Trevo Team: os integrantes dela formam a equipe da página About
 *   (apelido, nome, cargo, foto, descrição e até 3 redes de cada um).
 */

import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import StudioAccounts from '../../components/Admin/StudioAccounts'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import '../../styles/globals.css'

const EMPTY = { name: '', logo: '', description: '', activeDevs: 0, socials: [], members: [] }

export default function DeveloperEditor() {
  const { id } = useParams()
  const isNew = !id
  const { run, isAdmin, refreshUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const backTo = isAdmin ? '/painel/desenvolvedoras' : '/painel' // para onde o "Cancelar" volta

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('') // aviso de "salvo" (estúdio fica na página)

  // Aviso que veio junto com a navegação (ex.: "Desenvolvedora criada...")
  useEffect(() => {
    if (location.state?.message) setNotice(location.state.message)
  }, [location.state])

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

  // Redes de UM integrante (lista dentro da lista)
  const MAX_MEMBER_SOCIALS = 3
  const setMemberSocials = (index, fn) =>
    setForm((f) => ({
      ...f,
      members: f.members.map((m, i) => (i === index ? { ...m, socials: fn(m.socials || []) } : m)),
    }))
  const addMemberSocial = (index) => setMemberSocials(index, (list) => [...list, { label: '', url: '' }])
  const setMemberSocial = (index, j, field, value) =>
    setMemberSocials(index, (list) => list.map((s, k) => (k === j ? { ...s, [field]: value } : s)))
  const removeMemberSocial = (index, j) => setMemberSocials(index, (list) => list.filter((_, k) => k !== j))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setMessage('')
    setNotice('')
    setSaving(true)
    const payload = { ...form, activeDevs: Number(form.activeDevs) }
    try {
      const saved = await run((token) =>
        isNew ? api.admin.createDeveloper(token, payload) : api.admin.updateDeveloper(token, id, payload),
      )
      if (!isAdmin) {
        // Estúdio: continua na página e atualiza o nome no menu
        setNotice('Perfil do estúdio salvo.')
        refreshUser().catch(() => {})
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (isNew) {
        // Admin criou: abre a página dela para já criar os logins
        navigate(`/painel/desenvolvedoras/${saved.id}`, {
          replace: true,
          state: { message: 'Desenvolvedora criada. Agora você pode criar os logins do estúdio lá embaixo.' },
        })
      } else {
        navigate('/painel/desenvolvedoras', { state: { message: 'Desenvolvedora salva.' } })
      }
    } catch (err) {
      setErrors(err.details || {})
      setMessage(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  const title = !isAdmin ? 'Meu estúdio' : isNew ? 'Nova desenvolvedora' : 'Editar desenvolvedora'
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
      {notice && <p className="admin-alert" role="status">{notice}</p>}
      {form.isTrevo && (
        <p className="admin-alert admin-alert--trevo" role="note">
          🍀 Esta é a <strong>Trevo Team</strong>. Os integrantes daqui aparecem na seção da equipe da página About.
        </p>
      )}

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
          {form.members.map((member, i) => {
            const socials = member.socials || []
            const socialError = (j, field) => errors[`members.${i}.socials.${j}.${field}`]
            return (
              <div key={i} className="admin-member">
                {/* Linha 1: foto, nome, apelido e cargo */}
                <div className="admin-list-row admin-list-row--member">
                  <ImageUpload label="Foto" value={member.photo} onChange={(v) => setItem('members', i, 'photo', v)} small />
                  <label className={`admin-field ${itemError('members', i, 'name') ? 'has-error' : ''}`}>
                    <span className="admin-label">Nome</span>
                    <input value={member.name} maxLength={60} onChange={(e) => setItem('members', i, 'name', e.target.value)} />
                    {itemError('members', i, 'name') && <span className="admin-field-error">{itemError('members', i, 'name')}</span>}
                  </label>
                  <label className="admin-field">
                    <span className="admin-label">Apelido</span>
                    <input value={member.nickname || ''} maxLength={30} placeholder="Ex.: TECO"
                      onChange={(e) => setItem('members', i, 'nickname', e.target.value)} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-label">Cargo e função</span>
                    <input value={member.role} maxLength={60} placeholder="Ex.: Programador · Front-end"
                      onChange={(e) => setItem('members', i, 'role', e.target.value)} />
                  </label>
                  <button type="button" className="admin-button admin-button--ghost" onClick={() => removeItem('members', i)}
                    aria-label={`Remover integrante ${member.name || i + 1}`}>
                    Remover
                  </button>
                </div>

                {/* Linha 2: descrição */}
                <label className={`admin-field ${itemError('members', i, 'description') ? 'has-error' : ''}`}>
                  <span className="admin-label">Descrição</span>
                  <textarea rows="2" maxLength={600} value={member.description || ''}
                    onChange={(e) => setItem('members', i, 'description', e.target.value)} />
                  {itemError('members', i, 'description') && (
                    <span className="admin-field-error">{itemError('members', i, 'description')}</span>
                  )}
                </label>

                {/* Linha 3: redes da pessoa (viram as bolinhas na página About) */}
                <div className="admin-member-socials">
                  <span className="admin-label">Redes ({socials.length}/{MAX_MEMBER_SOCIALS})</span>
                  {socials.map((social, j) => (
                    <div key={j} className="admin-list-row">
                      <label className={`admin-field ${socialError(j, 'label') ? 'has-error' : ''}`}>
                        <span className="visually-hidden">Nome da rede</span>
                        <input value={social.label} maxLength={30} placeholder="Instagram"
                          onChange={(e) => setMemberSocial(i, j, 'label', e.target.value)} />
                        {socialError(j, 'label') && <span className="admin-field-error">{socialError(j, 'label')}</span>}
                      </label>
                      <label className={`admin-field admin-field--grow ${socialError(j, 'url') ? 'has-error' : ''}`}>
                        <span className="visually-hidden">Link da rede</span>
                        <input value={social.url} placeholder="https://..."
                          onChange={(e) => setMemberSocial(i, j, 'url', e.target.value)} />
                        {socialError(j, 'url') && <span className="admin-field-error">{socialError(j, 'url')}</span>}
                      </label>
                      <button type="button" className="admin-button admin-button--ghost" onClick={() => removeMemberSocial(i, j)}
                        aria-label={`Remover rede ${social.label || j + 1}`}>
                        Remover
                      </button>
                    </div>
                  ))}
                  {socials.length < MAX_MEMBER_SOCIALS && (
                    <button type="button" className="admin-button admin-button--light" onClick={() => addMemberSocial(i)}>
                      + Rede
                    </button>
                  )}
                </div>
              </div>
            )
          })}
          {form.members.length < 12 && (
            <button type="button" className="admin-button admin-button--light"
              onClick={() => addItem('members', { name: '', nickname: '', role: '', photo: '', description: '', socials: [] })}>
              + Adicionar integrante
            </button>
          )}
        </fieldset>

        <div className="admin-form-actions">
          <Link to={backTo} className="admin-button admin-button--ghost">{isAdmin ? 'Cancelar' : 'Voltar'}</Link>
          <button type="submit" className="admin-button admin-button--primary" disabled={saving}>
            {saving ? 'Salvando...' : isNew ? 'Criar desenvolvedora' : 'Salvar alterações'}
          </button>
        </div>
      </form>

      {/* ========== LOGINS DO ESTÚDIO (só admin) ========== */}
      {isAdmin && !isNew && (
        <div className="admin-form admin-after-form">
          <StudioAccounts developerId={Number(id)} />
        </div>
      )}
      {isAdmin && isNew && (
        <p className="admin-hint admin-after-form">
          Depois de criar a desenvolvedora, os logins do estúdio aparecem aqui embaixo.
        </p>
      )}
    </AdminLayout>
  )
}