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

import { useEffect, useState } from 'react'
import AdminLayout from '../../components/Admin/AdminLayout'
import BannerList from '../../components/Admin/BannerList'
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

  // ---------- Carrega as duas listas ----------
  useEffect(() => {
    run((token) => api.admin.getBanners(token))
      .then(setData)
      .catch((err) => setError(err.message))
  }, [run])

  return (
    <AdminLayout title="Banners">
      <p className="admin-hint admin-scope">
        Imagens do carrossel do topo do site. Tamanho recomendado: <strong>1600 × 400 px</strong> (no celular,
        o meio da imagem aparece). Até 8 banners por página.
      </p>

      {error && <p className="admin-alert admin-alert--error" role="alert">{error}</p>}
      {!data && !error && <p className="admin-loading">Carregando banners...</p>}

      {data && (
        <div className="admin-form">
          <BannerList page="home" title="Início (página inicial)" preview="/" initial={data.home} />
          <BannerList page="jogos" title="Página de jogos (/jogo)" preview="/jogo" initial={data.jogos} />
        </div>
      )}
    </AdminLayout>
  )
}
