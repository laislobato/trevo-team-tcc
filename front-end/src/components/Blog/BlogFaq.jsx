/**
 * COMPONENTE: BlogFaq
 * ===================
 * Aba FAQ do blog: perguntas que abrem e fecham ao clicar, com animação.
 *
 * Cada pergunta é um botão. Ao clicar, a resposta desliza para baixo
 * (e desliza de volta ao fechar). O "+" gira e vira um "×".
 * O botão informa ao leitor de tela se a resposta está aberta (aria-expanded).
 *
 * Props:
 * - items: lista [{ question, answer }] (ver data/faq.js)
 */

import { useState, useId } from 'react'
import './css/BlogFaq.css'

// Uma pergunta + resposta, com o próprio estado de aberto/fechado
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  const id = useId() // id único para ligar o botão à resposta

  return (
    <div className={`blog-faq-item ${isOpen ? 'is-open' : ''}`}>
      <h3 className="blog-faq-heading">
        <button
          type="button"
          className="blog-faq-question"
          aria-expanded={isOpen}
          aria-controls={`${id}-answer`}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{question}</span>
          <span className="blog-faq-icon" aria-hidden="true">+</span>
        </button>
      </h3>

      {/* Painel que abre e fecha (a altura é animada no CSS) */}
      <div id={`${id}-answer`} className="blog-faq-panel" role="region" aria-hidden={!isOpen}>
        <div className="blog-faq-panel-inner">
          <p className="blog-faq-answer">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function BlogFaq({ items = [] }) {
  return (
    <section className="blog-faq" aria-label="Perguntas frequentes">
      {items.map((item) => (
        <FaqItem key={item.question} question={item.question} answer={item.answer} />
      ))}
    </section>
  )
}