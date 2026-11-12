/**
 * COMPONENTE: ContactForm
 * =======================
 * Formulário da página Contact Us. É também o canal de suporte do site:
 * a pessoa escolhe o assunto (contato, suporte, parceria ou imprensa).
 *
 *   [ Nome          ] [ E-mail        ]
 *   [ Assunto                         ]
 *   [ Mensagem                        ]
 *   [ ENVIAR ]
 *
 * Por enquanto o envio só mostra a mensagem de sucesso na tela.
 * Quando o backend existir, troque o trecho marcado em handleSubmit.
 */

import { useState } from 'react'
import './css/Contact.css'
import './css/ContactForm.css'

// Opções do campo "Assunto"
const SUBJECTS = ['Contato geral', 'Suporte', 'Parceria e marketing', 'Imprensa']

// Valores iniciais (formulário vazio)
const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY)
  const [isSent, setIsSent] = useState(false)

  // Atualiza o campo que mudou (usa o "name" do input)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // >>> Aqui entra o envio para o backend (ex.: fetch para a API) <<<
    setIsSent(true)
    setForm(EMPTY)
    setTimeout(() => setIsSent(false), 4000)
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {/* Linha com Nome e E-mail lado a lado */}
      <div className="contact-form-row">
        <label className="contact-form-field">
          <span className="visually-hidden">Nome</span>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="contact-form-field">
          <span className="visually-hidden">E-mail</span>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label className="contact-form-field">
        <span className="visually-hidden">Assunto</span>
        <select name="subject" value={form.subject} onChange={handleChange} required>
          <option value="" disabled>Assunto</option>
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </label>

      <label className="contact-form-field">
        <span className="visually-hidden">Mensagem</span>
        <textarea
          name="message"
          placeholder="Mensagem"
          rows="6"
          value={form.message}
          onChange={handleChange}
          required
        />
      </label>

      <p className="contact-form-privacy">
        Usamos seus dados só para responder a esta mensagem.
      </p>

      <div className="contact-form-actions">
        <button type="submit" className="contact-form-button">ENVIAR</button>
        {isSent && (
          <p className="contact-form-success" role="status">
            ✓ Mensagem enviada! Responderemos no seu e-mail.
          </p>
        )}
      </div>
    </form>
  )
}
