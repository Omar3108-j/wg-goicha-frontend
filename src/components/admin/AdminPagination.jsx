const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis-end", totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis-start",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ]
}

/* Admin pagination unified V1 */
function AdminPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="admin-pagination-unified" aria-label="Paginación">
      <button
        type="button"
        className="admin-pagination-unified__nav"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span aria-hidden="true">←</span>
        <span className="admin-pagination-unified__nav-label">Anterior</span>
      </button>

      <div className="admin-pagination-unified__pages">
        {getVisiblePages(currentPage, totalPages).map((page) =>
          typeof page === "number" ? (
            <button
              type="button"
              key={page}
              className={`admin-pagination-unified__page ${
                page === currentPage ? "is-active" : ""
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Página ${page}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span
              className="admin-pagination-unified__ellipsis"
              key={page}
              aria-hidden="true"
            >
              …
            </span>
          )
        )}
      </div>

      <button
        type="button"
        className="admin-pagination-unified__nav"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="admin-pagination-unified__nav-label">Siguiente</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}

export default AdminPagination
