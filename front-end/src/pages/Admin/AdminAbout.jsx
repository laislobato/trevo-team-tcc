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
 *   [● Alterações não salvas                      Descartar  Salvar cards]
 *
 * As mudanças só vão para o site quando clicar em "Salvar cards".
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsBoxArrowUpRight } from 'react-icons/bs'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import { Alert, Field, SaveBar, Section } from '../../components/Admin/AdminUI'
import { useLeaveWarning } from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import '../../styles/globals.css'

const FORM_ID = 'about-form'
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
  const [saved, setSaved] = useState(null) // como está no site
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  const changed = Boolean(cards) && JSON.stringify(cards) !== JSON.stringify(saved) // tem mudança sem salvar?
  useLeaveWarning(changed && !saving)

  // ---------- Carrega os cards ----------
  useEffect(() => {
    run((token) => api.admin.getAboutCards(token))
      .then((list) => {
        setCards(fillSlots(list))
        setSaved(fillSlots(list))
      })
      .catch((err) => setFeedback({ type: 'error', text: err.message }))
  }, [run])

  // ---------- Mudanças (ainda não salvas) ----------
  const set = (index, field, value) => {
    setCards((list) => list.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
    setFeedback({ type: '', text: '' })
    setErrors((old) => {
      const next = { ...old }
      delete next[`cards.${index}.${field}`]
      return next
    })
  }

  const discard = () => {
    if (!window.confirm('Descartar as alterações que ainda não foram salvas?')) return
    setCards(saved)
    setErrors({})
    setFeedback({ type: '', text: '' })
  }

  // ---------- Salvar ----------
  const handleSave = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      const result = await run((token) => api.admin.saveAboutCards(token, cards))
      setCards(fillSlots(result))
      setSaved(fillSlots(result))
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
    <AdminLayout
      title="Página About"
      subtitle="Os 2 cards do topo da página About, embaixo do título “SOBRE NÓS”."
      crumbs={[{ label: 'Página About' }]}
      dirty={changed}
      actions={
        <>
          <Link to="/sobre" target="_blank" rel="noreferrer" className="admin-btn admin-btn--ghost">
            <BsBoxArrowUpRight aria-hidden="true" /> <span className="admin-btn-text">Ver página</span>
          </Link>
          <button type="submit" form={FORM_ID} className="admin-btn admin-btn--primary" disabled={saving || !changed}>
            {saving ? 'Salvando...' : 'Salvar cards'}
          </button>
        </>
      }
    >
      <Alert tone="info">
        Tamanho recomendado da imagem: <strong>1200 × 720 px</strong> (paisagem).
      </Alert>

      {feedback.text && (
        <Alert tone={feedback.type === 'error' ? 'error' : 'ok'} onClose={() => setFeedback({ type: '', text: '' })}>
          {feedback.text}
        </Alert>
      )}
      {!cards && !feedback.text && <p className="admin-loading">Carregando cards...</p>}

      {cards && (
        <form id={FORM_ID} onSubmit={handleSave} noValidate>
          <div className="admin-about-grid">
            {cards.map((card, i) => (
              <Section key={SLOTS[i]} title={SLOTS[i]}>
                <ImageUpload label="Imagem" value={card.image} onChange={(v) => set(i, 'image', v)} />
                {fieldError(i, 'image') && <p className="admin-field-error">{fieldError(i, 'image')}</p>}

                <div className="admin-grid-2">
                  <Field label="Título" error={fieldError(i, 'title')}>
                    <input value={card.title} maxLength={40} placeholder="Ex.: QUEM SOMOS"
                      onChange={(e) => set(i, 'title', e.target.value)} />
                  </Field>
                  <Field label="Subtítulo (laranja)" error={fieldError(i, 'subtitle')}>
                    <input value={card.subtitle} maxLength={40} placeholder="Ex.: TREVO TEAM"
                      onChange={(e) => set(i, 'subtitle', e.target.value)} />
                  </Field>
                </div>

                <Field label="Texto" error={fieldError(i, 'text')} count={`${card.text.length}/400`}>
                  <textarea value={card.text} maxLength={400} rows={5} onChange={(e) => set(i, 'text', e.target.value)} />
                </Field>
              </Section>
            ))}
          </div>

          <SaveBar show={changed} saving={saving} form={FORM_ID} onDiscard={discard} saveLabel="Salvar cards" />
        </form>
      )}
    </AdminLayout>
  )
}