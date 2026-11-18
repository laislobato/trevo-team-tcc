/**
 * PÁGINA: GameEditor
 * ==================
 * Criar (/painel/jogos/novo) ou editar (/painel/jogos/:id) um jogo.
 * As partes do formulário seguem a ordem em que as coisas aparecem no site:
 *
 *   1. Jogo           -> nome, subtítulo e estúdio
 *   2. Vitrine        -> personagem, cor, descrição curta e imagem da vitrine
 *                        (os banners do topo da página /jogo ficam em Painel → Banners)
 *   3. Informações    -> gênero, classificação, tema e plataformas
 *   4. Página do jogo -> arte do topo, frase, 3 imagens e "Sobre o jogo"
 *   5. Personagens    -> até 6 (nome, texto e imagem)
 *   Lateral           -> situação (rascunho/publicado) e prévia da vitrine
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
import { BsCheckCircle, BsEye, BsPencil, BsPlusLg, BsTrash } from 'react-icons/bs'
import AdminLayout from '../../components/Admin/AdminLayout'
import ImageUpload from '../../components/Admin/ImageUpload'
import { Alert, EditorTabs, Field, SaveBar, Section, StatusBadge } from '../../components/Admin/AdminUI'
import { colorHex, gameStatus, useLeaveWarning } from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api, imageUrl } from '../../services/api'
import { GAME_COLORS, GAME_RATINGS, GAME_PLATFORMS, MAX_SCREENSHOTS, MAX_CHARACTERS } from '../../data/gameOptions'
import '../../styles/globals.css'

// ===============================================
// FORMULÁRIO VAZIO E PARTES
// ===============================================

const FORM_ID = 'game-form'

const EMPTY = {
  title: '',
  subtitle: '',
  developerId: '',
  status: 'rascunho',
  character: '',
  characterImage: '',
  color: 'green',
  description: '',
  genre: '',
  rating: 'Livre',
  theme: '',
  platforms: [],
  art: '',
  quote: '',
  screenshots: ['', '', ''],
  about: '',
  characters: [],
}

const SECTIONS = [
  { id: 'jogo-dados', label: 'Jogo' },
  { id: 'jogo-vitrine', label: 'Vitrine' },
  { id: 'jogo-info', label: 'Informações' },
  { id: 'jogo-pagina', label: 'Página do jogo' },
  { id: 'jogo-personagens', label: 'Personagens' },
]

/** Jogo da API -> formulário */
const toForm = (game) => ({
  title: game.title,
  subtitle: game.subtitle,
  developerId: game.developerId ?? '',
  status: game.status,
  character: game.character,
  characterImage: game.characterImage,
  color: game.color,
  description: game.description,
  genre: game.genre,
  rating: game.rating,
  theme: game.theme,
  platforms: game.platforms,
  art: game.art,
  quote: game.quote,
  screenshots: [0, 1, 2].map((i) => game.screenshots[i] || ''),
  about: game.about,
  characters: game.characters,
})

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function GameEditor() {
  const { id } = useParams() // sem id = jogo novo
  const isNew = !id
  const { run, isAdmin, user } = useAuth()
  const navigate = useNavigate()

  // Estúdio: o jogo novo já começa com o estúdio dele
  const [start] = useState(() => (isAdmin ? EMPTY : { ...EMPTY, developerId: user?.developerId ?? '' }))
  const [form, setForm] = useState(start)
  const [saved, setSaved] = useState(start) // como está salvo (para saber se mudou)
  const [game, setGame] = useState(null) // jogo da API (endereço e situação salva)
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  useLeaveWarning(dirty && !saving)

  // ---------- Carrega os estúdios (admin) e, se for edição, o jogo ----------
  useEffect(() => {
    const loadGame = isNew ? Promise.resolve(null) : run((token) => api.admin.getGame(token, id))
    const loadDevs = isAdmin ? run((token) => api.admin.listDevelopers(token)) : Promise.resolve([])
    Promise.all([loadDevs, loadGame])
      .then(([devs, data]) => {
        setDevelopers(devs)
        if (data) {
          setGame(data)
          setForm(toForm(data))
          setSaved(toForm(data))
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

  const discard = () => {
    if (!window.confirm('Descartar as alterações que ainda não foram salvas?')) return
    setForm(saved)
    setErrors({})
    setMessage('')
  }

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

  // ---------- Apagar (só jogo que já existe) ----------
  const handleDelete = async () => {
    if (!window.confirm(`Apagar o jogo "${game.title}"? A página dele sai do site e isso não pode ser desfeito.`)) return
    try {
      await run((token) => api.admin.deleteGame(token, id))
      navigate('/painel/jogos', { state: { message: `Jogo "${game.title}" apagado.` } })
    } catch (err) {
      setMessage(err.message)
    }
  }

  const crumbs = [{ label: 'Jogos', to: '/painel/jogos' }, { label: isNew ? 'Novo jogo' : 'Editar jogo' }]
  if (loading) {
    return (
      <AdminLayout title={isNew ? 'Novo jogo' : 'Editar jogo'} crumbs={crumbs}>
        <p className="admin-loading">Carregando...</p>
      </AdminLayout>
    )
  }

  // Erro de um item de lista, ex.: errors["characters.0.name"]
  const itemError = (list, i, field) => errors[`${list}.${i}${field ? `.${field}` : ''}`]
  const savedStatus = game ? gameStatus(game) : null
  const published = form.status === 'publicado'

  return (
    <AdminLayout
      title={isNew ? 'Novo jogo' : game?.title || 'Editar jogo'}
      crumbs={crumbs}
      badge={savedStatus && <StatusBadge status={savedStatus} />}
      dirty={dirty}
      actions={
        <>
          {savedStatus === 'published' && (
            <Link to={`/jogo/${game.slug}`} target="_blank" rel="noreferrer" className="admin-btn admin-btn--ghost">
              <BsEye aria-hidden="true" /> <span className="admin-btn-text">Ver no site</span>
            </Link>
          )}
          <button type="submit" form={FORM_ID} className="admin-btn admin-btn--primary"
            disabled={saving || (!isNew && !dirty)}>
            {saving ? 'Salvando...' : isNew ? 'Criar jogo' : 'Salvar'}
          </button>
        </>
      }
    >
      {message && <Alert tone="error">{message}</Alert>}

      <EditorTabs sections={SECTIONS} />

      <form id={FORM_ID} className="admin-editor" onSubmit={handleSubmit} noValidate>
        <div className="admin-stack">
          {/* ========== 1. JOGO ========== */}
          <Section id="jogo-dados" title="Jogo">
            <div className="admin-grid-2">
              <Field
                label="Nome do jogo"
                error={errors.title}
                hint={game ? `Endereço: /jogo/${game.slug}` : 'O endereço da página é criado a partir do nome.'}
              >
                <input value={form.title} maxLength={100} onChange={(e) => set('title', e.target.value)} required />
              </Field>
              <Field label="Subtítulo" error={errors.subtitle} hint="Frase curta embaixo do nome.">
                <input value={form.subtitle} maxLength={150} onChange={(e) => set('subtitle', e.target.value)} />
              </Field>
            </div>

            {isAdmin ? (
              <Field label="Estúdio" error={errors.developerId} hint="O estúdio escolhido também pode editar este jogo.">
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
          </Section>

          {/* ========== 2. VITRINE ========== */}
          <Section id="jogo-vitrine" title="Vitrine">
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
              hint="Aparece na vitrine e no topo da página do jogo."
              count={`${form.description.length}/300`}
            >
              <textarea rows="3" maxLength={300} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </Field>

            <ImageUpload label="Imagem da vitrine (recortada no arco; vazio = silhueta)" value={form.characterImage}
              onChange={(v) => set('characterImage', v)} contain />
            {errors.characterImage && <p className="admin-field-error">{errors.characterImage}</p>}
          </Section>

          {/* ========== 3. INFORMAÇÕES ========== */}
          <Section id="jogo-info" title="Informações">
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
          </Section>

          {/* ========== 4. PÁGINA DO JOGO ========== */}
          <Section id="jogo-pagina" title="Página do jogo">
            <ImageUpload label="Arte do topo da página (inteira, na faixa colorida; vazio = estrela)" value={form.art}
              onChange={(v) => set('art', v)} contain />
            <p className="admin-hint admin-hint--block">
              Use PNG com fundo transparente e recortado rente ao desenho: a arte ocupa a faixa toda na altura e sai pelos lados.
            </p>
            {errors.art && <p className="admin-field-error">{errors.art}</p>}

            <Field label="Frase (em cima da imagem do meio)" error={errors.quote} hint="Ex.: “Toda raiz guarda um segredo.”">
              <input value={form.quote} maxLength={150} onChange={(e) => set('quote', e.target.value)} />
            </Field>

            <div className="admin-grid-3">
              {form.screenshots.slice(0, MAX_SCREENSHOTS).map((img, i) => (
                <ImageUpload key={i} label={`Imagem ${i + 1}${i === 1 ? ' (meio)' : ''}`} value={img}
                  onChange={(v) => setScreenshot(i, v)} />
              ))}
            </div>

            <Field label="Sobre o jogo" error={errors.about} hint="Texto do bloco “SOBRE O JOGO”."
              count={`${form.about.length}/3000`}>
              <textarea rows="6" maxLength={3000} value={form.about} onChange={(e) => set('about', e.target.value)} />
            </Field>
          </Section>

          {/* ========== 5. PERSONAGENS ========== */}
          <Section id="jogo-personagens" title="Personagens" note={`${form.characters.length}/${MAX_CHARACTERS}`}>
            {form.characters.map((character, i) => (
              <div key={i} className="admin-item">
                <div className="admin-item-head">
                  <span className="admin-item-number" aria-hidden="true">{i + 1}</span>
                  <span className="admin-item-title">{character.name || `Personagem ${i + 1}`}</span>
                  <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => removeCharacter(i)}
                    title="Remover" aria-label={`Remover personagem ${character.name || i + 1}`}>
                    <BsTrash aria-hidden="true" />
                  </button>
                </div>
                <div className="admin-item-body">
                  <ImageUpload label="Imagem" value={character.image} onChange={(v) => setCharacter(i, 'image', v)}
                    small contain />
                  <div className="admin-item-fields">
                    <Field label="Nome" error={itemError('characters', i, 'name')}>
                      <input value={character.name} maxLength={40} onChange={(e) => setCharacter(i, 'name', e.target.value)} />
                    </Field>
                    <Field label="Texto" error={itemError('characters', i, 'text')}>
                      <textarea rows="2" value={character.text} maxLength={300}
                        onChange={(e) => setCharacter(i, 'text', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>
            ))}

            {form.characters.length < MAX_CHARACTERS && (
              <button type="button" className="admin-add" onClick={addCharacter}>
                <BsPlusLg aria-hidden="true" /> Adicionar personagem
              </button>
            )}
          </Section>
        </div>

        {/* ========== LATERAL ========== */}
        <aside className="admin-aside" aria-label="Publicação e prévia">
          <Section title="Publicação">
            <Field label="Situação" error={errors.status}>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="rascunho">Rascunho (não aparece no site)</option>
                <option value="publicado">Publicado</option>
              </select>
            </Field>
            <p className={`admin-note ${published ? 'admin-note--published' : ''}`}>
              {published ? <BsCheckCircle aria-hidden="true" /> : <BsPencil aria-hidden="true" />}
              {published ? 'Publicado: aparece na vitrine e em /jogo.' : 'Rascunho: não aparece no site.'}
            </p>
            <dl className="admin-facts">
              <div>
                <dt>Endereço</dt>
                <dd>{game ? `/jogo/${game.slug}` : 'criado ao salvar'}</dd>
              </div>
              <div>
                <dt>Personagens</dt>
                <dd>{form.characters.length}/{MAX_CHARACTERS}</dd>
              </div>
            </dl>
            {!isNew && (
              <div className="admin-aside-danger">
                <button type="button" className="admin-text-btn admin-text-btn--danger" onClick={handleDelete}>
                  <BsTrash aria-hidden="true" /> Apagar jogo
                </button>
              </div>
            )}
          </Section>

          {/* Como o jogo aparece na vitrine */}
          <Section title="Prévia da vitrine">
            <div className="admin-preview">
              <span className="admin-preview-img admin-preview-img--game" style={{ background: colorHex(form.color) }}>
                {form.characterImage ? <img src={imageUrl(form.characterImage)} alt="" /> : 'Silhueta'}
              </span>
              {form.character && <span className="admin-preview-tag">{form.character}</span>}
              <span className={`admin-preview-title ${form.title ? '' : 'admin-preview-empty'}`}>
                {form.title || 'Nome do jogo'}
              </span>
              <span className={`admin-preview-text ${form.description ? '' : 'admin-preview-empty'}`}>
                {form.description || 'A descrição curta aparece aqui.'}
              </span>
            </div>
          </Section>
        </aside>

        <SaveBar show={dirty} saving={saving} form={FORM_ID} onDiscard={discard}
          saveLabel={isNew ? 'Criar jogo' : 'Salvar alterações'} />
      </form>
    </AdminLayout>
  )
}