/**
 * PÁGINA: About
 * =============
 * Página "Sobre nós" da Trevo Team.
 *
 * Estrutura da página (de cima para baixo):
 * - Header flutuando por cima da arte do topo
 * - AboutHero  -> arte de fundo, "SOBRE NÓS", 2 cards e a divisória "<>"
 * - Equipe (TeamMember), alternando o lado da imagem
 *
 * Vem do painel (só o admin da Trevo altera):
 * - os 2 cards do topo: Painel → Página About
 * - a equipe: Desenvolvedoras → Trevo Team → Integrantes
 *   (apelido, nome, cargo e função, foto, descrição e até 3 redes de cada um).
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

// Ajuste estes caminhos se o arquivo não estiver em src/pages/Principal/
import { useEffect, useState } from 'react'
import Header from '../components/shared/Header'
import AboutHero from '../components/About/AboutHero'
import TeamMember from '../components/About/TeamMember'
import Footer from '../components/shared/Footer'
import { api } from '../services/api'
import '../styles/globals.css'

// Cores dos arcos dos cartões, alternando: verde, ciano, laranja
const CARD_COLORS = ['green', 'cyan', 'orange']

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function About() {
  // Equipe da Trevo (do painel). null = carregando
  const [members, setMembers] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api
      .getTeam()
      .then((team) => active && setMembers(team.members))
      .catch((err) => {
        if (!active) return
        setMembers([])
        setError(err.message)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="about-page">
      {/* ========== CABEÇALHO POR CIMA DA ARTE DO TOPO ========== */}
      <div className="page-top">
        <Header flat />

        {/* ========== SOBRE NÓS (cards do painel) ========== */}
        <AboutHero title="SOBRE NÓS" />
      </div>


      {/* ========== EQUIPE ========== */}
      <section className="about-team">
        {members === null && <p className="about-team-status">Carregando a equipe...</p>}
        {error && <p className="about-team-status">A equipe não carregou agora. {error}</p>}

        {members?.map((member, index) => (
          <TeamMember
            key={index}
            nickname={member.nickname}
            name={member.name}
            role={member.role}
            text={member.description}
            photo={member.photo}
            socials={member.socials}
            color={CARD_COLORS[index % CARD_COLORS.length]}
            // Integrantes em posição ímpar ficam com a imagem à direita (zigue-zague)
            reverse={index % 2 === 1}
          />
        ))}
              <Footer />
      </section>
    </div>
  )
}