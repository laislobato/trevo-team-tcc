/**
 * COMPONENTE: Newsletter
 * ======================
 * Seção de inscrição para newsletter
 * 
 * Contém:
 * - Título "SUBSCRIBE TO NEWSLETTER"
 * - Subtítulo/descrição
 * - Formulário com input de email
 * - Botão de subscribe
 * - Estrela decorativa (branca)
 * 
 * Design:
 * - Fundo laranja (#F8906A)
 * - Texto branco
 * - Elementos com borda (input)
 */

import { useState } from 'react'
import './css/Newsletter.css'

export default function Newsletter() {
  // Estado para controlar o valor do input
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (email.trim()) {
      // Aqui você conectaria com um backend
      console.log('Email enviado:', email)
      setIsSubmitted(true)
      setEmail('')
      
      // Reset da mensagem de sucesso após 3 segundos
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <section className="newsletter">
      {/* ⭐ ESTRELA DECORATIVA (branca) */}
      <div className="newsletter-star"></div>

      {/* 📝 CONTEÚDO DA SEÇÃO */}
      <div className="newsletter-content">
        
        {/* Título */}
        <h2 className="newsletter-title">SUBSCRIBE TO NEWSLETTER</h2>

        {/* Subtítulo */}
        <p className="newsletter-subtitle">
          Lorem Ipsum Ipsone Lorem Ipsum Ipsone
        </p>

        {/* Mensagem de sucesso (condicional) */}
        {isSubmitted && (
          <p className="newsletter-success">
            ✓ Email inscrito com sucesso!
          </p>
        )}

        {/* Formulário de subscription */}
        <form className="newsletter-form" onSubmit={handleSubmit}>
          
          {/* Input de email */}
          <input
            type="email"
            className="newsletter-input"
            placeholder="Seu melhor email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Botão de envio */}
          <button 
            type="submit" 
            className="newsletter-button"
          >
            ENVIAR
          </button>
        </form>
      </div>
    </section>
  )
}