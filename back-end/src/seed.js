/**
 * ARQUIVO: seed.js
 * ================
 * Conteúdo de exemplo, colocado no banco quando ele está vazio.
 * Todos os jogos, estúdios e pessoas são FICTÍCIOS.
 * Para começar sem exemplos, use SEED_EXAMPLES=false no .env.
 */

const LOREM =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.'

export const EXAMPLE_DEVELOPERS = [
  {
    key: 'orvalho',
    name: 'Estúdio Orvalho',
    description:
      'O Estúdio Orvalho é uma desenvolvedora independente que cria jogos de aventura em pixel art, com histórias curtas e mundos feitos à mão.',
    activeDevs: 3,
    socials: [
      { label: 'Instagram', url: '#' },
      { label: 'X', url: '#' },
      { label: 'Discord', url: '#' },
    ],
    members: [
      { name: 'Ana Ribeiro', role: 'Programação', photo: '' },
      { name: 'Caio Mendes', role: 'Arte e animação', photo: '' },
      { name: 'Lia Duarte', role: 'Som e trilha', photo: '' },
    ],
  },
  {
    key: 'lume',
    name: 'Coletivo Lume',
    description:
      'O Coletivo Lume reúne quatro amigos que fazem jogos cooperativos para jogar no sofá, com partidas rápidas e muita bagunça boa.',
    activeDevs: 4,
    socials: [
      { label: 'Instagram', url: '#' },
      { label: 'YouTube', url: '#' },
      { label: 'Discord', url: '#' },
    ],
    members: [
      { name: 'Rafa Souza', role: 'Direção de jogo', photo: '' },
      { name: 'Bia Lopes', role: 'Programação', photo: '' },
      { name: 'Teo Alves', role: 'Arte', photo: '' },
    ],
  },
]

export const EXAMPLE_POSTS = [
  {
    slug: 'raizes-de-vidro-data-de-lancamento',
    type: 'anuncio',
    title: 'Raízes de Vidro recebe data de lançamento',
    excerpt:
      'A aventura em pixel art do Estúdio Orvalho chega em março de 2027, com campanha de financiamento aberta a partir de dezembro.',
    subtitle: 'Uma floresta de cristal, um jardineiro e muitas portas trancadas.',
    body: `${LOREM}\n\n${LOREM}`,
    authorName: 'Vitor Martins',
    developerKey: 'orvalho',
    publishedAt: '2026-08-28 12:00:00',
  },
  {
    slug: 'lumen-drift-patch-1-2',
    type: 'patch',
    title: 'Lumen Drift: patch 1.2 traz modo cooperativo local',
    excerpt:
      'A atualização adiciona partidas para até quatro pessoas na mesma tela, novas pistas e correções de desempenho.',
    subtitle: 'O que mudou na versão 1.2.',
    body: `${LOREM}\n\n${LOREM}`,
    authorName: 'Vitor Martins',
    developerKey: 'lume',
    publishedAt: '2026-09-15 12:00:00',
  },
  {
    slug: 'manutencao-servidores-outubro',
    type: 'aviso',
    title: 'Manutenção programada nos servidores de Lumen Drift',
    excerpt:
      'O modo online ficará fora do ar por algumas horas para a instalação de melhorias. O modo local continua funcionando.',
    subtitle: 'Datas e horários da manutenção.',
    body: LOREM,
    authorName: 'Vitor Martins',
    developerKey: 'lume',
    publishedAt: '2026-10-02 12:00:00',
  },
  {
    slug: 'mare-alta-world-premiere',
    type: 'anuncio',
    title: 'Conheça Maré Alta, o novo jogo do Estúdio Orvalho',
    excerpt:
      'Um jogo de exploração calmo, em que você cuida de um farol e das pessoas que passam pela ilha.',
    subtitle: 'Primeiras imagens e detalhes do projeto.',
    body: `${LOREM}\n\n${LOREM}`,
    authorName: 'Vitor Martins',
    developerKey: 'orvalho',
    publishedAt: '2026-10-20 12:00:00',
  },
]

/**
 * Jogos de exemplo (os mesmos que antes ficavam fixos no site).
 * "developerName" liga o jogo à desenvolvedora de exemplo com esse nome.
 */
export const EXAMPLE_GAMES = [
  {
    slug: 'raizes-de-vidro',
    title: 'Raízes de Vidro',
    subtitle: 'Uma floresta de cristal precisa de cuidado',
    developerName: 'Estúdio Orvalho',
    character: 'Mira, a jardineira',
    color: 'green',
    genre: 'Aventura',
    rating: 'Livre',
    theme: 'Natureza e mistério',
    platforms: ['PC', 'Nintendo Switch'],
    description:
      'Mira cuida de uma floresta de cristal que começou a rachar. Explore portas trancadas, resolva quebra-cabeças com plantas e descubra o que está quebrando o vidro.',
    quote: '“Toda raiz guarda um segredo.”',
    about:
      'Raízes de Vidro é uma aventura em pixel art com quebra-cabeças que usam plantas: cada semente cresce de um jeito e abre um caminho diferente. São seis áreas da floresta para explorar, cada uma com um guardião e uma música própria.',
    characters: [
      { name: 'MIRA', text: 'A jardineira da floresta. Curiosa e teimosa, carrega um regador que faz qualquer semente brotar.', image: '' },
      { name: 'TICO', text: 'Um besouro de vidro que vive no chapéu da Mira e conhece todos os atalhos da floresta.', image: '' },
      { name: 'O GUARDIÃO', text: 'A árvore mais antiga da floresta. Ninguém sabe se ele quer ajudar ou atrapalhar.', image: '' },
    ],
  },
  {
    slug: 'mare-alta',
    title: 'Maré Alta',
    subtitle: 'Cuide do farol, conheça quem passa pela ilha',
    developerName: 'Estúdio Orvalho',
    character: 'Seu Tomé, o faroleiro',
    color: 'cyan',
    genre: 'Exploração',
    rating: 'Livre',
    theme: 'Vida no mar',
    platforms: ['PC'],
    description:
      'Um jogo calmo sobre cuidar de um farol e das pessoas que passam pela ilha. Cada visitante traz uma história, e a maré muda tudo a cada dia.',
    quote: '“O mar sempre traz alguém de volta.”',
    about:
      'Em Maré Alta você vive os dias de um faroleiro: consertar a lâmpada, pescar, cozinhar e conversar com os visitantes. A maré sobe e desce de verdade, abrindo e fechando caminhos pela ilha ao longo do dia.',
    characters: [
      { name: 'SEU TOMÉ', text: 'O faroleiro da ilha há quarenta anos. Sabe a previsão do tempo só de olhar para as nuvens.', image: '' },
      { name: 'MARINA', text: 'Uma viajante que chegou num barco furado e decidiu ficar até descobrir de onde veio.', image: '' },
    ],
  },
  {
    slug: 'lumen-drift',
    title: 'Lumen Drift',
    subtitle: 'Corridas de luz para jogar com os amigos',
    developerName: 'Coletivo Lume',
    character: 'Faísca',
    color: 'orange',
    genre: 'Corrida cooperativa',
    rating: '10 anos',
    theme: 'Neon e velocidade',
    platforms: ['PC', 'Xbox', 'PlayStation'],
    description:
      'Corridas rápidas para até quatro pessoas na mesma tela. Faísca e seus amigos atravessam pistas de luz que mudam de forma a cada volta.',
    quote: '“Mais rápido que a própria luz!”',
    about:
      'Lumen Drift mistura corrida e cooperação: a equipe só vence se todos cruzarem a linha de chegada. As pistas são montadas na hora e mudam a cada volta, então nenhuma corrida é igual à outra.',
    characters: [
      { name: 'FAÍSCA', text: 'A piloto mais rápida da cidade de neon. Nunca freia, nem nas curvas.', image: '' },
      { name: 'VOLT', text: 'O mecânico da equipe. Monta peças novas no meio da corrida.', image: '' },
      { name: 'PRISMA', text: 'Uma rival misteriosa que muda de cor conforme a velocidade.', image: '' },
    ],
  },
]
