/**
 * SERVIÇO: api
 * ============
 * Todas as conversas do front com o backend passam por aqui.
 *
 * O endereço da API vem do arquivo .env do front:
 *   VITE_API_URL=http://localhost:3001
 * (na hospedagem, coloque o endereço público da API)
 */

/**
 * Limpa o endereço da API:
 * - tira espaços e a barra do final;
 * - coloca "https://" se faltar (sem isso, o navegador acha que é uma
 *   página do próprio site e a Vercel devolve o index.html no lugar dos posts).
 */
function cleanApiUrl(value) {
  let url = String(value || 'http://localhost:3001').trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`
  return url
}

export const API_URL = cleanApiUrl(import.meta.env.VITE_API_URL)

/** Erro com a mensagem do servidor, o código HTTP e os erros de cada campo */
export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.status = status
    this.details = details || {}
  }
}

/** Imagens enviadas pelo painel ficam na API: "/uploads/x.webp" -> "http://.../uploads/x.webp" */
export function imageUrl(path) {
  if (!path) return ''
  return path.startsWith('/uploads/') ? `${API_URL}${path}` : path
}

/** "2026-08-28T12:00:00Z" -> "28/08/2026" */
export function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('pt-BR') : ''
}

/** Faz o pedido e devolve o JSON da resposta (ou lança ApiError) */
async function request(path, { method = 'GET', body, token, form } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Tente de novo em instantes.', 0)
  }

  if (response.status === 204) return null

  // A API sempre responde JSON. Se veio outra coisa (ex.: uma página HTML),
  // o endereço da API está errado.
  const isJson = (response.headers.get('content-type') || '').includes('application/json')
  if (!isJson) {
    console.error(`Resposta inesperada de ${API_URL}${path}: confira o VITE_API_URL.`)
    throw new ApiError(
      'O site não encontrou a API. Confira o endereço em VITE_API_URL (na Vercel) e faça um Redeploy.',
      response.status,
    )
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError(data.error || 'Algo deu errado.', response.status, data.details)
  }
  return data
}

// ------------------------------------------------------------------
// Converte o post da API para o formato que os componentes do blog usam
// ------------------------------------------------------------------
function normalizeDeveloper(dev) {
  if (!dev) return null
  return {
    ...dev,
    logo: imageUrl(dev.logo),
    members: dev.members.map((m) => ({ ...m, photo: imageUrl(m.photo) })),
  }
}

export function normalizePost(post) {
  return {
    ...post,
    // texto com linhas em branco -> lista de parágrafos
    body: post.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    cover: imageUrl(post.cover),
    gallery: [0, 1, 2].map((i) => imageUrl(post.gallery[i] || '')),
    author: { name: post.author.name || 'Equipe Trevo Team', photo: imageUrl(post.author.photo) },
    date: formatDate(post.publishedAt),
    developer: normalizeDeveloper(post.developer),
  }
}

const normalizeSummary = (s) => (s ? { ...s, cover: imageUrl(s.cover) } : null)

// ------------------------------------------------------------------
// Converte o jogo da API para o formato que as páginas de jogos usam
// (os caminhos das imagens viram endereços completos)
// ------------------------------------------------------------------
export function normalizeGame(game) {
  return {
    ...game,
    characterImage: imageUrl(game.characterImage),
    banner: imageUrl(game.banner),
    screenshots: [0, 1, 2].map((i) => imageUrl(game.screenshots?.[i] || '')),
    characters: (game.characters || []).map((c) => ({ ...c, image: imageUrl(c.image) })),
    developer: game.developer ? { ...game.developer, logo: imageUrl(game.developer.logo) } : null,
  }
}

const normalizeGameSummary = (g) => ({ ...g, characterImage: imageUrl(g.characterImage) })

// ------------------------------------------------------------------
// Site público
// ------------------------------------------------------------------
export const api = {
  /** Posts publicados, do mais novo para o mais antigo */
  async getPosts() {
    const data = await request('/api/posts')
    return data.posts.map(normalizePost)
  },

  /** Um post + o anterior e o próximo */
  async getPost(slug) {
    const data = await request(`/api/posts/${encodeURIComponent(slug)}`)
    return {
      post: normalizePost(data.post),
      previous: normalizeSummary(data.previous),
      next: normalizeSummary(data.next),
    }
  },

  /** Jogos publicados (vitrine da página /jogo) */
  async getGames() {
    const data = await request('/api/games')
    return data.games.map(normalizeGame)
  },

  /** Um jogo + os outros jogos ("Outros projetos") */
  async getGame(slug) {
    const data = await request(`/api/games/${encodeURIComponent(slug)}`)
    return { game: normalizeGame(data.game), others: data.others.map(normalizeGameSummary) }
  },

  // ----------------------------------------------------------------
  // Login
  // ----------------------------------------------------------------
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/api/auth/me', { token }),
  changePassword: (token, currentPassword, newPassword) =>
    request('/api/auth/password', { method: 'POST', token, body: { currentPassword, newPassword } }),

  // ----------------------------------------------------------------
  // Painel (precisam do token). Aqui os dados vêm "crus", como a API guarda.
  // ----------------------------------------------------------------
  admin: {
    listPosts: (token) => request('/api/admin/posts', { token }).then((d) => d.posts),
    getPost: (token, id) => request(`/api/admin/posts/${id}`, { token }).then((d) => d.post),
    createPost: (token, data) => request('/api/admin/posts', { method: 'POST', token, body: data }).then((d) => d.post),
    updatePost: (token, id, data) => request(`/api/admin/posts/${id}`, { method: 'PUT', token, body: data }).then((d) => d.post),
    deletePost: (token, id) => request(`/api/admin/posts/${id}`, { method: 'DELETE', token }),

    listGames: (token) => request('/api/admin/games', { token }).then((d) => d.games),
    getGame: (token, id) => request(`/api/admin/games/${id}`, { token }).then((d) => d.game),
    createGame: (token, data) => request('/api/admin/games', { method: 'POST', token, body: data }).then((d) => d.game),
    updateGame: (token, id, data) => request(`/api/admin/games/${id}`, { method: 'PUT', token, body: data }).then((d) => d.game),
    deleteGame: (token, id) => request(`/api/admin/games/${id}`, { method: 'DELETE', token }),

    listDevelopers: (token) => request('/api/admin/developers', { token }).then((d) => d.developers),
    getDeveloper: (token, id) => request(`/api/admin/developers/${id}`, { token }).then((d) => d.developer),
    createDeveloper: (token, data) =>
      request('/api/admin/developers', { method: 'POST', token, body: data }).then((d) => d.developer),
    updateDeveloper: (token, id, data) =>
      request(`/api/admin/developers/${id}`, { method: 'PUT', token, body: data }).then((d) => d.developer),
    deleteDeveloper: (token, id) => request(`/api/admin/developers/${id}`, { method: 'DELETE', token }),

    /** Envia uma imagem e devolve o caminho dela ("/uploads/...") */
    async uploadImage(token, file) {
      const form = new FormData()
      form.append('image', file)
      const data = await request('/api/admin/uploads', { method: 'POST', token, form })
      return data.url
    },
  },
}
