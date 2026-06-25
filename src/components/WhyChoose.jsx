import { FaTruck, FaBoxes, FaWhatsapp, FaHardHat } from "react-icons/fa"

function WhyChoose() {
  const estadisticas = [
    {
      icon: <FaBoxes />,
      number: "500+",
      label: "Productos",
      text: "Tuberías, conexiones, válvulas y accesorios.",
    },
    {
      icon: <FaWhatsapp />,
      number: "24h",
      label: "Respuesta rápida",
      text: "Cotizaciones ágiles por WhatsApp.",
    },
    {
      icon: <FaHardHat />,
      number: "100%",
      label: "Asesoría",
      text: "Orientación para proyectos y obras.",
    },
    {
      icon: <FaTruck />,
      number: "Perú",
      label: "Cobertura",
      text: "Atención para Lima y provincias.",
    },
  ]

  return (
    <section className="why-section">
      <div className="why-container">
        <div className="why-header">
          <span>CONFIANZA W&G</span>
          <h2>Soluciones para obras, negocios y proyectos</h2>
          <p>
            Productos confiables, atención personalizada y soporte comercial
            para cada necesidad.
          </p>
        </div>

        <div className="why-grid">
          {estadisticas.map((item) => (
            <div className="why-card" key={item.label}>
              <div className="why-icon">{item.icon}</div>
              <strong className="why-number">{item.number}</strong>
              <h3>{item.label}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChoose
