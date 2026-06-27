function AdminModuleFormHeader({
  backLabel,
  description,
  editing = false,
  eyebrow,
  onBack,
  title,
}) {
  return (
    <div className="admin-module-form-header">
      <button
        type="button"
        className="admin-module-form-header__back"
        onClick={onBack}
      >
        ← {backLabel}
      </button>

      <div className="admin-module-form-header__content">
        <p>{eyebrow}</p>
        <div className="admin-module-form-header__title">
          <h1>{title}</h1>
          {editing && <span>Editando</span>}
        </div>
        <small>{description}</small>
      </div>
    </div>
  )
}

export default AdminModuleFormHeader
