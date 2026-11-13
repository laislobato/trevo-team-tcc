/**
 * PÁGINA: AdminDevelopers
 * =======================
 * Lista das desenvolvedoras (/painel/desenvolvedoras), usadas na seção
 * "Developed By" dos posts e como estúdio dos jogos. Só o admin abre esta página.
 * Os logins de cada estúdio são criados na página da desenvolvedora.
 */

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AdminLayout from '../../components/Admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { api, imageUrl } from '../../services/api'
import '../../styles/globals.css'

export default function AdminDevelopers() {
  const { run } = useAuth()
  const location = useLocation()
  const [developers, setDevelopers] = useState([])
  const [loginCount, setLoginCount] = useState({}) // { idDaDesenvolvedora: nº de logins }
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState(location.state?.message || '')

  useEffect(() => {
    Promise.all([run((token) => api.admin.listDevelopers(token)), run((token) => api.admin.listAccounts(token))])
      .then(([data, accounts]) => {
        setDevelopers(data)
        // Conta quantos logins cada estúdio tem
        const count = {}
        for (const account of accounts) count[account.developerId] = (count[account.developerId] || 0) + 1
        setLoginCount(count)
        setStatus('ready')
      })
      .catch((err) => {
        setMessage(err.message)
        setStatus('error')
      })
  }, [run])

  const handleDelete = async (dev) => {
    const logins = loginCount[dev.id] || 0
    const text =
      `Apagar "${dev.name}"? Os posts e jogos dela continuam, mas sem estúdio.` +
      (logins ? ` Os ${logins} login(s) do estúdio também serão apagados.` : '')
    if (!window.confirm(text)) return
    try {
      await run((token) => api.admin.deleteDeveloper(token, dev.id))
      setDevelopers((list) => list.filter((d) => d.id !== dev.id))
      setMessage(`"${dev.name}" apagada.`)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <AdminLayout
      title="Desenvolvedoras"
      actions={
        <Link to="/painel/desenvolvedoras/nova" className="admin-button admin-button--primary">
          + Nova desenvolvedora
        </Link>
      }
    >
      {message && <p className="admin-alert" role="status">{message}</p>}
      {status === 'loading' && <p className="admin-loading">Carregando...</p>}
      {status === 'ready' && developers.length === 0 && (
        <p className="admin-empty">Nenhuma desenvolvedora cadastrada.</p>
      )}

      <ul className="admin-dev-list">
        {developers.map((dev) => (
          <li key={dev.id} className={`admin-dev ${dev.isTrevo ? 'admin-dev--trevo' : ''}`}>
            <span className="admin-dev-logo">{dev.logo && <img src={imageUrl(dev.logo)} alt="" />}</span>
            <div className="admin-dev-info">
              <Link to={`/painel/desenvolvedoras/${dev.id}`} className="admin-table-title">{dev.name}</Link>
              {dev.isTrevo && <span className="admin-trevo-tag">🍀 Equipe da Trevo · página About</span>}
              <span className="admin-hint">
                {dev.activeDevs} devs ativos · {dev.members.length} integrantes · {dev.socials.length} redes ·{' '}
                {loginCount[dev.id] ? `${loginCount[dev.id]} login(s)` : 'sem login'}
              </span>
            </div>
            <div className="admin-table-actions">
              <Link to={`/painel/desenvolvedoras/${dev.id}`} className="admin-button admin-button--light">Editar</Link>
              {/* A Trevo Team não pode ser apagada */}
              {!dev.isTrevo && (
                <button type="button" className="admin-button admin-button--danger" onClick={() => handleDelete(dev)}>
                  Apagar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  )
}