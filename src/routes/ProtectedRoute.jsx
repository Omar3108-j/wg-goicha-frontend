import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("adminAuth") === "true"

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute