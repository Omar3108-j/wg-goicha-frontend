import tienda from "../assets/empresa/tienda.jpg"
import movilidad from "../assets/empresa/movilidad.jpg"
import stock from "../assets/empresa/stock.jpg"
import asesoria from "../assets/empresa/asesoria.jpg"

function CompanyShowcase() {
  return (
    <section className="company-section">
      <div className="company-container">
        <div className="company-header">
          <span>NUESTRA EMPRESA</span>
          <h2>Infraestructura y logística para atender tus proyectos</h2>
          <p>
            Contamos con stock disponible, atención especializada y reparto para
            garantizar una experiencia rápida y confiable.
          </p>
        </div>

        <div className="company-grid">

  <div className="company-card">
    <img src={tienda} alt="Nuestra tienda W&G" />

    <div className="company-overlay">
      <span>NUESTRA TIENDA</span>
      <h3>Showroom y atención</h3>

      <p>
        Visítanos y encuentra tuberías, conexiones,
        válvulas y accesorios con asesoría especializada.
      </p>
    </div>
  </div>

  <div className="company-card">
    <img src={movilidad} alt="Despacho y reparto" />

    <div className="company-overlay">
      <span>LOGÍSTICA</span>
      <h3>Despacho y reparto</h3>

      <p>
        Entregas rápidas para proyectos,
        negocios y clientes finales.
      </p>
    </div>
  </div>

  <div className="company-card">
    <img src={stock} alt="Inventario disponible" />

    <div className="company-overlay">
      <span>STOCK PERMANENTE</span>
      <h3>Inventario disponible</h3>

      <p>
        Amplio stock de tuberías y accesorios
        para atender proyectos de forma inmediata.
      </p>
    </div>
  </div>

  <div className="company-card">
    <img src={asesoria} alt="Equipo comercial" />

    <div className="company-overlay">
      <span>ATENCIÓN ESPECIALIZADA</span>
      <h3>Equipo comercial</h3>

      <p>
        Coordinamos pedidos y brindamos
        asesoría técnica para cada proyecto.
      </p>
    </div>
  </div>

</div>
      </div>
    </section>
  )
}

export default CompanyShowcase