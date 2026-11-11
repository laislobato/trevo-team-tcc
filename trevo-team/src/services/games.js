/**
 * SERVIÇO: jogos
 * ==============
 * Única porta de entrada dos dados de jogos para as páginas.
 *
 * HOJE:     lê a lista local (src/data/games.js).
 * FUTURO:   quando os jogos estiverem no painel, troque o corpo destas
 *           funções por chamadas ao backend (igual aos posts do blog), ex.:
 *             getGame: (slug) => api.getGame(slug)
 *           As páginas não precisam mudar, porque já recebem uma Promise
 *           e já tratam "carregando", "não encontrado" e "erro".
 *
 * Formato das respostas (o mesmo que o backend deve devolver):
 *   getGames()     -> [ jogo, jogo, ... ]
 *   getGame(slug)  -> { game, others }   (others = os outros jogos)
 *   getReviews()   -> [ comentário, ... ]
 */

import { games, reviews } from '../data/games'
import { ApiError } from './api'

// ===============================================
// FUNÇÕES
// ===============================================

/** Todos os jogos (vitrine da página /jogo) */
export async function getGames() {
  return games
}

/** Um jogo pelo slug + os outros jogos ("Outros projetos") */
export async function getGame(slug) {
  const game = games.find((g) => g.slug === slug)

  // Mesmo erro que a API devolve, para a página mostrar "Jogo não encontrado"
  if (!game) throw new ApiError('Jogo não encontrado.', 404)

  const others = games.filter((g) => g.slug !== slug)
  return { game, others }
}

/** Comentários de jogadores (faixa da página /jogo) */
export async function getReviews() {
  return reviews
}