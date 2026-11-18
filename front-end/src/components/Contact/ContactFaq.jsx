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
 * - A lista é o FaqList (o mesmo da aba FAQ do Blog): a primeira pergunta
 *   começa aberta, o "+" vira "−" com animação e o rodapé não se mexe.
 * - As perguntas vêm de src/data/faq.js: aqui entram só as que têm
 *   "destaque: true" (a página Contact passa elas em "items").
 * - O botão leva para a aba FAQ do blog (/blog?aba=faq).
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

import { useId } from 'react'
import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'
import FaqList from '../shared/FaqList'
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
  const titleId = useId()

  if (items.length === 0) return null

  // Um grupo só, sem nome, numerado 01, 02, 03...
  const groups = [{ name: '', items: items.map((item, index) => ({ ...item, number: index + 1 })) }]

  return (
    <section className="contact-faq" aria-labelledby={titleId}>
      {/* ========== COLUNA DA ESQUERDA ========== */}
      <div className="contact-faq-intro">
        <h2 id={titleId} className="contact-faq-title">
          {title}
          {subtitle && <span className="contact-faq-subtitle">{subtitle}</span>}
        </h2>
        {text && <p className="contact-faq-text">{text}</p>}
        <Link to={linkTo} className="contact-faq-button">
          VER TODAS NO FAQ <BsArrowRight aria-hidden="true" />
        </Link>
      </div>

      {/* ========== LISTA DE PERGUNTAS ========== */}
      <FaqList groups={groups} />
    </section>
  )
}