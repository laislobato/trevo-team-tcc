/**
 * COMPONENTE: ContactForm
 * =======================
 * Formulário da página Contact. O assunto não é escolhido aqui:
 * vem dos botões da seção "Como podemos ajudar" (prop "subject").
 *
 *   ┌──────────────────── card ciano ────────────────────┐
 *   │  Nome [            ]     E-mail [            ]     │
 *   │  Mensagem [                                    ]   │
 *   │  Usamos seus dados...          [ ENVIAR MENSAGEM ] │
 *   └────────────────────────────────────────────────╱
 *
 * Por enquanto o envio só mostra a mensagem de sucesso na tela.
 * Quando o backend existir, troque o trecho marcado em handleSubmit
 * (o assunto escolhido já está em "subject").
 *
 * Props:
 * - subject: assunto escolhido (ex.: "Suporte")
 * - tone:    cor do assunto ('green' | 'cyan' | 'orange'): o card fica num
 *            tom claro dessa cor, e a troca é animada no CSS
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useState } from 'react'
import './css/ContactForm.css'

// Valores iniciais (formulário vazio)
const EMPTY = { name: '', email: '', message: '' }

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function ContactForm({ subject = 'Contato geral', tone = 'cyan' }) {
  const [form, setForm] = useState(EMPTY)
  const [isSent, setIsSent] = useState(false)

  // Atualiza o campo que mudou (usa o "name" do input)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // >>> Aqui entra o envio para o backend (ex.: fetch para a API) <<<
    // Dados para enviar: { ...form, subject }
    setIsSent(true)
    setForm(EMPTY)
    setTimeout(() => setIsSent(false), 4000)
  }

  return (
    <form className={`contact-form contact-form--${tone}`} onSubmit={handleSubmit}>
      {/* Linha com Nome e E-mail lado a lado */}
      <div className="contact-form-row">
        <label className="contact-form-field">
          Nome
          <input
            type="text"
            name="name"
            placeholder="Seu nome"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="contact-form-field">
          E-mail
          <input
            type="email"
            name="email"
            placeholder="voce@email.com"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label className="contact-form-field">
        Mensagem
        <textarea
          name="message"
          placeholder="Escreva sua mensagem"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
        />
      </label>

      {/* Aviso de dados + botão */}
      <div className="contact-form-end">
        <p className="contact-form-privacy">Usamos seus dados só para responder a esta mensagem.</p>
        <button type="submit" className="contact-form-button">ENVIAR MENSAGEM</button>
      </div>

      {isSent && (
        <p className="contact-form-success" role="status">
          ✓ Mensagem enviada! Responderemos no seu e-mail.
        </p>
      )}
    </form>
  )
}