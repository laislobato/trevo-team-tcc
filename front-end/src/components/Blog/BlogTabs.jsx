/**
 * COMPONENTE: BlogTabs
 * ====================
 * Abas que filtram os posts por tipo: Todos, Anúncios, Patch Notes, Avisos e FAQ.
 *
 * Props:
 * - tabs:     lista de abas [{ id, label }]
 * - activeId: id da aba selecionada
 * - onChange: função chamada com o id da aba clicada
 */

import './css/BlogTabs.css'

export default function BlogTabs({ tabs = [], activeId, onChange }) {
  return (
    <div className="blog-tabs" role="tablist" aria-label="Filtrar posts por tipo">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`blog-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
