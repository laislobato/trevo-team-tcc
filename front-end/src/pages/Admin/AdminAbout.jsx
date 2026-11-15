/**
 * PÁGINA: AdminAbout
 * ==================
 * Os 2 cards do topo da página About (/painel/sobre). Só o admin da Trevo
 * abre esta página (os estúdios não veem o menu e são mandados de volta
 * para /painel; a API também recusa).
 *
 *   Card 1 (esquerda)                     Card 2 (direita)
 *   [imagem]                              [imagem]
 *   Título     [            ]             Título     [            ]
 *   Subtítulo  [            ] (laranja)   Subtítulo  [            ]
 *   Texto      [            ]             Texto      [            ]
 *                                                    [Salvar cards]
 *
 * As mudanças só vão para o site quando clicar em "Salvar cards".
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import '../../styles/globals.css'

const EMPTY_CARD = { image: '', title: '', subtitle: '', text: '' }
const SLOTS = ['Card 1 (esquerda)', 'Card 2 (direita)']

/** Sempre 2 cards na tela (completa com cards vazios se faltar) */
const fillSlots = (cards = []) =>
  SLOTS.map((_, i) => {
    const { image = '', title = '', subtitle = '', text = '' } = cards[i] || EMPTY_CARD
    return { image, title, subtitle, text }
  })

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AdminAbout() {
  const { run } = useAuth()
  const [cards, setCards] = useState(null) // null = carregando
  const [changed, setChanged] = useState(false) // tem mudança sem salvar?
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  // ---------- Carrega os cards ----------
  useEffect(() => {
    run((token) => api.admin.getAboutCards(token))
      .then((list) => setCards(fillSlots(list)))
      .catch((err) => setFeedback({ type: 'error', text: err.message }))
  }, [run])

  // ---------- Mudanças (ainda não salvas) ----------
  const set = (index, field, value) => {
    setCards((list) => list.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
    setChanged(true)
    setFeedback({ type: '', text: '' })
    setErrors((old) => {
      const next = { ...old }
      delete next[`cards.${index}.${field}`]
      return next
    })
  }

  // ---------- Salvar ----------
  const handleSave = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      const saved = await run((token) => api.admin.saveAboutCards(token, cards))
      setCards(fillSlots(saved))
      setChanged(false)
      setFeedback({ type: 'ok', text: 'Cards salvos. Já estão no site.' })
    } catch (err) {
      setErrors(err.details || {})
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const fieldError = (i, field) => errors[`cards.${i}.${field}`]

  return (
    <AdminLayout title="Página About">
      <p className="admin-hint admin-scope">
        Os 2 cards do topo da página About, embaixo do título &quot;SOBRE NÓS&quot;. Tamanho recomendado da
        imagem: <strong>1200 × 720 px</strong> (paisagem).{' '}
        <Link to="/sobre" target="_blank" rel="noreferrer">Ver página ↗</Link>
      </p>

      {feedback.text && (
        <p className={`admin-alert ${feedback.type === 'error' ? 'admin-alert--error' : ''}`} role="status">
          {feedback.text}
        </p>
      )}
      {!cards && !feedback.text && <p className="admin-loading">Carregando cards...</p>}

      {cards && (
        <form className="admin-form" onSubmit={handleSave} noValidate>
          <div className="admin-about-grid">
            {cards.map((card, i) => (
              <section key={SLOTS[i]} className="admin-card" aria-labelledby={`about-card-${i}`}>
                <h2 id={`about-card-${i}`} className="admin-card-title">{SLOTS[i]}</h2>

                <ImageUpload label="Imagem" value={card.image} onChange={(v) => set(i, 'image', v)} />
                {fieldError(i, 'image') && <span className="admin-field-error">{fieldError(i, 'image')}</span>}

                <label className={`admin-field ${fieldError(i, 'title') ? 'has-error' : ''}`}>
                  <span className="admin-label">Título</span>
                  <input value={card.title} maxLength={40} placeholder="Ex.: QUEM SOMOS"
                    onChange={(e) => set(i, 'title', e.target.value)} />
                  {fieldError(i, 'title') && <span className="admin-field-error">{fieldError(i, 'title')}</span>}
                </label>

                <label className={`admin-field ${fieldError(i, 'subtitle') ? 'has-error' : ''}`}>
                  <span className="admin-label">Subtítulo (laranja)</span>
                  <input value={card.subtitle} maxLength={40} placeholder="Ex.: TREVO TEAM"
                    onChange={(e) => set(i, 'subtitle', e.target.value)} />
                  {fieldError(i, 'subtitle') && <span className="admin-field-error">{fieldError(i, 'subtitle')}</span>}
                </label>

                <label className={`admin-field ${fieldError(i, 'text') ? 'has-error' : ''}`}>
                  <span className="admin-label">Texto</span>
                  <textarea value={card.text} maxLength={400} rows={5}
                    onChange={(e) => set(i, 'text', e.target.value)} />
                  <span className="admin-hint">{card.text.length}/400</span>
                  {fieldError(i, 'text') && <span className="admin-field-error">{fieldError(i, 'text')}</span>}
                </label>
              </section>
            ))}
          </div>

          {/* ---------- Botão ---------- */}
          <div className="admin-banners-footer">
            {changed && <span className="admin-hint">Mudanças ainda não salvas.</span>}
            <button type="submit" className="admin-button admin-button--primary" disabled={saving || !changed}>
              {saving ? 'Salvando...' : 'Salvar cards'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  )
}