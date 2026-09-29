import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginAdmin } from "../../utils/adminSession"

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    usuario: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await loginAdmin({
        username: form.usuario,
        password: form.password,
      })
      navigate("/admin/productos")
    } catch (error) {
      console.error("Error iniciando sesión:", error)
      setError("Usuario o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-card admin-login-card">
        <div className="admin-header">
          <p className="admin-badge">Acceso privado</p>
          <h1>Panel administrador</h1>
          <span>Ingresa tus credenciales para administrar productos.</span>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              name="usuario"
              placeholder="admin"
              value={form.usuario}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="save-button" type="submit">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {error && <p className="admin-login-error">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
