import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


function AddProduct() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    marca: "",
    precio: "",
    categoriaId: "",
  })

  const [categorias, setCategorias] = useState([])
  const [imagen, setImagen] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías:", err))
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    setImagen(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ""

      if (imagen) {
        const formData = new FormData()
        formData.append("file", imagen)

        const uploadRes = await axios.post(
          "http://localhost:8080/api/upload",
          formData
        )

        imageUrl = uploadRes.data
      }

      await axios.post("http://localhost:8080/api/productos", {
        nombre: form.nombre,
        descripcion: form.descripcion,
        tipo: form.tipo,
        marca: form.marca,
        precio: Number(form.precio || 0),
        imagen: imageUrl,
        categoria: {
          id: form.categoriaId,
        },
      })

      alert("Producto creado correctamente")

      setForm({
        nombre: "",
        descripcion: "",
        tipo: "",
        marca: "",
        precio: "",
        categoriaId: "",
      })
      setImagen(null)
    } catch (error) {
      console.error("Error al crear producto:", error)
      alert("Error al crear producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-header">
          <p className="admin-badge">Panel administrador</p>
          <h1>Agregar producto</h1>
          <span>Registra nuevos productos para el catálogo de W&G.</span>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del producto</label>
              <input
                name="nombre"
                placeholder="Ej: Tubería PVC 1/2"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Marca</label>
              <input
                name="marca"
                placeholder="Ej: Pavco, Nicoll, Tigre"
                value={form.marca}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Tipo / Uso</label>
              <input
                name="tipo"
                placeholder="Ej: Agua fría"
                value={form.tipo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
  <label>Precio</label>
  <input
    type="number"
    name="precio"
    placeholder="Ej: 25.90"
    value={form.precio}
    onChange={handleChange}
    min="0"
    step="0.01"
  />
</div>

            <div className="form-group">
              <label>Categoría</label>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción del producto..."
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Imagen del producto</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button
  type="button"
  className="admin-back-button"
  onClick={() => navigate("/admin/productos")}
>
  ← Volver a productos
</button>

          <button className="save-button" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Producto"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct