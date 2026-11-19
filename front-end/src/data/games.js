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
 * platform: 'steam' | 'xbox' | 'playstation' | 'switch' | 'gog' | 'tabuleiro'
 * game: nome do jogo, do jeito que aparece no card
 *
 * EXEMPLO: comentários fictícios sobre os jogos da Trevo Team (Never Lost,
 * O Pequeno Guardião e The Treasure in the Deep), cada um numa plataforma em
 * que o jogo existe. Troque pelos comentários reais quando tiver.
 */
export const reviews = [
  {
    user: 'ana_ventania',
    platform: 'steam',
    game: 'Never Lost',
    text: 'Joguei pensando no meu bichinho de pelúcia de criança. A Bunny é uma fofura e a história aperta o coração.',
  },
  {
    user: 'mesa_de_sabado',
    platform: 'tabuleiro',
    game: 'The Treasure in the Deep',
    text: 'Jogamos em cinco e ninguém queria deixar o outro para trás. As cartas de evento mudam a partida toda hora.',
  },
  {
    user: 'GabiSpeedrun',
    platform: 'steam',
    game: 'Never Lost',
    text: 'O pulo duplo é bem gostoso de controlar, e as tocas ajudam muito a cortar caminho. Já estou tentando zerar mais rápido.',
  },
  {
    user: 'lu.pixelada',
    platform: 'gog',
    game: 'O Pequeno Guardião',
    text: 'Só vi as primeiras imagens e já quero saber o que tem dentro daquele cadeado. O visual está lindo.',
  },
  {
    user: 'BetoNoControle',
    platform: 'tabuleiro',
    game: 'The Treasure in the Deep',
    text: 'Fácil de explicar para quem nunca jogou. Meu filho de 10 anos escolheu o Kobold e liderou o grupo.',
  },
  {
    user: 'joao.semente',
    platform: 'steam',
    game: 'Never Lost',
    text: 'Fiquei FEDIDO por causa da Maria Fedida e atraí uma nuvem de mosquitos. Ri muito, que mecânica criativa!',
  },
  {
    user: 'dado_de_seis',
    platform: 'tabuleiro',
    game: 'The Treasure in the Deep',
    text: 'A trilha em espiral até o centro deixa a tensão crescer a cada rodada. Chegar todo mundo vivo foi uma vitória.',
  },
  {
    user: 'miranda.joga',
    platform: 'steam',
    game: 'Never Lost',
    text: 'A luta contra o Guardião do Jardim é o melhor momento do jogo. Desafiador, mas nunca injusto.',
  },
]

// Nome que aparece em cada plataforma
export const PLATFORM_NAMES = {
  steam: 'Steam',
  xbox: 'Xbox',
  playstation: 'PlayStation',
  switch: 'Nintendo Switch',
  gog: 'GOG',
  tabuleiro: 'Tabuleiro',
}