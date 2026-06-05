function Testimonials() {
  const testimonios = [
    {
      nombre: "Cliente de Lima",
      tipo: "Proyecto sanitario",
      texto: "Excelente atención, rápida respuesta y productos de buena calidad.",
    },
    {
      nombre: "Contratista independiente",
      tipo: "Obra y mantenimiento",
      texto: "Encontré tuberías, conexiones y accesorios para completar mi proyecto.",
    },
    {
      nombre: "Cliente frecuente",
      tipo: "Compras por WhatsApp",
      texto: "La cotización fue rápida y me orientaron con los productos adecuados.",
    },
  ]

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span>CONFIANZA DE CLIENTES</span>
          <h2>Clientes que confían en W&G</h2>
          <p>Atención especializada para proyectos, negocios y compras por volumen.</p>
        </div>

        <div className="testimonials-grid">
          {testimonios.map((item) => (
            <article className="testimonial-card" key={item.nombre}>
              <div className="testimonial-stars">★★★★★</div>
              <p>“{item.texto}”</p>
              <div>
                <strong>{item.nombre}</strong>
                <span>{item.tipo}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials