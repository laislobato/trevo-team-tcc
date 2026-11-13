/**
 * COMPONENTE: AboutHero
 * =====================
 * Bloco "SOBRE NÓS" da página About.
 *
 * Layout (desktop):
 *   [ imagem com quadrados rotacionados ]   [ título + texto + botão ]
 *
 * Layout (mobile): a imagem fica em cima e o texto embaixo.
 *
 * Props:
 * - title:       título da seção
 * - text:        parágrafo descritivo
 * - buttonLabel: texto do botão laranja
 * - onButtonClick: função opcional ao clicar no botão
 */

import './css/Abouthero.css'

export default function AboutHero({
  title = 'SOBRE NÓS',
  text = 'Criada no desespero da reprova, A Trevo Team nasce da angustia e sofrimento de seus fundadores, as raízes infertéis mobilizando a circulação de toda frustração diante ao seu arredor',
  buttonLabel = 'SAIBA MAIS',
  onButtonClick,
}) {
  return (
    <section className="about-hero">
      <div className="about-hero-inner">

        {/* 🖼️ LADO ESQUERDO: imagem com quadrados */}
        <div className="about-hero-visual">
          {/* Quadrado azul rotacionado (fica atrás) */}
          <div className="about-hero-shape"></div>

          {/* Quadrado branco (lugar da foto) */}
          <div className="about-hero-photo"></div>
        </div>

        {/* 📝 LADO DIREITO: texto e botão */}
        <div className="about-hero-text">
          <h2 className="about-hero-title">{title}</h2>
          <p className="about-hero-paragraph">{text}</p>
          <button className="about-hero-button" onClick={onButtonClick}>
            {buttonLabel}
          </button>
        </div>

      </div>
    </section>
  )
}