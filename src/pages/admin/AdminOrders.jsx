import { useEffect, useState } from "react"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"

function AdminOrders() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  const cargarPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/pedidos")
      setPedidos(res.data)
    } catch (error) {
      console.error("Error cargando pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  const cambiarEstado = async (id, estado) => {
    try {
      await axios.put(`http://localhost:8080/api/pedidos/${id}/estado?estado=${estado}`)
      cargarPedidos()
    } catch (error) {
      console.error("Error actualizando estado:", error)
      alert("No se pudo actualizar el estado")
    }
  }

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

        <div className="admin-orders-list">
          {pedidos.map((pedido) => (
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
  href={`http://localhost:8080/api/pedidos/${pedido.id}/pdf`}
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
      </section>
    </AdminLayout>
  )
}

export default AdminOrders