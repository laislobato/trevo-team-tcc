/**
 * COMPONENTE: ContactNewsletter
 * =============================
 * Caixa preta de inscrição na newsletter, ao lado do formulário de contato.
 * Versão compacta da faixa laranja da página inicial.
 *
 *   SUBSCRIBE TO        ★
 *   NEWSLETTER
 *   texto curto
 *   [ e-mail          ]
 *   [x] aceito receber e-mails
 *        [ INSCREVER ]
 *
 * A caixa de aceite atende à LGPD (consentimento explícito, sem marcação prévia).
 */

import { useState } from 'react'
import './css/Contact.css'
import './css/ContactNewsletter.css'

export default function ContactNewsletter({
  title = 'SUBSCRIBE TO NEWSLETTER',
  text = 'Novidades dos jogos e das campanhas, direto no seu e-mail.',
}) {
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // >>> Aqui entra o envio para o backend <<<
    setIsSubscribed(true)
    setEmail('')
    setAccepted(false)
    setTimeout(() => setIsSubscribed(false), 4000)
  }

  return (
    <aside className="contact-newsletter" aria-labelledby="contact-newsletter-title">
      <div className="contact-newsletter-top">
        <h2 id="contact-newsletter-title" className="contact-newsletter-title">{title}</h2>
        <span className="contact-newsletter-star" aria-hidden="true"></span>
      </div>

      <p className="contact-newsletter-text">{text}</p>

      <form className="contact-newsletter-form" onSubmit={handleSubmit}>
        <label>
          <span className="visually-hidden">E-mail para a newsletter</span>
          <input
            type="email"
            className="contact-newsletter-input"
            placeholder="Seu melhor e-mail"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="contact-newsletter-consent">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            required
          />
          <span>Aceito receber e-mails da Trevo Team. Posso cancelar quando quiser.</span>
        </label>

        <button type="submit" className="contact-newsletter-button">INSCREVER</button>

        {isSubscribed && (
          <p className="contact-newsletter-success" role="status">✓ Inscrição feita!</p>
        )}
      </form>
    </aside>
  )
}
