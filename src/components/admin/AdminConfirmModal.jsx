import { AlertTriangle, X } from "lucide-react"

/* Premium confirm modal V1 */
function AdminConfirmModal({ confirmation, onCancel, onConfirm }) {
  if (!confirmation) return null

  return (
    <div
      className="admin-confirm-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div
        className="admin-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-description"
      >
        <button
          type="button"
          className="admin-confirm-modal__close"
          onClick={onCancel}
          aria-label="Cerrar confirmación"
        >
          <X size={19} />
        </button>

        <span className="admin-confirm-modal__icon">
          <AlertTriangle size={26} strokeWidth={2.2} />
        </span>

        <div className="admin-confirm-modal__copy">
          <p>CONFIRMACIÓN REQUERIDA</p>
          <h2 id="admin-confirm-title">{confirmation.title}</h2>
          <span id="admin-confirm-description">
            {confirmation.message}
          </span>
        </div>

        <div className="admin-confirm-modal__actions">
          <button
            type="button"
            className="admin-confirm-modal__cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="admin-confirm-modal__confirm"
            onClick={onConfirm}
          >
            {confirmation.confirmLabel || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminConfirmModal
