import { useEffect, useState } from "react"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"
import { API_URL } from "../../config/api"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"

function AdminDashboard() {
  const [stats, setStats] = useState({
    productos: 0,
    pedidos: 0,
    cotizaciones: 0,
  })
  const [ventasMensuales, setVentasMensuales] = useState([])
  const [estadosPedidos, setEstadosPedidos] = useState([])

  const COLORS = ["#10b981", "#7c3aed", "#ef4444"]

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const [
          productosRes,
          pedidosRes,
          cotizacionesRes,
          ventasRes,
          estadosRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/api/productos`),
          axios.get(`${API_URL}/api/pedidos`),
          axios.get(`${API_URL}/api/cotizaciones`),
          axios.get(`${API_URL}/api/dashboard/ventas-mensuales`),
          axios.get(`${API_URL}/api/dashboard/estado-pedidos`),
        ])

        /* Dashboard safe API data V1 */
        const productos = Array.isArray(productosRes.data) ? productosRes.data : []
        const pedidos = Array.isArray(pedidosRes.data) ? pedidosRes.data : []
        const cotizaciones = Array.isArray(cotizacionesRes.data) ? cotizacionesRes.data : []
        const ventas = Array.isArray(ventasRes.data) ? ventasRes.data : []
        const estados = Array.isArray(estadosRes.data) ? estadosRes.data : []

        setStats({
          productos: productos.length,
          pedidos: pedidos.length,
          cotizaciones: cotizaciones.length,
        })
        setVentasMensuales(ventas)
        setEstadosPedidos(estados)
      } catch (error) {
        console.error("Error cargando estadísticas:", error)
        setVentasMensuales([])
        setEstadosPedidos([])
      }
    }

    cargarStats()
  }, [])

  return (
    <AdminLayout>
      <section className="admin-dashboard-premium">
        <div className="admin-dashboard-hero">
          <div>
            <p className="admin-badge">Dashboard comercial</p>
            <h1>Centro de control W&G</h1>
            <span>
              Gestiona productos, cotizaciones y futuras solicitudes comerciales desde un solo panel.
            </span>
          </div>

          <div className="admin-dashboard-status">
            <span>Sistema activo</span>
            <strong>Online</strong>
          </div>
        </div>

        <div className="admin-metric-grid">
          <div className="admin-metric-card metric-blue">
            <span>Total productos</span>
            <strong>{stats.productos}</strong>
            <p>Productos activos en catálogo</p>
          </div>

          <div className="admin-metric-card metric-green">
            <span>Cotizaciones</span>
            <strong>{stats.cotizaciones}</strong>
            <p>Pendientes por atender</p>
          </div>

          <div className="admin-metric-card metric-purple">
            <span>Pedidos</span>
            <strong>{stats.pedidos}</strong>
            <p>Solicitudes registradas</p>
          </div>

          <div className="admin-metric-card metric-orange">
            <span>Estado web</span>
            <strong>Activo</strong>
            <p>Catálogo comercial operativo</p>
          </div>
        </div>

        <div className="dashboard-metrics-grid">
          <div className="dashboard-chart-card">
            <div className="dashboard-card-header">
              <div>
                <span>MÉTRICAS COMERCIALES</span>
                <h2>Ventas mensuales</h2>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={ventasMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#ff5b2e"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-pie-card">
            <div className="dashboard-card-header">
              <div>
                <span>ESTADO PEDIDOS</span>
                <h2>Resumen</h2>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadosPedidos}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  {estadosPedidos.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name || index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}

export default AdminDashboard
