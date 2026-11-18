/**
 * PÁGINA: AdminBanners
 * ====================
 * Banners do carrossel do topo do site (/painel/banners). Só o admin da
 * Trevo abre esta página (os estúdios não veem o menu e são mandados de
 * volta para /painel; a API também recusa).
 *
 * Duas listas, cada uma salva separado:
 * - Início           -> página inicial (/)
 * - Página de jogos  -> página inicial dos jogos (/jogo)
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useCallback, useEffect, useState } from 'react'
import AdminLayout from '../../components/Admin/AdminLayout'
import BannerList from '../../components/Admin/BannerList'
import { Alert } from '../../components/Admin/AdminUI'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import '../../styles/globals.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AdminBanners() {
  const { run } = useAuth()
  const [data, setData] = useState(null) // { home: [...], jogos: [...] }
  const [error, setError] = useState('')
  const [dirtyPages, setDirtyPages] = useState({}) // { home: true, jogos: false }

  // ---------- Carrega as duas listas ----------
  useEffect(() => {
    run((token) => api.admin.getBanners(token))
      .then(setData)
      .catch((err) => setError(err.message))
  }, [run])

  // Cada lista avisa se tem mudança sem salvar
  const handleDirty = useCallback((page, value) => {
    setDirtyPages((old) => (old[page] === value ? old : { ...old, [page]: value }))
  }, [])

  return (
    <AdminLayout
      title="Banners"
      subtitle="Imagens do carrossel do topo do site. Cada lista é salva separada."
      crumbs={[{ label: 'Banners' }]}
      dirty={Object.values(dirtyPages).some(Boolean)}
    >
      <Alert tone="info">
        Tamanho recomendado: <strong>1600 × 520 px</strong>. O cabeçalho do site fica por cima da parte de cima da
        imagem e, no celular, só o meio aparece. Até 8 banners por página.
      </Alert>

      {error && <Alert tone="error">{error}</Alert>}
      {!data && !error && <p className="admin-loading">Carregando banners...</p>}

      {data && (
        <div className="admin-stack">
          <BannerList page="home" title="Início (página inicial)" preview="/" initial={data.home}
            onDirtyChange={handleDirty} />
          <BannerList page="jogos" title="Página de jogos (/jogo)" preview="/jogo" initial={data.jogos}
            onDirtyChange={handleDirty} />
        </div>
      )}
    </AdminLayout>
  )
}