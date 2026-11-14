/**
 * PÁGINA: Contact (Contact Us)
 * ============================
 * Página de contato da Trevo Team, na rota /contato.
 * Também é o canal de suporte do site (assunto "Suporte" no formulário).
 *
 * Estrutura (de cima para baixo):
 * - Header (igual ao das outras páginas)
 * - ContactHero       -> banner ciano com quadrado verde e TREVO TEAM repetido
 * - ContactValues     -> "OUR VALUES": valores para parceiros e marketing
 * - ContactBand       -> faixa laranja "CONTACT US" com e-mail e redes sociais
 * - ContactForm       -> formulário (nome, e-mail, assunto e mensagem)
 * - ContactNewsletter -> caixa preta de inscrição na newsletter
 * - Footer
 *
 * Para trocar textos, edite as constantes abaixo.
 */

import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import ContactHero from '../components/Contact/ContactHero'
import ContactValues from '../components/Contact/ContactValues'
import ContactBand from '../components/Contact/ContactBand'
import ContactForm from '../components/Contact/ContactForm'
import ContactNewsletter from '../components/Contact/ContactNewsletter'
import '../styles/globals.css'
import '../components/Contact/css/Contact.css'

// E-mail de contato (provisório)
const CONTACT_EMAIL = 'contato@trevoteam.com'

// Valores da Trevo Team para parceiros e marketing.
// "image" vazio mostra o círculo colorido.
const values = [
  { label: 'Parceria', image: '' },
  { label: 'Transparência', image: '' },
  { label: 'Criatividade', image: '' },
  { label: 'Comunidade', image: '' },
  { label: 'Alcance', image: '' },
]

// Redes sociais da Trevo Team (troque "#" pelos links reais)
const socials = [
  { label: 'Instagram', url: '#' },
  { label: 'X', url: '#' },
  { label: 'YouTube', url: '#' },
  { label: 'Discord', url: '#' },
]

export default function Contact() {
  return (
    <div className="contact-page">
      {/* ========== CABEÇALHO POR CIMA DO BANNER CIANO ========== */}
      <div className="page-top page-top--cyan">
        <Header flat />
        <ContactHero
          title="TREVO TEAM"
          tagline="Onde os indies criam raízes."
          phrase="Fale com a gente!"
        />
      </div>

      {/* ========== NOSSOS VALORES ========== */}
      <ContactValues title="OUR VALUES" values={values} />

      {/* ========== FAIXA CONTACT US ========== */}
      <ContactBand title="CONTACT US" email={CONTACT_EMAIL} socials={socials} />

      {/* ========== FORMULÁRIO + NEWSLETTER ========== */}
      <section className="contact-main" aria-label="Enviar mensagem">
        <ContactForm />
        <ContactNewsletter />
      </section>

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}