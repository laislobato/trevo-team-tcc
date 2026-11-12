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
