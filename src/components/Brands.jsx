import pavco from "../assets/brands/pavco.png"
import nicoll from "../assets/brands/nicoll.png"
import rotoplas from "../assets/brands/rotoplas.png"
import tigre from "../assets/brands/tigre.png"
import oatey from "../assets/brands/oatey.png"
import matusita from "../assets/brands/matusita.png"
import cimvalve from "../assets/brands/cimvalve.png"
import inyectoplast from "../assets/brands/inyectoplast.png"
function Brands() {
  const marcas = [
    { nombre: "PAVCO", logo: pavco },
    { nombre: "NICOLL", logo: nicoll },
    { nombre: "ROTOPLAS", logo: rotoplas },
    { nombre: "TIGRE", logo: tigre },
    { nombre: "OATEY", logo: oatey },
    { nombre: "MATUSITA", logo: matusita },
    { nombre: "CIM VALVE", logo: cimvalve },
    { nombre: "INYECTOPLAST", logo: inyectoplast },
  ]

  const marcasDuplicadas = [...marcas, ...marcas]

  return (
    <section className="brands-section">
      <div className="brands-container">
        <div className="brands-header">
          <span>MARCAS ALIADAS</span>
          <h2>Trabajamos con marcas de confianza</h2>
          <p>Productos seleccionados para proyectos de agua, desagüe y construcción.</p>
        </div>

        <div className="brands-carousel">
          <div className="brands-track">
            {marcasDuplicadas.map((marca, index) => (
              <div className="brand-card" key={`${marca.nombre}-${index}`}>
                <img src={marca.logo} alt={marca.nombre} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Brands
