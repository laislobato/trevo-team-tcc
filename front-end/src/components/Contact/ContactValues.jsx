/**
 * COMPONENTE: ContactValues
 * =========================
 * Seção "OUR VALUES": valores da Trevo Team voltados a parceiros e marketing.
 * Cinco círculos (3 em cima, 2 embaixo), cada um com o nome do valor.
 * As cores dos círculos se alternam entre laranja, ciano e verde.
 *
 * Props:
 * - title:  título da seção
 * - values: lista [{ label, image }]  (image vazio = círculo colorido)
 */

import './css/ContactValues.css'

const COLORS = ['orange', 'cyan', 'green']

export default function ContactValues({ title = 'OUR VALUES', values = [] }) {
  return (
    <section className="contact-values" aria-labelledby="contact-values-title">
      <h2 id="contact-values-title" className="contact-values-title">{title}</h2>

      <ul className="contact-values-list">
        {values.map((value, index) => (
          <li key={value.label} className="contact-value">
            <span className={`contact-value-circle contact-value-circle--${COLORS[index % COLORS.length]}`}>
              {value.image && <img src={value.image} alt="" />}
            </span>
            <span className="contact-value-label">{value.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
