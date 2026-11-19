/**
 * PÁGINA: AdminDevelopers
 * =======================
 * Lista das desenvolvedoras (/painel/desenvolvedoras), usadas na seção
 * "Desenvolvido por" dos posts e como estúdio dos jogos. Só o admin abre esta página.
 * Os logins de cada estúdio são criados na página da desenvolvedora.
 *
 *   [Buscar]  [Todas 3 | Com login 2 | Sem login 1]
 *   Desenvolvedora · Integrantes · Redes · Logins · [editar] [apagar]
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsBuilding, BsPencil, BsPlusLg, BsTrash } from 'react-icons/bs'
import AdminLayout from '../../components/Admin/AdminLayout'
import { Alert, EmptyState, FilterChips, Pagination, SearchBox, Thumb } from '../../components/Admin/AdminUI'
import { normalize, plural, usePagination } from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api, imageUrl } from '../../services/api'
import '../../styles/globals.css'

const PAGE_SIZE = 10

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AdminDevelopers() {
  const { run } = useAuth()
  const location = useLocation()
  const [developers, setDevelopers] = useState([])
  const [loginCount, setLoginCount] = useState({}) // { idDaDesenvolvedora: nº de logins }
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState(location.state?.message || '')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  // ---------- Carrega as desenvolvedoras e conta os logins ----------
  useEffect(() => {
    Promise.all([run((token) => api.admin.listDevelopers(token)), run((token) => api.admin.listAccounts(token))])
      .then(([data, accounts]) => {
        setDevelopers(data)
        const count = {}
        for (const account of accounts) count[account.developerId] = (count[account.developerId] || 0) + 1
        setLoginCount(count)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [run])

  // ---------- Apagar ----------
  const handleDelete = async (dev) => {
    const logins = loginCount[dev.id] || 0
    const text =
      `Apagar "${dev.name}"? Os posts e jogos dela continuam, mas sem estúdio.` +
      (logins ? ` Os ${logins} login(s) do estúdio também serão apagados.` : '')
    if (!window.confirm(text)) return
    setError('')
    try {
      await run((token) => api.admin.deleteDeveloper(token, dev.id))
      setDevelopers((list) => list.filter((d) => d.id !== dev.id))
      setMessage(`"${dev.name}" apagada.`)
    } catch (err) {
      setError(err.message)
    }
  }

  // ---------- Busca e filtro ----------
  const searched = useMemo(() => {
    const q = normalize(query)
    return developers.filter((d) => !q || normalize(d.name).includes(q))
  }, [developers, query])

  const hasLogin = (dev) => Boolean(loginCount[dev.id])
  const counts = {
    all: searched.length,
    login: searched.filter(hasLogin).length,
    nologin: searched.filter((d) => !hasLogin(d)).length,
  }
  const visible = searched.filter((d) => filter === 'all' || (filter === 'login' ? hasLogin(d) : !hasLogin(d)))
  const pager = usePagination(visible, PAGE_SIZE, `${query}|${filter}`)

  return (
    <AdminLayout
      title="Desenvolvedoras"
      subtitle={
        status === 'ready'
          ? `${plural(developers.length, 'estúdio', 'estúdios')} · aparecem no “Desenvolvido por” dos posts e como estúdio dos jogos.`
          : undefined
      }
      crumbs={[{ label: 'Desenvolvedoras' }]}
      counts={status === 'ready' ? { developers: developers.length } : undefined}
      actions={
        <Link to="/painel/desenvolvedoras/nova" className="admin-btn admin-btn--primary">
          <BsPlusLg aria-hidden="true" /> <span className="admin-btn-text">Nova desenvolvedora</span>
        </Link>
      }
    >
      {message && <Alert onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {status === 'loading' && <p className="admin-loading">Carregando...</p>}

      {status === 'ready' && developers.length === 0 && (
        <div className="admin-card">
          <EmptyState
            icon={BsBuilding}
            title="Nenhuma desenvolvedora cadastrada"
            action={
              <Link to="/painel/desenvolvedoras/nova" className="admin-btn admin-btn--primary">
                <BsPlusLg aria-hidden="true" /> Cadastrar desenvolvedora
              </Link>
            }
          />
        </div>
      )}

      {status === 'ready' && developers.length > 0 && (
        <div className="admin-card admin-table-card">
          <div className="admin-toolbar">
            <SearchBox label="Buscar desenvolvedora pelo nome" placeholder="Buscar por nome" value={query}
              onChange={setQuery} />
            <FilterChips
              label="Filtrar por login"
              value={filter}
              onChange={setFilter}
              options={[
                { id: 'all', label: 'Todas', count: counts.all },
                { id: 'login', label: 'Com login', count: counts.login },
                { id: 'nologin', label: 'Sem login', count: counts.nologin },
              ]}
            />
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title="Nenhuma desenvolvedora com esses filtros"
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
                  <th scope="col">Desenvolvedora</th>
                  <th scope="col">Integrantes</th>
                  <th scope="col">Redes</th>
                  <th scope="col">Logins</th>
                  <th scope="col"><span className="visually-hidden">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {pager.items.map((dev) => (
                  <tr key={dev.id}>
                    <td className="admin-td-main" data-label="Desenvolvedora">
                      <div className="admin-cell-main">
                        <Thumb src={imageUrl(dev.logo)} contain round />
                        <div className="admin-cell-text">
                          <Link to={`/painel/desenvolvedoras/${dev.id}`} className="admin-row-title">{dev.name}</Link>
                          {dev.isTrevo ? (
                            <span className="admin-tag-trevo">🍀 Equipe da Trevo · página About</span>
                          ) : (
                            <span className="admin-row-sub">{plural(dev.activeDevs, 'dev ativo', 'devs ativos')}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label="Integrantes">{dev.members.length}</td>
                    <td data-label="Redes">{dev.socials.length}</td>
                    <td data-label="Logins" className={hasLogin(dev) ? '' : 'admin-td-muted'}>
                      {hasLogin(dev) ? loginCount[dev.id] : 'sem login'}
                    </td>
                    <td className="admin-td-actions">
                      <div className="admin-row-actions">
                        <Link to={`/painel/desenvolvedoras/${dev.id}`} className="admin-icon-btn" title="Editar"
                          aria-label={`Editar ${dev.name}`}>
                          <BsPencil aria-hidden="true" />
                        </Link>
                        {/* A Trevo Team não pode ser apagada */}
                        {!dev.isTrevo && (
                          <button type="button" className="admin-icon-btn admin-icon-btn--danger" title="Apagar"
                            aria-label={`Apagar ${dev.name}`} onClick={() => handleDelete(dev)}>
                            <BsTrash aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <Pagination pager={pager} />
        </div>
      )}
    </AdminLayout>
  )
}