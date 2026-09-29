import { useState } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { clearAdminSession, getAdminUser } from "../../utils/adminSession"

function AdminLayout({ children }) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoErrorUrls, setLogoErrorUrls] = useState([])
  const adminUser = getAdminUser()
  const empresa = adminUser?.empresa
  const empresaNombre = empresa?.nombreComercial || "Panel administrador"
  const empresaCodigo = empresa?.codigo || ""
  const logoCandidates = {
    WG: ["/logo-dark.png"],
    GI: ["/logo-gi-dark.png"],
  }[empresaCodigo] || []
  const logoActual = logoCandidates.find((logoUrl) => !logoErrorUrls.includes(logoUrl))
  const mostrarLogo = Boolean(logoActual)

  const cerrarSidebar = () => setSidebarOpen(false)

  const cerrarSesion = () => {
    clearAdminSession()
    navigate("/admin/login")
  }

  const obtenerInicialesEmpresa = () => {
    const fuente = empresaNombre || empresaCodigo || "Admin"
    return fuente
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join("")
      .toUpperCase()
  }

  const registrarErrorLogo = (logoUrl) => {
    setLogoErrorUrls((logosFallidos) =>
      logosFallidos.includes(logoUrl)
        ? logosFallidos
        : [...logosFallidos, logoUrl]
    )
  }

  return (
    <div className={`admin-shell${sidebarOpen ? " sidebar-open" : ""}`}>
      {/* Responsive admin drawer V1 */}
      <header className="admin-mobile-header">
        <Link
          to="/admin/dashboard"
          className="admin-mobile-header__brand"
          onClick={cerrarSidebar}
        >
          <span className="admin-mobile-header__logo">
            {mostrarLogo ? (
              <img
                src={logoActual}
                alt={empresaNombre}
                onError={() => registrarErrorLogo(logoActual)}
              />
            ) : (
              <span className="admin-company-logo-fallback">
                {obtenerInicialesEmpresa()}
              </span>
            )}
          </span>
        </Link>

        <button
          type="button"
          className={`admin-mobile-header__toggle${sidebarOpen ? " open" : ""}`}
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={sidebarOpen}
          aria-controls="admin-sidebar"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={cerrarSidebar}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`admin-sidebar${sidebarOpen ? " open" : ""}`}
      >
        <div>
          <div className="admin-sidebar__brand">
            <div className="admin-sidebar__logo">
              {mostrarLogo ? (
                <img
                  src={logoActual}
                  alt={empresaNombre}
                  onError={() => registrarErrorLogo(logoActual)}
                />
              ) : (
                <span className="admin-company-logo-fallback">
                  {obtenerInicialesEmpresa()}
                </span>
              )}
            </div>
          </div>

          <nav className="admin-sidebar__nav">
            <NavLink to="/admin/dashboard" onClick={cerrarSidebar}>
  <span className="admin-nav-icon">🏠</span>
  Dashboard
</NavLink>

<NavLink to="/admin/productos" onClick={cerrarSidebar}>
  <span className="admin-nav-icon">📦</span>
  Productos
</NavLink>

<NavLink to="/admin/categorias" onClick={cerrarSidebar}>
  <span className="admin-nav-icon">🗂️</span>
  Categorías
</NavLink>

<NavLink to="/admin/pedidos" onClick={cerrarSidebar}>
  <span className="admin-nav-icon">🧾</span>
  Pedidos
</NavLink>

<NavLink to="/admin/cotizaciones" onClick={cerrarSidebar}>
  <span className="admin-nav-icon">💎</span>
  Cotizaciones
</NavLink>

<NavLink to="/admin/configuracion/empresa" onClick={cerrarSidebar}>
  <span className="admin-nav-icon">⚙️</span>
  Mi empresa
</NavLink>
          </nav>
        </div>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__store" onClick={cerrarSidebar}>
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
