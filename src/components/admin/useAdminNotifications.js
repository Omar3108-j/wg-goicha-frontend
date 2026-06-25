import { useContext } from "react"
import { AdminNotificationsContext } from "./AdminNotificationsContext"

export function useAdminNotifications() {
  const context = useContext(AdminNotificationsContext)

  if (!context) {
    throw new Error(
      "useAdminNotifications debe usarse dentro de AdminNotificationsProvider"
    )
  }

  return context
}
