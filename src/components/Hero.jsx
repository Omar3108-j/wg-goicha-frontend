import ParticleCanvas from "./ParticleCanvas"
import { useReveal } from "../hooks/useReveal"

import hero1 from "../assets/hero/hero1.png"

function Hero({ whatsappUrl }) {
  const [heroRef, heroVisible] = useReveal()

  return (
    <section
      id="hero-section"
      ref={heroRef}
      className="hero-pro"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.72)
          ),
          url(${hero1})
        `,
      }}
    >
      {/* Partículas premium */}
      <ParticleCanvas />

      {/* Efectos visuales */}
      <div className="hero-dots" />
      <div className="hero-glow" />
      <div className="hero-bottom-fade" />

      {/* Contenido izquierdo */}
      <div id="hero-left" className="hero-pro__content">
        <div className={`hero-badge ${heroVisible ? "is-visible" : ""}`}>
          <span />
          <strong>Distribuidora especializada</strong>
        </div>

        <h1 className={`hero-title ${heroVisible ? "is-visible" : ""}`}>
  Tuberías, <span>conexiones</span> y accesorios
  para proyectos sanitarios en todo el Perú
</h1>

        <p className={`hero-subtitle ${heroVisible ? "is-visible" : ""}`}>
  Realizamos envíos a nivel nacional con stock disponible,
  atención rápida y asesoría especializada para obras,
  negocios y proyectos sanitarios.
</p>

        {/* Estadísticas */}
        <div className={`hero-stats ${heroVisible ? "is-visible" : ""}`}>
          {[
  ["500+", "Productos"],
  ["24h", "Despacho rápido"],
  ["Perú", "Envíos nacionales"],
].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className={`hero-actions ${heroVisible ? "is-visible" : ""}`}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="hero-btn-primary"
          >
            Cotizar por WhatsApp
          </a>

          <a href="#productos" className="hero-btn-secondary">
            <h2>Nuestros productos</h2>
          </a>
        </div>
      </div>      
    </section>
  )
}

export default Hero
