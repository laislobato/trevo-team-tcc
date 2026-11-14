/**
 * COMPONENTE: Art
 * ===============
 * Lugar de uma ARTE decorativa do site (as "estrelinhas").
 * Enquanto a arte não existe, aparece uma estrela no lugar.
 *
 * Como trocar a estrela pela arte:
 *   1. coloque a imagem em src/assets (de preferência PNG sem fundo)
 *   2. importe no arquivo que usa a arte:
 *        import artFooter from '../../assets/arte-footer.png'
 *   3. passe na prop src:
 *        <Art src={artFooter} />
 *
 * Props:
 * - src:       imagem da arte (vazio = estrela)
 * - alt:       descrição da arte (vazio = decorativa, leitor de tela ignora)
 * - size:      largura em px (a altura acompanha). Padrão: 80
 * - color:     cor da estrela ('white' | 'orange' | 'cyan' | 'green' | 'gray')
 * - className: classe extra, para posicionar a arte em cada lugar
 */

import './css/Art.css'

export default function Art({ src = '', alt = '', size = 80, color = 'gray', className = '' }) {
  const style = { '--art-size': `${size}px` }

  // Com imagem: mostra a arte
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : 'true'}
        className={`art art--image ${className}`}
        style={style}
      />
    )
  }

  // Sem imagem: estrela no lugar
  return <span className={`art art--star art--${color} ${className}`} style={style} aria-hidden="true"></span>
}