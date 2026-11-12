/**
 * DADOS: comentários de jogadores
 * ===============================
 * Os JOGOS agora ficam no back-end e são cadastrados pelo painel
 * (as páginas buscam pela API, via src/services/games.js).
 *
 * Aqui ficam só os comentários que passam na página /jogo, que ainda
 * são fixos. Conteúdo de EXEMPLO: usuários e comentários fictícios.
 */

// ===============================================
// COMENTÁRIOS DE JOGADORES (página /jogo)
// ===============================================

/**
 * platform: 'steam' | 'xbox' | 'playstation' | 'switch'
 * game: nome do jogo, do jeito que aparece no card
 */
export const reviews = [
  { user: 'luana_px', platform: 'steam', game: 'Raízes de Vidro', text: 'Os quebra-cabeças com plantas são muito criativos. Terminei em uma tarde e quero mais!' },
  { user: 'GuiNoSofa', platform: 'switch', game: 'Raízes de Vidro', text: 'Perfeito para jogar no portátil. A trilha sonora é uma delícia.' },
  { user: 'rafa.gamer', platform: 'xbox', game: 'Lumen Drift', text: 'Joguei com meus irmãos e foi a maior bagunça. Modo cooperativo excelente.' },
  { user: 'Bia_Farol', platform: 'steam', game: 'Maré Alta', text: 'Um jogo que dá paz. Cada visitante da ilha tem uma história bonita.' },
  { user: 'tiago_ps', platform: 'playstation', game: 'Lumen Drift', text: 'Rindo até agora da corrida em que a pista virou de cabeça para baixo.' },
  { user: 'mel.indie', platform: 'switch', game: 'Raízes de Vidro', text: 'A arte em pixel é linda. Dá vontade de tirar print de tudo.' },
  { user: 'Caio_Drift', platform: 'playstation', game: 'Lumen Drift', text: 'As pistas mudando a cada volta deixam toda corrida diferente.' },
  { user: 'ana_ventania', platform: 'steam', game: 'Maré Alta', text: 'Controles simples e uma história muito bem pensada. Recomendo!' },
]

// Nome que aparece em cada plataforma
export const PLATFORM_NAMES = {
  steam: 'Steam',
  xbox: 'Xbox',
  playstation: 'PlayStation',
  switch: 'Nintendo Switch',
}