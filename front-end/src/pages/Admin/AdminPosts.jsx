/**
 * PÁGINA: AdminPosts
 * ==================
 * Lista dos posts do blog (/painel/posts), inclusive rascunhos e agendados.
 *
 *   [Buscar]  [Todos 12 | Publicados 8 | Agendados 1 | Rascunhos 3]  [Tipo ▾]
 *   Post · Estúdio · Situação · Data · [editar] [ver] [apagar]
 *   Mostrando 1–10 de 12                                   [1] [2]
 *
 * - Admin: vê os posts de todos os estúdios.
 * - Estúdio: a API devolve só os posts do estúdio dele.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsEye, BsFileText, BsPencil, BsPlusLg, BsTrash } from 'react-icons/bs'
import AdminLayout from '../../components/Admin/AdminLayout'
import {
  Alert,
  EmptyState,
  FilterChips,
  Pagination,
  SearchBox,
  StatusBadge,
  Thumb,
} from '../../components/Admin/AdminUI'
import { normalize, plural, postStatus, usePagination } from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api, formatDate, imageUrl } from '../../services/api'
import { POST_TYPES, POST_TYPE_OPTIONS } from '../../data/posts'
import '../../styles/globals.css'

const PAGE_SIZE = 10
const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'published', label: 'Publicados' },
  { id: 'scheduled', label: 'Agendados' },
  { id: 'draft', label: 'Rascunhos' },
]

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AdminPosts() {
  const { run, isAdmin, user } = useAuth()
  const location = useLocation()
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')
  // Mensagem vinda do editor ("Post criado.", "Post salvo.")
  const [message, setMessage] = useState(location.state?.message || '')
  const [error, setError] = useState('')

  // Busca e filtros (a visão geral pode abrir já filtrado)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(location.state?.filter || 'all')
  const [type, setType] = useState('')

  // ---------- Carrega os posts ----------
  useEffect(() => {
    run((token) => api.admin.listPosts(token))
      .then((data) => {
        setPosts(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [run])

  // ---------- Apagar ----------
  const handleDelete = async (post) => {
    if (!window.confirm(`Apagar o post "${post.title}"? Isso não pode ser desfeito.`)) return
    setError('')
    try {
      await run((token) => api.admin.deletePost(token, post.id))
      setPosts((list) => list.filter((p) => p.id !== post.id))
      setMessage(`Post "${post.title}" apagado.`)
    } catch (err) {
      setError(err.message)
    }
  }

  // ---------- Busca + tipo (as contagens dos filtros seguem a busca) ----------
  const searched = useMemo(() => {
    const q = normalize(query)
    return posts.filter((p) => (!type || p.type === type) && (!q || normalize(p.title).includes(q)))
  }, [posts, query, type])

  const counts = { all: searched.length, published: 0, scheduled: 0, draft: 0 }
  searched.forEach((p) => (counts[postStatus(p)] += 1))

  const visible = filter === 'all' ? searched : searched.filter((p) => postStatus(p) === filter)
  const pager = usePagination(visible, PAGE_SIZE, `${query}|${filter}|${type}`)

  const clearFilters = () => {
    setQuery('')
    setFilter('all')
    setType('')
  }

  const subtitle = isAdmin
    ? `${plural(posts.length, 'post', 'posts')} · o que está publicado aparece em /blog.`
    : `Só os posts do ${user?.developer?.name || 'seu estúdio'} aparecem aqui.`

  return (
    <AdminLayout
      title="Posts do blog"
      subtitle={status === 'ready' ? subtitle : undefined}
      crumbs={[{ label: 'Posts' }]}
      counts={status === 'ready' ? { posts: posts.length } : undefined}
      actions={
        <Link to="/painel/posts/novo" className="admin-btn admin-btn--primary">
          <BsPlusLg aria-hidden="true" /> <span className="admin-btn-text">Novo post</span>
        </Link>
      }
    >
      {message && <Alert onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {status === 'loading' && <p className="admin-loading">Carregando posts...</p>}

      {status === 'ready' && posts.length === 0 && (
        <div className="admin-card">
          <EmptyState
            icon={BsFileText}
            title="Nenhum post ainda"
            action={
              <Link to="/painel/posts/novo" className="admin-btn admin-btn--primary">
                <BsPlusLg aria-hidden="true" /> Criar o primeiro post
              </Link>
            }
          >
            Os posts publicados aparecem no blog do site. Rascunhos ficam só aqui no painel.
          </EmptyState>
        </div>
      )}

      {status === 'ready' && posts.length > 0 && (
        <div className="admin-card admin-table-card">
          {/* ---------- Busca e filtros ---------- */}
          <div className="admin-toolbar">
            <SearchBox label="Buscar posts pelo título" placeholder="Buscar por título" value={query} onChange={setQuery} />
            <FilterChips
              label="Filtrar por situação"
              value={filter}
              onChange={setFilter}
              options={FILTERS.map((f) => ({ ...f, count: counts[f.id] }))}
            />
            <label className="admin-toolbar-end">
              <span className="visually-hidden">Tipo de post</span>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Todos os tipos</option>
                {POST_TYPE_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>{POST_TYPES[t.id]}</option>
                ))}
              </select>
            </label>
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title="Nenhum post com esses filtros"
              action={
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearFilters}>
                  Limpar busca e filtros
                </button>
              }
            >
              Tente outra palavra ou outra situação.
            </EmptyState>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Post</th>
                  <th scope="col">Estúdio</th>
                  <th scope="col">Situação</th>
                  <th scope="col">Data</th>
                  <th scope="col"><span className="visually-hidden">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {pager.items.map((post) => {
                  const s = postStatus(post)
                  return (
                    <tr key={post.id}>
                      <td className="admin-td-main" data-label="Post">
                        <div className="admin-cell-main">
                          <Thumb src={imageUrl(post.cover)} />
                          <div className="admin-cell-text">
                            <Link to={`/painel/posts/${post.id}`} className="admin-row-title">{post.title}</Link>
                            <span className="admin-row-sub">{POST_TYPES[post.type]}</span>
                          </div>
                        </div>
                      </td>
                      <td data-label="Estúdio">{post.developer?.name || '—'}</td>
                      <td data-label="Situação"><StatusBadge status={s} /></td>
                      <td data-label="Data" className="admin-td-muted">{formatDate(post.publishedAt) || '—'}</td>
                      <td className="admin-td-actions">
                        <div className="admin-row-actions">
                          <Link to={`/painel/posts/${post.id}`} className="admin-icon-btn" title="Editar"
                            aria-label={`Editar ${post.title}`}>
                            <BsPencil aria-hidden="true" />
                          </Link>
                          {s === 'published' && (
                            <Link to={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="admin-icon-btn"
                              title="Ver no site" aria-label={`Ver ${post.title} no site (abre em outra aba)`}>
                              <BsEye aria-hidden="true" />
                            </Link>
                          )}
                          <button type="button" className="admin-icon-btn admin-icon-btn--danger" title="Apagar"
                            aria-label={`Apagar ${post.title}`} onClick={() => handleDelete(post)}>
                            <BsTrash aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          <Pagination pager={pager} />
        </div>
      )}
    </AdminLayout>
  )
}