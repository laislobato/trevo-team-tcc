/**
 * COMPONENTE: ContactDirect
 * =========================
 * Linha de contato direto embaixo do formulário, separada pelos "|"
 * do cabeçalho:
 *
 *   ✉ contato@trevoteam.com  |  ◷ Resposta em até 2 dias úteis  |  ● ● ● ●
 *
 * - O e-mail é um link (abre o programa de e-mail da pessoa).
 * - Cada bolinha é o link de uma rede; o ícone é escolhido pelo nome
 *   da rede ou pelo link (SocialIcon).
 *
 * Props:
 * - email:        e-mail de contato
 * - responseTime: texto do prazo de resposta
 * - socials:      redes sociais [{ label, url }]
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { Fragment } from 'react'
import { BsEnvelope, BsClock } from 'react-icons/bs'
import SocialIcon from '../shared/SocialIcon'
import './css/ContactDirect.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function ContactDirect({ email = '', responseTime = '', socials = [] }) {
  // Só os itens preenchidos (os "|" ficam só entre eles)
  const items = [
    email && (
      <a href={`mailto:${email}`} className="contact-direct-link">
        <BsEnvelope aria-hidden="true" />
        {email}
      </a>
    ),
    responseTime && (
      <span className="contact-direct-text">
        <BsClock aria-hidden="true" />
        {responseTime}
      </span>
    ),
    socials.length > 0 && (
      <span className="contact-direct-socials">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="contact-direct-social"
            aria-label={`${social.label} da Trevo Team`}
            title={social.label}
          >
            <SocialIcon label={social.label} url={social.url} />
          </a>
        ))}
      </span>
    ),
  ].filter(Boolean)

  if (items.length === 0) return null

  return (
    <ul className="contact-direct" aria-label="Contato direto">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <li className="contact-direct-separator" aria-hidden="true" />}
          <li>{item}</li>
        </Fragment>
      ))}
    </ul>
  )
}
