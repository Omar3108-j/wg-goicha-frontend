import { useEffect, useState } from "react"
import axios from "axios"
import "../../styles/admin-categories.css"
import { API_URL } from "../../config/api"

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([])
  const [imagen, setImagen] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    imagen: "",
  })

  const cargarCategorias = async () => {
    const res = await axios.get(`${API_URL}/api/categorias`)
    setCategorias(res.data)
  }

  useEffect(() => {
    cargarCategorias()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const limpiarFormulario = () => {
    setForm({ id: null, nombre: "", descripcion: "", imagen: "" })
    setImagen(null)
  }

  const guardarCategoria = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = form.imagen

      if (imagen) {
        const formData = new FormData()
        formData.append("file", imagen)

        const uploadRes = await axios.post(
          `${API_URL}/api/upload`,
          formData
        )

        imageUrl = uploadRes.data
      }

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagen: imageUrl,
      }

      if (form.id) {
        await axios.put(`${API_URL}/api/categorias/${form.id}`, payload)
      } else {
        await axios.post(`${API_URL}/api/categorias`, payload)
      }

      await cargarCategorias()
      limpiarFormulario()
    } catch (error) {
      console.error("Error guardando categoría:", error)
      alert("Error al guardar categoría")
    } finally {
      setLoading(false)
    }
  }

  const editarCategoria = (cat) => {
    setForm({
      id: cat.id,
      nombre: cat.nombre || "",
      descripcion: cat.descripcion || "",
      imagen: cat.imagen || "",
    })
    setImagen(null)
  }

  const eliminarCategoria = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return

    try {
      await axios.delete(`${API_URL}/api/categorias/${id}`)
      await cargarCategorias()
    } catch (error) {
      console.error("Error eliminando categoría:", error)
      alert("Error al eliminar categoría")
    }
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories__header">
        <p>CATEGORÍAS</p>
        <h1>Gestión de categorías</h1>
        <span>Administra las líneas principales que se muestran en la web.</span>
      </div>

      <form className="admin-categories__form" onSubmit={guardarCategoria}>
        <input
          name="nombre"
          placeholder="Nombre de categoría"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        <label className="admin-categories__upload">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
          <span>{imagen ? imagen.name : "📷 Agregar imagen"}</span>
        </label>

        <button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : form.id
            ? "Actualizar categoría"
            : "Guardar categoría"}
        </button>

        {form.id && (
          <button
            type="button"
            className="admin-categories__cancel"
            onClick={limpiarFormulario}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="admin-categories__list">
        {categorias.map((cat) => (
          <div className="admin-categories__card" key={cat.id}>
            <div className="admin-categories__image">
              {cat.imagen ? (
                <img src={cat.imagen} alt={cat.nombre} />
              ) : (
                <span>Sin imagen</span>
              )}
            </div>

            <div className="admin-categories__info">
              <h3>{cat.nombre}</h3>
              <p>{cat.descripcion}</p>
              <small>CATEGORÍA</small>
            </div>

            <div className="admin-categories__actions">
              <button type="button" onClick={() => editarCategoria(cat)}>
                Editar
              </button>

              <button type="button" onClick={() => eliminarCategoria(cat.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoriasAdmin