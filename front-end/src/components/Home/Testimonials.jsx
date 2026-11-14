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
 * - As estrelas são lugares de ARTES (componente Art): para trocar, importe a
 *   imagem e passe em "src" (veja ARTS logo abaixo).
 * - No celular os cards ficam um embaixo do outro, em zigue-zague.
 *
 * Para mudar os depoimentos: edite a lista TESTIMONIALS.
 *   photo: foto da pessoa (vazio = bolinha preta)
 *   color: cor do card e da raiz ('cyan' | 'green' | 'orange')
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import Art from '../shared/Art'
import TreeRoot from './TreeRoot'
import './css/Testimonials.css'

// ===============================================
// CONTEÚDO (troque pelos dados reais)
// ===============================================

const TITLE = 'Lorem Ipsum'

const TESTIMONIALS = [
  { id: 1, author: 'Jogador 1', photo: '', color: 'cyan', text: 'Lorem ipsum dolor sit amet consectetur' },
  { id: 2, author: 'Jogador 2', photo: '', color: 'green', text: 'Lorem ipsum dolor sit amet consectetur' },
  { id: 3, author: 'Jogador 3', photo: '', color: 'orange', text: 'Lorem ipsum dolor sit amet consectetur' },
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
      {/* ========== ARTES (estrelas por enquanto) ========== */}
      {ARTS.map((art) => (
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
              {/* Bolinha da pessoa, metade para fora do card */}
              <span className="testimonial-avatar">
                {item.photo && <img src={item.photo} alt="" />}
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