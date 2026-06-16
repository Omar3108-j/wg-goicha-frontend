import { useState } from "react"
import "../styles/seo-content.css"

function SeoContent() {
  const [open, setOpen] = useState(false)

  return (
    <section className="seo-content">
      <div className="seo-container">
        <span className="seo-badge">DISTRIBUIDOR ESPECIALIZADO</span>

        <h2>Distribuidor especializado en tuberías PVC y accesorios</h2>

        <p className="seo-intro">
          En W&G Corporación Goicha comercializamos tuberías PVC, conexiones,
          válvulas de agua y accesorios para instalaciones de agua y desagüe,
          con atención para obras, negocios y proyectos en Lima y todo el Perú.
        </p>

        <div className="seo-benefits">
          <span>Stock disponible</span>
          <span>Asesoría especializada</span>
          <span>Marcas reconocidas</span>
          <span>Envíos nacionales</span>
        </div>

        <button
  className="seo-toggle"
  onClick={() => setOpen(!open)}
  type="button"
>
  {open
    ? "Ocultar información ↑"
    : "Explorar marcas y materiales →"}
</button>

        {open && (
  <div className="seo-extra">

    <h3>Distribuidor de tuberías PVC y conexiones en Lima</h3>
    <p>
      Somos especialistas en la comercialización de tuberías PVC,
      conexiones sanitarias, válvulas de agua y accesorios para
      instalaciones de agua y desagüe.
    </p>

    <h3>Marcas líderes del sector</h3>
    <p>
      Trabajamos con marcas reconocidas como Pavco, Nicoll, Tigre,
      Rotoplas, Oatey, Matusita, Inyectoplast, CIM VAL y Sanking.
    </p>

    <h3>Materiales para agua potable y desagüe</h3>
    <p>
      Contamos con productos para sistemas hidráulicos,
      instalaciones sanitarias, redes de distribución y proyectos
      de infraestructura.
    </p>

    <h3>Atención para obras y construcción</h3>
    <p>
      Suministramos materiales para proyectos residenciales,
      comerciales e industriales, garantizando disponibilidad y
      asesoría especializada.
    </p>

    <h3>Asesoría técnica especializada</h3>
    <p>
      Nuestro equipo ayuda a seleccionar los materiales adecuados
      según las necesidades de cada proyecto.
    </p>

    <h3>Stock permanente</h3>
    <p>
      Disponemos de una amplia variedad de tuberías, conexiones,
      válvulas y accesorios listos para entrega.
    </p>

    <h3>Envíos en Lima y todo el Perú</h3>
    <p>
      Realizamos despachos en Lima Metropolitana y coordinamos
      envíos a diferentes regiones del país.
    </p>

    <h3>Soluciones para ferreterías y contratistas</h3>
    <p>
      Atendemos empresas constructoras, contratistas,
      instaladores, ferreterías y clientes finales que buscan
      productos de calidad para sus proyectos.
    </p>

  </div>
)}
      </div>
    </section>
  )
}

export default SeoContent