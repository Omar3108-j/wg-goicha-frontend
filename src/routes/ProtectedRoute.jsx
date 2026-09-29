import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import {
  clearAdminSession,
  getAdminToken,
  loadCurrentAdminUser,
} from "../utils/adminSession"

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState(() =>
    getAdminToken() ? "checking" : "guest"
  )

  useEffect(() => {
    let activo = true

    const validarSesion = async () => {
      if (!getAdminToken()) {
        clearAdminSession()
        if (activo) setStatus("guest")
        return
      }

      try {
        await loadCurrentAdminUser()
        if (activo) setStatus("authenticated")
      } catch (error) {
        console.error("Sesión admin inválida:", error)
        clearAdminSession()
        if (activo) setStatus("guest")
      }
    }

    validarSesion()

    return () => {
      activo = false
    }
  }, [])

  if (status === "checking") {
    return <div className="admin-auth-loading">Validando sesión...</div>
  }

  if (status !== "authenticated") {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
