/**
 * PÁGINA: PostEditor
 * ==================
 * Criar (/painel/posts/novo) ou editar (/painel/posts/:id) um post do blog.
 *
 * - Ao escolher o tipo de um post novo, o subtítulo e o texto recebem o
 *   template daquele tipo (World Premiere, Patch Notes ou Aviso).
 * - Situação "Rascunho" não aparece no site. "Publicado" aparece na data
 *   escolhida: data no futuro = post agendado; sem data = publica agora.
 * - No texto, uma linha em branco começa um novo parágrafo.
 */

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { POST_TYPE_OPTIONS, POST_TEMPLATES } from '../../data/posts'
import '../../styles/globals.css'

const EMPTY = {
  type: 'anuncio',
  title: '',
  excerpt: '',
  subtitle: POST_TEMPLATES.anuncio.subtitle,
  body: POST_TEMPLATES.anuncio.body,
  cover: '',
  gallery: ['', '', ''],
  authorName: '',
  authorPhoto: '',
  developerId: '',
  status: 'rascunho',
  publishedAt: '', // formato do campo datetime-local: "AAAA-MM-DDTHH:MM"
}

/** Data ISO da API -> valor do campo datetime-local (no fuso do computador) */
function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Campo com rótulo, dica e mensagem de erro */
function Field({ label, error, hint, children }) {
  return (
    <label className={`admin-field ${error ? 'has-error' : ''}`}>
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="admin-hint">{hint}</span>}
      {error && <span className="admin-field-error">{error}</span>}
    </label>
  )
}

export default function PostEditor() {
  const { id } = useParams() // sem id = post novo
  const isNew = !id
  const { run } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  // Carrega as desenvolvedoras (para o seletor) e, se for edição, o post
  useEffect(() => {
    const loadPost = isNew ? Promise.resolve(null) : run((token) => api.admin.getPost(token, id))
    Promise.all([run((token) => api.admin.listDevelopers(token)), loadPost])
      .then(([devs, post]) => {
        setDevelopers(devs)
        if (post) {
          setForm({
            type: post.type,
            title: post.title,
            excerpt: post.excerpt,
            subtitle: post.subtitle,
            body: post.body,
            cover: post.cover,
            gallery: [0, 1, 2].map((i) => post.gallery[i] || ''),
            authorName: post.author.name,
            authorPhoto: post.author.photo,
            developerId: post.developerId ?? '',
            status: post.status,
            publishedAt: toLocalInput(post.publishedAt),
          })
        }
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false))
  }, [id, isNew, run])

  // Atualiza um campo
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  // Troca de tipo: num post novo, troca o template se o texto ainda não foi mexido
  const changeType = (type) => {
    setForm((f) => {
      const old = POST_TEMPLATES[f.type]
      const next = { ...f, type }
      if (isNew && (f.subtitle === '' || f.subtitle === old.subtitle)) next.subtitle = POST_TEMPLATES[type].subtitle
      if (isNew && (f.body === '' || f.body === old.body)) next.body = POST_TEMPLATES[type].body
      return next
    })
  }

  const setGallery = (index, value) =>
    setForm((f) => ({ ...f, gallery: f.gallery.map((img, i) => (i === index ? value : img)) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setMessage('')

    // Aviso: publicar com trechos do template ainda entre [ ]
    const leftovers = /\[[^\]]+\]/.test(form.subtitle + form.body)
    if (form.status === 'publicado' && leftovers &&
        !window.confirm('O texto ainda tem trechos do template entre [ ]. Publicar mesmo assim?')) {
      return
    }

    const payload = {
      ...form,
      developerId: form.developerId === '' ? null : Number(form.developerId),
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
    }

    setSaving(true)
    try {
      await run((token) =>
        isNew ? api.admin.createPost(token, payload) : api.admin.updatePost(token, id, payload),
      )
      navigate('/painel', { state: { message: isNew ? 'Post criado.' : 'Post salvo.' } })
    } catch (err) {
      setErrors(err.details || {})
      setMessage(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title={isNew ? 'Novo post' : 'Editar post'}>
        <p className="admin-loading">Carregando...</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={isNew ? 'Novo post' : 'Editar post'}>
      {message && <p className="admin-alert admin-alert--error" role="alert">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        {/* ---------- Conteúdo ---------- */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Conteúdo</legend>

          <div className="admin-grid-2">
            <Field label="Tipo de post" error={errors.type}>
              <select value={form.type} onChange={(e) => changeType(e.target.value)}>
                {POST_TYPE_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Título" error={errors.title}>
              <input value={form.title} maxLength={150} onChange={(e) => set('title', e.target.value)} required />
            </Field>
          </div>

          <Field label="Resumo (aparece na lista do blog)" error={errors.excerpt}>
            <textarea rows="2" maxLength={300} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </Field>

          <Field label="Subtítulo (em negrito, antes do texto)" error={errors.subtitle}>
            <input value={form.subtitle} maxLength={200} onChange={(e) => set('subtitle', e.target.value)} />
          </Field>

          <Field
            label="Texto"
            error={errors.body}
            hint="Deixe uma linha em branco para começar um novo parágrafo. Troque os trechos entre [ ]."
          >
            <textarea rows="12" value={form.body} onChange={(e) => set('body', e.target.value)} />
          </Field>
        </fieldset>

        {/* ---------- Imagens ---------- */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Imagens</legend>
          <ImageUpload label="Capa (lista do blog e banner do post)" value={form.cover} onChange={(v) => set('cover', v)} />
          {errors.cover && <p className="admin-field-error">{errors.cover}</p>}
          <div className="admin-grid-3">
            {form.gallery.map((img, i) => (
              <ImageUpload
                key={i}
                label={i === 0 ? 'Galeria: imagem grande' : `Galeria: imagem ${i + 1}`}
                value={img}
                onChange={(v) => setGallery(i, v)}
              />
            ))}
          </div>
        </fieldset>

        {/* ---------- Autor e desenvolvedora ---------- */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Autor e desenvolvedora</legend>
          <div className="admin-grid-2">
            <Field label="Nome do autor" error={errors.authorName} hint="Vazio = “Equipe Trevo Team”">
              <input value={form.authorName} maxLength={80} onChange={(e) => set('authorName', e.target.value)} />
            </Field>
            <Field label="Desenvolvedora (Developed By)" error={errors.developerId}>
              <select value={form.developerId} onChange={(e) => set('developerId', e.target.value)}>
                <option value="">Nenhuma</option>
                {developers.map((dev) => (
                  <option key={dev.id} value={dev.id}>{dev.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <ImageUpload label="Foto do autor" value={form.authorPhoto} onChange={(v) => set('authorPhoto', v)} small />
          <p className="admin-hint">
            Desenvolvedora nova? <Link to="/painel/desenvolvedoras/nova">Cadastre aqui</Link> e volte para este post.
          </p>
        </fieldset>

        {/* ---------- Publicação ---------- */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Publicação</legend>
          <div className="admin-grid-2">
            <Field label="Situação" error={errors.status}>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="rascunho">Rascunho (não aparece no site)</option>
                <option value="publicado">Publicado</option>
              </select>
            </Field>
            <Field
              label="Data de publicação"
              error={errors.publishedAt}
              hint="Vazio = publica agora. Data no futuro = agendado."
            >
              <input type="datetime-local" value={form.publishedAt} onChange={(e) => set('publishedAt', e.target.value)} />
            </Field>
          </div>
        </fieldset>

        <div className="admin-form-actions">
          <Link to="/painel" className="admin-button admin-button--ghost">Cancelar</Link>
          <button type="submit" className="admin-button admin-button--primary" disabled={saving}>
            {saving ? 'Salvando...' : isNew ? 'Criar post' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
