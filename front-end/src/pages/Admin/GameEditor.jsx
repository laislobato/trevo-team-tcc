/**
 * PÁGINA: GameEditor
 * ==================
 * Criar (/painel/jogos/novo) ou editar (/painel/jogos/:id) um jogo.
 * Os blocos do formulário seguem a ordem em que as coisas aparecem no site:
 *
 *   1. Jogo           -> nome, subtítulo, estúdio, situação
 *   2. Vitrine        -> personagem, cor, descrição curta e banner (página /jogo)
 *   3. Informações    -> gênero, classificação, tema e plataformas
 *   4. Página do jogo -> frase, 3 imagens e "Sobre o jogo"
 *   5. Personagens    -> até 6 (nome, texto e imagem)
 *
 * - Situação "Rascunho" não aparece no site; "Publicado" aparece na hora.
 * - Login de estúdio: o estúdio é sempre o dele (não aparece o seletor).
 * - O endereço da página (/jogo/<slug>) é criado a partir do nome na
 *   primeira vez que o jogo é salvo e não muda depois.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { GAME_COLORS, GAME_RATINGS, GAME_PLATFORMS, MAX_SCREENSHOTS, MAX_CHARACTERS } from '../../data/gameOptions'
import '../../styles/globals.css'

// ===============================================
// FORMULÁRIO VAZIO E CAMPO
// ===============================================

const EMPTY = {
  title: '',
  subtitle: '',
  developerId: '',
  status: 'rascunho',
  character: '',
  characterImage: '',
  color: 'green',
  description: '',
  banner: '',
  genre: '',
  rating: 'Livre',
  theme: '',
  platforms: [],
  quote: '',
  screenshots: ['', '', ''],
  about: '',
  characters: [],
}

/** Campo com rótulo, dica e mensagem de erro */
function Field({ label, error, hint, children }) {
  return (
    <label className={`admin-field ${error ? 'has-error' : ''}`}>
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="admin-hint">{hint}</span>}
      {error && <span className="admin-field-error">{error}</span>}
    </label>
  )
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function GameEditor() {
  const { id } = useParams() // sem id = jogo novo
  const isNew = !id
  const { run, isAdmin, user } = useAuth()
  const navigate = useNavigate()

  // Estúdio: o jogo novo já começa com o estúdio dele
  const [form, setForm] = useState(() => (isAdmin ? EMPTY : { ...EMPTY, developerId: user?.developerId ?? '' }))
  const [slug, setSlug] = useState('')
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  // ---------- Carrega os estúdios (admin) e, se for edição, o jogo ----------
  useEffect(() => {
    const loadGame = isNew ? Promise.resolve(null) : run((token) => api.admin.getGame(token, id))
    const loadDevs = isAdmin ? run((token) => api.admin.listDevelopers(token)) : Promise.resolve([])
    Promise.all([loadDevs, loadGame])
      .then(([devs, game]) => {
        setDevelopers(devs)
        if (game) {
          setSlug(game.slug)
          setForm({
            title: game.title,
            subtitle: game.subtitle,
            developerId: game.developerId ?? '',
            status: game.status,
            character: game.character,
            characterImage: game.characterImage,
            color: game.color,
            description: game.description,
            banner: game.banner,
            genre: game.genre,
            rating: game.rating,
            theme: game.theme,
            platforms: game.platforms,
            quote: game.quote,
            screenshots: [0, 1, 2].map((i) => game.screenshots[i] || ''),
            about: game.about,
            characters: game.characters,
          })
        }
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false))
  }, [id, isNew, isAdmin, run])

  // ---------- Funções para mudar o formulário ----------
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const togglePlatform = (platform) =>
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(platform)
        ? f.platforms.filter((p) => p !== platform)
        : GAME_PLATFORMS.filter((p) => p === platform || f.platforms.includes(p)), // mantém a ordem da lista
    }))

  const setScreenshot = (index, value) =>
    setForm((f) => ({ ...f, screenshots: f.screenshots.map((img, i) => (i === index ? value : img)) }))

  const addCharacter = () =>
    setForm((f) => ({ ...f, characters: [...f.characters, { name: '', text: '', image: '' }] }))
  const setCharacter = (index, field, value) =>
    setForm((f) => ({
      ...f,
      characters: f.characters.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }))
  const removeCharacter = (index) =>
    setForm((f) => ({ ...f, characters: f.characters.filter((_, i) => i !== index) }))

  // ---------- Salvar ----------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setMessage('')

    const payload = { ...form, developerId: form.developerId === '' ? null : Number(form.developerId) }

    setSaving(true)
    try {
      await run((token) => (isNew ? api.admin.createGame(token, payload) : api.admin.updateGame(token, id, payload)))
      navigate('/painel/jogos', { state: { message: isNew ? 'Jogo criado.' : 'Jogo salvo.' } })
    } catch (err) {
      setErrors(err.details || {})
      setMessage(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  const title = isNew ? 'Novo jogo' : 'Editar jogo'
  if (loading) {
    return (
      <AdminLayout title={title}>
        <p className="admin-loading">Carregando...</p>
      </AdminLayout>
    )
  }

  // Erro de um item de lista, ex.: errors["characters.0.name"]
  const itemError = (list, i, field) => errors[`${list}.${i}${field ? `.${field}` : ''}`]

  return (
    <AdminLayout
      title={title}
      actions={
        slug &&
        form.status === 'publicado' && (
          <Link to={`/jogo/${slug}`} target="_blank" rel="noreferrer" className="admin-button admin-button--ghost">
            Ver no site ↗
          </Link>
        )
      }
    >
      {message && <p className="admin-alert admin-alert--error" role="alert">{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        {/* ========== 1. JOGO ========== */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Jogo</legend>

          <div className="admin-grid-2">
            <Field
              label="Nome do jogo"
              error={errors.title}
              hint={slug ? `Endereço: /jogo/${slug}` : 'O endereço da página é criado a partir do nome.'}
            >
              <input value={form.title} maxLength={100} onChange={(e) => set('title', e.target.value)} required />
            </Field>
            <Field label="Subtítulo" error={errors.subtitle} hint="Frase curta embaixo do nome.">
              <input value={form.subtitle} maxLength={150} onChange={(e) => set('subtitle', e.target.value)} />
            </Field>
          </div>

          <div className="admin-grid-2">
            {isAdmin ? (
              <Field label="Estúdio" error={errors.developerId}>
                <select value={form.developerId} onChange={(e) => set('developerId', e.target.value)}>
                  <option value="">Nenhum (só a Trevo edita)</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                  ))}
                </select>
              </Field>
            ) : (
              // Estúdio: fixo no estúdio dele (a API também garante isso)
              <div className="admin-field">
                <span className="admin-label">Estúdio</span>
                <p className="admin-fixed">{user?.developer?.name}</p>
              </div>
            )}
            <Field label="Situação" error={errors.status}>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="rascunho">Rascunho (não aparece no site)</option>
                <option value="publicado">Publicado</option>
              </select>
            </Field>
          </div>
        </fieldset>

        {/* ========== 2. VITRINE E BANNER (página /jogo) ========== */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Vitrine e banner</legend>

          <div className="admin-grid-2">
            <Field label="Personagem da vitrine" error={errors.character} hint="Ex.: Mira, a jardineira">
              <input value={form.character} maxLength={60} onChange={(e) => set('character', e.target.value)} />
            </Field>

            {/* Cor: bolinhas para escolher */}
            <div className={`admin-field ${errors.color ? 'has-error' : ''}`}>
              <span className="admin-label" id="game-color-label">Cor do fundo</span>
              <div className="admin-swatches" role="radiogroup" aria-labelledby="game-color-label">
                {GAME_COLORS.map((color) => (
                  <label key={color.id} className={`admin-swatch ${form.color === color.id ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="game-color"
                      value={color.id}
                      checked={form.color === color.id}
                      onChange={() => set('color', color.id)}
                      className="visually-hidden"
                    />
                    <span className="admin-swatch-dot" style={{ background: color.hex }} aria-hidden="true"></span>
                    {color.label}
                  </label>
                ))}
              </div>
              {errors.color && <span className="admin-field-error">{errors.color}</span>}
            </div>
          </div>

          <Field
            label="Descrição curta"
            error={errors.description}
            hint={`Aparece na vitrine e no topo da página do jogo. ${form.description.length}/300`}
          >
            <textarea rows="3" maxLength={300} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>

          <div className="admin-grid-2">
            <ImageUpload label="Imagem do personagem (vazio = silhueta)" value={form.characterImage}
              onChange={(v) => set('characterImage', v)} />
            <ImageUpload label="Banner (topo da página /jogo)" value={form.banner} onChange={(v) => set('banner', v)} />
          </div>
          {(errors.characterImage || errors.banner) && (
            <p className="admin-field-error">{errors.characterImage || errors.banner}</p>
          )}
        </fieldset>

        {/* ========== 3. INFORMAÇÕES ========== */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Informações</legend>

          <div className="admin-grid-3">
            <Field label="Gênero" error={errors.genre} hint="Ex.: Aventura">
              <input value={form.genre} maxLength={40} onChange={(e) => set('genre', e.target.value)} />
            </Field>
            <Field label="Classificação indicativa" error={errors.rating}>
              <select value={form.rating} onChange={(e) => set('rating', e.target.value)}>
                {GAME_RATINGS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Tema" error={errors.theme} hint="Ex.: Natureza e mistério">
              <input value={form.theme} maxLength={60} onChange={(e) => set('theme', e.target.value)} />
            </Field>
          </div>

          {/* Plataformas: caixinhas de marcar */}
          <fieldset className="admin-checks">
            <legend className="admin-label">Plataformas</legend>
            {GAME_PLATFORMS.map((platform) => (
              <label key={platform} className="admin-check">
                <input
                  type="checkbox"
                  checked={form.platforms.includes(platform)}
                  onChange={() => togglePlatform(platform)}
                />
                {platform}
              </label>
            ))}
          </fieldset>
          {errors.platforms && <p className="admin-field-error">{errors.platforms}</p>}
        </fieldset>

        {/* ========== 4. PÁGINA DO JOGO ========== */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Página do jogo</legend>

          <Field label="Frase (em cima da imagem do meio)" error={errors.quote} hint="Ex.: “Toda raiz guarda um segredo.”">
            <input value={form.quote} maxLength={150} onChange={(e) => set('quote', e.target.value)} />
          </Field>

          <div className="admin-grid-3">
            {form.screenshots.slice(0, MAX_SCREENSHOTS).map((img, i) => (
              <ImageUpload key={i} label={`Imagem ${i + 1}${i === 1 ? ' (meio)' : ''}`} value={img}
                onChange={(v) => setScreenshot(i, v)} />
            ))}
          </div>

          <Field label="Sobre o jogo" error={errors.about} hint="Texto do bloco “SOBRE O JOGO”.">
            <textarea rows="6" maxLength={3000} value={form.about} onChange={(e) => set('about', e.target.value)} />
          </Field>
        </fieldset>

        {/* ========== 5. PERSONAGENS ========== */}
        <fieldset className="admin-card">
          <legend className="admin-card-title">Personagens ({form.characters.length}/{MAX_CHARACTERS})</legend>

          {form.characters.map((character, i) => (
            <div key={i} className="admin-list-row admin-list-row--member">
              <ImageUpload label="Imagem" value={character.image} onChange={(v) => setCharacter(i, 'image', v)} small />
              <label className={`admin-field ${itemError('characters', i, 'name') ? 'has-error' : ''}`}>
                <span className="admin-label">Nome</span>
                <input value={character.name} maxLength={40} onChange={(e) => setCharacter(i, 'name', e.target.value)} />
                {itemError('characters', i, 'name') && (
                  <span className="admin-field-error">{itemError('characters', i, 'name')}</span>
                )}
              </label>
              <label className="admin-field admin-field--grow">
                <span className="admin-label">Texto</span>
                <input value={character.text} maxLength={300} onChange={(e) => setCharacter(i, 'text', e.target.value)} />
              </label>
              <button type="button" className="admin-button admin-button--ghost" onClick={() => removeCharacter(i)}
                aria-label={`Remover personagem ${character.name || i + 1}`}>
                Remover
              </button>
            </div>
          ))}

          {form.characters.length < MAX_CHARACTERS && (
            <button type="button" className="admin-button admin-button--light" onClick={addCharacter}>
              + Adicionar personagem
            </button>
          )}
        </fieldset>

        {/* ========== BOTÕES ========== */}
        <div className="admin-form-actions">
          <Link to="/painel/jogos" className="admin-button admin-button--ghost">Cancelar</Link>
          <button type="submit" className="admin-button admin-button--primary" disabled={saving}>
            {saving ? 'Salvando...' : isNew ? 'Criar jogo' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
