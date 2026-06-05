import { NavLink, Link, useNavigate } from "react-router-dom"
import { API_URL } from "../../config/api"

function AdminLayout({ children }) {
  const navigate = useNavigate()

  const cerrarSesion = () => {
    localStorage.removeItem("adminAuth")
    navigate("/admin/login")
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-sidebar__brand">
            <div className="admin-sidebar__logo">WG</div>

            <div className="admin-sidebar__brand-text">
              <strong>W&G</strong>
              <span>CORPORACIÓN GOICHA</span>
            </div>
          </div>

          <nav className="admin-sidebar__nav">
            <NavLink to="/admin/dashboard">
  <span className="admin-nav-icon">🏠</span>
  Dashboard
</NavLink>

<NavLink to="/admin/productos">
  <span className="admin-nav-icon">📦</span>
  Productos
</NavLink>

<NavLink to="/admin/categorias">
  <span className="admin-nav-icon">🗂️</span>
  Categorías
</NavLink>

<NavLink to="/admin/pedidos">
  <span className="admin-nav-icon">🧾</span>
  Pedidos
</NavLink>

<NavLink to="/admin/cotizaciones">
  <span className="admin-nav-icon">💎</span>
  Cotizaciones
</NavLink>
          </nav>
        </div>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__store">
            <span>◥</span>
            Ver página web
          </Link>

          <button onClick={cerrarSesion} className="admin-sidebar__logout">
            <span>⏻</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  )
}

export default AdminLayout