/**
 * PÁGINA: AdminPosts
 * ==================
 * Início do painel (/painel): lista de todos os posts, inclusive rascunhos
 * e agendados, com os botões de editar, ver no site e apagar.
 */

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AdminLayout from '../../components/Admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { api, formatDate } from '../../services/api'
import { POST_TYPES } from '../../data/posts'
import '../../styles/globals.css'

/** Situação que aparece na tabela: Rascunho, Agendado ou Publicado */
function postStatus(post) {
  if (post.status === 'rascunho') return { label: 'Rascunho', tone: 'draft' }
  if (post.publishedAt && new Date(post.publishedAt) > new Date()) return { label: 'Agendado', tone: 'scheduled' }
  return { label: 'Publicado', tone: 'published' }
}

export default function AdminPosts() {
  const { run } = useAuth()
  const location = useLocation()
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')
  // Mensagem vinda do editor ("Post criado.", "Post salvo.")
  const [message, setMessage] = useState(location.state?.message || '')

  useEffect(() => {
    run((token) => api.admin.listPosts(token))
      .then((data) => {
        setPosts(data)
        setStatus('ready')
      })
      .catch((err) => {
        setMessage(err.message)
        setStatus('error')
      })
  }, [run])

  const handleDelete = async (post) => {
    if (!window.confirm(`Apagar o post "${post.title}"? Isso não pode ser desfeito.`)) return
    try {
      await run((token) => api.admin.deletePost(token, post.id))
      setPosts((list) => list.filter((p) => p.id !== post.id))
      setMessage(`Post "${post.title}" apagado.`)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <AdminLayout
      title="Posts do blog"
      actions={<Link to="/painel/posts/novo" className="admin-button admin-button--primary">+ Novo post</Link>}
    >
      {message && <p className="admin-alert" role="status">{message}</p>}

      {status === 'loading' && <p className="admin-loading">Carregando posts...</p>}

      {status === 'ready' && posts.length === 0 && (
        <p className="admin-empty">Nenhum post ainda. Clique em “Novo post” para criar o primeiro.</p>
      )}

      {status === 'ready' && posts.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Tipo</th>
                <th scope="col">Situação</th>
                <th scope="col">Data</th>
                <th scope="col"><span className="visually-hidden">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const s = postStatus(post)
                return (
                  <tr key={post.id}>
                    <td data-label="Título">
                      <Link to={`/painel/posts/${post.id}`} className="admin-table-title">{post.title}</Link>
                    </td>
                    <td data-label="Tipo">{POST_TYPES[post.type]}</td>
                    <td data-label="Situação">
                      <span className={`admin-badge admin-badge--${s.tone}`}>{s.label}</span>
                    </td>
                    <td data-label="Data">{formatDate(post.publishedAt) || '—'}</td>
                    <td className="admin-table-actions">
                      <Link to={`/painel/posts/${post.id}`} className="admin-button admin-button--light">Editar</Link>
                      {s.tone === 'published' && (
                        <Link to={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="admin-button admin-button--ghost">
                          Ver
                        </Link>
                      )}
                      <button type="button" className="admin-button admin-button--danger" onClick={() => handleDelete(post)}>
                        Apagar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
