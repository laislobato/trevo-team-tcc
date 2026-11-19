/**
 * PÁGINA: PostEditor
 * ==================
 * Criar (/painel/posts/novo) ou editar (/painel/posts/:id) um post do blog.
 *
 *   [Conteúdo] [Imagens] [Autor e estúdio] [Publicação]      <- abas
 *   ┌ formulário ─────────────────┐ ┌ Publicação ──────┐
 *   │ Conteúdo / Imagens / Autor  │ │ Prévia no blog   │
 *   └─────────────────────────────┘ └──────────────────┘
 *   [● Alterações não salvas            Descartar  Salvar]  <- só com mudança
 *
 * - Ao escolher o tipo de um post novo, o subtítulo e o texto recebem o
 *   template daquele tipo (World Premiere, Patch Notes ou Aviso).
 * - Situação "Rascunho" não aparece no site. "Publicado" aparece na data
 *   escolhida: data no futuro = post agendado; sem data = publica agora.
 * - No texto, uma linha em branco começa um novo parágrafo.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BsCheckCircle, BsClock, BsEye, BsPencil, BsTrash } from 'react-icons/bs'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import { Alert, EditorTabs, Field, SaveBar, Section, StatusBadge } from '../../components/Admin/AdminUI'
import { hasTemplateLeftovers, postStatus, useLeaveWarning } from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api, imageUrl } from '../../services/api'
import { POST_TYPES, POST_TYPE_OPTIONS, POST_TEMPLATES } from '../../data/posts'
import '../../styles/globals.css'

const FORM_ID = 'post-form'
const LEAVE_TEXT = 'Você tem alterações que ainda não foram salvas. Sair mesmo assim?'

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

const SECTIONS = [
  { id: 'post-conteudo', label: 'Conteúdo' },
  { id: 'post-imagens', label: 'Imagens' },
  { id: 'post-autor', label: 'Autor e estúdio' },
  { id: 'post-publicacao', label: 'Publicação' },
]

/** Data ISO da API -> valor do campo datetime-local (no fuso do computador) */
function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Post da API -> formulário */
const toForm = (post) => ({
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

/** Recado da lateral, conforme a situação escolhida */
function publishNote(form) {
  if (form.status === 'rascunho') return { tone: 'draft', icon: BsPencil, text: 'Rascunho: não aparece no site.' }
  if (form.publishedAt && new Date(form.publishedAt) > new Date()) {
    const when = new Date(form.publishedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    return { tone: 'scheduled', icon: BsClock, text: `Agendado: aparece no blog em ${when}.` }
  }
  return { tone: 'published', icon: BsCheckCircle, text: 'Publicado: aparece no blog do site.' }
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function PostEditor() {
  const { id } = useParams() // sem id = post novo
  const isNew = !id
  const { run, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [saved, setSaved] = useState(EMPTY) // como está salvo (para saber se mudou)
  const [post, setPost] = useState(null) // post da API (endereço e situação salva)
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  useLeaveWarning(dirty && !saving)

  // ---------- Carrega as desenvolvedoras e, se for edição, o post ----------
  useEffect(() => {
    const loadPost = isNew ? Promise.resolve(null) : run((token) => api.admin.getPost(token, id))
    Promise.all([run((token) => api.admin.listDevelopers(token)), loadPost])
      .then(([devs, data]) => {
        setDevelopers(devs)
        if (data) {
          setPost(data)
          setForm(toForm(data))
          setSaved(toForm(data))
        }
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false))
  }, [id, isNew, run])

  // ---------- Funções para mudar o formulário ----------
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

    // Aviso: publicar com trechos do template ainda entre [ ]
    if (form.status === 'publicado' && hasTemplateLeftovers(form.subtitle + form.body) &&
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
      await run((token) => (isNew ? api.admin.createPost(token, payload) : api.admin.updatePost(token, id, payload)))
      navigate('/painel/posts', { state: { message: isNew ? 'Post criado.' : 'Post salvo.' } })
    } catch (err) {
      setErrors(err.details || {})
      setMessage(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  // ---------- Apagar (só post que já existe) ----------
  const handleDelete = async () => {
    if (!window.confirm(`Apagar o post "${post.title}"? Isso não pode ser desfeito.`)) return
    try {
      await run((token) => api.admin.deletePost(token, id))
      navigate('/painel/posts', { state: { message: `Post "${post.title}" apagado.` } })
    } catch (err) {
      setMessage(err.message)
    }
  }

  const pageTitle = isNew ? 'Novo post' : post?.title || 'Editar post'
  const crumbs = [{ label: 'Posts', to: '/painel/posts' }, { label: isNew ? 'Novo post' : 'Editar post' }]

  if (loading) {
    return (
      <AdminLayout title={isNew ? 'Novo post' : 'Editar post'} crumbs={crumbs}>
        <p className="admin-loading">Carregando...</p>
      </AdminLayout>
    )
  }

  const savedStatus = post ? postStatus(post) : null
  const note = publishNote(form)

  return (
    <AdminLayout
      title={pageTitle}
      crumbs={crumbs}
      badge={savedStatus && <StatusBadge status={savedStatus} />}
      dirty={dirty}
      actions={
        <>
          {savedStatus === 'published' && (
            <Link to={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="admin-btn admin-btn--ghost">
              <BsEye aria-hidden="true" /> <span className="admin-btn-text">Ver no site</span>
            </Link>
          )}
          <button type="submit" form={FORM_ID} className="admin-btn admin-btn--primary"
            disabled={saving || (!isNew && !dirty)}>
            {saving ? 'Salvando...' : isNew ? 'Criar post' : 'Salvar'}
          </button>
        </>
      }
    >
      {message && <Alert tone="error">{message}</Alert>}

      <EditorTabs sections={SECTIONS} />

      <form id={FORM_ID} className="admin-editor" onSubmit={handleSubmit} noValidate>
        <div className="admin-stack">
          {/* ========== CONTEÚDO ========== */}
          <Section id="post-conteudo" title="Conteúdo">
            <div className="admin-grid-2">
              <Field label="Tipo de post" error={errors.type}>
                <select value={form.type} onChange={(e) => changeType(e.target.value)}>
                  {POST_TYPE_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Título" error={errors.title} count={`${form.title.length}/150`}>
                <input value={form.title} maxLength={150} onChange={(e) => set('title', e.target.value)} required />
              </Field>
            </div>

            <Field label="Resumo" hint="Aparece na lista do blog, embaixo do título." error={errors.excerpt}
              count={`${form.excerpt.length}/300`}>
              <textarea rows="2" maxLength={300} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
            </Field>

            <Field label="Subtítulo" hint="Em negrito, antes do texto." error={errors.subtitle}>
              <input value={form.subtitle} maxLength={200} onChange={(e) => set('subtitle', e.target.value)} />
            </Field>

            <Field
              label="Texto"
              error={errors.body}
              hint="Deixe uma linha em branco para começar um novo parágrafo. Troque os trechos entre [ ]."
            >
              <textarea rows="12" value={form.body} onChange={(e) => set('body', e.target.value)} />
            </Field>
          </Section>

          {/* ========== IMAGENS ========== */}
          <Section id="post-imagens" title="Imagens">
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
          </Section>

          {/* ========== AUTOR E ESTÚDIO ========== */}
          <Section id="post-autor" title="Autor e estúdio">
            <div className="admin-grid-2">
              <Field label="Nome do autor" error={errors.authorName} hint="Vazio = “Equipe Trevo Team”">
                <input value={form.authorName} maxLength={80} onChange={(e) => set('authorName', e.target.value)} />
              </Field>
              <Field label="Desenvolvedora (Desenvolvido por)" error={errors.developerId}>
                <select value={form.developerId} onChange={(e) => set('developerId', e.target.value)}>
                  <option value="">Nenhuma</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <ImageUpload label="Foto do autor" value={form.authorPhoto} onChange={(v) => set('authorPhoto', v)} small />
            {isAdmin && (
              <p className="admin-hint">
                Desenvolvedora nova?{' '}
                <Link to="/painel/desenvolvedoras/nova"
                  onClick={(e) => dirty && !window.confirm(LEAVE_TEXT) && e.preventDefault()}>
                  Cadastre aqui
                </Link>{' '}
                e volte para este post.
              </p>
            )}
          </Section>
        </div>

        {/* ========== LATERAL ========== */}
        <aside className="admin-aside" aria-label="Publicação e prévia">
          <Section id="post-publicacao" title="Publicação">
            <Field label="Situação" error={errors.status}>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="rascunho">Rascunho (não aparece no site)</option>
                <option value="publicado">Publicado</option>
              </select>
            </Field>
            <Field label="Data de publicação" error={errors.publishedAt}
              hint="Vazio = publica agora. Data no futuro = agendado.">
              <input type="datetime-local" value={form.publishedAt} onChange={(e) => set('publishedAt', e.target.value)} />
            </Field>
            <p className={`admin-note admin-note--${note.tone}`}>
              <note.icon aria-hidden="true" /> {note.text}
            </p>
            {!isNew && (
              <div className="admin-aside-danger">
                <button type="button" className="admin-text-btn admin-text-btn--danger" onClick={handleDelete}>
                  <BsTrash aria-hidden="true" /> Apagar post
                </button>
              </div>
            )}
          </Section>

          {/* Como o card aparece na lista do blog */}
          <Section title="Prévia na lista do blog">
            <div className="admin-preview">
              <span className="admin-preview-img">
                {form.cover ? <img src={imageUrl(form.cover)} alt="" /> : 'Sem capa'}
              </span>
              <span className="admin-preview-tag">{POST_TYPES[form.type]}</span>
              <span className={`admin-preview-title ${form.title ? '' : 'admin-preview-empty'}`}>
                {form.title || 'Título do post'}
              </span>
              <span className={`admin-preview-text ${form.excerpt ? '' : 'admin-preview-empty'}`}>
                {form.excerpt || 'O resumo aparece aqui.'}
              </span>
            </div>
          </Section>
        </aside>

        <SaveBar show={dirty} saving={saving} form={FORM_ID} onDiscard={discard}
          saveLabel={isNew ? 'Criar post' : 'Salvar alterações'} />
      </form>
    </AdminLayout>
  )
}