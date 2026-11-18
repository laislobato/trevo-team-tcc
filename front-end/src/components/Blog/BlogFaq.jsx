/**
 * COMPONENTE: BlogFaq
 * ===================
 * Aba FAQ do Blog, no mesmo padrão do FAQ da página Contact:
 *
 *   PERGUNTAS                  O SITE
 *   FREQUENTES (laranja)       ─────────────────────────────────
 *   Texto curto...             01  A Trevo Team vende jogos?      –
 *   [🔍 Buscar uma pergunta]       Resposta aberta...
 *   ▌Todas          9          02  Preciso criar uma conta?       +
 *    O site         2
 *    Suporte        3          SUPORTE
 *    ...                       ─────────────────────────────────
 *   ┌ Não achou sua resposta? ┐ 03  ...
 *   │ [ FALE COM A GENTE → ]  │
 *   └─────────────────────────╱
 *
 * - Filtro por tema (botões da esquerda) e busca por texto
 *   (procura na pergunta e na resposta, sem ligar para acentos).
 * - A lista é o FaqList (o mesmo da Contact): o "+" vira "−" com animação,
 *   e o rodapé não se mexe ao abrir, filtrar ou buscar.
 * - A numeração é fixa (a mesma com ou sem filtro).
 * - No computador, a coluna da esquerda fica parada enquanto a lista rola.
 *
 * Props:
 * - items:      perguntas de src/data/faq.js [{ question, answer, category }]
 * - categories: temas de src/data/faq.js [{ id, label }]
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsArrowRight, BsSearch } from 'react-icons/bs'
import FaqList from '../shared/FaqList'
// Título, texto e botão iguais aos do FAQ da Contact
import '../Contact/css/ContactFaq.css'
import './css/BlogFaq.css'

// Tira acentos e deixa minúsculo: "É" e "e" contam como iguais na busca
const normalize = (text = '') =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function BlogFaq({ items = [], categories = [] }) {
  const [filter, setFilter] = useState('todas') // 'todas' ou o id do tema
  const [query, setQuery] = useState('')
  const titleId = useId()
  const searchId = useId()

  // Número fixo de cada pergunta (posição na lista completa)
  const numbered = items.map((item, index) => ({ ...item, number: index + 1 }))

  // Busca: pergunta ou resposta contém o texto digitado
  const search = normalize(query.trim())
  const matches = (item) =>
    !search || normalize(item.question).includes(search) || normalize(item.answer).includes(search)

  // Grupos que aparecem (um por tema, ou só o tema escolhido)
  const shownCategories = filter === 'todas' ? categories : categories.filter((cat) => cat.id === filter)
  const groups = shownCategories.map((cat) => ({
    name: cat.label.toUpperCase(),
    items: numbered.filter((item) => item.category === cat.id && matches(item)),
  }))

  // Filtros com a quantidade de perguntas de cada tema
  const filters = [
    { id: 'todas', label: 'Todas', count: items.length },
    ...categories.map((cat) => ({
      id: cat.id,
      label: cat.label,
      count: items.filter((item) => item.category === cat.id).length,
    })),
  ]

  return (
    <section className="blog-faq" aria-labelledby={titleId}>
      {/* ========== COLUNA DA ESQUERDA ========== */}
      <div className="blog-faq-intro">
        <h2 id={titleId} className="contact-faq-title">
          PERGUNTAS
          <span className="contact-faq-subtitle">FREQUENTES</span>
        </h2>
        <p className="contact-faq-text">
          Tudo o que mais perguntam para a equipe da Trevo Team, separado por tema.
        </p>

        {/* Busca */}
        <label htmlFor={searchId} className="visually-hidden">Buscar uma pergunta</label>
        <div className="blog-faq-search">
          <BsSearch aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            placeholder="Buscar uma pergunta"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filtro por tema */}
        <ul className="blog-faq-filters" aria-label="Filtrar por tema">
          {filters.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`blog-faq-filter ${filter === item.id ? 'is-active' : ''}`}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                <span>{item.label}</span>
                <span className="blog-faq-count">{item.count}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Não achou? Vai para a página Contact */}
        <div className="blog-faq-help">
          <p className="blog-faq-help-title">Não achou sua resposta?</p>
          <p className="blog-faq-help-text">Mande uma mensagem e a equipe responde no seu e-mail.</p>
          <Link to="/contato" className="contact-faq-button">
            FALE COM A GENTE <BsArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* ========== LISTA DE PERGUNTAS ========== */}
      <FaqList
        groups={groups}
        empty={
          <p className="blog-faq-empty" role="status">
            Nenhuma pergunta encontrada{query.trim() ? ` para "${query.trim()}"` : ''}.{' '}
            <Link to="/contato">Mande sua dúvida para a equipe.</Link>
          </p>
        }
      />
    </section>
  )
}