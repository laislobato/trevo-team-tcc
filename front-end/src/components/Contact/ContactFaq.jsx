/**
 * COMPONENTE: ContactFaq
 * ======================
 * Perguntas frequentes da página Contact, em duas colunas:
 *
 *   PERGUNTAS                 ───────────────────────────────────
 *   FREQUENTES (laranja)      01  Quanto tempo leva...?          –
 *   Texto curto...                Resposta aberta...
 *   [ VER TODAS NO FAQ → ]    02  O que preciso enviar...?       +
 *                             03  ...                            +
 *
 * - Clicar numa pergunta abre a resposta (e fecha a que estava aberta).
 *   A primeira já começa aberta.
 * - O botão leva para a aba FAQ do blog (/blog?aba=faq).
 * - O leitor de tela é avisado se cada pergunta está aberta (aria-expanded).
 * - Animação: o "+" gira e vira "−", e a resposta abre deslizando
 *   (a altura é animada no CSS). Resposta fechada fica "inert":
 *   o leitor de tela e o Tab pulam ela.
 *
 * Props:
 * - title, subtitle: título e a parte laranja embaixo
 * - text:            texto curto da coluna da esquerda
 * - items:           perguntas [{ question, answer }]
 * - linkTo:          para onde o botão leva (padrão: /blog?aba=faq)
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'
import './css/ContactFaq.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function ContactFaq({
  title = 'PERGUNTAS',
  subtitle = 'FREQUENTES',
  text = '',
  items = [],
  linkTo = '/blog?aba=faq',
}) {
  const [open, setOpen] = useState(0) // pergunta aberta (-1 = nenhuma)
  const baseId = useId() // liga cada pergunta à sua resposta (aria-controls)

  if (items.length === 0) return null

  return (
    <section className="contact-faq" aria-labelledby={`${baseId}-title`}>
      {/* ========== COLUNA DA ESQUERDA ========== */}
      <div className="contact-faq-intro">
        <h2 id={`${baseId}-title`} className="contact-faq-title">
          {title}
          {subtitle && <span className="contact-faq-subtitle">{subtitle}</span>}
        </h2>
        {text && <p className="contact-faq-text">{text}</p>}
        <Link to={linkTo} className="contact-faq-button">
          VER TODAS NO FAQ <BsArrowRight aria-hidden="true" />
        </Link>
      </div>

      {/* ========== LISTA DE PERGUNTAS ========== */}
      <ul className="contact-faq-list">
        {items.map((item, index) => {
          const isOpen = index === open
          const answerId = `${baseId}-answer-${index}`
          return (
            <li key={item.question} className={`contact-faq-item ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="contact-faq-question"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                <span className="contact-faq-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="contact-faq-question-text">{item.question}</span>
                {/* "+" feito de dois tracinhos: aberto, o de pé deita e vira "−" */}
                <span className="contact-faq-icon" aria-hidden="true" />
              </button>

              {/* Painel que abre e fecha (a altura é animada no CSS) */}
              <div id={answerId} className="contact-faq-panel" inert={!isOpen}>
                <div className="contact-faq-panel-inner">
                  <p className="contact-faq-answer">{item.answer}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}