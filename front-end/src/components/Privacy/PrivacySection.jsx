/**
 * COMPONENTE: PrivacySection
 * ==========================
 * Uma seção da política (o texto vem de src/data/privacy.js):
 *
 *   02  Que dados usamos e para quê
 *   ──────────────────────────────────────────
 *   Parágrafos, listas, a caixa de destaque e,
 *   na seção "dados", os cards de cada dado:
 *
 *   ┌───────────────────────────────────────┐
 *   │ Newsletter                 [EM BREVE] │
 *   │ QUAIS DADOS       Seu e-mail.         │
 *   │ PARA QUÊ          Mandar as novid...  │
 *   │ POR QUANTO TEMPO  Até você cancelar...│
 *   │ BASE NA LGPD      Seu consentimen...  │
 *   └───────────────────────────────────────┘
 *
 * Props:
 * - section:  { id, title, blocks }
 * - number:   número da seção (1, 2, 3...)
 * - email:    e-mail de privacidade (para o {email} dos textos)
 * - dataUses: cards do bloco { type: 'data' }
 */

import PrivacyText from './PrivacyText'
import './css/PrivacySection.css'

// Linhas de cada card de dado: campo do privacy.js -> nome na tela
const DATA_FIELDS = [
  { key: 'data', label: 'Quais dados' },
  { key: 'purpose', label: 'Para quê' },
  { key: 'keep', label: 'Por quanto tempo' },
  { key: 'basis', label: 'Base na LGPD' },
]

// ===============================================
// CARDS DOS DADOS
// ===============================================

function DataList({ items, email }) {
  return (
    <ul className="privacy-data">
      {items.map((item) => (
        <li key={item.name} className={`privacy-data-card ${item.soon ? 'is-soon' : ''}`}>
          <div className="privacy-data-head">
            <h3 className="privacy-data-name">{item.name}</h3>
            {item.soon && <span className="privacy-data-badge">Em breve</span>}
          </div>
          <dl className="privacy-data-fields">
            {DATA_FIELDS.map((field) => (
              <div key={field.key} className="privacy-data-field">
                <dt>{field.label}</dt>
                <dd>
                  <PrivacyText text={item[field.key]} email={email} />
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  )
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function PrivacySection({ section, number, email, dataUses = [] }) {
  const titleId = `${section.id}-titulo`

  return (
    <section id={section.id} className="privacy-section" aria-labelledby={titleId}>
      <h2 id={titleId} className="privacy-section-title">
        <span className="privacy-section-number" aria-hidden="true">
          {String(number).padStart(2, '0')}
        </span>
        {section.title}
      </h2>

      {section.blocks.map((block, index) => {
        if (block.type === 'data') return <DataList key={index} items={dataUses} email={email} />

        if (block.type === 'list') {
          return (
            <ul key={index} className="privacy-list">
              {block.items.map((item) => (
                <li key={item}>
                  <PrivacyText text={item} email={email} />
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'note') {
          return (
            <p key={index} className="privacy-note">
              <PrivacyText text={block.text} email={email} />
            </p>
          )
        }

        // 'p' (parágrafo)
        return (
          <p key={index} className="privacy-paragraph">
            <PrivacyText text={block.text} email={email} />
          </p>
        )
      })}
    </section>
  )
}
