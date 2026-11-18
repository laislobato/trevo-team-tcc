/**
 * COMPONENTE: ContactHelp
 * =======================
 * Seção "Como podemos ajudar": a pessoa escolhe o assunto num dos três
 * botões, lê a dica daquele assunto e preenche o formulário logo embaixo.
 *
 *              COMO PODEMOS AJUDAR
 *               ESCOLHA O ASSUNTO   (laranja)
 *   ( PARCERIAS )   ( SUPORTE )   ( IMPRENSA )   <- o escolhido fica colorido
 *        dica do assunto escolhido
 *   ┌───────────── formulário (ContactForm) ─────────────┐
 *   └────────────────────────────────────────────────╱
 *   ✉ e-mail  |  ◷ prazo  |  ● ● ● ●   (ContactDirect)
 *
 * O assunto escolhido vai junto com a mensagem (ver ContactForm).
 *
 * Animação na troca de assunto: o botão escolhido dá um "pulinho",
 * a dica entra deslizando e o formulário muda para o tom do assunto.
 * Também é o canal de suporte do site (assunto "Suporte").
 *
 * Props:
 * - title, subtitle: título da seção e a frase laranja embaixo
 * - email:           e-mail de contato (linha de contato direto)
 * - responseTime:    prazo de resposta (linha de contato direto)
 * - socials:         redes sociais [{ label, url }]
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useState } from 'react'
import { BsController, BsLifePreserver, BsNewspaper } from 'react-icons/bs'
import ContactForm from './ContactForm'
import ContactDirect from './ContactDirect'
import './css/ContactHelp.css'

// ===============================================
// ASSUNTOS
// ===============================================
// label: texto do botão | value: assunto que vai junto com a mensagem
// color: cor do botão escolhido | hint: dica embaixo dos botões

const SUBJECTS = [
  {
    label: 'PARCERIAS',
    value: 'Parceria e marketing',
    color: 'green',
    icon: BsController,
    hint: 'Publicação e parcerias: conte sobre o jogo, a fase do projeto e do que vocês precisam.',
  },
  {
    label: 'SUPORTE',
    value: 'Suporte',
    color: 'cyan',
    icon: BsLifePreserver,
    hint: 'Suporte: diga qual jogo, em qual plataforma, e o que aconteceu.',
  },
  {
    label: 'IMPRENSA',
    value: 'Imprensa',
    color: 'orange',
    icon: BsNewspaper,
    hint: 'Imprensa: conte qual é o veículo e o que você precisa (entrevista, chave para review, material).',
  },
]

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function ContactHelp({
  title = 'COMO PODEMOS AJUDAR',
  subtitle = 'ESCOLHA O ASSUNTO',
  email = '',
  responseTime = '',
  socials = [],
}) {
  // Assunto escolhido (começa no primeiro)
  const [active, setActive] = useState(0)
  const subject = SUBJECTS[active]

  return (
    <section className="contact-help" aria-labelledby="contact-help-title">
      {/* ========== TÍTULO ========== */}
      <h2 id="contact-help-title" className="contact-help-title">{title}</h2>
      {subtitle && <p className="contact-help-subtitle">{subtitle}</p>}

      {/* ========== BOTÕES DE ASSUNTO ========== */}
      <div className="contact-help-subjects" role="group" aria-label="Assunto da mensagem">
        {SUBJECTS.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={item.value}
              type="button"
              className={`contact-help-subject contact-help-subject--${item.color} ${index === active ? 'is-active' : ''}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <Icon aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Dica do assunto escolhido (o leitor de tela avisa quando muda).
          A "key" recria o texto a cada troca, para a animação rodar de novo. */}
      <div className="contact-help-hint" aria-live="polite">
        <p key={subject.value} className="contact-help-hint-text">{subject.hint}</p>
      </div>

      {/* ========== FORMULÁRIO (no tom do assunto escolhido) ========== */}
      <ContactForm subject={subject.value} tone={subject.color} />

      {/* ========== CONTATO DIRETO ========== */}
      <ContactDirect email={email} responseTime={responseTime} socials={socials} />
    </section>
  )
}