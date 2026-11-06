/**
 * PÁGINA: AdminDevelopers
 * =======================
 * Lista das desenvolvedoras (/painel/desenvolvedoras), usadas na seção
 * "Developed By" dos posts.
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
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState(location.state?.message || '')

  useEffect(() => {
    run((token) => api.admin.listDevelopers(token))
      .then((data) => {
        setDevelopers(data)
        setStatus('ready')
      })
      .catch((err) => {
        setMessage(err.message)
        setStatus('error')
      })
  }, [run])

  const handleDelete = async (dev) => {
    if (!window.confirm(`Apagar "${dev.name}"? Os posts dela continuam, mas sem a seção Developed By.`)) return
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
          <li key={dev.id} className="admin-dev">
            <span className="admin-dev-logo">{dev.logo && <img src={imageUrl(dev.logo)} alt="" />}</span>
            <div className="admin-dev-info">
              <Link to={`/painel/desenvolvedoras/${dev.id}`} className="admin-table-title">{dev.name}</Link>
              <span className="admin-hint">
                {dev.activeDevs} devs ativos · {dev.members.length} integrantes · {dev.socials.length} redes
              </span>
            </div>
            <div className="admin-table-actions">
              <Link to={`/painel/desenvolvedoras/${dev.id}`} className="admin-button admin-button--light">Editar</Link>
              <button type="button" className="admin-button admin-button--danger" onClick={() => handleDelete(dev)}>
                Apagar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  )
}
