import { useCallback, useEffect, useRef, useState } from "react"
import AdminConfirmModal from "./AdminConfirmModal"
import AdminToast from "./AdminToast"
import { AdminNotificationsContext } from "./AdminNotificationsContext"
import "../../styles/admin-notifications.css"

const TOAST_DURATION = 2800

/* Premium admin notifications V1 */
export function AdminNotificationsProvider({ children }) {
  const [notification, setNotification] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const toastTimer = useRef(null)
  const confirmationResolver = useRef(null)

  const closeToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setNotification(null)
  }, [])

  const showToast = useCallback((message, type = "info", title = "") => {
    if (toastTimer.current) clearTimeout(toastTimer.current)

    setNotification({
      id: Date.now(),
      message,
      type,
      title,
    })

    toastTimer.current = setTimeout(() => {
      setNotification(null)
    }, TOAST_DURATION)
  }, [])

  const requestConfirm = useCallback((options) => {
    if (confirmationResolver.current) {
      confirmationResolver.current(false)
    }

    setConfirmation({
      title: options.title,
      message: options.message || "Esta acción no se puede deshacer.",
      confirmLabel: options.confirmLabel || "Confirmar",
    })

    return new Promise((resolve) => {
      confirmationResolver.current = resolve
    })
  }, [])

  const resolveConfirmation = useCallback((confirmed) => {
    confirmationResolver.current?.(confirmed)
    confirmationResolver.current = null
    setConfirmation(null)
  }, [])

  useEffect(() => {
    if (!confirmation) return undefined

    const handleKeyDown = (event) => {
      if (event.key === "Escape") resolveConfirmation(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [confirmation, resolveConfirmation])

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      confirmationResolver.current?.(false)
    },
    []
  )

  return (
    <AdminNotificationsContext.Provider value={{ showToast, requestConfirm }}>
      {children}
      <div className="admin-toast-viewport">
        <AdminToast notification={notification} onClose={closeToast} />
      </div>
      <AdminConfirmModal
        confirmation={confirmation}
        onCancel={() => resolveConfirmation(false)}
        onConfirm={() => resolveConfirmation(true)}
      />
    </AdminNotificationsContext.Provider>
  )
}
