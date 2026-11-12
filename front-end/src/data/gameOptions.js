/**
 * DADOS: opções do formulário de jogos (painel)
 * =============================================
 * São as MESMAS listas que o back-end aceita (back-end/src/services/games.js).
 * Se mudar uma lista lá, mude aqui também.
 */

/** Cor do fundo do personagem na vitrine (e da barra na página do jogo) */
export const GAME_COLORS = [
  { id: 'green', label: 'Verde', hex: '#8cc74f' },
  { id: 'cyan', label: 'Ciano', hex: '#d0fffb' },
  { id: 'orange', label: 'Laranja', hex: '#f8906a' },
]

/** Classificação indicativa (ClassInd) */
export const GAME_RATINGS = ['Livre', '10 anos', '12 anos', '14 anos', '16 anos', '18 anos']

export const GAME_PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile']

/** Limites (iguais aos do back-end) */
export const MAX_SCREENSHOTS = 3
export const MAX_CHARACTERS = 6
