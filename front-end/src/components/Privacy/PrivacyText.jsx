/**
 * COMPONENTE: PrivacyText
 * =======================
 * Mostra um texto da política (src/data/privacy.js) trocando as marcas
 * pelos links:
 * - {email}             -> link do e-mail de privacidade
 * - [texto](/rota)      -> link para uma página do site
 * - [texto](https://…)  -> link para outro site (abre em outra aba)
 *
 * Props:
 * - text:  o texto
 * - email: e-mail usado no {email}
 */

import { Fragment } from 'react'
import { Link } from 'react-router-dom'

// Acha as marcas: {email} ou [texto](endereço)
const MARKS = /(\{email\}|\[[^\]]+\]\([^)]+\))/g

export default function PrivacyText({ text, email }) {
  const parts = text.split(MARKS)

  return parts.map((part, index) => {
    // ---------- E-mail ----------
    if (part === '{email}') {
      return (
        <a key={index} href={`mailto:${email}`} className="privacy-link">
          {email}
        </a>
      )
    }

    // ---------- Link [texto](endereço) ----------
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const [, label, href] = link
      if (href.startsWith('/')) {
        return (
          <Link key={index} to={href} className="privacy-link">
            {label}
          </Link>
        )
      }
      return (
        <a key={index} href={href} className="privacy-link" target="_blank" rel="noreferrer">
          {label}
          <span className="privacy-sr"> (abre em outra aba)</span>
        </a>
      )
    }

    // ---------- Texto normal ----------
    return <Fragment key={index}>{part}</Fragment>
  })
}