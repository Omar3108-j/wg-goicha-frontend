import { empresa } from "../data/empresa"
import { Building2, Headset, ClipboardList} from "lucide-react"
import { FaFacebookF } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa6"


function Footer() {
  const mensaje = "Hola, deseo cotizar productos de tuberías y conexiones."
  const whatsappUrl = `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(mensaje)}`
  const ogtMessage = encodeURIComponent(
  "Hola OGTSystems, vi el sitio web de W&G Corporación Goicha y me gustaría recibir información sobre el desarrollo de una página web o sistema para mi negocio."
)

const ogtUrl = `https://wa.me/51938495942?text=${ogtMessage}`

  return (
    <footer id="contacto" className="footer-premium">
      <div className="footer-premium__bg" />

      <div className="footer-premium__container">
        <div className="footer-premium__hero">
          <div className="footer-premium__header">
  <span>CONTACTO COMERCIAL</span>
  <h2>Estamos listos para ayudarte</h2>
</div>
          <div className="footer-premium__brand">
            <div className="footer-premium__logo">W&amp;G</div>

            <div>
              <span className="footer-premium__eyebrow">Contacto comercial</span>
              <h2>{empresa.nombre}</h2>
              <p>
                Asesoría especializada en tuberías, conexiones, válvulas y accesorios
                para proyectos de agua, desagüe y construcción.
              </p>
            </div>
          </div>

          <a className="footer-premium__hero-btn" href={whatsappUrl} target="_blank" rel="noreferrer">
            Cotizar ahora
          </a>
        </div>

        <div className="footer-premium__grid">
          <div className="footer-card">
            <div className="footer-card__icon">
  <Building2 size={30} />
</div>
            <small>Ubicación</small>
            <p>Lima Metropolitana · Atención a nivel nacional</p>
            <p>{empresa.direccion || "Atendemos pedidos y cotizaciones a nivel nacional."}</p>
          </div>

          <div className="footer-card">
            <div className="footer-card__icon">
  <Headset size={30} />
</div>
            <small>Atención comercial</small>
            <>
  <h3>{empresa.telefono || empresa.whatsapp}</h3>
  <p>Lunes a sábado · 08:00 AM - 07:00 PM</p>
</>
          </div>

          <div className="footer-card">
            <div className="footer-card__icon">
  <ClipboardList size={30} />
</div>
            <small>Cotizaciones</small>
            <h3>Respuesta rápida</h3>
            <p>Solicita precios, stock disponible y recomendaciones de productos por WhatsApp.</p>
          </div>
        </div>

        <div className="footer-premium__cta">
          <div>
            <span>Asesoría personalizada</span>
            <h3>¿Necesitas una cotización rápida?</h3>
            <p>Envíanos tu lista de materiales y te ayudamos a encontrar la mejor solución.</p>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Cotizar por WhatsApp
          </a>
        </div>

        <div className="footer-bottom">

  <div className="footer-copy">
    <p>
      © {new Date().getFullYear()} W&G Corporación Goicha E.I.R.L.
      Todos los derechos reservados.
    </p>

  </div>

  <div className="footer-socials">
  <a
    href="https://www.facebook.com/profile.php?id=61581582235767"
    target="_blank"
    rel="noreferrer"
    aria-label="Facebook"
  >
    <FaFacebookF />
  </a>

  <a
    href="https://www.tiktok.com/@goichainversiones1"
    target="_blank"
    rel="noreferrer"
    aria-label="TikTok"
  >
    <FaTiktok />
  </a>
</div>

  <div className="footer-right">
  <a
  href={ogtUrl}
  target="_blank"
  rel="noreferrer"
  className="footer-powered"
>
  Sitio web desarrollado por OGTSystems®
</a>
</div>

</div>
</div>
    </footer>
  )
}

export default Footer