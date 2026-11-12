/**
 * COMPONENTE: BannerList
 * ======================
 * Editor da lista de banners de UMA página (usado em Painel → Banners).
 *
 *   Início (página inicial)                              [Ver página ↗]
 *   1  [imagem]  Descrição [        ]  Link [        ]   [↑] [↓] [Remover]
 *   2  [imagem]  Descrição [        ]  Link [        ]   [↑] [↓] [Remover]
 *   [+ Adicionar banner]                                [Salvar banners]
 *
 * As mudanças só vão para o site quando clicar em "Salvar banners":
 * a lista inteira é enviada de uma vez, na ordem da tela.
 *
 * Props:
 * - page:    'home' | 'jogos'
 * - title:   título do bloco
 * - preview: endereço da página no site (link "Ver página")
 * - initial: banners que vieram da API
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import ImageUpload from './ImageUpload'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './css/Admin.css'

const MAX_BANNERS = 8 // igual ao back-end
const EMPTY_BANNER = { image: '', alt: '', link: '' }

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function BannerList({ page, title, preview, initial = [] }) {
  const { run } = useAuth()
  const [banners, setBanners] = useState(initial)
  const [changed, setChanged] = useState(false) // tem mudança sem salvar?
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  // ---------- Mudanças na lista (ainda não salvas) ----------
  const update = (fn) => {
    setBanners(fn)
    setChanged(true)
    setFeedback({ type: '', text: '' })
    setErrors({}) // os avisos antigos somem ao mexer (a ordem pode ter mudado)
  }
  const set = (index, field, value) =>
    update((list) => list.map((b, i) => (i === index ? { ...b, [field]: value } : b)))
  const add = () => update((list) => [...list, { ...EMPTY_BANNER }])
  const remove = (index) => update((list) => list.filter((_, i) => i !== index))
  /** Troca o banner de lugar com o vizinho (direction: -1 = sobe, 1 = desce) */
  const move = (index, direction) =>
    update((list) => {
      const next = [...list]
      const target = index + direction
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })

  // ---------- Salvar ----------
  const handleSave = async () => {
    setErrors({})
    setSaving(true)
    try {
      const saved = await run((token) =>
        api.admin.saveBanners(token, page, banners.map(({ image, alt, link }) => ({ image, alt, link }))),
      )
      setBanners(saved)
      setChanged(false)
      setFeedback({ type: 'ok', text: 'Banners salvos. Já estão no site.' })
    } catch (err) {
      setErrors(err.details || {})
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const fieldError = (i, field) => errors[`banners.${i}.${field}`]

  return (
    <section className="admin-card" aria-labelledby={`banners-${page}-title`}>
      <div className="admin-card-head">
        <h2 id={`banners-${page}-title`} className="admin-card-title">
          {title} ({banners.length}/{MAX_BANNERS})
        </h2>
        <Link to={preview} target="_blank" rel="noreferrer" className="admin-button admin-button--ghost">
          Ver página ↗
        </Link>
      </div>

      {feedback.text && (
        <p className={`admin-alert ${feedback.type === 'error' ? 'admin-alert--error' : ''}`} role="status">
          {feedback.text}
        </p>
      )}

      {banners.length === 0 && (
        <p className="admin-empty">Nenhum banner. O site mostra o bloco ciano vazio até você adicionar um.</p>
      )}

      {/* ---------- Banners, na ordem do carrossel ---------- */}
      <ol className="admin-banners">
        {banners.map((banner, i) => (
          <li key={banner.id ?? `novo-${i}`} className="admin-banner">
            <span className="admin-banner-number" aria-hidden="true">{i + 1}</span>

            <div className="admin-banner-image">
              <ImageUpload label="Imagem" value={banner.image} onChange={(v) => set(i, 'image', v)} />
              {fieldError(i, 'image') && <span className="admin-field-error">{fieldError(i, 'image')}</span>}
            </div>

            <div className="admin-banner-fields">
              <label className={`admin-field ${fieldError(i, 'alt') ? 'has-error' : ''}`}>
                <span className="admin-label">Descrição da imagem</span>
                <input value={banner.alt} maxLength={120} placeholder="Ex.: Lançamento de Maré Alta"
                  onChange={(e) => set(i, 'alt', e.target.value)} />
                <span className="admin-hint">Lida por quem usa leitor de tela.</span>
                {fieldError(i, 'alt') && <span className="admin-field-error">{fieldError(i, 'alt')}</span>}
              </label>
              <label className={`admin-field ${fieldError(i, 'link') ? 'has-error' : ''}`}>
                <span className="admin-label">Link (opcional)</span>
                <input value={banner.link} placeholder="/jogo/mare-alta ou https://..."
                  onChange={(e) => set(i, 'link', e.target.value)} />
                {fieldError(i, 'link') && <span className="admin-field-error">{fieldError(i, 'link')}</span>}
              </label>
            </div>

            {/* Ordem e remover */}
            <div className="admin-banner-actions">
              <button type="button" className="admin-button admin-button--light" onClick={() => move(i, -1)}
                disabled={i === 0} aria-label={`Subir banner ${i + 1}`}>↑</button>
              <button type="button" className="admin-button admin-button--light" onClick={() => move(i, 1)}
                disabled={i === banners.length - 1} aria-label={`Descer banner ${i + 1}`}>↓</button>
              <button type="button" className="admin-button admin-button--ghost" onClick={() => remove(i)}
                aria-label={`Remover banner ${i + 1}`}>Remover</button>
            </div>
          </li>
        ))}
      </ol>

      {/* ---------- Botões ---------- */}
      <div className="admin-banners-footer">
        {banners.length < MAX_BANNERS && (
          <button type="button" className="admin-button admin-button--light" onClick={add}>
            + Adicionar banner
          </button>
        )}
        {changed && <span className="admin-hint">Mudanças ainda não salvas.</span>}
        <button type="button" className="admin-button admin-button--primary" onClick={handleSave}
          disabled={saving || !changed}>
          {saving ? 'Salvando...' : 'Salvar banners'}
        </button>
      </div>
    </section>
  )
}
