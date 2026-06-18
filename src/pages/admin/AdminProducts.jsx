import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"
import { API_URL } from "../../config/api"

function AdminProducts() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)
  const [productosPorPagina, setProductosPorPagina] = useState(10)

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/productos`)
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
      await axios.delete(`${API_URL}/api/productos/${id}`)
      cargarProductos()
    } catch (error) {
      console.error("Error eliminando producto:", error)
      alert("No se pudo eliminar el producto")
    }
  }

  const cambiarDestacado = async (producto) => {
  try {
    await axios.put(`${API_URL}/api/productos/${producto.id}`, {
  ...producto,
  destacado: !producto.destacado,
})

    cargarProductos()
  } catch (error) {
    console.error("Error actualizando destacado:", error)
    alert("No se pudo actualizar el producto destacado")
  }
}
const cambiarEstadoProducto = async (producto) => {
  try {
    await axios.put(`${API_URL}/api/productos/${producto.id}`, {
      ...producto,
      activo: producto.activo === false ? true : false,
    })

    cargarProductos()
  } catch (error) {
    console.error("Error cambiando estado del producto:", error)
    alert("No se pudo cambiar el estado del producto")
  }
}

const totalProductos = productos.length
const productosActivos = productos.filter((p) => p.activo !== false).length
const productosInactivos = productos.filter((p) => p.activo === false).length

const indiceUltimo = paginaActual * productosPorPagina
const indicePrimero = indiceUltimo - productosPorPagina
const productosPaginados = productos.slice(indicePrimero, indiceUltimo)
const totalPaginas = Math.ceil(productos.length / productosPorPagina)

  return (
  <AdminLayout>
    <div className="admin-card admin-products-page">
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

        <div className="admin-product-stats">
  <div>
    <strong>{totalProductos}</strong>
    <span>Total productos</span>
  </div>

  <div>
    <strong>{productosActivos}</strong>
    <span>Activos</span>
  </div>

  <div>
    <strong>{productosInactivos}</strong>
    <span>Inactivos</span>
  </div>

  <select
    value={productosPorPagina}
    onChange={(e) => {
      setProductosPorPagina(Number(e.target.value))
      setPaginaActual(1)
    }}
  >
    <option value={10}>10 por página</option>
    <option value={20}>20 por página</option>
    <option value={50}>50 por página</option>
  </select>
</div>

        {loading && <p className="admin-empty">Cargando productos...</p>}

        {!loading && productos.length === 0 && (
          <p className="admin-empty">No hay productos registrados.</p>
        )}

        <div className="admin-product-list">
          {productosPaginados.map((prod) => (
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
                  <span className={`admin-product-status ${prod.activo === false ? "inactive" : "active"}`}>
  {prod.activo === false ? "Inactivo" : "Activo"}
</span>
                </div>
                </div>
              </div>

              <div className="admin-product-actions">

  <button
  className={`admin-status-button ${prod.activo === false ? "inactive" : "active"}`}
  onClick={() => cambiarEstadoProducto(prod)}
>
  {prod.activo === false ? "Activar" : "Desactivar"}
</button>

  <button
    className={`admin-featured-button ${prod.destacado ? "active" : ""}`}
    onClick={() => cambiarDestacado(prod)}
  >
    {prod.destacado ? "Quitar destacado" : "Marcar destacado"}
  </button>

  <Link
    to={`/admin/productos/${prod.id}/variantes`}
    className="admin-edit-button"
  >
    Variantes
  </Link>

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

        {totalPaginas > 1 && (
  <div className="admin-pagination">
    <button
      disabled={paginaActual === 1}
      onClick={() => setPaginaActual((prev) => prev - 1)}
    >
      ← Anterior
    </button>

    <span>
      Página {paginaActual} de {totalPaginas}
    </span>

    <button
      disabled={paginaActual === totalPaginas}
      onClick={() => setPaginaActual((prev) => prev + 1)}
    >
      Siguiente →
    </button>
  </div>
)}
          </div>
  </AdminLayout>
)
}

export default AdminProducts