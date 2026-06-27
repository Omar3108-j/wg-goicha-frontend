import { useEffect, useState } from "react"
import axios from "axios"
import "../../styles/admin-categories.css"
import { API_URL } from "../../config/api"
import AdminModuleFormHeader from "./AdminModuleFormHeader"
import AdminPagination from "./AdminPagination"
import { useAdminNotifications } from "./useAdminNotifications"

function CategoriasAdmin() {
  const { showToast, requestConfirm } = useAdminNotifications()
  const [categorias, setCategorias] = useState([])
  const [imagen, setImagen] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [paginaActual, setPaginaActual] = useState(1)
  const categoriasPorPagina = 10

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
    const cargarCategoriasIniciales = async () => {
      const res = await axios.get(`${API_URL}/api/categorias`)
      setCategorias(res.data)
    }

    cargarCategoriasIniciales()
  }, [])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const limpiarFormulario = () => {
    setForm({ id: null, nombre: "", descripcion: "", imagen: "" })
    setImagen(null)
  }

  const volverAlListado = () => {
    limpiarFormulario()
    setMostrarFormulario(false)
  }

  const nuevaCategoria = () => {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  const guardarCategoria = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      let imageUrl = form.imagen

      if (imagen) {
        const formData = new FormData()
        formData.append("file", imagen)

        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData)
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
      showToast(
        form.id
          ? "Categoría actualizada correctamente"
          : "Categoría creada correctamente",
        "success"
      )
      volverAlListado()
    } catch (error) {
      console.error("Error guardando categoría:", error)
      showToast("Error al guardar categoría", "error")
    } finally {
      setLoading(false)
    }
  }

  const editarCategoria = (categoria) => {
    setForm({
      id: categoria.id,
      nombre: categoria.nombre || "",
      descripcion: categoria.descripcion || "",
      imagen: categoria.imagen || "",
    })
    setImagen(null)
    setMostrarFormulario(true)
  }

  const eliminarCategoria = async (id) => {
    const confirmar = await requestConfirm({
      title: "¿Eliminar categoría?",
      message: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
    })
    if (!confirmar) return

    try {
      await axios.delete(`${API_URL}/api/categorias/${id}`)
      await cargarCategorias()
      showToast("Categoría eliminada correctamente", "success")
    } catch (error) {
      console.error("Error eliminando categoría:", error)
      showToast("Error al eliminar categoría", "error")
    }
  }

  const totalPaginas = Math.max(
    1,
    Math.ceil(categorias.length / categoriasPorPagina)
  )
  const paginaActualSegura = Math.min(paginaActual, totalPaginas)
  const indiceInicial = (paginaActualSegura - 1) * categoriasPorPagina
  const categoriasPaginadas = categorias.slice(
    indiceInicial,
    indiceInicial + categoriasPorPagina
  )

  return (
    <div className="admin-categories">
      {mostrarFormulario ? (
        <div className="admin-module-view admin-categories__form-view">
          <AdminModuleFormHeader
            backLabel="Volver a categorías"
            description={
              form.id
                ? "Actualiza la información de la categoría seleccionada."
                : "Registra una nueva línea para organizar el catálogo."
            }
            editing={Boolean(form.id)}
            eyebrow="Categorías"
            onBack={volverAlListado}
            title={form.id ? "Editando categoría" : "Nueva categoría"}
          />

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
                onChange={(event) => setImagen(event.target.files[0])}
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
                onClick={volverAlListado}
              >
                Cancelar edición
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="admin-module-view">
          <div className="admin-categories__header admin-categories__header--list">
            <div>
              <p>CATEGORÍAS</p>
              <h1>Gestión de categorías</h1>
              <span>Administra las líneas principales que se muestran en la web.</span>
            </div>

            <button
              type="button"
              className="admin-categories__add"
              onClick={nuevaCategoria}
            >
              + Agregar categoría
            </button>
          </div>

          <div className="admin-categories__stat">
            <strong>{categorias.length}</strong>
            <span>Categorías registradas</span>
          </div>

          <div className="admin-categories__list">
            {categoriasPaginadas.map((categoria) => (
              <div className="admin-categories__card" key={categoria.id}>
                <div className="admin-categories__image">
                  {categoria.imagen ? (
                    <img src={categoria.imagen} alt={categoria.nombre} />
                  ) : (
                    <span>Sin imagen</span>
                  )}
                </div>

                <div className="admin-categories__info">
                  <h3>{categoria.nombre}</h3>
                  <p>{categoria.descripcion}</p>
                  <small>CATEGORÍA</small>
                </div>

                <div className="admin-categories__actions">
                  <button
                    type="button"
                    onClick={() => editarCategoria(categoria)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => eliminarCategoria(categoria.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <AdminPagination
            currentPage={paginaActualSegura}
            totalPages={totalPaginas}
            onPageChange={setPaginaActual}
          />
        </div>
      )}
    </div>
  )
}

export default CategoriasAdmin
