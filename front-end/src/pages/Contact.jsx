/**
 * PÁGINA: Contact (Contact Us)
 * ============================
 * Página de contato da Trevo Team, na rota /contato.
 * Também é o canal de suporte do site (assunto "Suporte").
 *
 * Estrutura (de cima para baixo):
 * - Header (flutua por cima da arte do topo)
 * - ContactHero   -> "FALE COM A GENTE", com a arte de rascunho no fundo
 * - ContactHelp   -> "COMO PODEMOS AJUDAR": botões de assunto, formulário
 *                    (ContactForm) e a linha de contato direto (ContactDirect)
 * - ContactValues -> "NOSSOS VALORES"
 * - ContactFaq    -> perguntas frequentes + botão para o FAQ do blog
 *                    (as perguntas vêm de src/data/faq.js: só as com "destaque")
 * - Footer
 *
 * Para trocar textos, edite as constantes abaixo.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect } from 'react'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import ContactHero from '../components/Contact/ContactHero'
import ContactHelp from '../components/Contact/ContactHelp'
import ContactValues from '../components/Contact/ContactValues'
import ContactFaq from '../components/Contact/ContactFaq'
import { faq } from '../data/faq'
import '../styles/globals.css'
import '../components/Contact/css/Contact.css'

// ===============================================
// TEXTOS E DADOS DA PÁGINA
// ===============================================

// E-mail de contato (provisório)
const CONTACT_EMAIL = 'contato@trevoteam.com'

// Prazo de resposta (EXEMPLO: troque pelo prazo real)
const RESPONSE_TIME = 'Resposta em até 2 dias úteis'

// Redes sociais da Trevo Team (troque "#" pelos links reais)
const socials = [
  { label: 'Instagram', url: '#' },
  { label: 'X', url: '#' },
  { label: 'YouTube', url: '#' },
  { label: 'Discord', url: '#' },
]

// Valores da Trevo Team para parceiros e marketing.
// "image" vazio mostra o círculo colorido.
const values = [
  { label: 'Parceria', image: '' },
  { label: 'Transparência', image: '' },
  { label: 'Criatividade', image: '' },
  { label: 'Comunidade', image: '' },
  { label: 'Alcance', image: '' },
]

// Perguntas frequentes desta página: as marcadas com "destaque: true"
// em src/data/faq.js (a lista completa fica na aba FAQ do blog)
const faqHighlights = faq.filter((item) => item.destaque)

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function Contact() {
  // Título da aba do navegador
  useEffect(() => {
    document.title = 'Contato | Trevo Team'
  }, [])

  return (
    <div className="contact-page">
      {/* ========== CABEÇALHO POR CIMA DA ARTE DO TOPO ========== */}
      <div className="page-top">
        <Header flat />
        <ContactHero
          title="FALE COM A GENTE"
          subtitle="ONDE OS INDIES CRIAM RAÍZES"
          text="Parcerias, suporte ou imprensa: escolha o assunto e a pessoa certa da equipe responde."
        />
      </div>

      {/* ========== COMO PODEMOS AJUDAR (assunto + formulário) ========== */}
      <ContactHelp email={CONTACT_EMAIL} responseTime={RESPONSE_TIME} socials={socials} />

      {/* ========== NOSSOS VALORES ========== */}
      <ContactValues title="NOSSOS VALORES" values={values} />

      {/* ========== PERGUNTAS FREQUENTES ========== */}
      <ContactFaq
        text="As dúvidas que mais chegam para a equipe. Se a sua não estiver aqui, veja a lista completa ou mande uma mensagem."
        items={faqHighlights}
      />

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}