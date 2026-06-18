import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"
import { API_URL } from "../../config/api"

function AdminVariantes() {
  const { id } = useParams()

  const [variantes, setVariantes] = useState([])
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [loading, setLoading] = useState(false)
  const [producto, setProducto] = useState(null)

  const cargarVariantes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/variantes/producto/${id}`)
      setVariantes(res.data)
    } catch (error) {
      console.error("Error cargando variantes:", error)
    }
  }

  useEffect(() => {
  cargarProducto()
  cargarVariantes()
}, [id])

  const guardarVariante = async () => {
    if (!nombre.trim() || !precio) {
      alert("Ingresa el nombre y precio de la variante")
      return
    }

    try {
      setLoading(true)

      await axios.post(`${API_URL}/api/variantes`, {
        nombre: nombre.trim(),
        precio: Number(precio),
        activo: true,
        producto: {
          id: Number(id),
        },
      })

      setNombre("")
      setPrecio("")
      cargarVariantes()
    } catch (error) {
      console.error("Error guardando variante:", error)
      alert("Error guardando variante")
    } finally {
      setLoading(false)
    }
  }

  const cambiarVariante = (varianteId, campo, valor) => {
    setVariantes((prev) =>
      prev.map((v) =>
        v.id === varianteId ? { ...v, [campo]: valor } : v
      )
    )
  }

  const actualizarVariante = async (variante) => {
    if (!variante.nombre.trim() || variante.precio === "") {
      alert("La variante debe tener nombre y precio")
      return
    }

    try {
      await axios.put(`${API_URL}/api/variantes/${variante.id}`, {
        nombre: variante.nombre.trim(),
        precio: Number(variante.precio),
        activo: variante.activo ?? true,
      })

      cargarVariantes()
    } catch (error) {
      console.error("Error actualizando variante:", error)
      alert("No se pudo actualizar la variante")
    }
  }

  const cambiarEstadoVariante = async (variante) => {
  try {
    await axios.put(`${API_URL}/api/variantes/${variante.id}`, {
      nombre: variante.nombre,
      precio: Number(variante.precio),
      activo: !variante.activo,
    })

    cargarVariantes()
  } catch (error) {
    console.error("Error cambiando estado de variante:", error)
    alert("No se pudo cambiar el estado de la variante")
  }
}

  const eliminarVariante = async (varianteId) => {
    const confirmar = confirm("¿Seguro que deseas eliminar esta variante?")
    if (!confirmar) return

    try {
      await axios.delete(`${API_URL}/api/variantes/${varianteId}`)
      cargarVariantes()
    } catch (error) {
      console.error("Error eliminando variante:", error)
      alert("No se pudo eliminar la variante")
    }
  }
  const cargarProducto = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/productos/${id}`)
    setProducto(res.data)
  } catch (error) {
    console.error("Error cargando producto:", error)
  }
}

  return (
    <AdminLayout>
      <div className="admin-card">
        <div className="admin-variants-header">
          <div>
            <p className="admin-badge">Panel administrador</p>
            <h1>Variantes del producto</h1>

            {producto && (
            <div className="admin-variant-product-box">
                Producto: <strong>{producto.nombre}</strong>
            </div>
            )}

            <span>Agrega, edita o elimina medidas y precios.</span>
          </div>

          <Link to="/admin/productos" className="admin-add-button">
            ← Volver
          </Link>
        </div>

        <div className="admin-variant-create">
          <input
            type="text"
            placeholder="Ej: 1/2 x 5m"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            min="0"
            step="0.01"
            onChange={(e) => setPrecio(e.target.value)}
          />

          <button onClick={guardarVariante} disabled={loading}>
            {loading ? "Guardando..." : "+ Agregar variante"}
          </button>
        </div>

        <div className="admin-variant-section-title">
          Variantes registradas
        </div>

        {variantes.length === 0 ? (
          <p className="admin-empty">
            Este producto aún no tiene variantes registradas.
          </p>
        ) : (
          <div className="admin-variant-list">
            {variantes.map((v) => (
              <div className="admin-variant-row" key={v.id}>
                <input
                  type="text"
                  value={v.nombre}
                  onChange={(e) =>
                    cambiarVariante(v.id, "nombre", e.target.value)
                  }
                />

                <input
                  type="number"
                  value={v.precio}
                  min="0"
                  step="0.01"
                  onChange={(e) =>
                    cambiarVariante(v.id, "precio", e.target.value)
                  }
                />

                <button
  className={`admin-status-button ${v.activo ? "active" : "inactive"}`}
  onClick={() => cambiarEstadoVariante(v)}
>
  {v.activo ? "Activo" : "Inactivo"}
</button>
                <button
                  className="admin-edit-button"
                  onClick={() => actualizarVariante(v)}
                >
                  Guardar
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() => eliminarVariante(v.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminVariantes