function LocationMap() {
  const direccion =
    "AV. GUILLERMO DANSEY NRO. 481 INT. 159, Centro Comercial Loreto, Lima, Perú"

  const whatsapp = "51994079602"

  return (
    <section id="contacto" className="location-section">
      <div className="location-container">
        <div className="location-info">
          <span>UBICACIÓN</span>
          <h2>Visítanos o cotiza por WhatsApp</h2>
          <p>
            Encuéntranos en el Centro Comercial Loreto. Atendemos cotizaciones,
            pedidos y consultas para proyectos.
          </p>

          <div className="location-card">
            <strong>Dirección</strong>
            <p>AV. GUILLERMO DANSEY NRO. 481 INT. 159</p>
            <p>Centro Comercial Loreto</p>
          </div>

          <div className="location-card">
            <strong>WhatsApp</strong>
            <p>+51 994 079 602</p>
          </div>

          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
              "Hola W&G Corporación Goicha, deseo realizar una cotización."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="location-button"
          >
            Cotizar por WhatsApp →
          </a>
        </div>

        <div className="location-map">
          <iframe
            title="Ubicación W&G Corporación Goicha"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              direccion
            )}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default LocationMap