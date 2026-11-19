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
    key: 'lume',
    name: 'Coletivo Lume',
    description:
      'O Coletivo Lume reúne amigos que criam jogos de tabuleiro de aventura, com partidas cooperativas para jogar em grupo.',
    activeDevs: 3,
    socials: [
      { label: 'Instagram', url: '#' },
      { label: 'YouTube', url: '#' },
      { label: 'Discord', url: '#' },
    ],
    members: [
      { name: 'Rafa Souza', role: 'Design do jogo', photo: '' },
      { name: 'Bia Lopes', role: 'Regras e testes', photo: '' },
      { name: 'Teo Alves', role: 'Arte', photo: '' },
    ],
  },
]

/**
 * Posts de exemplo. developerKey: 'trevo' (a própria Trevo Team) ou a "key"
 * de uma desenvolvedora de EXAMPLE_DEVELOPERS.
 */
export const EXAMPLE_POSTS = [
  {
    slug: 'never-lost-world-premiere',
    type: 'anuncio',
    title: 'Conheça Never Lost, o novo jogo da Trevo Team',
    excerpt:
      'Uma aventura de plataforma em que a coelha de pelúcia Bunny atravessa o Grande Jardim para voltar ao seu dono.',
    subtitle: 'Primeiras imagens e detalhes do projeto.',
    body: `${LOREM}\n\n${LOREM}`,
    authorName: 'Vitor Martins',
    developerKey: 'trevo',
    publishedAt: '2026-08-28 12:00:00',
  },
  {
    slug: 'the-treasure-in-the-deep-livro-de-regras',
    type: 'patch',
    title: 'The Treasure in the Deep: livro de regras atualizado',
    excerpt:
      'A nova versão das regras explica a preparação da partida, a trilha em espiral até o centro do tabuleiro e as cartas de evento.',
    subtitle: 'O que mudou nas regras.',
    body: `${LOREM}\n\n${LOREM}`,
    authorName: 'Vitor Martins',
    developerKey: 'lume',
    publishedAt: '2026-09-15 12:00:00',
  },
  {
    slug: 'manutencao-programada-outubro',
    type: 'aviso',
    title: 'Manutenção programada no site',
    excerpt:
      'O site e o Painel ficarão fora do ar por algumas horas para a instalação de melhorias.',
    subtitle: 'Datas e horários da manutenção.',
    body: LOREM,
    authorName: 'Vitor Martins',
    developerKey: 'trevo',
    publishedAt: '2026-10-02 12:00:00',
  },
  {
    slug: 'pequeno-guardiao-world-premiere',
    type: 'anuncio',
    title: 'Conheça O Pequeno Guardião',
    excerpt:
      'O segundo jogo da Trevo Team acompanha um pequeno guardião que protege um segredo trancado num cadeado de luz.',
    subtitle: 'Primeiras imagens e detalhes do projeto.',
    body: `${LOREM}\n\n${LOREM}`,
    authorName: 'Vitor Martins',
    developerKey: 'trevo',
    publishedAt: '2026-10-20 12:00:00',
  },
]

/**
 * Jogos de exemplo: os três jogos fictícios da Trevo Team.
 * "developerName" liga o jogo à desenvolvedora com esse nome.
 * Never Lost segue o documento do jogo, e The Treasure in the Deep, o livro de regras.
 * EXEMPLO: O Pequeno Guardião ainda não tem documento; o texto dele é provisório.
 */
export const EXAMPLE_GAMES = [
  {
    slug: 'never-lost',
    title: 'Never Lost',
    subtitle: 'Uma coelha de pelúcia em busca do caminho de volta',
    developerName: 'Trevo Team',
    character: 'Bunny',
    color: 'green',
    genre: 'Plataforma',
    rating: 'Livre',
    theme: 'Infância, memórias e amizade',
    platforms: ['PC'],
    description:
      'Bunny se encontra em uma terra vasta e mágica chamada o Grande Jardim, lugar de fauna e flora, onde todos os brinquedos vão parar quando se perdem de seus donos. Determinada a encontrar o caminho de volta para seu amigo, a pequena coelha parte em uma aventura, explorando tudo o que aquele reino tem a oferecer.',
    quote: '“Uma história sobre a infância, memórias queridas e amizades.”',
    about:
      'Never Lost é um jogo de plataforma com uma história simples e aconchegante: vença os desafios e chegue ao fim do Grande Jardim, passando por inimigos e amigos pelo caminho. A coelha anda para os lados, sobe e desce vinhas e pula com a tecla Z (apertando duas vezes, faz um pulo duplo, na altura de dois blocos). No caminho há espinhos, que fazem a fase recomeçar, arbustos espinhosos, que tiram uma vida, e tocas, que levam de uma ponta à outra num instante.',
    characters: [
      { name: 'BUNNY', text: 'Uma coelha de pelúcia que se separou do seu dono. Perdida no Grande Jardim, ela só tem um objetivo: voltar para o seu amigo.', image: '' },
      { name: 'MARIA FEDIDA', text: 'O inseto que mais odeia banho. Se lança no chão e deixa uma bomba de fedor para trás; quem é atingido fica FEDIDO.', image: '' },
      { name: 'MOSQUITO', text: 'Gosta de curtir a vida na dele. Não é uma ameaça, a não ser que você esteja FEDIDO: aí ele persegue você até o efeito passar.', image: '' },
      { name: 'ROSA', text: 'Uma flor bela e tímida, mas espinhenta: anda pela plataforma e mostra os espinhos quando alguém chega perto.', image: '' },
      { name: 'PLANTA CARNÍVORA', text: 'Animada como um cachorro, corre atrás de quem passa e pula se precisar. Pisar nela deixa a planta nocauteada por um tempo.', image: '' },
      { name: 'GUARDIÃO DO JARDIM', text: 'Um grande urso de pelúcia que mora nas profundezas do jardim e protege os moradores. Superprotetor, não recebe bem os invasores.', image: '' },
    ],
  },
  {
    slug: 'pequeno-guardiao',
    title: 'O Pequeno Guardião',
    subtitle: 'Alguns segredos merecem ser protegidos',
    developerName: 'Trevo Team',
    character: 'O Guardião',
    color: 'cyan',
    genre: 'Aventura',
    rating: 'Livre',
    theme: 'Mistério',
    platforms: ['PC'],
    description:
      'Um pequeno guardião de casaco e capuz carrega um cadeado luminoso que tranca um segredo. Explore, resolva enigmas e descubra o que ele está protegendo.',
    quote: '“Alguns segredos merecem ser guardados.”',
    about: 'O Pequeno Guardião é o segundo jogo da Trevo Team. Mais detalhes sobre a história e as mecânicas serão divulgados em breve.',
    characters: [
      { name: 'O GUARDIÃO', text: 'Pequeno, de casaco claro e capuz, segura com as duas mãos um cadeado que brilha no escuro.', image: '' },
    ],
  },
  {
    slug: 'the-treasure-in-the-deep',
    title: 'The Treasure in the Deep',
    subtitle: 'Uma aventura de tabuleiro para 2 a 5 jogadores',
    developerName: 'Coletivo Lume',
    character: 'Cinco aventureiros',
    color: 'orange',
    genre: 'Aventura, Cooperativo',
    rating: '10 anos',
    theme: 'Fantasia',
    platforms: ['Tabuleiro'],
    description:
      'Escolha um dos cinco personagens e avance com o grupo até o centro do tabuleiro. Estratégia, sorte e trabalho em equipe decidem se todos chegam ao fim da jornada.',
    quote: '“Ninguém chega ao tesouro sozinho.”',
    about:
      'The Treasure in the Deep é um jogo de tabuleiro de aventura com estética de fantasia, para 2 a 5 jogadores, em que o grupo trabalha junto para que todos sobrevivam e cheguem ao fim do tabuleiro. Na sua vez, cada jogador rola o dado e anda o número de casas pela trilha em espiral, em direção ao centro. Quem para numa casa de evento puxa uma das 18 cartas de evento, que podem trazer benefícios ou consequências para o grupo todo, e o caminho muda conforme o desempenho da equipe. Um jogador é eliminado se a vida chegar a zero, se ficar com fome ou se for derrotado em batalha, e a partida termina quando todos chegam à última casa. Acompanham o jogo um tabuleiro, um dado de seis faces, cinco cartas de personagem, dezoito cartas de evento e cinco peões.',
    characters: [
      { name: 'VAMPIRO', text: 'Um viajante da noite, acostumado à escuridão das profundezas.', image: '' },
      { name: 'ELFO', text: 'Ágil e atento, percebe os perigos do caminho antes de todo mundo.', image: '' },
      { name: 'HUMANO', text: 'Corajoso e versátil, se adapta a qualquer situação da trilha.', image: '' },
      { name: 'ANÃO', text: 'Resistente e teimoso, conhece bem os túneis debaixo da terra.', image: '' },
      { name: 'KOBOLD', text: 'Pequeno e esperto, sempre encontra um atalho ou um truque novo.', image: '' },
    ],
  },
]

/**
 * Trevo Team: criada sozinha na primeira vez que a API liga (não depende dos
 * exemplos). Os integrantes são os que estavam fixos na página About; troque
 * pelo painel (Desenvolvedoras → Trevo Team).
 */
const TEAM_LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis porttitor ullamcorper. In pretium nec est at tempus. Duis quis lacus at elit maximus mollis.'

export const TREVO_TEAM = {
  name: 'Trevo Team',
  description: 'Publisher que divulga e financia jogos indie.',
  members: [1, 2, 3].map(() => ({
    name: 'Luka Antonio Lobato',
    nickname: 'TECO',
    role: '',
    photo: '',
    description: TEAM_LOREM,
    socials: [],
  })),
}