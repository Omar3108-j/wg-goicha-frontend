import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../config/api"
import AdminModuleFormHeader from "../../components/admin/AdminModuleFormHeader"
import { useAdminNotifications } from "../../components/admin/useAdminNotifications"
import { compressProductImage, isImageUploadTooLarge } from "../../utils/imageCompression"

function AddProduct() {
  const { showToast } = useAdminNotifications()
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    marca: "",
    precio: "",
    categoriaId: "",
  })

  const [categorias, setCategorias] = useState([])
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${API_URL}/api/categorias`)
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías:", err))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImagen(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ""

      if (imagen) {
        const imageToUpload = await compressProductImage(imagen)

        if (isImageUploadTooLarge(imageToUpload)) {
          showToast("La imagen es muy pesada. Usa una imagen menor a 1 MB.", "warning")
          return
        }

        const formData = new FormData()
        formData.append("file", imageToUpload)
        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData)
        imageUrl = uploadRes.data
      }

      await axios.post(`${API_URL}/api/productos`, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        tipo: form.tipo,
        marca: form.marca,
        precio: Number(form.precio || 0),
        imagen: imageUrl,
        categoria: { id: form.categoriaId },
      })

      showToast("Producto creado correctamente", "success")
      setForm({ nombre: "", descripcion: "", tipo: "", marca: "", precio: "", categoriaId: "" })
      setImagen(null)
      setPreview(null)
      navigate("/admin/productos")
    } catch (error) {
      console.error("Error al crear producto:", error)
      const isTooLarge = error?.response?.status === 413
      showToast(
        isTooLarge ? "La imagen es demasiado pesada para subirla." : "Error al crear producto",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-card admin-edit-card">

        <AdminModuleFormHeader
          backLabel="Volver a productos"
          description="Registra un nuevo producto para el catálogo de W&G."
          eyebrow="Productos"
          onBack={() => navigate("/admin/productos")}
          title="Nuevo producto"
        />

        <form className="admin-form" onSubmit={handleSubmit}>

          {/* Fila 1: Nombre + Marca */}
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del producto</label>
              <input
                name="nombre"
                placeholder="Ej: Tubería PVC 1/2"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input
                name="marca"
                placeholder="Ej: Pavco, Nicoll, Tigre"
                value={form.marca}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Fila 2: Tipo + Precio + Categoría */}
          <div className="form-grid form-grid--3">
            <div className="form-group">
              <label>Tipo / Uso</label>
              <input
                name="tipo"
                placeholder="Ej: Agua fría"
                value={form.tipo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="precio"
                placeholder="Ej: 25.90"
                value={form.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 3: Descripción + Imagen lado a lado */}
          <div className="form-grid form-grid--desc-img">
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                placeholder="Descripción del producto..."
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Imagen del producto</label>
              {preview ? (
                <div className="admin-preview-image">
                  <img src={preview} alt="Vista previa" />
                </div>
              ) : (
                <div className="admin-preview-image admin-preview-placeholder">
                  <span>Sin imagen</span>
                </div>
              )}
              <label style={{ marginTop: "10px" }}>Seleccionar archivo</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-cancel-button"
              onClick={() => navigate("/admin/productos")}
            >
              ← Volver
            </button>
            <button className="save-button" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar producto"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddProduct
