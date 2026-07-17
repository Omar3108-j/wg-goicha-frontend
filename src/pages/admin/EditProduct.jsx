import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config/api"
import AdminModuleFormHeader from "../../components/admin/AdminModuleFormHeader"
import { useAdminNotifications } from "../../components/admin/useAdminNotifications"
import { compressProductImage, isImageUploadTooLarge } from "../../utils/imageCompression"

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useAdminNotifications()

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    marca: "",
    precio: "",
    categoriaId: "",
    imagenActual: "",
  })

  const [categorias, setCategorias] = useState([])
  const [imagenNueva, setImagenNueva] = useState(null)
  const [loading, setLoading] = useState(false)
  const [variantes, setVariantes] = useState([])

  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías:", err))

    axios.get(`${API_URL}/api/productos/${id}`)
      .then((res) => {
        const prod = res.data
        setForm({
          nombre: prod.nombre || "",
          descripcion: prod.descripcion || "",
          tipo: prod.tipo || "",
          marca: prod.marca || "",
          precio: prod.precio ?? "",
          categoriaId: prod.categoria?.id || "",
          imagenActual: prod.imagen || "",
        })
      })
      .catch((err) => console.error("Error cargando producto:", err))

    axios.get(`${API_URL}/api/variantes/producto/${id}`)
      .then((res) => setVariantes(res.data))
      .catch((err) => console.error("Error cargando variantes:", err))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setImagenNueva(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = form.imagenActual
      let imageUploadWarning = ""

      if (imagenNueva) {
        const imageToUpload = await compressProductImage(imagenNueva)

        if (isImageUploadTooLarge(imageToUpload)) {
          showToast("La imagen es muy pesada. Usa una imagen menor a 1 MB.", "warning")
          return
        }

        const formData = new FormData()
        formData.append("file", imageToUpload)

        try {
          const uploadRes = await axios.post(`${API_URL}/api/upload`, formData)
          imageUrl = uploadRes.data
        } catch (uploadError) {
          console.error("Error al subir nueva imagen del producto:", uploadError)
          imageUploadWarning = form.imagenActual
            ? "Producto actualizado. No se pudo cambiar la imagen, se mantuvo la anterior."
            : "Producto actualizado sin imagen. Puedes intentar subirla luego."
        }
      }

      await axios.put(`${API_URL}/api/productos/${id}`, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        tipo: form.tipo,
        marca: form.marca,
        precio: variantes.length > 0 ? 0 : Number(form.precio || 0),
        imagen: imageUrl,
        categoria: { id: form.categoriaId },
      })

      showToast(
        imageUploadWarning || "Producto actualizado correctamente",
        imageUploadWarning ? "warning" : "success"
      )
      navigate("/admin/productos")
    } catch (error) {
      console.error("Error actualizando producto:", error)
      const isTooLarge = error?.response?.status === 413
      showToast(
        isTooLarge ? "La imagen es demasiado pesada para subirla." : "Error al actualizar producto",
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
          description="Actualiza la información del producto seleccionado."
          editing
          eyebrow="Productos"
          onBack={() => navigate("/admin/productos")}
          title="Editando producto"
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
              {variantes.length > 0 ? (
                <div className="admin-price-disabled">
                  Precio por variante
                </div>
              ) : (
                <input
                  type="number"
                  name="precio"
                  placeholder="Ej: 25.90"
                  value={form.precio}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              )}
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
              <label>Imagen actual</label>
              <div className="admin-preview-image">
                <img src={form.imagenActual} alt={form.nombre} />
              </div>
              <label style={{ marginTop: "10px" }}>Cambiar imagen</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="admin-form-actions">
            <Link to="/admin/productos" className="admin-cancel-button">
              Cancelar
            </Link>
            <button className="save-button" type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar producto"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditProduct
