/**
 * COMPONENTE: PostGallery
 * =======================
 * Galeria do post: uma imagem grande à esquerda e duas menores
 * empilhadas à direita. Imagem vazia = bloco cinza.
 *
 * Props:
 * - images: lista com 3 endereços de imagem
 * - title:  título do post (usado na descrição das imagens)
 */

import './css/PostGallery.css'

export default function PostGallery({ images = ['', '', ''], title = '' }) {
  return (
    <div className="post-gallery">
      {images.slice(0, 3).map((src, index) => (
        <div key={index} className={`post-gallery-item post-gallery-item--${index + 1}`}>
          {src && <img src={src} alt={`${title}: imagem ${index + 1}`} />}
        </div>
      ))}
    </div>
  )
}
