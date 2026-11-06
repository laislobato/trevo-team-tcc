/**
 * COMPONENTE: Testimonials
 * ========================
 * Seção que exibe depoimentos/feedback dos clientes
 * 
 * Contém:
 * - Título e subtítulo
 * - Grid com cards de depoimentos
 * - Estrelas decorativas (posicionadas aleatoriamente)
 * 
 * Cada card contém:
 * - Ícone circular (marrom)
 * - Caixa de texto com depoimento
 * - Estrelas decorativas espalhadas
 */

import './css/Testimonials.css'

export default function Testimonials() {
  // Array com dados dos depoimentos
  const testimonials = [
    {
      id: 1,
      text: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone'
    },
    {
      id: 2,
      text: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone'
    },
    {
      id: 3,
      text: 'Lorem Ipsum Ipsone Lorem Ipsum Ipsone'
    }
  ]

  return (
    <section className="testimonials">
      {/* 🌟 ESTRELAS DECORATIVAS (Posição absoluta) */}
      <div className="testimonials-star testimonials-star-1"></div>
      <div className="testimonials-star testimonials-star-2"></div>
      <div className="testimonials-star testimonials-star-3"></div>
      <div className="testimonials-star testimonials-star-4"></div>

      {/* 📋 HEADER DA SEÇÃO */}
      <div className="testimonials-header">
        <h2 className="testimonials-title">LOREM IPSUM</h2>
        <p className="testimonials-subtitle">Lorem Ipsum Ipsone Lorem Ipsum Ipsone</p>
      </div>

      {/* 💬 GRID DE DEPOIMENTOS */}
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            
            {/* Ícone circular do depoimento */}
            <div className="testimonial-icon"></div>

            {/* Caixa com texto do depoimento */}
            <div className="testimonial-box">
              <p className="testimonial-text">
                {testimonial.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}