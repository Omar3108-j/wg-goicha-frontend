import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"

function AdminProducts() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/productos")
      setProductos(res.data)
    } catch (error) {
      console.error("Error cargando productos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const eliminarProducto = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este producto?")

    if (!confirmar) return

    try {
      await axios.delete(`http://localhost:8080/api/productos/${id}`)
      cargarProductos()
    } catch (error) {
      console.error("Error eliminando producto:", error)
      alert("No se pudo eliminar el producto")
    }
  }

  const cambiarDestacado = async (producto) => {
  try {
    await axios.put(`http://localhost:8080/api/productos/${producto.id}`, {
      ...producto,
      destacado: !producto.destacado,
    })

    cargarProductos()
  } catch (error) {
    console.error("Error actualizando destacado:", error)
    alert("No se pudo actualizar el producto destacado")
  }
}

  return (
  <AdminLayout>
    <div className="admin-card">
        <div className="admin-topbar">
          <div>
            <p className="admin-badge">Panel administrador</p>
            <h1>Gestión de productos</h1>
            <span>Administra los productos visibles en la página.</span>
          </div>

          <Link to="/admin/productos/nuevo" className="admin-add-button">
            + Agregar producto
          </Link>
        </div>

        {loading && <p className="admin-empty">Cargando productos...</p>}

        {!loading && productos.length === 0 && (
          <p className="admin-empty">No hay productos registrados.</p>
        )}

        <div className="admin-product-list">
          {productos.map((prod) => (
            <div key={prod.id} className="admin-product-item">
              <div className="admin-product-info">
                <div className="admin-product-img">
                  {prod.imagen ? (
                    <img src={prod.imagen} alt={prod.nombre} />
                  ) : (
                    <span>🔧</span>
                  )}
                </div>

                <div>
                  <h3>{prod.nombre}</h3>
                  <p>{prod.descripcion}</p>

                  <div className="admin-product-meta">
                  {prod.marca && <span>{prod.marca}</span>}
                  {prod.tipo && <span>{prod.tipo}</span>}
                  {prod.categoria?.nombre && <span>{prod.categoria.nombre}</span>}
                  {prod.destacado && <span>⭐ Destacado</span>}
                </div>
                </div>
              </div>

              <div className="admin-product-actions">
              <button
                className={`admin-featured-button ${prod.destacado ? "active" : ""}`}
                onClick={() => cambiarDestacado(prod)}
              >
                {prod.destacado ? "Quitar destacado" : "Marcar destacado"}
              </button>

              <Link
                to={`/admin/productos/editar/${prod.id}`}
                className="admin-edit-button"
              >
                Editar
              </Link>

              <button
                className="admin-delete-button"
                onClick={() => eliminarProducto(prod.id)}
              >
                Eliminar
              </button>
            </div>
            </div>
          ))}
        </div>
          </div>
  </AdminLayout>
)
}

export default AdminProducts