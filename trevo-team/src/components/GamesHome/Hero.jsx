/**
 * COMPONENTE: Hero (carrossel de banners)
 * =======================================
 * Bloco ciano grande logo abaixo do cabeçalho, na página inicial.
 * Mostra um banner por vez; as barrinhas de baixo indicam qual está na tela
 * (a verde é a atual) e levam direto ao banner clicado.
 *
 *   [                     banner                      ]
 *            ▬▬  ▬▬(verde)  ▬▬  ▬▬  ▬▬  ▬▬
 *
 * - Troca sozinho a cada 6 segundos (para quando o mouse está em cima
 *   ou quando a pessoa está navegando pelo teclado).
 * - No celular, dá para arrastar o dedo para o lado.
 * - Quem ativa "reduzir movimento" no sistema não tem troca automática.
 *
 * Para colocar as artes: importe as imagens de src/assets e preencha
 * "image" em cada banner (ex.: import banner1 from '../../assets/banner1.png').
 * "link" é opcional (para onde o banner leva ao ser clicado).
 *
 * Props (opcionais, para reaproveitar o carrossel em outras páginas):
 * - banners: lista de banners (sem isso, usa DEFAULT_BANNERS abaixo)
 * - label:   nome do carrossel lido pelos leitores de tela
 *   ex.: <Hero banners={gameBanners} label="Jogos em destaque" />  (página /jogos)
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './css/Hero.css'

const DEFAULT_BANNERS = [
  { image: '', alt: 'Banner 1', link: '' },
  { image: '', alt: 'Banner 2', link: '' },
  { image: '', alt: 'Banner 3', link: '' },
  { image: '', alt: 'Banner 4', link: '' },
  { image: '', alt: 'Banner 5', link: '' },
  { image: '', alt: 'Banner 6', link: '' },
]

const AUTOPLAY_MS = 6000

// true se a pessoa pediu para reduzir animações no sistema
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Hero({ banners = DEFAULT_BANNERS, label = 'Destaques da Trevo Team' }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const total = banners.length

  const goTo = (index) => setCurrent((index + total) % total)

  // Troca automática
  useEffect(() => {
    if (paused || total < 2 || prefersReducedMotion()) return
    const timer = setTimeout(() => setCurrent((c) => (c + 1) % total), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [current, paused, total])

  // Arrastar no celular: mais de 50px para o lado troca de banner
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const distance = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(distance) > 50) goTo(current + (distance < 0 ? 1 : -1))
    touchStartX.current = null
  }

  return (
    <section
      className="hero"
      aria-roledescription="carrossel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 🖼️ FAIXA COM TODOS OS BANNERS (desliza para o lado) */}
      <div className="hero-viewport">
        <div className="hero-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {banners.map((banner, index) => {
            const content = banner.image ? (
              <img src={banner.image} alt={banner.alt} className="hero-image" />
            ) : (
              <span className="visually-hidden">{banner.alt}</span>
            )
            return (
              <div
                key={index}
                className="hero-slide"
                role="group"
                aria-roledescription="banner"
                aria-label={`${index + 1} de ${total}`}
                aria-hidden={index !== current}
              >
                {banner.link ? (
                  <Link to={banner.link} className="hero-slide-link" tabIndex={index === current ? 0 : -1}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ▬ BARRINHAS: qual banner está na tela */}
      <div className="hero-dots">
        {banners.map((banner, index) => (
          <button
            key={index}
            type="button"
            className={`hero-dot ${index === current ? 'is-active' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Mostrar banner ${index + 1}`}
            aria-current={index === current}
          />
        ))}
      </div>
    </section>
  )
}
