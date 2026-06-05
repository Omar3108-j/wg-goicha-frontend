import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useReveal } from "../hooks/useReveal"

function Categories({ whatsappUrl, onSelectCategory }) {
  const [catRef, catVisible] = useReveal()
  const [categorias, setCategorias] = useState([])
  const sliderRef = useRef(null)

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías:", err))
  }, [])

  const moverSlider = (direccion) => {
    if (!sliderRef.current) return

    const cardWidth =
      sliderRef.current.querySelector(".category-premium-card")?.offsetWidth || 360

    const distancia = cardWidth + 22

    sliderRef.current.scrollBy({
      left: direccion === "next" ? distancia : -distancia,
      behavior: "smooth",
    })
  }

  return (
    <section
  id="categorias"
  ref={catRef}
  className={`categories-section reveal ${catVisible ? "is-visible" : ""}`}
>
      <div className="section-container">
        <div className="section-heading">
          <div>
            <p>Lo que distribuimos</p>
            <h2>Explora nuestras líneas</h2>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Consultar disponibilidad →
          </a>
        </div>

        <div className="categories-slider-wrapper">
          <button
            type="button"
            className="categories-arrow categories-arrow-left"
            onClick={() => moverSlider("prev")}
            aria-label="Categoría anterior"
          >
            ‹
          </button>

          <div className="categories-slider" ref={sliderRef}>
            <div className="categories-track">
              {categorias.map((cat, index) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`category-premium-card ${
                    catVisible ? "is-visible" : ""
                  }`}
                  style={{
                    transitionDelay: `${index * 0.06}s`,
                    backgroundImage: `
                      linear-gradient(
                        rgba(0,0,0,0.25),
                        rgba(0,0,0,0.66)
                      ),
                      ${
                        cat.imagen
                          ? `url(${cat.imagen})`
                          : "linear-gradient(135deg, #111827, #ef4444)"
                      }
                    `,
                  }}
                  onClick={() => {
                    onSelectCategory(cat.nombre)
                    document
                      .getElementById("productos")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <span>Categoría</span>
                  <h3>{cat.nombre}</h3>
                  <p>{cat.descripcion}</p>
                  <strong>Ver línea completa →</strong>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="categories-arrow categories-arrow-right"
            onClick={() => moverSlider("next")}
            aria-label="Siguiente categoría"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}

export default Categories