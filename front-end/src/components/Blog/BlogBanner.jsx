/**
 * COMPONENTE: BlogBanner
 * ======================
 * Faixa ciano grande no topo das páginas do blog.
 * Reservada para a arte (banner) do blog ou do jogo do post.
 *
 * Props:
 * - image: endereço da imagem do banner (vazio = só o fundo ciano)
 * - alt:   descrição da imagem, para leitores de tela
 */

import './css/Blog.css'

export default function BlogBanner({ image = '', alt = '' }) {
  return (
    <div className="blog-banner">
      {image && <img className="blog-banner-image" src={image} alt={alt} />}
    </div>
  )
}
