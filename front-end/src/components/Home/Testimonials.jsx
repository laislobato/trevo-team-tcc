/**
 * COMPONENTE: Testimonials
 * ========================
 * Depoimentos da Home em ESCADINHA: cada card fica em cima de uma raiz
 * (TreeRoot) da mesma cor, e cada um desce um degrau em relação ao anterior.
 *
 *   ★          Lorem Ipsum
 *      (●)
 *   [ card ciano ]
 *         ⋎                 (●)
 *         │        [ card verde ]        ★
 *         │              ⋎                  (●)
 *     ▬▬▬▬▬▬▬            │         [ card laranja ]
 *   ★                ▬▬▬▬▬▬▬               ⋎
 *              Nossos Projetos              │  <- a última raiz desce ao lado
 *                                       ▬▬▬▬▬▬▬     do título da próxima seção
 *
 * - As 3 raízes são o MESMO desenho; o card cobre uma parte diferente do topo
 *   de cada uma (--hide no CSS), igual à referência.
 * - As estrelas são lugares de ARTES (componente Art). Enquanto a arte não
 *   existe, nada aparece: importe a imagem e passe em "src" (veja ARTS
 *   logo abaixo) que ela volta a aparecer no lugar da estrela.
 * - No celular os cards ficam um embaixo do outro, em zigue-zague.
 *
 * Para mudar os objetivos: edite a lista TESTIMONIALS.
 *   icon:  ícone branco na bolinha verde-escura (react-icons/bs)
 *   photo: foto no lugar do ícone (opcional)
 *   color: cor do card e da raiz ('cyan' | 'green' | 'orange')
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { BsController, BsMegaphoneFill, BsShieldFillCheck } from 'react-icons/bs'
import Art from '../shared/Art'
import TreeRoot from './TreeRoot'
import './css/Testimonials.css'

// ===============================================
// CONTEÚDO (troque pelos dados reais)
// ===============================================

const TITLE = 'Nossos Objetivos'

const TESTIMONIALS = [
  { id: 1, author: 'Marketing', icon: BsMegaphoneFill, photo: '', color: 'cyan', text: 'Marketing e Divulgação' },
  {
    id: 2,
    author: 'Transparência',
    icon: BsShieldFillCheck,
    photo: '',
    color: 'green',
    text: 'Transparência e integridade com nossos jogadores',
  },
  { id: 3, author: 'Experiência', icon: BsController, photo: '', color: 'orange', text: 'Trazer uma boa experiência para os fãs' },
]

// ⭐ ARTES (hoje estrelas). Para trocar uma estrela pela arte:
//   import arteTopo from '../../assets/arte-depoimentos-1.png'
//   { id: 'a', src: arteTopo, size: 113 }
const ARTS = [
  { id: 'a', src: '', size: 113 }, // perto do título
  { id: 'b', src: '', size: 142 }, // em cima do card laranja
  { id: 'c', src: '', size: 139 }, // embaixo, à esquerda
]

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      {/* ========== ARTES (só as que já têm imagem; as estrelas ficam ocultas) ========== */}
      {ARTS.filter((art) => art.src).map((art) => (
        <Art
          key={art.id}
          src={art.src}
          size={art.size}
          color="black"
          className={`testimonials-art testimonials-art--${art.id}`}
        />
      ))}

      {/* ========== TÍTULO ========== */}
      <h2 id="testimonials-title" className="testimonials-title">{TITLE}</h2>

      {/* ========== DEPOIMENTOS (escadinha) ========== */}
      <ul className="testimonials-list">
        {TESTIMONIALS.map((item) => (
          <li key={item.id} className={`testimonial testimonial--${item.color}`}>
            <figure className="testimonial-card">
              {/* Bolinha verde-escura com o ícone, metade para fora do card */}
              <span className="testimonial-avatar" aria-hidden="true">
                {item.photo ? <img src={item.photo} alt="" /> : item.icon && <item.icon className="testimonial-icon" />}
              </span>

              <blockquote className="testimonial-text">
                <p>{item.text}</p>
              </blockquote>
              <figcaption className="visually-hidden">{item.author}</figcaption>
            </figure>

            {/* Raiz embaixo do card (só enfeite) */}
            <TreeRoot className="testimonial-root" />
          </li>
        ))}
      </ul>
    </section>
  )
}