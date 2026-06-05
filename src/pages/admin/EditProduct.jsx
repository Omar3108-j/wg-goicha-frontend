import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config/api"

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    marca: "",
    precio: "",
    categoriaId: "",
    imagenActual: "",
  })

  const [categorias, setCategorias] = useState([])
  const [imagenNueva, setImagenNueva] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías:", err))

    axios.get(`${API_URL}/api/productos/${id}`)
      .then((res) => {
        const prod = res.data

        setForm({
          nombre: prod.nombre || "",
          descripcion: prod.descripcion || "",
          tipo: prod.tipo || "",
          marca: prod.marca || "",
          precio: prod.precio ||"",
          categoriaId: prod.categoria?.id || "",
          imagenActual: prod.imagen || "",
        })
      })
      .catch((err) => console.error("Error cargando producto:", err))
  }, [id])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    setImagenNueva(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = form.imagenActual

      if (imagenNueva) {
        const formData = new FormData()
        formData.append("file", imagenNueva)

        const uploadRes = await axios.post(
          `${API_URL}/api/upload`,
          formData
        )

        imageUrl = uploadRes.data
      }

      await axios.put(`${API_URL}/api/productos/${id}`, {
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

      alert("Producto actualizado correctamente")
      navigate("/admin/productos")
    } catch (error) {
      console.error("Error actualizando producto:", error)
      alert("Error al actualizar producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-header">
          <p className="admin-badge">Panel administrador</p>
          <h1>Editar producto</h1>
          <span>Actualiza la información del producto seleccionado.</span>
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

          {form.imagenActual && (
            <div className="form-group">
              <label>Imagen actual</label>
              <div className="admin-preview-image">
                <img src={form.imagenActual} alt={form.nombre} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Cambiar imagen</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="admin-form-actions">
            <Link to="/admin/productos" className="admin-cancel-button">
              Cancelar
            </Link>

            <button className="save-button" type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct