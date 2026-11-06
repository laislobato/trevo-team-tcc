/**
 * COMPONENTE: Hero (NOVO LAYOUT)
 * ==============================
 * Seção inicial após o header com novo design
 * 
 * Layout vertical:
 * - TOPO: Duas frases motivacionais (esquerda e direita)
 * - MEIO: Espaço grande
 * - CENTRO: Botão CTA (Call To Action)
 * - BASE: Avatares dos membros
 * 
 * Estrutura:
 *   [Frase Esq] -------- [Frase Dir]
 *   
 *        [Espaço vazio]
 *   
 *       [CTA Button]
 *   
 *   [Avatar1][Avatar2][Avatar3][Avatar4]
 */

import './css/Hero.css'

export default function Hero() {
  // Array com dados dos avatares (para crescimento futuro)
  const avatars = [
    { id: 1, name: 'Rede 1' },
    { id: 2, name: 'Rede 2' },
    { id: 3, name: 'Rede 3' },
    { id: 4, name: 'Rede 4' }
  ]

  return (
    <section className="hero">
      {/* 💬 CONTEÚDO PRINCIPAL - FRASES NO TOPO */}
      <div className="hero-content">
        
        {/* Frase motivadora - Esquerda */}
        <div className="hero-text hero-text-left">
          <p>AI FRASE EMOTIVADORA<br/>DIFERENTE UHUUUUU<br/>LEGALLL</p>
        </div>

        {/* Frase motivadora - Direita */}
        <div className="hero-text hero-text-right">
          <p>Frase emotiva lindo olçha com,o a gente trabalha em grupo</p>
        </div>
      </div>

      {/* Botão CTA no centro */}
      <button className="hero-cta-button">
        COMECE AGORA
      </button>

      {/* 👥 AVATARES DOS MEMBROS - NA BASE */}
      <div className="hero-avatars">
        {avatars.map((avatar) => (
          <div 
            key={avatar.id} 
            className="hero-avatar"
            title={avatar.name}
          >
            {/* Imagem será adicionada aqui depois */}
          </div>
        ))}
      </div>
    </section>
  )
}