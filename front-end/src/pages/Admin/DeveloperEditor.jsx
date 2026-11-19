/**
 * PÁGINA: DeveloperEditor
 * =======================
 * Criar (/painel/desenvolvedoras/nova) ou editar (/painel/desenvolvedoras/:id)
 * uma desenvolvedora: nome, logotipo, descrição, devs ativos,
 * redes sociais (até 6) e integrantes (até 12, com foto).
 *
 *   [Estúdio] [Redes sociais] [Integrantes] [Logins]      <- abas
 *   formulário                          | Resumo (lateral)
 *   Logins do estúdio (só admin)        |
 *
 * - Admin: edita qualquer desenvolvedora e, embaixo, cria os logins do
 *   estúdio (componente StudioAccounts).
 * - Estúdio: esta página vira "Meu estúdio" e só abre o estúdio dele.
 * - Trevo Team: os integrantes dela formam a equipe da página About
 *   (apelido, nome, cargo, foto, descrição e até 3 redes de cada um).
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BsPlusLg, BsTrash } from 'react-icons/bs'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import StudioAccounts from '../../components/Admin/StudioAccounts'
import { Alert, EditorTabs, Field, SaveBar, Section, Thumb } from '../../components/Admin/AdminUI'
import { plural, useLeaveWarning } from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api, imageUrl } from '../../services/api'
import '../../styles/globals.css'

const FORM_ID = 'developer-form'
const EMPTY = { name: '', logo: '', description: '', activeDevs: 0, socials: [], members: [] }
const MAX_SOCIALS = 6
const MAX_MEMBERS = 12
const MAX_MEMBER_SOCIALS = 3

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function DeveloperEditor() {
  const { id } = useParams()
  const isNew = !id
  const { run, isAdmin, refreshUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState(EMPTY)
  const [saved, setSaved] = useState(EMPTY) // como está salvo (para saber se mudou)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('') // aviso de "salvo" (estúdio fica na página)

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  useLeaveWarning(dirty && !saving)

  // Aviso que veio junto com a navegação (ex.: "Desenvolvedora criada...")
  useEffect(() => {
    if (location.state?.message) setNotice(location.state.message)
  }, [location.state])

  useEffect(() => {
    if (isNew) return
    run((token) => api.admin.getDeveloper(token, id))
      .then((dev) => {
        setForm(dev)
        setSaved(dev)
      })
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
  const setMemberSocials = (index, fn) =>
    setForm((f) => ({
      ...f,
      members: f.members.map((m, i) => (i === index ? { ...m, socials: fn(m.socials || []) } : m)),
    }))
  const addMemberSocial = (index) => setMemberSocials(index, (list) => [...list, { label: '', url: '' }])
  const setMemberSocial = (index, j, field, value) =>
    setMemberSocials(index, (list) => list.map((s, k) => (k === j ? { ...s, [field]: value } : s)))
  const removeMemberSocial = (index, j) => setMemberSocials(index, (list) => list.filter((_, k) => k !== j))

  const discard = () => {
    if (!window.confirm('Descartar as alterações que ainda não foram salvas?')) return
    setForm(saved)
    setErrors({})
    setMessage('')
  }

  // ---------- Salvar ----------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setMessage('')
    setNotice('')
    setSaving(true)
    const payload = { ...form, activeDevs: Number(form.activeDevs) }
    try {
      const result = await run((token) =>
        isNew ? api.admin.createDeveloper(token, payload) : api.admin.updateDeveloper(token, id, payload),
      )
      if (!isAdmin) {
        // Estúdio: continua na página e atualiza o nome no menu
        setForm(result)
        setSaved(result)
        setNotice('Perfil do estúdio salvo.')
        refreshUser().catch(() => {})
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (isNew) {
        // Admin criou: abre a página dela para já criar os logins
        setSaved(form) // não pergunta "sair sem salvar?"
        navigate(`/painel/desenvolvedoras/${result.id}`, {
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

  const title = !isAdmin ? 'Meu estúdio' : isNew ? 'Nova desenvolvedora' : saved.name || 'Editar desenvolvedora'
  const crumbs = isAdmin
    ? [{ label: 'Desenvolvedoras', to: '/painel/desenvolvedoras' }, { label: isNew ? 'Nova' : 'Editar' }]
    : [{ label: 'Meu estúdio' }]

  if (loading) {
    return (
      <AdminLayout title={title} crumbs={crumbs}>
        <p className="admin-loading">Carregando...</p>
      </AdminLayout>
    )
  }

  // Erro de um item de lista, ex.: errors["members.0.name"]
  const itemError = (list, i, field) => errors[`${list}.${i}.${field}`]

  const sections = [
    { id: 'dev-estudio', label: 'Estúdio' },
    { id: 'dev-redes', label: 'Redes sociais' },
    { id: 'dev-integrantes', label: 'Integrantes' },
    ...(isAdmin && !isNew ? [{ id: 'dev-logins', label: 'Logins' }] : []),
  ]

  return (
    <AdminLayout
      title={title}
      subtitle={!isAdmin ? 'O perfil do estúdio aparece no “Desenvolvido por” dos posts.' : undefined}
      crumbs={crumbs}
      dirty={dirty}
      actions={
        <button type="submit" form={FORM_ID} className="admin-btn admin-btn--primary"
          disabled={saving || (!isNew && !dirty)}>
          {saving ? 'Salvando...' : isNew ? 'Criar desenvolvedora' : 'Salvar'}
        </button>
      }
    >
      {message && <Alert tone="error">{message}</Alert>}
      {notice && <Alert onClose={() => setNotice('')}>{notice}</Alert>}
      {form.isTrevo && (
        <Alert tone="trevo">
          Esta é a <strong>Trevo Team</strong>. Os integrantes daqui aparecem na seção da equipe da página About.
        </Alert>
      )}

      <EditorTabs sections={sections} />

      <div className="admin-editor">
        <div className="admin-stack">
          <form id={FORM_ID} className="admin-stack" onSubmit={handleSubmit} noValidate>
            {/* ========== ESTÚDIO ========== */}
            <Section id="dev-estudio" title="Estúdio">
              <div className="admin-grid-2">
                <Field label="Nome" error={errors.name}>
                  <input value={form.name} maxLength={100} onChange={(e) => set('name', e.target.value)} required />
                </Field>
                <Field label="Devs ativos" error={errors.activeDevs}>
                  <input type="number" min="0" max="999" value={form.activeDevs}
                    onChange={(e) => set('activeDevs', e.target.value)} />
                </Field>
              </div>
              <Field label="Descrição" error={errors.description} count={`${(form.description || '').length}/600`}>
                <textarea rows="3" maxLength={600} value={form.description}
                  onChange={(e) => set('description', e.target.value)} />
              </Field>
              <ImageUpload label="Logotipo" value={form.logo} onChange={(v) => set('logo', v)} small contain />
            </Section>

            {/* ========== REDES SOCIAIS ========== */}
            <Section id="dev-redes" title="Redes sociais" note={`${form.socials.length}/${MAX_SOCIALS}`}>
              {form.socials.length === 0 && <p className="admin-muted admin-gap">Nenhuma rede ainda.</p>}
              {form.socials.map((social, i) => (
                <div key={i} className="admin-row admin-row--labeled">
                  <Field label="Rede" error={itemError('socials', i, 'label')}>
                    <input value={social.label} placeholder="Instagram" maxLength={30}
                      onChange={(e) => setItem('socials', i, 'label', e.target.value)} />
                  </Field>
                  <Field label="Link" error={itemError('socials', i, 'url')}>
                    <input value={social.url} placeholder="https://..."
                      onChange={(e) => setItem('socials', i, 'url', e.target.value)} />
                  </Field>
                  <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => removeItem('socials', i)}
                    title="Remover" aria-label={`Remover rede ${social.label || i + 1}`}>
                    <BsTrash aria-hidden="true" />
                  </button>
                </div>
              ))}
              {form.socials.length < MAX_SOCIALS && (
                <button type="button" className="admin-add" onClick={() => addItem('socials', { label: '', url: '' })}>
                  <BsPlusLg aria-hidden="true" /> Adicionar rede
                </button>
              )}
            </Section>

            {/* ========== INTEGRANTES ========== */}
            <Section id="dev-integrantes" title="Integrantes" note={`${form.members.length}/${MAX_MEMBERS}`}>
              {form.members.map((member, i) => {
                const socials = member.socials || []
                const socialError = (j, field) => errors[`members.${i}.socials.${j}.${field}`]
                return (
                  <div key={i} className="admin-item">
                    <div className="admin-item-head">
                      <span className="admin-item-number" aria-hidden="true">{i + 1}</span>
                      <span className="admin-item-title">{member.name || `Integrante ${i + 1}`}</span>
                      <button type="button" className="admin-icon-btn admin-icon-btn--danger"
                        onClick={() => removeItem('members', i)} title="Remover"
                        aria-label={`Remover integrante ${member.name || i + 1}`}>
                        <BsTrash aria-hidden="true" />
                      </button>
                    </div>

                    <div className="admin-item-body">
                      <ImageUpload label="Foto" value={member.photo} onChange={(v) => setItem('members', i, 'photo', v)} small />
                      <div className="admin-item-fields">
                        <div className="admin-grid-3">
                          <Field label="Nome" error={itemError('members', i, 'name')}>
                            <input value={member.name} maxLength={60}
                              onChange={(e) => setItem('members', i, 'name', e.target.value)} />
                          </Field>
                          <Field label="Apelido" error={itemError('members', i, 'nickname')}>
                            <input value={member.nickname || ''} maxLength={30} placeholder="Ex.: TECO"
                              onChange={(e) => setItem('members', i, 'nickname', e.target.value)} />
                          </Field>
                          <Field label="Cargo e função" error={itemError('members', i, 'role')}>
                            <input value={member.role} maxLength={60} placeholder="Ex.: Programador · Front-end"
                              onChange={(e) => setItem('members', i, 'role', e.target.value)} />
                          </Field>
                        </div>
                        <Field label="Descrição" error={itemError('members', i, 'description')}>
                          <textarea rows="2" maxLength={600} value={member.description || ''}
                            onChange={(e) => setItem('members', i, 'description', e.target.value)} />
                        </Field>

                        {/* Redes da pessoa (viram as bolinhas na página About) */}
                        <p className="admin-subhead">
                          Redes <span>({socials.length}/{MAX_MEMBER_SOCIALS})</span>
                        </p>
                        {socials.map((social, j) => (
                          <div key={j} className="admin-row">
                            <Field label="Nome da rede" hideLabel error={socialError(j, 'label')}>
                              <input value={social.label} maxLength={30} placeholder="Instagram"
                                onChange={(e) => setMemberSocial(i, j, 'label', e.target.value)} />
                            </Field>
                            <Field label="Link da rede" hideLabel error={socialError(j, 'url')}>
                              <input value={social.url} placeholder="https://..."
                                onChange={(e) => setMemberSocial(i, j, 'url', e.target.value)} />
                            </Field>
                            <button type="button" className="admin-icon-btn admin-icon-btn--danger"
                              onClick={() => removeMemberSocial(i, j)} title="Remover"
                              aria-label={`Remover rede ${social.label || j + 1}`}>
                              <BsTrash aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                        {socials.length < MAX_MEMBER_SOCIALS && (
                          <button type="button" className="admin-text-btn" onClick={() => addMemberSocial(i)}>
                            <BsPlusLg aria-hidden="true" /> Adicionar rede
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {form.members.length < MAX_MEMBERS && (
                <button type="button" className="admin-add"
                  onClick={() => addItem('members', { name: '', nickname: '', role: '', photo: '', description: '', socials: [] })}>
                  <BsPlusLg aria-hidden="true" /> Adicionar integrante
                </button>
              )}
            </Section>

            <SaveBar show={dirty} saving={saving} form={FORM_ID} onDiscard={discard}
              saveLabel={isNew ? 'Criar desenvolvedora' : 'Salvar alterações'} />
          </form>

          {/* ========== LOGINS DO ESTÚDIO (só admin) ========== */}
          {isAdmin && !isNew && <StudioAccounts id="dev-logins" developerId={Number(id)} />}
          {isAdmin && isNew && (
            <p className="admin-muted">Depois de criar a desenvolvedora, os logins do estúdio aparecem aqui embaixo.</p>
          )}
        </div>

        {/* ========== LATERAL: RESUMO ========== */}
        <aside className="admin-aside" aria-label="Resumo">
          <Section title="Resumo">
            <div className="admin-profile admin-gap">
              <Thumb src={imageUrl(form.logo)} contain round />
              <div className="admin-profile-text">
                <strong>{form.name || 'Nome do estúdio'}</strong>
                <span className="admin-muted">{plural(Number(form.activeDevs) || 0, 'dev ativo', 'devs ativos')}</span>
              </div>
            </div>
            <dl className="admin-facts">
              <div>
                <dt>Integrantes</dt>
                <dd>{form.members.length}/{MAX_MEMBERS}</dd>
              </div>
              <div>
                <dt>Redes sociais</dt>
                <dd>{form.socials.length}/{MAX_SOCIALS}</dd>
              </div>
            </dl>
            <p className="admin-note">
              {form.isTrevo
                ? 'Os integrantes aparecem na seção da equipe da página About.'
                : 'Aparece no “Desenvolvido por” dos posts e como estúdio dos jogos.'}
            </p>
          </Section>
        </aside>
      </div>
    </AdminLayout>
  )
}