/**
 * PÁGINA: Games (jogos)
 * =====================
 * Página de um jogo, seguindo as referências de design.
 *
 * Estrutura (de cima para baixo):
 * - Header (igual ao das outras páginas)
 * - GameHero        -> barra ciano com estrela, título, texto e informações
 * - GameCards       -> três imagens, o card do meio com a frase acima
 * - Sobre o jogo    -> bloco de texto centralizado
 * - GameCharacters  -> personagens (silhueta preta + laranja + caixa cinza)
 * - GameProjects    -> outros projetos (cards em arco)
 *
 * Para trocar textos e imagens, edite as constantes e arrays abaixo.
 */

// Ajuste estes caminhos se o arquivo não estiver em src/pages/Principal/
import Header from '../components/shared/Header'
import GameHero from '../components/Games/Gamehero'
import GameCards from '../components/Games/GameCards'
import GameCharacters from '../components/Games/GameCharacters'
import GameProjects from '../components/Games/GameProjects'
import Footer from '../components/shared/Footer'
import '../components/Games/css/Games.css'

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis porttitor ullamcorper. In pretium nec est at tempus. Duis quis lacus at elit maximus mollis.'

// Informações do jogo (grid de 2 colunas)
const gameInfo = [
  { label: 'Genre', value: 'Lorem.' },
  { label: 'Rating', value: 'Ipsum.' },
  { label: 'Theme', value: 'Lorem ipsum dolor sit amet.' },
  { label: 'Platform', value: 'Lorem, Ipsum.' },
]

// Imagens dos cards. "src" vazio mostra o bloco cinza (placeholder)
const screenshots = [
  { id: 1, src: '' },
  { id: 2, src: '' },
  { id: 3, src: '' },
]

const characters = [
  { id: 1, name: 'NAME', text: LOREM },
  { id: 2, name: 'NAME', text: LOREM },
  { id: 3, name: 'NAME', text: LOREM },
]

const otherProjects = [
  { id: 1, name: 'NOME', text: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone' },
  { id: 2, name: 'NOME', text: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone' },
  { id: 3, name: 'NOME', text: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone' },
]

export default function Games() {
  return (
    <div className="games-page">
      {/* ========== CABEÇALHO ========== */}
      <Header />

      {/* ========== HERO DO JOGO ========== */}
      <GameHero
        title="TITULO"
        subtitle="Subtitulo baba"
        text={LOREM}
        info={gameInfo}
      />

      {/* ========== IMAGENS COM FRASE ========== */}
      <GameCards quote="“CUTE QUOTE”" items={screenshots} />

      {/* ========== SOBRE O JOGO ========== */}
      <section className="games-about">
        <h3 className="games-about-title">SOBRE O JOGO</h3>
        <p className="games-about-text">{LOREM}</p>
      </section>

      {/* ========== PERSONAGENS ========== */}
      <GameCharacters
        title="CONHEÇA OS PERSONAGENS"
        characters={characters}
      />

      {/* ========== OUTROS PROJETOS ========== */}
      <GameProjects
        title="OUTROS PROJETOS"
        projects={otherProjects}
      />
      <Footer />
    </div>
  )
}