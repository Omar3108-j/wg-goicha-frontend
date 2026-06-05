import { empresa } from "../data/empresa"

function Footer() {
  const mensaje = "Hola, deseo cotizar productos de tuberías y conexiones."
  const whatsappUrl = `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(mensaje)}`

  return (
    <footer id="contacto" className="footer-premium">
      <div className="footer-premium__bg" />

      <div className="footer-premium__container">
        <div className="footer-premium__brand">
          <div className="footer-premium__logo">W&amp;G</div>

          <div>
            <h2>{empresa.nombre}</h2>
            <p>
              Distribuidora especializada en tuberías, conexiones, accesorios,
              válvulas y soluciones para proyectos de agua, desagüe y construcción.
            </p>
          </div>
        </div>

        <div className="footer-premium__grid">
          <div className="footer-card">
            <span>📍</span>
            <h3>Ubicación</h3>
            <p>{empresa.direccion || "Visítanos en nuestra tienda principal"}</p>
          </div>

          <div className="footer-card">
            <span>📞</span>
            <h3>Atención comercial</h3>
            <p>{empresa.telefono || empresa.whatsapp}</p>
          </div>

          <div className="footer-card">
            <span>💬</span>
            <h3>Cotizaciones</h3>
            <p>Solicita precios, stock y asesoría personalizada por WhatsApp.</p>
          </div>
        </div>

        <div className="footer-premium__cta">
          <div>
            <h3>¿Necesitas una cotización rápida?</h3>
            <p>Te ayudamos a encontrar los productos ideales para tu proyecto.</p>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Cotizar por WhatsApp
          </a>
        </div>

        <div className="footer-premium__bottom">
          <span>© {new Date().getFullYear()} {empresa.nombre}. Todos los derechos reservados.</span>
          <span>Tuberías · Conexiones · Accesorios</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer