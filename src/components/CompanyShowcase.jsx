import tiendaImg from "../assets/empresa/tienda.jpg"
import movilidadImg from "../assets/empresa/movilidad.jpg"

function CompanyShowcase() {
  return (
    <section className="company-section">
      <div className="company-container">

        <div className="company-header">
          <span>NUESTRA EMPRESA</span>
          <h2>Infraestructura y logística para atender tus proyectos</h2>
          <p>
            Contamos con stock disponible, atención especializada y
            reparto para garantizar una experiencia rápida y confiable.
          </p>
        </div>

        <div className="company-grid">

          <div className="company-card company-card-large">
            <img src={tiendaImg} alt="Tienda W&G" />

            <div className="company-overlay">
              <span>W&G CORPORACIÓN GOICHA</span>
              <h3>Nuestra tienda</h3>

              <p>
                Punto de atención especializado en tuberías,
                conexiones, válvulas y accesorios.
              </p>
            </div>
          </div>

          <div className="company-card">
            <img src={movilidadImg} alt="Movilidad W&G" />

            <div className="company-overlay">
              <span>LOGÍSTICA</span>
              <h3>Despacho y reparto</h3>

              <p>
                Entregas rápidas para proyectos,
                negocios y clientes finales.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default CompanyShowcase