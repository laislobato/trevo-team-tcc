/**
 * PÁGINA: AdminGames
 * ==================
 * Lista dos jogos no painel (/painel/jogos), inclusive rascunhos,
 * com os botões de editar, ver no site e apagar.
 *
 * - Admin: vê os jogos de todos os estúdios.
 * - Estúdio: a API devolve só os jogos do estúdio dele.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AdminLayout from '../../components/Admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { api, formatDate, imageUrl } from '../../services/api'
import { GAME_COLORS } from '../../data/gameOptions'
import '../../styles/globals.css'

const colorHex = (id) => GAME_COLORS.find((c) => c.id === id)?.hex || 'var(--light-gray)'

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

  // ---------- Carrega os jogos ----------
  useEffect(() => {
    run((token) => api.admin.listGames(token))
      .then((data) => {
        setGames(data)
        setStatus('ready')
      })
      .catch((err) => {
        setMessage(err.message)
        setStatus('error')
      })
  }, [run])

  // ---------- Apagar ----------
  const handleDelete = async (game) => {
    if (!window.confirm(`Apagar o jogo "${game.title}"? A página dele sai do site e isso não pode ser desfeito.`)) return
    try {
      await run((token) => api.admin.deleteGame(token, game.id))
      setGames((list) => list.filter((g) => g.id !== game.id))
      setMessage(`Jogo "${game.title}" apagado.`)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <AdminLayout
      title="Jogos"
      actions={<Link to="/painel/jogos/novo" className="admin-button admin-button--primary">+ Novo jogo</Link>}
    >
      {message && <p className="admin-alert" role="status">{message}</p>}
      {!isAdmin && (
        <p className="admin-hint admin-scope">
          Aqui aparecem só os jogos do <strong>{user?.developer?.name}</strong>.
        </p>
      )}

      {status === 'loading' && <p className="admin-loading">Carregando jogos...</p>}

      {status === 'ready' && games.length === 0 && (
        <p className="admin-empty">Nenhum jogo ainda. Clique em “Novo jogo” para cadastrar o primeiro.</p>
      )}

      {/* ---------- Tabela ---------- */}
      {status === 'ready' && games.length > 0 && (
        <div className="admin-table-wrap">
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
              {games.map((game) => {
                const published = game.status === 'publicado'
                return (
                  <tr key={game.id}>
                    <td data-label="Jogo">
                      <span className="admin-game-cell">
                        {/* Miniatura: imagem do personagem ou a cor do jogo */}
                        <span className="admin-game-thumb" style={{ background: colorHex(game.color) }} aria-hidden="true">
                          {game.characterImage && <img src={imageUrl(game.characterImage)} alt="" />}
                        </span>
                        <Link to={`/painel/jogos/${game.id}`} className="admin-table-title">{game.title}</Link>
                      </span>
                    </td>
                    <td data-label="Estúdio">{game.developer?.name || '—'}</td>
                    <td data-label="Situação">
                      <span className={`admin-badge admin-badge--${published ? 'published' : 'draft'}`}>
                        {published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td data-label="Atualizado">{formatDate(game.updatedAt) || '—'}</td>
                    <td className="admin-table-actions">
                      <Link to={`/painel/jogos/${game.id}`} className="admin-button admin-button--light">Editar</Link>
                      {published && (
                        <Link to={`/jogo/${game.slug}`} target="_blank" rel="noreferrer" className="admin-button admin-button--ghost">
                          Ver
                        </Link>
                      )}
                      <button type="button" className="admin-button admin-button--danger" onClick={() => handleDelete(game)}>
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
