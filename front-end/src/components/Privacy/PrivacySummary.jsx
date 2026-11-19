/**
 * COMPONENTE: PrivacySummary
 * ==========================
 * O resumo da política em quatro cards, logo abaixo do topo:
 *
 *   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
 *   │ (ícone)│ │ (ícone)│ │ (ícone)│ │ (ícone)│
 *   │ Título │ │ Título │ │ Título │ │ Título │
 *   │ texto  │ │ texto  │ │ texto  │ │ texto  │
 *   └────────┘ └────────┘ └────────┘ └────────┘
 *
 * - No computador, os cards sobem um pouco por cima do bloco ciano.
 * - Tablet: 2 por linha. Celular: 1 por linha.
 * - Os textos vêm de src/data/privacy.js ("summary").
 *
 * Props:
 * - items: [{ icon, title, text }]
 *          icon: 'browse' | 'cookie' | 'minimal' | 'rights'
 */

import { BsCompass, BsEyeSlash, BsChatText, BsPersonCheck } from 'react-icons/bs'
import './css/PrivacySummary.css'

// Ícone e cor do círculo de cada card
const ICONS = {
  browse: { Icon: BsCompass, tone: 'cyan' },
  cookie: { Icon: BsEyeSlash, tone: 'orange' },
  minimal: { Icon: BsChatText, tone: 'green' },
  rights: { Icon: BsPersonCheck, tone: 'cyan' },
}

export default function PrivacySummary({ items = [] }) {
  return (
    <section className="privacy-summary" aria-labelledby="privacy-summary-title">
      {/* Título só para leitor de tela (os cards já se explicam na tela) */}
      <h2 id="privacy-summary-title" className="privacy-sr">Resumo da política</h2>
      <ul className="privacy-summary-list">
        {items.map((item) => {
          const { Icon, tone } = ICONS[item.icon] || ICONS.browse
          return (
            <li key={item.title} className="privacy-summary-card">
              <span className={`privacy-summary-icon privacy-summary-icon--${tone}`} aria-hidden="true">
                <Icon />
              </span>
              <h3 className="privacy-summary-title">{item.title}</h3>
              <p className="privacy-summary-text">{item.text}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
