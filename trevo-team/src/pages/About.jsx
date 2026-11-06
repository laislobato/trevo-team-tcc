/**
 * PÁGINA: About
 * =============
 * Página "Sobre nós" da Trevo Team.
 *
 * Estrutura da página (de cima para baixo):
 * - Header (compartilhado com as outras páginas)
 * - Divisor curto
 * - AboutHero  -> bloco "SOBRE NÓS" com a imagem em quadrados rotacionados
 * - Símbolo "<>"
 * - Lista de membros da equipe (TeamMember), alternando o lado da imagem
 *
 * Para mudar textos e membros, edite os arrays e constantes deste arquivo.
 * Nenhum CSS precisa ser alterado para isso.
 */

// Ajuste estes caminhos se o arquivo não estiver em src/pages/Principal/
import Header from '../components/shared/Header'
import AboutHero from '../components/About/AboutHero'
import TeamMember from '../components/About/TeamMember'
import Footer from '../components/shared/Footer'
import '../styles/globals.css'

// Texto de exemplo reutilizado (troque pelo texto real quando tiver)
const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis porttitor ullamcorper. In pretium nec est at tempus. Duis quis lacus at elit maximus mollis.'

// Dados dos membros da equipe.
// "circles" define as três bolinhas de baixo: 'cyan' ou 'orange'
const teamMembers = [
  {
    id: 1,
    role: 'TECO',
    name: 'Luka Antonio Lobato',
    text: LOREM,
    circles: ['cyan', 'orange', 'cyan'],
  },
  {
    id: 2,
    role: 'TECO',
    name: 'Luka Antonio Lobato',
    text: LOREM,
    circles: ['cyan', 'orange', 'cyan'],
  },
  {
    id: 3,
    role: 'TECO',
    name: 'Luka Antonio Lobato',
    text: LOREM,
    circles: ['cyan', 'orange', 'cyan'],
  },
]

export default function About() {
  return (
    <div className="about-page">
      {/* ========== CABEÇALHO (igual ao da Home) ========== */}
      <Header />

      {/* ========== DIVISOR CURTO ========== */}
      <div className="about-short-divider"></div>

      {/* ========== SOBRE NÓS ========== */}
      <AboutHero
        title="SOBRE NÓS"
        text={LOREM}
        buttonLabel="SAIBA MAIS"
      />


      {/* ========== EQUIPE ========== */}
      <section className="about-team">
        {teamMembers.map((member, index) => (
          <TeamMember
            key={member.id}
            role={member.role}
            name={member.name}
            text={member.text}
            circles={member.circles}
            // Membros em índice ímpar ficam com a imagem à direita (zigue-zague)
            reverse={index % 2 === 1}
          />
        ))}
              <Footer />
      </section>
    </div>
  )
}