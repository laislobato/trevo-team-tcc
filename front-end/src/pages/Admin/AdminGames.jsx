/**
 * PÁGINA: AdminGames
 * ==================
 * Lista dos jogos no painel (/painel/jogos), inclusive rascunhos.
 *
 *   [Buscar]  [Todos 3 | Publicados 2 | Rascunhos 1]
 *   Jogo · Estúdio · Situação · Atualizado · [editar] [ver] [apagar]
 *
 * - Admin: vê os jogos de todos os estúdios.
 * - Estúdio: a API devolve só os jogos do estúdio dele.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsController, BsEye, BsPencil, BsPlusLg, BsTrash } from 'react-icons/bs'
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
import { colorHex, gameStatus, normalize, plural, usePagination } from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api, formatDate, imageUrl } from '../../services/api'
import '../../styles/globals.css'

const PAGE_SIZE = 10
const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'published', label: 'Publicados' },
  { id: 'draft', label: 'Rascunhos' },
]

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AdminGames() {
  const { run, isAdmin, user } = useAuth()
  const location = useLocation()
  const [games, setGames] = useState([])
  const [status, setStatus] = useState('loading')
  // Mensagem vinda do editor ("Jogo criado.", "Jogo salvo.")
  const [message, setMessage] = useState(location.state?.message || '')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(location.state?.filter || 'all')

  // ---------- Carrega os jogos ----------
  useEffect(() => {
    run((token) => api.admin.listGames(token))
      .then((data) => {
        setGames(data)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [run])

  // ---------- Apagar ----------
  const handleDelete = async (game) => {
    if (!window.confirm(`Apagar o jogo "${game.title}"? A página dele sai do site e isso não pode ser desfeito.`)) return
    setError('')
    try {
      await run((token) => api.admin.deleteGame(token, game.id))
      setGames((list) => list.filter((g) => g.id !== game.id))
      setMessage(`Jogo "${game.title}" apagado.`)
    } catch (err) {
      setError(err.message)
    }
  }

  // ---------- Busca e filtro ----------
  const searched = useMemo(() => {
    const q = normalize(query)
    return games.filter((g) => !q || normalize(`${g.title} ${g.subtitle || ''}`).includes(q))
  }, [games, query])

  const counts = { all: searched.length, published: 0, draft: 0 }
  searched.forEach((g) => (counts[gameStatus(g)] += 1))

  const visible = filter === 'all' ? searched : searched.filter((g) => gameStatus(g) === filter)
  const pager = usePagination(visible, PAGE_SIZE, `${query}|${filter}`)

  const subtitle = isAdmin
    ? `${plural(games.length, 'jogo', 'jogos')} · os publicados aparecem na vitrine e em /jogo.`
    : `Só os jogos do ${user?.developer?.name || 'seu estúdio'} aparecem aqui.`

  return (
    <AdminLayout
      title="Jogos"
      subtitle={status === 'ready' ? subtitle : undefined}
      crumbs={[{ label: 'Jogos' }]}
      counts={status === 'ready' ? { games: games.length } : undefined}
      actions={
        <Link to="/painel/jogos/novo" className="admin-btn admin-btn--primary">
          <BsPlusLg aria-hidden="true" /> <span className="admin-btn-text">Novo jogo</span>
        </Link>
      }
    >
      {message && <Alert onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {status === 'loading' && <p className="admin-loading">Carregando jogos...</p>}

      {status === 'ready' && games.length === 0 && (
        <div className="admin-card">
          <EmptyState
            icon={BsController}
            title="Nenhum jogo ainda"
            action={
              <Link to="/painel/jogos/novo" className="admin-btn admin-btn--primary">
                <BsPlusLg aria-hidden="true" /> Cadastrar o primeiro jogo
              </Link>
            }
          >
            Os jogos publicados aparecem na vitrine do site e ganham uma página própria.
          </EmptyState>
        </div>
      )}

      {status === 'ready' && games.length > 0 && (
        <div className="admin-card admin-table-card">
          <div className="admin-toolbar">
            <SearchBox label="Buscar jogos pelo nome" placeholder="Buscar por nome" value={query} onChange={setQuery} />
            <FilterChips
              label="Filtrar por situação"
              value={filter}
              onChange={setFilter}
              options={FILTERS.map((f) => ({ ...f, count: counts[f.id] }))}
            />
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title="Nenhum jogo com esses filtros"
              action={
                <button type="button" className="admin-btn admin-btn--ghost"
                  onClick={() => { setQuery(''); setFilter('all') }}>
                  Limpar busca e filtros
                </button>
              }
            />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Jogo</th>
                  <th scope="col">Estúdio</th>
                  <th scope="col">Situação</th>
                  <th scope="col">Atualizado</th>
                  <th scope="col"><span className="visually-hidden">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {pager.items.map((game) => {
                  const s = gameStatus(game)
                  return (
                    <tr key={game.id}>
                      <td className="admin-td-main" data-label="Jogo">
                        <div className="admin-cell-main">
                          {/* Miniatura: imagem do personagem na cor do jogo */}
                          <Thumb src={imageUrl(game.characterImage)} color={colorHex(game.color)} contain />
                          <div className="admin-cell-text">
                            <Link to={`/painel/jogos/${game.id}`} className="admin-row-title">{game.title}</Link>
                            <span className="admin-row-sub">/jogo/{game.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td data-label="Estúdio">{game.developer?.name || '—'}</td>
                      <td data-label="Situação"><StatusBadge status={s} /></td>
                      <td data-label="Atualizado" className="admin-td-muted">{formatDate(game.updatedAt) || '—'}</td>
                      <td className="admin-td-actions">
                        <div className="admin-row-actions">
                          <Link to={`/painel/jogos/${game.id}`} className="admin-icon-btn" title="Editar"
                            aria-label={`Editar ${game.title}`}>
                            <BsPencil aria-hidden="true" />
                          </Link>
                          {s === 'published' && (
                            <Link to={`/jogo/${game.slug}`} target="_blank" rel="noreferrer" className="admin-icon-btn"
                              title="Ver no site" aria-label={`Ver ${game.title} no site (abre em outra aba)`}>
                              <BsEye aria-hidden="true" />
                            </Link>
                          )}
                          <button type="button" className="admin-icon-btn admin-icon-btn--danger" title="Apagar"
                            aria-label={`Apagar ${game.title}`} onClick={() => handleDelete(game)}>
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