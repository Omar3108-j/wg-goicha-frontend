import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    usuario: "",
    password: "",
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.usuario === "admin" && form.password === "123456") {
      localStorage.setItem("adminAuth", "true")
      navigate("/admin/productos")
    } else {
      alert("Credenciales incorrectas")
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
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin