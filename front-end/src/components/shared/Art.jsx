/**
 * COMPONENTE: Art
 * ===============
 * Lugar de uma ARTE decorativa do site (as "estrelinhas").
 * Enquanto a arte não existe, aparece uma estrela no lugar.
 *
 * A estrela é desenhada aqui mesmo (SVG), com tamanho e cor próprios:
 * não depende de nenhum arquivo CSS para aparecer.
 *
 * Uso:
 *   <Art size={120} color="black" className="minha-classe" />
 *
 * Como trocar a estrela pela arte (quando ela existir):
 *   1. coloque a imagem em src/assets (de preferência PNG sem fundo)
 *   2. importe no arquivo que usa a arte:
 *        import artFooter from '../../assets/arte-footer.png'
 *   3. passe na prop src:
 *        <Art src={artFooter} size={84} />
 *
 * Props:
 * - src:       imagem da arte (vazio = estrela)
 * - alt:       descrição da arte (vazio = decorativa, leitor de tela ignora)
 * - size:      largura em px (a altura acompanha). Padrão: 80
 * - color:     cor da estrela: 'white' | 'gray' | 'orange' | 'cyan' | 'green' | 'black'
 *              (ou qualquer cor do CSS, ex.: '#003223')
 * - className: classe extra, para posicionar a arte em cada lugar
 */

// ===============================================
// CORES DA ESTRELA
// ===============================================

// "black" e "gray" seguem o tema (no modo escuro, a estrela preta fica clara)
const COLORS = {
  white: '#FFFFFF',
  gray: 'var(--color-gray)',
  orange: '#F8906A',
  cyan: '#D0FFFB',
  green: '#8CC74F',
  black: 'var(--color-text)',
}

// Pontas da estrela (num quadrado de 100 × 100)
const STAR_POINTS = '50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function Art({ src = '', alt = '', size = 80, color = 'gray', className = '' }) {
  // ---------- Com imagem: mostra a arte ----------
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : 'true'}
        className={`art art--image ${className}`}
        style={{ width: `${size}px`, height: 'auto', maxWidth: 'none' }}
      />
    )
  }

  // ---------- Sem imagem: estrela no lugar ----------
  return (
    <svg
      className={`art art--star ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <polygon points={STAR_POINTS} style={{ fill: COLORS[color] || color }} />
    </svg>
  )
}