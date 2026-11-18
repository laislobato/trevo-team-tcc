/**
 * COMPONENTES: peças do painel
 * ============================
 * Peças pequenas repetidas em várias telas do painel:
 *
 * - Section:      card branco com título (cada parte de um formulário)
 * - Field:        campo com rótulo, contador, dica e erro
 * - StatusBadge:  etiqueta Publicado / Agendado / Rascunho
 * - Alert:        aviso (salvo, erro, informação)
 * - EmptyState:   lista vazia
 * - Thumb:        miniatura de imagem
 * - SearchBox:    busca das listas
 * - FilterChips:  filtros com contagem (Todos 12 · Publicados 8 ...)
 * - Pagination:   "Mostrando 1–10 de 12" e os botões das páginas
 * - EditorTabs:   abas do editor (levam até cada parte do formulário)
 * - SaveBar:      barra "Alterações não salvas" no pé da tela
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useId, useState } from 'react'
import {
  BsCheckCircle,
  BsCheckCircleFill,
  BsChevronLeft,
  BsChevronRight,
  BsClock,
  BsExclamationOctagonFill,
  BsInfoCircleFill,
  BsPencil,
  BsSearch,
  BsXLg,
} from 'react-icons/bs'

// ===============================================
// CARD COM TÍTULO
// ===============================================

/**
 * id:      usado pelas abas do editor (rola até aqui)
 * title:   título do card
 * icon:    ícone antes do título (opcional)
 * note:    texto pequeno à direita do título (opcional)
 * actions: botões à direita do título (opcional)
 */
export function Section({ id, title, icon: Icon, note, actions, className = '', children }) {
  const autoId = useId()
  const headingId = `${id || autoId}-titulo`
  return (
    <section
      id={id}
      className={`admin-card ${className}`}
      aria-labelledby={title ? headingId : undefined}
      tabIndex={id ? -1 : undefined}
    >
      {(title || actions) && (
        <div className="admin-card-head">
          {title && (
            <h2 id={headingId} className="admin-card-title">
              {Icon && <Icon aria-hidden="true" />}
              {title}
            </h2>
          )}
          {note && <span className="admin-card-note">{note}</span>}
          {actions && <div className="admin-card-actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

// ===============================================
// CAMPO
// ===============================================

/**
 * label: rótulo
 * count: contador "45/300" à direita do rótulo (opcional)
 * hint:  dica embaixo do campo (opcional)
 * error: mensagem de erro da API (opcional)
 * hideLabel: rótulo só para leitor de tela (linhas de redes sociais)
 */
export function Field({ label, count, hint, error, hideLabel = false, className = '', children }) {
  return (
    <label className={`admin-field ${error ? 'has-error' : ''} ${className}`}>
      {hideLabel ? (
        <span className="visually-hidden">{label}</span>
      ) : (
        <span className="admin-label-row">
          <span className="admin-label">{label}</span>
          {count && <span className="admin-count" aria-hidden="true">{count}</span>}
        </span>
      )}
      {children}
      {hint && <span className="admin-hint">{hint}</span>}
      {error && <span className="admin-field-error">{error}</span>}
    </label>
  )
}

// ===============================================
// ETIQUETA DE SITUAÇÃO
// ===============================================

const STATUS = {
  published: ['Publicado', BsCheckCircle],
  scheduled: ['Agendado', BsClock],
  draft: ['Rascunho', BsPencil],
}

/** status: 'published' | 'scheduled' | 'draft' */
export function StatusBadge({ status }) {
  const [label, Icon] = STATUS[status] || STATUS.draft
  return (
    <span className={`admin-badge admin-badge--${status}`}>
      <Icon aria-hidden="true" /> {label}
    </span>
  )
}

// ===============================================
// AVISO
// ===============================================

const ALERT_ICONS = {
  ok: BsCheckCircleFill,
  error: BsExclamationOctagonFill,
  info: BsInfoCircleFill,
}

/**
 * tone:    'ok' | 'error' | 'info' | 'trevo'
 * onClose: mostra o botão de fechar (opcional)
 */
export function Alert({ tone = 'ok', onClose, children }) {
  const Icon = ALERT_ICONS[tone]
  return (
    <div className={`admin-alert admin-alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {Icon ? (
        <Icon className="admin-alert-icon" aria-hidden="true" />
      ) : (
        <span className="admin-alert-icon" aria-hidden="true">🍀</span>
      )}
      <div className="admin-alert-text">{children}</div>
      {onClose && (
        <button type="button" className="admin-alert-close" onClick={onClose} aria-label="Fechar aviso">
          <BsXLg aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

// ===============================================
// LISTA VAZIA
// ===============================================

export function EmptyState({ icon: Icon, title, action, children }) {
  return (
    <div className="admin-empty">
      {Icon && (
        <span className="admin-empty-icon" aria-hidden="true">
          <Icon />
        </span>
      )}
      <p className="admin-empty-title">{title}</p>
      {children && <p className="admin-empty-text">{children}</p>}
      {action}
    </div>
  )
}

// ===============================================
// MINIATURA
// ===============================================

/**
 * src:     endereço da imagem (vazio = só o fundo)
 * color:   cor de fundo (jogos)
 * contain: mostra a imagem inteira (logotipos e PNG recortado)
 */
export function Thumb({ src, color, contain = false, round = false }) {
  const cls = ['admin-thumb', contain && 'admin-thumb--contain', round && 'admin-thumb--round'].filter(Boolean).join(' ')
  return (
    <span className={cls} style={color ? { background: color } : undefined} aria-hidden="true">
      {src && <img src={src} alt="" loading="lazy" />}
    </span>
  )
}

// ===============================================
// BUSCA E FILTROS
// ===============================================

export function SearchBox({ label, placeholder, value, onChange }) {
  return (
    <label className="admin-search">
      <BsSearch aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
      <input type="search" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

/** options: [{ id, label, count }] */
export function FilterChips({ label, options, value, onChange }) {
  return (
    <div className="admin-filters" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`admin-filter ${value === option.id ? 'is-active' : ''}`}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
          <span className="admin-filter-count">{option.count}</span>
        </button>
      ))}
    </div>
  )
}

// ===============================================
// PÁGINAS DA LISTA
// ===============================================

/** pager: o que o usePagination devolve */
export function Pagination({ pager }) {
  const { page, pages, from, to, total, setPage } = pager
  return (
    <div className="admin-table-foot">
      <p className="admin-muted" aria-live="polite">
        {total ? `Mostrando ${from}–${to} de ${total}` : 'Nenhum resultado'}
      </p>
      {pages > 1 && (
        <nav className="admin-pages" aria-label="Páginas da lista">
          <button type="button" className="admin-page" onClick={() => setPage(page - 1)} disabled={page === 1}
            aria-label="Página anterior">
            <BsChevronLeft aria-hidden="true" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`admin-page ${n === page ? 'is-active' : ''}`}
              onClick={() => setPage(n)}
              aria-label={`Página ${n}`}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </button>
          ))}
          <button type="button" className="admin-page" onClick={() => setPage(page + 1)} disabled={page === pages}
            aria-label="Próxima página">
            <BsChevronRight aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  )
}

// ===============================================
// ABAS DO EDITOR
// ===============================================

/**
 * Abas no topo do editor. Cada aba rola até uma parte do formulário
 * (um <Section id="...">) e fica marcada conforme a tela desce.
 *
 * sections: [{ id, label }]
 */
export function EditorTabs({ sections }) {
  const [active, setActive] = useState(sections[0]?.id)
  const ids = sections.map((s) => s.id).join(',')

  // Marca a aba da parte que está no alto da tela
  useEffect(() => {
    const list = ids.split(',')
    const elements = list.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length || !('IntersectionObserver' in window)) return undefined

    const visible = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting))
        const first = list.find((id) => visible.get(id))
        if (first) setActive(first)
      },
      { rootMargin: '-140px 0px -55% 0px' }, // faixa logo abaixo do topo fixo
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  const goTo = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' })
    target.focus({ preventScroll: true })
    setActive(id)
  }

  return (
    <nav className="admin-tabs" aria-label="Partes do formulário">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`admin-tab ${active === section.id ? 'is-active' : ''}`}
          aria-current={active === section.id ? 'location' : undefined}
          onClick={(e) => goTo(e, section.id)}
        >
          {section.label}
        </a>
      ))}
    </nav>
  )
}

// ===============================================
// BARRA "ALTERAÇÕES NÃO SALVAS"
// ===============================================

/**
 * show:      aparece só quando tem mudança
 * form:      id do <form> que o botão Salvar envia
 * onDiscard: volta tudo para o que está salvo
 * onSave:    use no lugar de "form" quando não há <form>
 */
export function SaveBar({ show, saving, form, onSave, onDiscard, saveLabel = 'Salvar alterações' }) {
  if (!show) return null
  return (
    <div className="admin-savebar" role="region" aria-label="Alterações não salvas">
      <span className="admin-savebar-text">
        <span className="admin-dot admin-dot--warn" aria-hidden="true" />
        Alterações não salvas
      </span>
      <div className="admin-savebar-actions">
        <button type="button" className="admin-btn admin-btn--on-dark" onClick={onDiscard} disabled={saving}>
          Descartar
        </button>
        <button
          type={onSave ? 'button' : 'submit'}
          form={onSave ? undefined : form}
          onClick={onSave}
          className="admin-btn admin-btn--primary"
          disabled={saving}
        >
          {saving ? 'Salvando...' : saveLabel}
        </button>
      </div>
    </div>
  )
}