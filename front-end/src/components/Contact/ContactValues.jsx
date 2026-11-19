/**
 * COMPONENTE: ContactValues
 * =========================
 * Seção "OUR VALUES": valores da Trevo Team voltados a parceiros e marketing.
 * Cinco círculos (3 em cima, 2 embaixo), cada um com o nome do valor.
 * As cores dos círculos se alternam entre laranja, ciano e verde.
 *
 * Cada círculo tem um ícone verde-escuro que combina com o valor (ICONS,
 * abaixo, pelo nome do valor). Valor novo sem ícone na lista: círculo liso.
 *
 * Props:
 * - title:  título da seção
 * - values: lista [{ label, image, icon }]
 *           image: imagem no lugar do ícone (opcional)
 *           icon:  ícone próprio (opcional; senão usa o do ICONS)
 */

import { BsChatHeartFill, BsEyeFill, BsGlobeAmericas, BsLightbulbFill } from 'react-icons/bs'
import { FaHandshake } from 'react-icons/fa6'
import './css/ContactValues.css'

// Ícone de cada valor (pelo nome que aparece na tela)
const ICONS = {
  Parceria: FaHandshake, // aperto de mãos
  Transparência: BsEyeFill, // tudo à vista
  Criatividade: BsLightbulbFill, // ideia
  Comunidade: BsChatHeartFill, // conversa com carinho
  Alcance: BsGlobeAmericas, // chegar longe
}

const COLORS = ['orange', 'cyan', 'green']

export default function ContactValues({ title = 'OUR VALUES', values = [] }) {
  return (
    <section className="contact-values" aria-labelledby="contact-values-title">
      <h2 id="contact-values-title" className="contact-values-title">{title}</h2>

      <ul className="contact-values-list">
        {values.map((value, index) => {
          const Icon = value.icon || ICONS[value.label]
          const color = COLORS[index % COLORS.length]
          return (
            <li key={value.label} className="contact-value">
              <span className={`contact-value-circle contact-value-circle--${color}`} aria-hidden="true">
                {value.image ? <img src={value.image} alt="" /> : Icon && <Icon className="contact-value-icon" />}
              </span>
              <span className="contact-value-label">{value.label}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}