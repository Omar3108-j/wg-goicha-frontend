import { useEffect, useState } from "react"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"
import { API_URL } from "../../config/api"
import { useAdminNotifications } from "../../components/admin/useAdminNotifications"

function AdminOrders() {
  const { showToast } = useAdminNotifications()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  /* Order filters V1 */
  const [busquedaPedido, setBusquedaPedido] = useState("")
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState("TODOS")
  const [filtroFechaPedido, setFiltroFechaPedido] = useState("TODAS")
  /* Order pagination V1 */
  const [pedidosPorPagina, setPedidosPorPagina] = useState(10)
  const [paginaPedidos, setPaginaPedidos] = useState(1)

  const cargarPedidos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pedidos`)
      setPedidos(res.data)
    } catch (error) {
      console.error("Error cargando pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cargarPedidosIniciales = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/pedidos`)
        setPedidos(res.data)
      } catch (error) {
        console.error("Error cargando pedidos:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarPedidosIniciales()
  }, [])

  const cambiarEstado = async (id, estado) => {
    try {
      await axios.put(`${API_URL}/api/pedidos/${id}/estado?estado=${estado}`)
      await cargarPedidos()
      showToast("Estado del pedido actualizado", "success")
    } catch (error) {
      console.error("Error actualizando estado:", error)
      showToast("No se pudo actualizar el estado", "error")
    }
  }

  const inicioDelDia = (fecha) =>
    new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())

  const pedidoCoincideFecha = (pedido) => {
    if (filtroFechaPedido === "TODAS") return true

    const fechaPedido = new Date(pedido.fechaCreacion)
    if (Number.isNaN(fechaPedido.getTime())) return false

    const hoy = inicioDelDia(new Date())
    const fecha = inicioDelDia(fechaPedido)

    if (filtroFechaPedido === "HOY") {
      return fecha.getTime() === hoy.getTime()
    }

    if (filtroFechaPedido === "SEMANA") {
      const inicioSemana = new Date(hoy)
      const diaSemana = (hoy.getDay() + 6) % 7
      inicioSemana.setDate(hoy.getDate() - diaSemana)
      return fecha >= inicioSemana && fecha <= hoy
    }

    if (filtroFechaPedido === "MES") {
      return (
        fecha.getFullYear() === hoy.getFullYear() &&
        fecha.getMonth() === hoy.getMonth()
      )
    }

    return true
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const texto =
      `${pedido.codigo || ""} ${pedido.cliente || ""} ${pedido.telefono || ""}`.toLowerCase()
    const coincideBusqueda = texto.includes(busquedaPedido.toLowerCase())
    const coincideEstado =
      filtroEstadoPedido === "TODOS" ||
      (pedido.estado || "PENDIENTE").toUpperCase() === filtroEstadoPedido

    return coincideBusqueda && coincideEstado && pedidoCoincideFecha(pedido)
  })

  const totalPedidos = pedidos.length
  const totalPendientes = pedidos.filter(
    (pedido) => (pedido.estado || "PENDIENTE").toUpperCase() === "PENDIENTE"
  ).length
  const totalEnProceso = pedidos.filter(
    (pedido) => (pedido.estado || "").toUpperCase() === "EN_PROCESO"
  ).length
  const totalEntregados = pedidos.filter(
    (pedido) => (pedido.estado || "").toUpperCase() === "ENTREGADO"
  ).length
  const totalAnulados = pedidos.filter(
    (pedido) => (pedido.estado || "").toUpperCase() === "ANULADO"
  ).length

  const totalPaginasPedidos = Math.max(
    1,
    Math.ceil(pedidosFiltrados.length / pedidosPorPagina)
  )
  const paginaPedidosSegura = Math.min(paginaPedidos, totalPaginasPedidos)
  const indiceInicialPedidos = (paginaPedidosSegura - 1) * pedidosPorPagina
  const pedidosPaginados = pedidosFiltrados.slice(
    indiceInicialPedidos,
    indiceInicialPedidos + pedidosPorPagina
  )

  return (
    <AdminLayout>
      <section className="admin-dashboard-premium">
        <div className="admin-dashboard-hero admin-orders-hero">
          <div>
            <p className="admin-badge">Bandeja comercial</p>
            <h1>Pedidos</h1>
            <span>
              Administra los pedidos enviados desde la página web y controla su estado.
            </span>
          </div>

          <div className="admin-dashboard-status">
            <span>Total</span>
            <strong>{pedidos.length}</strong>
          </div>
        </div>

        {loading && <p className="admin-empty">Cargando pedidos...</p>}

        {!loading && pedidos.length === 0 && (
          <div className="admin-panel-card admin-orders-empty">
            <h2>No hay pedidos registrados</h2>
            <p>Cuando un cliente confirme su carrito, aparecerá aquí automáticamente.</p>
          </div>
        )}

        {!loading && pedidos.length > 0 && (
          <div className="admin-orders-tools">
            <div className="admin-orders-stats">
              <div>
                <strong>{totalPedidos}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>{totalPendientes}</strong>
                <span>Pendientes</span>
              </div>
              <div>
                <strong>{totalEnProceso}</strong>
                <span>En proceso</span>
              </div>
              <div>
                <strong>{totalEntregados}</strong>
                <span>Entregados</span>
              </div>
              <div>
                <strong>{totalAnulados}</strong>
                <span>Anulados</span>
              </div>
            </div>

            <div className="admin-orders-filters">
              <input
                placeholder="Buscar por código, cliente o teléfono..."
                value={busquedaPedido}
                onChange={(e) => {
                  setBusquedaPedido(e.target.value)
                  setPaginaPedidos(1)
                }}
              />

              <select
                value={filtroEstadoPedido}
                onChange={(e) => {
                  setFiltroEstadoPedido(e.target.value)
                  setPaginaPedidos(1)
                }}
              >
                <option value="TODOS">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="EN_PROCESO">En proceso</option>
                <option value="ENTREGADO">Entregado</option>
                <option value="ANULADO">Anulado</option>
              </select>

              <select
                value={filtroFechaPedido}
                onChange={(e) => {
                  setFiltroFechaPedido(e.target.value)
                  setPaginaPedidos(1)
                }}
              >
                <option value="TODAS">Todas las fechas</option>
                <option value="HOY">Hoy</option>
                <option value="SEMANA">Esta semana</option>
                <option value="MES">Este mes</option>
              </select>

              <select
                value={pedidosPorPagina}
                onChange={(e) => {
                  setPedidosPorPagina(Number(e.target.value))
                  setPaginaPedidos(1)
                }}
              >
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </div>
        )}

        <div className="admin-orders-list">
          {pedidosPaginados.map((pedido) => (
            <div key={pedido.id} className="admin-order-card">
              <div className="admin-order-header">
                <div>
                  <p>Pedido</p>
                  <h2>{pedido.codigo || `PED-${String(pedido.id).padStart(5, "0")}`}</h2>
                </div>

                <span className={`admin-order-status status-${pedido.estado?.toLowerCase()}`}>
                  {pedido.estado}
                </span>
              </div>

              <div className="admin-order-info">
                <div>
                  <span>Cliente</span>
                  <strong>{pedido.cliente}</strong>
                </div>

                <div>
                  <span>Teléfono</span>
                  <strong>{pedido.telefono}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>S/ {pedido.total}</strong>
                </div>

                <div>
                  <span>Fecha</span>
                  <strong>{pedido.fechaCreacion?.replace("T", " ").slice(0, 16)}</strong>
                </div>
              </div>

              <div className="admin-order-products">
                <h3>Productos</h3>

                {pedido.detalles?.map((item) => (
                  <div key={item.id} className="admin-order-product">
                    <span>{item.productoNombre}</span>
                    <strong>
                      {item.cantidad} x S/ {item.precio}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="admin-order-actions">
                
                <button onClick={() => cambiarEstado(pedido.id, "CONFIRMADO")}>
                  Confirmar
                </button>
                <button onClick={() => cambiarEstado(pedido.id, "EN_PROCESO")}>
                  En proceso
                </button>
                <button onClick={() => cambiarEstado(pedido.id, "ENTREGADO")}>
                  Entregado
                </button>
                <button onClick={() => cambiarEstado(pedido.id, "ANULADO")}>
                  Anular
                </button>
                <a
  href={`${API_URL}/api/pedidos/${pedido.id}/pdf`}
  target="_blank"
  rel="noreferrer"
  className="admin-order-pdf-button"
>
  Descargar PDF
</a>
              </div>
            </div>
          ))}
        </div>

        {!loading && pedidos.length > 0 && pedidosFiltrados.length === 0 && (
          <div className="admin-orders-no-results">
            No hay pedidos que coincidan con los filtros.
          </div>
        )}

        {!loading && pedidosFiltrados.length > 0 && (
          <div className="admin-orders-pagination">
            <button
              type="button"
              disabled={paginaPedidosSegura === 1}
              onClick={() =>
                setPaginaPedidos(Math.max(1, paginaPedidosSegura - 1))
              }
            >
              Anterior
            </button>

            <span>
              Página {paginaPedidosSegura} de {totalPaginasPedidos}
            </span>

            <button
              type="button"
              disabled={paginaPedidosSegura === totalPaginasPedidos}
              onClick={() =>
                setPaginaPedidos(
                  Math.min(totalPaginasPedidos, paginaPedidosSegura + 1)
                )
              }
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}

export default AdminOrders
