/**
 * COMPONENTE: BannerList
 * ======================
 * Editor da lista de banners de UMA página (usado em Painel → Banners).
 *
 *   Início (página inicial)  2/8                         [Ver página]
 *   ① [imagem]  Descrição [        ]  Link [        ]    [↑] [↓] [🗑]
 *   ② [imagem]  Descrição [        ]  Link [        ]    [↑] [↓] [🗑]
 *   [+ Adicionar banner]
 *   ------------------------------------------------------------------
 *   ● Mudanças ainda não salvas                 [Descartar] [Salvar banners]
 *
 * As mudanças só vão para o site quando clicar em "Salvar banners":
 * a lista inteira é enviada de uma vez, na ordem da tela.
 *
 * Props:
 * - page:          'home' | 'jogos'
 * - title:         título do bloco
 * - preview:       endereço da página no site (link "Ver página")
 * - initial:       banners que vieram da API
 * - onDirtyChange: avisa a página quando tem (ou deixa de ter) mudança sem salvar
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsArrowDown, BsArrowUp, BsBoxArrowUpRight, BsPlusLg, BsTrash } from 'react-icons/bs'
import ImageUpload from './ImageUpload'
import { Alert, Field, Section } from './AdminUI'
import { useLeaveWarning } from './AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './css/Admin.css'

const MAX_BANNERS = 8 // igual ao back-end
const EMPTY_BANNER = { image: '', alt: '', link: '' }

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function BannerList({ page, title, preview, initial = [], onDirtyChange }) {
  const { run } = useAuth()
  const [banners, setBanners] = useState(initial)
  const [saved, setSaved] = useState(initial) // como está no site
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  const changed = JSON.stringify(banners) !== JSON.stringify(saved) // tem mudança sem salvar?
  useLeaveWarning(changed && !saving)

  // Conta para a página (o menu pergunta antes de sair)
  useEffect(() => {
    onDirtyChange?.(page, changed)
  }, [onDirtyChange, page, changed])

  // ---------- Mudanças na lista (ainda não salvas) ----------
  const update = (fn) => {
    setBanners(fn)
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

  const discard = () => {
    if (!window.confirm('Descartar as mudanças desta lista de banners?')) return
    setBanners(saved)
    setErrors({})
    setFeedback({ type: '', text: '' })
  }

  // ---------- Salvar ----------
  const handleSave = async () => {
    setErrors({})
    setSaving(true)
    try {
      const result = await run((token) =>
        api.admin.saveBanners(token, page, banners.map(({ image, alt, link }) => ({ image, alt, link }))),
      )
      setBanners(result)
      setSaved(result)
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
    <Section
      id={`banners-${page}`}
      title={
        <>
          {title} <span className="admin-card-count">{banners.length}/{MAX_BANNERS}</span>
        </>
      }
      actions={
        <Link to={preview} target="_blank" rel="noreferrer" className="admin-btn admin-btn--ghost admin-btn--sm">
          <BsBoxArrowUpRight aria-hidden="true" /> Ver página
          <span className="visually-hidden">(abre em outra aba)</span>
        </Link>
      }
    >
      {feedback.text && (
        <Alert tone={feedback.type === 'error' ? 'error' : 'ok'} onClose={() => setFeedback({ type: '', text: '' })}>
          {feedback.text}
        </Alert>
      )}

      {banners.length === 0 && (
        <p className="admin-muted admin-gap">Nenhum banner. O site mostra o bloco ciano vazio até você adicionar um.</p>
      )}

      {/* ---------- Banners, na ordem do carrossel ---------- */}
      {banners.length > 0 && (
        <ol className="admin-banners">
          {banners.map((banner, i) => (
            <li key={banner.id ?? `novo-${i}`} className="admin-banner">
              <span className="admin-banner-number" aria-hidden="true">{i + 1}</span>

              <div className="admin-banner-image">
                <ImageUpload label={`Imagem do banner ${i + 1}`} value={banner.image} onChange={(v) => set(i, 'image', v)} />
                {fieldError(i, 'image') && <span className="admin-field-error">{fieldError(i, 'image')}</span>}
              </div>

              <div className="admin-banner-fields">
                <Field label="Descrição da imagem" hint="Lida por quem usa leitor de tela." error={fieldError(i, 'alt')}>
                  <input value={banner.alt} maxLength={120} placeholder="Ex.: Lançamento de Maré Alta"
                    onChange={(e) => set(i, 'alt', e.target.value)} />
                </Field>
                <Field label="Link (opcional)" error={fieldError(i, 'link')}>
                  <input value={banner.link} placeholder="/jogo/mare-alta ou https://..."
                    onChange={(e) => set(i, 'link', e.target.value)} />
                </Field>
              </div>

              {/* Ordem e remover */}
              <div className="admin-banner-actions">
                <button type="button" className="admin-icon-btn" onClick={() => move(i, -1)} disabled={i === 0}
                  title="Subir" aria-label={`Subir banner ${i + 1}`}>
                  <BsArrowUp aria-hidden="true" />
                </button>
                <button type="button" className="admin-icon-btn" onClick={() => move(i, 1)}
                  disabled={i === banners.length - 1} title="Descer" aria-label={`Descer banner ${i + 1}`}>
                  <BsArrowDown aria-hidden="true" />
                </button>
                <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => remove(i)}
                  title="Remover" aria-label={`Remover banner ${i + 1}`}>
                  <BsTrash aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {banners.length < MAX_BANNERS && (
        <button type="button" className="admin-add" onClick={add}>
          <BsPlusLg aria-hidden="true" /> Adicionar banner
        </button>
      )}

      {/* ---------- Salvar ---------- */}
      <div className="admin-card-foot">
        {changed ? (
          <span className="admin-unsaved">
            <span className="admin-dot admin-dot--warn" aria-hidden="true" /> Mudanças ainda não salvas
          </span>
        ) : (
          <span className="admin-muted">Tudo salvo.</span>
        )}
        <div className="admin-card-foot-end">
          {changed && (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={discard} disabled={saving}>
              Descartar
            </button>
          )}
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving || !changed}>
            {saving ? 'Salvando...' : 'Salvar banners'}
          </button>
        </div>
      </div>
    </Section>
  )
}