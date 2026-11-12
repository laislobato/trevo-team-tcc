/**
 * SERVIÇO: jogos
 * ==============
 * Única porta de entrada dos dados de jogos para as páginas
 * (pages/Games.jsx e pages/GamePage.jsx).
 *
 * - Jogos: vêm da API (back-end), cadastrados pelo painel.
 * - Comentários de jogadores: ainda são uma lista fixa (src/data/games.js).
 *
 * Formato das respostas:
 *   getGames()     -> [ jogo, jogo, ... ]     (só os publicados)
 *   getGame(slug)  -> { game, others }        (others = os outros jogos)
 *   getReviews()   -> [ comentário, ... ]
 *
 * Se o jogo não existir (ou for rascunho), getGame lança um erro com
 * status 404 e a página mostra "Jogo não encontrado".
 */

import { api } from './api'
import { reviews } from '../data/games'

// ===============================================
// FUNÇÕES
// ===============================================

/** Jogos publicados (vitrine e banners da página /jogo) */
export function getGames() {
  return api.getGames()
}

/** Um jogo pelo slug + os outros jogos ("Outros projetos") */
export function getGame(slug) {
  return api.getGame(slug)
}

/** Comentários de jogadores (faixa da página /jogo) */
export async function getReviews() {
  return reviews
}
