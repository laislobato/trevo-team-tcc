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
  { user: 'CapivaraCarioca', platform: 'gog', game: 'Deltarune', text: 'Toby Fox eu comprei esse jogo faz 6 anos e ele não tá pronto ainda' },
  { user: 'CapivaraSupremacy', platform: 'steam', game: 'Deadlock', text: 'Tem que nerfar o Rat King no Deadlock, tá dando mais não' },
  { user: 'CapivaraPobre', platform: 'playstation', game: 'Bloodborne', text: 'Esperando bloodborne no PC, enquanto isso comprei um PS5' },
  { user: 'CapivaraPirata', platform: 'switch', game: 'Zelda Ocarina of Time', text: 'Emulei até as reviews' },
  { user: 'CapivaraGamerBR', platform: 'xbox', game: 'Minecraft', text: 'Gamepass tá caro' },
  { user: 'LuskinhaGamesBrasil', platform: 'xbox', game: 'Call of Duty: Modern Warfare 4', text: 'Actvision devolve meu dinheiro eu tenho que comprar GTA VI' },
  { user: 'Caio_Drift', platform: 'playstation', game: 'Lumen Drift', text: 'As pistas mudando a cada volta deixam toda corrida diferente.' },
  { user: 'ana_ventania', platform: 'steam', game: 'Maré Alta', text: 'Controles simples e uma história muito bem pensada. Recomendo!' },
]

// Nome que aparece em cada plataforma
export const PLATFORM_NAMES = {
  steam: 'Steam',
  xbox: 'Xbox',
  playstation: 'PlayStation',
  switch: 'Nintendo Switch',
  gog: 'GOG',
}