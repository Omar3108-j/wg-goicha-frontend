import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
  /* Admin session per browser session V1 */
  localStorage.removeItem("adminAuth")
  const isAuth = sessionStorage.getItem("adminAuth") === "true"

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
