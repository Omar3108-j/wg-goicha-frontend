import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"
import AdminPagination from "../../components/admin/AdminPagination"
import { API_URL } from "../../config/api"
import { useAdminNotifications } from "../../components/admin/useAdminNotifications"

function AdminProducts() {
  const { showToast, requestConfirm } = useAdminNotifications()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)
  const [productosPorPagina, setProductosPorPagina] = useState(10)
  /* Product admin filters V1 */
  const [busquedaProducto, setBusquedaProducto] = useState("")
  const [filtroEstadoProducto, setFiltroEstadoProducto] = useState("TODOS")
  const [filtroCategoriaProducto, setFiltroCategoriaProducto] = useState("TODAS")
  const [filtroDestacadoProducto, setFiltroDestacadoProducto] = useState("TODOS")

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/productos`)
      /* Admin products safe API data V1 */
      setProductos(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Error cargando productos:", error)
      setProductos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cargarProductosIniciales = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos`)
        /* Admin products safe API data V1 */
        setProductos(Array.isArray(res.data) ? res.data : [])
      } catch (error) {
        console.error("Error cargando productos:", error)
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    cargarProductosIniciales()
  }, [])

  const eliminarProducto = async (id) => {
    const confirmar = await requestConfirm({
      title: "¿Eliminar producto?",
      message: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
    })
    if (!confirmar) return

    try {
      await axios.delete(`${API_URL}/api/productos/${id}`)
      await cargarProductos()
      showToast("Producto eliminado correctamente", "success")
    } catch (error) {
      console.error("Error eliminando producto:", error)
      showToast("No se pudo eliminar el producto", "error")
    }
  }

  const cambiarDestacado = async (producto) => {
  try {
    await axios.put(`${API_URL}/api/productos/${producto.id}`, {
  ...producto,
  destacado: !producto.destacado,
})

    await cargarProductos()
    showToast(
      producto.destacado
        ? "Producto retirado de destacados"
        : "Producto marcado como destacado",
      "success"
    )
  } catch (error) {
    console.error("Error actualizando destacado:", error)
    showToast("No se pudo actualizar el producto destacado", "error")
  }
}
const cambiarEstadoProducto = async (producto) => {
  try {
    await axios.put(`${API_URL}/api/productos/${producto.id}`, {
      ...producto,
      activo: producto.activo === false ? true : false,
    })

    await cargarProductos()
    showToast(
      producto.activo === false
        ? "Producto activado correctamente"
        : "Producto desactivado correctamente",
      "success"
    )
  } catch (error) {
    console.error("Error cambiando estado del producto:", error)
    showToast("No se pudo cambiar el estado del producto", "error")
  }
}

/* Admin products safe API data V1 */
const productosSeguros = Array.isArray(productos) ? productos : []
const totalProductos = productosSeguros.length
const productosActivos = productosSeguros.filter((p) => p.activo !== false).length
const productosInactivos = productosSeguros.filter((p) => p.activo === false).length

const obtenerCategoriaProducto = (producto) =>
  producto.categoria?.nombre ||
  (typeof producto.categoria === "string" ? producto.categoria : "")

const categoriasProductos = [
  ...new Set(
    productosSeguros
      .map(obtenerCategoriaProducto)
      .filter(Boolean)
  ),
].sort((a, b) => String(a).localeCompare(String(b)))

const productosFiltrados = productosSeguros.filter((producto) => {
  const categoria = obtenerCategoriaProducto(producto)
  const texto =
    `${producto.nombre || ""} ${producto.marca || ""} ${producto.tipo || ""} ${categoria}`.toLowerCase()
  const coincideBusqueda = texto.includes(busquedaProducto.toLowerCase())
  const coincideEstado =
    filtroEstadoProducto === "TODOS" ||
    (filtroEstadoProducto === "ACTIVOS" && producto.activo !== false) ||
    (filtroEstadoProducto === "INACTIVOS" && producto.activo === false)
  const coincideCategoria =
    filtroCategoriaProducto === "TODAS" ||
    String(categoria) === filtroCategoriaProducto
  const coincideDestacado =
    filtroDestacadoProducto === "TODOS" ||
    (filtroDestacadoProducto === "DESTACADOS" && producto.destacado === true) ||
    (filtroDestacadoProducto === "NO_DESTACADOS" && producto.destacado !== true)

  return (
    coincideBusqueda &&
    coincideEstado &&
    coincideCategoria &&
    coincideDestacado
  )
})

/* Product admin filtered pagination V1 */
const totalPaginas = Math.max(
  1,
  Math.ceil(productosFiltrados.length / productosPorPagina)
)
const paginaActualSegura = Math.min(paginaActual, totalPaginas)
const indiceUltimo = paginaActualSegura * productosPorPagina
const indicePrimero = indiceUltimo - productosPorPagina
const productosPaginados = productosFiltrados.slice(indicePrimero, indiceUltimo)

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

        <div className="admin-product-filters">
          <input
            type="search"
            placeholder="Buscar por nombre, marca, tipo o categoría..."
            value={busquedaProducto}
            onChange={(e) => {
              setBusquedaProducto(e.target.value)
              setPaginaActual(1)
            }}
          />

          <select
            value={filtroEstadoProducto}
            onChange={(e) => {
              setFiltroEstadoProducto(e.target.value)
              setPaginaActual(1)
            }}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVOS">Activos</option>
            <option value="INACTIVOS">Inactivos</option>
          </select>

          <select
            value={filtroCategoriaProducto}
            onChange={(e) => {
              setFiltroCategoriaProducto(e.target.value)
              setPaginaActual(1)
            }}
          >
            <option value="TODAS">Todas las categorías</option>
            {categoriasProductos.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>

          <select
            value={filtroDestacadoProducto}
            onChange={(e) => {
              setFiltroDestacadoProducto(e.target.value)
              setPaginaActual(1)
            }}
          >
            <option value="TODOS">Todos</option>
            <option value="DESTACADOS">Destacados</option>
            <option value="NO_DESTACADOS">No destacados</option>
          </select>
        </div>

        {loading && <p className="admin-empty">Cargando productos...</p>}

        {!loading && productosSeguros.length === 0 && (
          <p className="admin-empty">No hay productos registrados.</p>
        )}

        {!loading && productosSeguros.length > 0 && productosFiltrados.length === 0 && (
          <p className="admin-product-filter-empty">
            No hay productos que coincidan con los filtros.
          </p>
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

        {productosFiltrados.length > 0 && (
          <AdminPagination
            currentPage={paginaActualSegura}
            totalPages={totalPaginas}
            onPageChange={setPaginaActual}
          />
        )}
          </div>
  </AdminLayout>
)
}

export default AdminProducts
