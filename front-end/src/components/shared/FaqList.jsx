/**
 * COMPONENTE: FaqList
 * ===================
 * Lista numerada de perguntas que abrem e fecham, usada na página Contact
 * (ContactFaq) e na aba FAQ do Blog (BlogFaq).
 *
 *   O SITE                                   <- nome do grupo (opcional)
 *   ───────────────────────────────────────
 *   01  A Trevo Team vende jogos?          –
 *       Resposta aberta...
 *   02  Preciso criar uma conta?           +
 *
 * - Só uma pergunta fica aberta por vez (abrir uma fecha a outra).
 * - Animação: o "+" gira e vira "−", e a resposta abre deslizando.
 *   Resposta fechada fica "inert": o leitor de tela e o Tab pulam ela.
 * - O rodapé NÃO se mexe: a lista reserva a altura da lista inteira
 *   com a maior resposta aberta. Assim, abrir, fechar, filtrar ou buscar
 *   não empurra nem puxa o que está embaixo. A reserva é medida de novo
 *   quando a largura da tela muda.
 *
 * Props:
 * - groups:      grupos [{ name, items: [{ question, answer, number }] }]
 *                (name vazio = sem título de grupo; number = número na tela)
 * - initialOpen: pergunta que começa aberta (a "question"), ou '' para nenhuma
 * - empty:       o que mostrar quando não há nenhuma pergunta (ex.: busca vazia)
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useId, useRef, useState } from 'react'
import { onSettingsChange } from '../../services/acessibilidade'
import './css/FaqList.css'

// ===============================================
// RESERVA DE ALTURA (o rodapé não se mexe)
// ===============================================
// Altura com tudo fechado + a maior resposta. A reserva só cresce
// enquanto a largura é a mesma (ao filtrar, a lista fica menor,
// mas a reserva da lista inteira continua valendo).

function useReservedHeight(ref) {
  const [minHeight, setMinHeight] = useState(0)
  const lastWidth = useRef(0)

  useEffect(() => {
    // "list" é a caixa de dentro (o conteúdo), sem a reserva:
    // medir a de fora contaria a própria reserva
    const list = ref.current
    if (!list) return undefined

    const measure = () => {
      const panels = [...list.querySelectorAll('.faq-list-panel')]
      // Altura atual menos o que as respostas ocupam agora = tudo fechado
      // (com casas decimais: arredondar soma 1px aqui e ali)
      const height = (el) => el.getBoundingClientRect().height
      const open = panels.reduce((sum, panel) => sum + height(panel), 0)
      const closed = height(list) - open
      // Maior resposta (mede o texto, mesmo com o painel fechado)
      const biggest = panels.reduce((max, panel) => Math.max(max, panel.firstElementChild.scrollHeight), 0)
      const needed = Math.ceil(closed + biggest)

      const width = list.clientWidth
      if (width !== lastWidth.current) {
        // Largura nova: o texto quebra diferente, mede do zero
        lastWidth.current = width
        setMinHeight(needed)
      } else {
        setMinHeight((current) => Math.max(current, needed))
      }
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    // Mudou o tamanho do texto ou o espaçamento (menu de acessibilidade): mede do zero
    const stopListening = onSettingsChange(() => {
      lastWidth.current = 0
      requestAnimationFrame(measure)
    })
    return () => {
      observer.disconnect()
      stopListening()
    }
  }, [ref])

  return minHeight
}

// ===============================================
// UMA PERGUNTA
// ===============================================

function FaqItem({ item, isOpen, answerId, onToggle }) {
  return (
    <li className={`faq-list-item ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="faq-list-question"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
      >
        <span className="faq-list-number">{String(item.number).padStart(2, '0')}</span>
        <span className="faq-list-question-text">{item.question}</span>
        {/* "+" feito de dois tracinhos: aberto, o de pé deita e vira "−" */}
        <span className="faq-list-icon" aria-hidden="true" />
      </button>

      {/* Painel que abre e fecha (a altura é animada no CSS) */}
      <div id={answerId} className="faq-list-panel" inert={!isOpen}>
        <div className="faq-list-panel-inner">
          <p className="faq-list-answer">{item.answer}</p>
        </div>
      </div>
    </li>
  )
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function FaqList({ groups = [], initialOpen, empty = null }) {
  const firstQuestion = groups[0]?.items[0]?.question ?? ''
  const [open, setOpen] = useState(initialOpen ?? firstQuestion) // pergunta aberta
  const baseId = useId()
  const contentRef = useRef(null)
  const minHeight = useReservedHeight(contentRef)

  const visibleGroups = groups.filter((group) => group.items.length > 0)

  return (
    <div className="faq-list" style={{ minHeight: minHeight || undefined }}>
      {/* Conteúdo (é ele que é medido para a reserva) */}
      <div ref={contentRef} className="faq-list-content">
        {visibleGroups.length === 0 && empty}

        {visibleGroups.map((group) => (
          <div key={group.name || 'perguntas'} className="faq-list-group">
            {group.name && <p className="faq-list-group-name">{group.name}</p>}

            <ul className="faq-list-items">
              {group.items.map((item) => (
                <FaqItem
                  key={item.question}
                  item={item}
                  isOpen={item.question === open}
                  answerId={`${baseId}-${item.number}`}
                  onToggle={() => setOpen(item.question === open ? '' : item.question)}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}