/**
 * DADOS: jogos e comentários
 * ==========================
 * Usado pela página inicial dos jogos (/jogo) e pela página de cada jogo
 * (/jogo/<slug>). As páginas NÃO leem este arquivo direto: elas pedem os
 * dados para src/services/games.js. Quando os jogos forem para o painel,
 * só aquele arquivo muda (passa a buscar no backend) e este aqui sai.
 *
 * Conteúdo de EXEMPLO: todos os jogos, personagens, usuários e comentários
 * abaixo são fictícios. Troque pelos dados reais antes de publicar.
 *
 * Para adicionar um jogo, copie um bloco da lista "games" e mude os campos
 * (o carrossel e as páginas se ajustam sozinhos).
 *
 * Imagens: importe de src/assets e coloque no campo (vazio = desenho padrão
 * ou bloco cinza).
 *   ex.: import miraImg from '../assets/mira.png'  ->  characterImage: miraImg
 */

// ===============================================
// BANNERS DO HERO (página /jogo)
// ===============================================

export const gameBanners = [
  { image: '', alt: 'Raízes de Vidro', link: '/jogo/raizes-de-vidro' },
  { image: '', alt: 'Maré Alta', link: '/jogo/mare-alta' },
  { image: '', alt: 'Lumen Drift', link: '/jogo/lumen-drift' },
]

// ===============================================
// JOGOS
// ===============================================

/**
 * Campos de cada jogo (os mesmos que o painel vai ter no futuro):
 *
 * Vitrine (/jogo)
 * - slug:           endereço da página do jogo -> /jogo/<slug> (sem acento e espaço)
 * - title:          nome do jogo
 * - character:      personagem que aparece na vitrine
 * - characterImage: imagem desse personagem (vazio = silhueta)
 * - color:          cor de fundo do personagem ('orange' | 'cyan' | 'green')
 * - description:    texto curto (vitrine e topo da página do jogo)
 *
 * Página do jogo (/jogo/<slug>)
 * - subtitle:    frase curta embaixo do título
 * - developer:   estúdio que fez o jogo
 * - genre, rating, theme, platforms: quadro de informações
 *     rating = classificação indicativa (ex.: 'Livre', '10 anos')
 * - quote:       frase em cima da imagem do meio
 * - screenshots: 3 imagens do jogo (vazio = bloco cinza)
 * - about:       texto do bloco "SOBRE O JOGO"
 * - characters:  personagens { name, text, image }
 */
export const games = [
  {
    slug: 'raizes-de-vidro',
    title: 'Raízes de Vidro',
    subtitle: 'Uma floresta de cristal precisa de cuidado',
    developer: 'Estúdio Orvalho',
    character: 'Mira, a jardineira',
    characterImage: '',
    color: 'green',
    genre: 'Aventura',
    rating: 'Livre',
    theme: 'Natureza e mistério',
    platforms: ['PC', 'Nintendo Switch'],
    description:
      'Mira cuida de uma floresta de cristal que começou a rachar. Explore portas trancadas, resolva quebra-cabeças com plantas e descubra o que está quebrando o vidro.',
    quote: '“Toda raiz guarda um segredo.”',
    screenshots: ['', '', ''],
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
    developer: 'Estúdio Orvalho',
    character: 'Seu Tomé, o faroleiro',
    characterImage: '',
    color: 'cyan',
    genre: 'Exploração',
    rating: 'Livre',
    theme: 'Vida no mar',
    platforms: ['PC'],
    description:
      'Um jogo calmo sobre cuidar de um farol e das pessoas que passam pela ilha. Cada visitante traz uma história, e a maré muda tudo a cada dia.',
    quote: '“O mar sempre traz alguém de volta.”',
    screenshots: ['', '', ''],
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
    developer: 'Coletivo Lume',
    character: 'Faísca',
    characterImage: '',
    color: 'orange',
    genre: 'Corrida cooperativa',
    rating: '10 anos',
    theme: 'Neon e velocidade',
    platforms: ['PC', 'Xbox', 'PlayStation'],
    description:
      'Corridas rápidas para até quatro pessoas na mesma tela. Faísca e seus amigos atravessam pistas de luz que mudam de forma a cada volta.',
    quote: '“Mais rápido que a própria luz!”',
    screenshots: ['', '', ''],
    about:
      'Lumen Drift mistura corrida e cooperação: a equipe só vence se todos cruzarem a linha de chegada. As pistas são montadas na hora e mudam a cada volta, então nenhuma corrida é igual à outra.',
    characters: [
      { name: 'FAÍSCA', text: 'A piloto mais rápida da cidade de neon. Nunca freia, nem nas curvas.', image: '' },
      { name: 'VOLT', text: 'O mecânico da equipe. Monta peças novas no meio da corrida.', image: '' },
      { name: 'PRISMA', text: 'Uma rival misteriosa que muda de cor conforme a velocidade.', image: '' },
    ],
  },
]

// ===============================================
// COMENTÁRIOS DE JOGADORES (página /jogo)
// ===============================================

/** platform: 'steam' | 'xbox' | 'playstation' | 'switch' */
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