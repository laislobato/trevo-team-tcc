/**
 * DADOS: comentários de jogadores
 * ===============================
 * Os JOGOS agora ficam no back-end e são cadastrados pelo painel
 * (as páginas buscam pela API, via src/services/games.js).
 *
 * Aqui ficam só os comentários de jogadores (faixa "O que os jogadores
 * dizem", na Home e na página /jogo), que ainda são fixos.
 * Conteúdo de EXEMPLO: usuários e comentários fictícios.
 */

// ===============================================
// COMENTÁRIOS DE JOGADORES (Home e página /jogo)
// ===============================================

/**
 * platform: 'steam' | 'xbox' | 'playstation' | 'switch' | 'gog'
 * game: nome do jogo, do jeito que aparece no card
 *
 * EXEMPLO: comentários fictícios sobre os jogos de exemplo do site
 * (Raízes de Vidro, Maré Alta e Lumen Drift), cada um numa plataforma
 * em que o jogo existe. Troque pelos comentários reais quando tiver.
 */
export const reviews = [
  {
    user: 'ana_ventania',
    platform: 'steam',
    game: 'Maré Alta',
    text: 'Jogo um dia na ilha antes de dormir e já virou ritual. Cada visitante tem uma história que fica com você.',
  },
  {
    user: 'Caio_Drift',
    platform: 'playstation',
    game: 'Lumen Drift',
    text: 'As pistas mudam a cada volta, então nenhuma corrida é igual. Com quatro amigos no sofá é caos do bom.',
  },
  {
    user: 'mirandaplays',
    platform: 'switch',
    game: 'Raízes de Vidro',
    text: 'Os quebra-cabeças com sementes são muito criativos. Joguei no portátil e não larguei até o segundo guardião.',
  },
  {
    user: 'BetoNoControle',
    platform: 'xbox',
    game: 'Lumen Drift',
    text: 'Gostei de ganhar só se a equipe inteira cruzar a linha. Meu filho de 10 anos joga junto e se diverte.',
  },
  {
    user: 'lu.pixelada',
    platform: 'gog',
    game: 'Raízes de Vidro',
    text: 'A pixel art é linda e cada área da floresta tem uma música própria. O Tico já é meu personagem favorito.',
  },
  {
    user: 'farol_do_sul',
    platform: 'steam',
    game: 'Maré Alta',
    text: 'Um jogo calmo que respeita o seu tempo. A maré abrindo caminhos pela ilha é uma ideia muito bem feita.',
  },
  {
    user: 'GabiSpeedrun',
    platform: 'steam',
    game: 'Lumen Drift',
    text: 'Controles precisos e visual neon caprichado. O patch 1.2 com cooperativo local ficou excelente.',
  },
  {
    user: 'joao.semente',
    platform: 'switch',
    game: 'Raízes de Vidro',
    text: 'Comecei sem esperar muito e me peguei anotando os segredos da floresta num caderno. Recomendo!',
  },
]

// Nome que aparece em cada plataforma
export const PLATFORM_NAMES = {
  steam: 'Steam',
  xbox: 'Xbox',
  playstation: 'PlayStation',
  switch: 'Nintendo Switch',
  gog: 'GOG',
}