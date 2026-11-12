/**
 * COMPONENTE: BlogHeading
 * =======================
 * Título da página do blog com o enfeite de folhas por cima:
 *
 *        (folha) ~~~~~~~~~~~~~ (folha)
 *            Novidades das Equipes
 *
 * Props:
 * - title: texto do título
 */

import './css/Blog.css'

export default function BlogHeading({ title = 'Novidades das Equipes' }) {
  return (
    <div className="blog-heading">
      {/* Enfeite: duas folhas ligadas por um caule verde */}
      <div className="blog-heading-ornament" aria-hidden="true">
        <span className="blog-leaf blog-leaf--left"></span>
        <span className="blog-heading-stem"></span>
        <span className="blog-leaf blog-leaf--right"></span>
      </div>

      <h2 className="blog-heading-title">{title}</h2>
    </div>
  )
}
