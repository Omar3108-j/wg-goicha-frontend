import { useEffect, useRef, useState } from "react"
import { obtenerProductosCatalogo } from "../services/productoService"
import { resolveAssetUrl } from "../config/api"

function FeaturedProducts() {
  const [productos, setProductos] = useState([])
  const [preciosMinimos, setPreciosMinimos] = useState({})
  const sliderRef = useRef(null)

  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        const catalogo = await obtenerProductosCatalogo()
        const destacados = catalogo.filter((producto) => producto.destacado)

        setProductos(destacados)
        setPreciosMinimos(
          Object.fromEntries(
            destacados
              .filter((producto) => producto.tieneVariantesActivas)
              .map((producto) => [
                producto.id,
                Number(producto.precioMinimo || 0),
              ])
          )
        )
      } catch (error) {
        console.error("Error cargando destacados", error)
      }
    }

    cargarDestacados()
  }, [])

  const moverSlider = (direccion) => {
    if (!sliderRef.current) return

    const cardWidth = sliderRef.current.querySelector(".featured-card")?.offsetWidth || 280
    const distancia = cardWidth + 24

    sliderRef.current.scrollBy({
      left: direccion === "next" ? distancia : -distancia,
      behavior: "smooth",
    })
  }

  if (productos.length === 0) return null

  return (
    <section className="featured-section">
      <div className="section-container">
        <div className="featured-header">
          <span>MÁS VENDIDOS</span>
          <h2>Productos destacados</h2>
          <p>Selección de productos recomendados por nuestros especialistas.</p>
        </div>

        <div className="featured-slider-wrapper">
          <button
            className="featured-arrow featured-arrow-left"
            onClick={() => moverSlider("prev")}
            aria-label="Anterior"
          >
            ‹
          </button>

          <div className="featured-slider" ref={sliderRef}>
            {productos.map((prod) => (
              <div key={prod.id} className="featured-card">
                <span className="featured-badge">Destacado</span>

                <img src={resolveAssetUrl(prod.imagen)} alt={prod.nombre} loading="lazy" />

                <div className="featured-body">
                  <h3>{prod.nombre}</h3>
                  <p>{prod.descripcion}</p>

                  <span>
                    {preciosMinimos[prod.id] !== undefined ? (
                      <>Desde S/ {Number(preciosMinimos[prod.id]).toFixed(2)}</>
                    ) : (
                      <>S/ {Number(prod.precio || 0).toFixed(2)}</>
                    )}
                  </span>

                  <a href="#productos" className="featured-button">
                    Ver en catálogo →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            className="featured-arrow featured-arrow-right"
            onClick={() => moverSlider("next")}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
