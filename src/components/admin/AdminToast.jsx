import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react"

const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

/* Premium admin notifications V1 */
function AdminToast({ notification, onClose }) {
  if (!notification) return null

  const Icon = toastIcons[notification.type] || Info

  return (
    <div
      className={`admin-toast admin-toast--${notification.type || "info"}`}
      role="status"
      aria-live="polite"
    >
      <span className="admin-toast__icon">
        <Icon size={20} strokeWidth={2.4} />
      </span>

      <div className="admin-toast__content">
        {notification.title && <strong>{notification.title}</strong>}
        <p>{notification.message}</p>
      </div>

      <button
        type="button"
        className="admin-toast__close"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        <X size={17} />
      </button>

      <span className="admin-toast__progress" />
    </div>
  )
}

export default AdminToast
