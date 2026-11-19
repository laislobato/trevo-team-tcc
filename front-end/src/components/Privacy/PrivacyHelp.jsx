/**
 * COMPONENTE: PrivacyHelp
 * =======================
 * Caixa ciano de canto cortado (a mesma do "Não achou sua resposta?" do
 * FAQ), com o e-mail de privacidade e o botão para a página Contact:
 *
 *   ┌─────────────────────────────┐
 *   │ Dúvidas sobre seus dados?   │
 *   │ Escreva para contato@...    │
 *   │ [ FALE COM A GENTE → ]      │
 *   └──────────────────────────╱
 *
 * Aparece em dois lugares da página (ver pages/Privacy.jsx): embaixo do
 * sumário, no computador, e no fim do texto, no celular. Só um deles
 * aparece de cada vez (o outro fica escondido também do leitor de tela).
 *
 * Props:
 * - email:     e-mail de privacidade
 * - className: classe extra (para escolher onde ela aparece)
 */

import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'
import './css/PrivacyHelp.css'

export default function PrivacyHelp({ email, className = '' }) {
  return (
    <div className={`privacy-help ${className}`}>
      <p className="privacy-help-title">Dúvidas sobre seus dados?</p>
      <p className="privacy-help-text">
        Escreva para{' '}
        <a href={`mailto:${email}`} className="privacy-link">
          {email}
        </a>{' '}
        ou mande uma mensagem pela página de contato.
      </p>
      <Link to="/contato" className="privacy-help-button">
        FALE COM A GENTE
        <BsArrowRight aria-hidden="true" />
      </Link>
    </div>
  )
}
