import { useEffect, useState } from "react"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"
import { API_URL } from "../../config/api"
import { useAdminNotifications } from "../../components/admin/useAdminNotifications"
import { loadCurrentAdminUser } from "../../utils/adminSession"

const empresaVacia = {
  codigo: "",
  razonSocial: "",
  nombreComercial: "",
  ruc: "",
  direccion: "",
  telefono: "",
  whatsapp: "",
  correo: "",
  sitioWeb: "",
  logoUrl: "",
  monedaPredeterminada: "PEN",
  igvPorcentaje: 18,
  validezDias: 7,
  datosBancarios: "",
}

function AdminCompanySettings() {
  const { showToast } = useAdminNotifications()
  const [empresa, setEmpresa] = useState(empresaVacia)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    const cargarEmpresa = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/mi-empresa`)
        setEmpresa({ ...empresaVacia, ...data })
      } catch (error) {
        console.error("Error cargando configuración empresarial:", error)
        showToast("No se pudo cargar la configuración de empresa", "error")
      } finally {
        setLoading(false)
      }
    }

    cargarEmpresa()
  }, [showToast])

  const actualizarCampo = (campo, valor) => {
    setEmpresa((prev) => ({ ...prev, [campo]: valor }))
  }

  const subirLogo = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploadingLogo(true)
      const { data } = await axios.post(`${API_URL}/api/upload`, formData)
      actualizarCampo("logoUrl", data)
      showToast("Logo cargado correctamente", "success")
    } catch (error) {
      console.error("Error cargando logo:", error)
      showToast("No se pudo cargar el logo", "error")
    } finally {
      setUploadingLogo(false)
      event.target.value = ""
    }
  }

  const guardarConfiguracion = async (event) => {
    event.preventDefault()

    if (!empresa.nombreComercial?.trim()) {
      showToast("El nombre comercial es obligatorio", "warning")
      return
    }

    try {
      setSaving(true)
      const payload = {
        razonSocial: empresa.razonSocial,
        nombreComercial: empresa.nombreComercial,
        ruc: empresa.ruc,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        whatsapp: empresa.whatsapp,
        correo: empresa.correo,
        sitioWeb: empresa.sitioWeb,
        logoUrl: empresa.logoUrl,
        monedaPredeterminada: empresa.monedaPredeterminada,
        igvPorcentaje: Number(empresa.igvPorcentaje || 0),
        validezDias: Number(empresa.validezDias || 0),
        datosBancarios: empresa.datosBancarios,
      }

      const { data } = await axios.put(`${API_URL}/api/mi-empresa`, payload)
      setEmpresa({ ...empresaVacia, ...data })
      await loadCurrentAdminUser()
      showToast("Configuración actualizada correctamente", "success")
    } catch (error) {
      console.error("Error guardando configuración empresarial:", error)
      const mensaje =
        error.response?.status === 400
          ? "Revisa los datos ingresados antes de guardar"
          : "No se pudo actualizar la configuración"
      showToast(mensaje, "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <section className="admin-company-settings">
        <div className="admin-company-settings__hero">
          <div>
            <p className="admin-badge">Configuración</p>
            <h1>Mi empresa</h1>
            <p>
              Actualiza los datos comerciales que se usarán en nuevas
              cotizaciones y PDFs.
            </p>
          </div>

          <div className="admin-company-settings__code">
            <small>Código</small>
            <strong>{empresa.codigo || "—"}</strong>
          </div>
        </div>

        {loading ? (
          <p className="admin-empty">Cargando configuración...</p>
        ) : (
          <form className="admin-company-card" onSubmit={guardarConfiguracion}>
            <div className="admin-company-section">
              <div className="admin-company-section__heading">
                <h2>Datos de la empresa</h2>
                <p>Información fiscal y comercial visible en nuevas cotizaciones.</p>
              </div>

              <div className="admin-company-grid">
                <label>
                  <span>Razón social</span>
                  <input
                    value={empresa.razonSocial || ""}
                    onChange={(e) => actualizarCampo("razonSocial", e.target.value)}
                    placeholder="Razón social de la empresa"
                  />
                </label>

                <label>
                  <span>Nombre comercial *</span>
                  <input
                    value={empresa.nombreComercial || ""}
                    onChange={(e) => actualizarCampo("nombreComercial", e.target.value)}
                    placeholder="Nombre visible de la empresa"
                    required
                  />
                </label>

                <label>
                  <span>RUC</span>
                  <input
                    value={empresa.ruc || ""}
                    onChange={(e) => actualizarCampo("ruc", e.target.value)}
                    placeholder="RUC de la empresa"
                  />
                </label>
              </div>

              <label className="admin-company-field-full">
                <span>Dirección</span>
                <textarea
                  value={empresa.direccion || ""}
                  onChange={(e) => actualizarCampo("direccion", e.target.value)}
                  placeholder="Dirección comercial o fiscal"
                  rows="3"
                />
              </label>
            </div>

            <div className="admin-company-section">
              <div className="admin-company-section__heading">
                <h2>Contacto</h2>
                <p>Canales de atención que se usarán como referencia comercial.</p>
              </div>

              <div className="admin-company-grid">
                <label>
                  <span>Teléfono</span>
                  <input
                    value={empresa.telefono || ""}
                    onChange={(e) => actualizarCampo("telefono", e.target.value)}
                    placeholder="Teléfonos de contacto"
                  />
                </label>

                <label>
                  <span>WhatsApp</span>
                  <input
                    value={empresa.whatsapp || ""}
                    onChange={(e) => actualizarCampo("whatsapp", e.target.value)}
                    placeholder="51999999999"
                  />
                </label>

                <label>
                  <span>Correo</span>
                  <input
                    type="email"
                    value={empresa.correo || ""}
                    onChange={(e) => actualizarCampo("correo", e.target.value)}
                    placeholder="correo@empresa.com"
                  />
                </label>

                <label>
                  <span>Sitio web</span>
                  <input
                    value={empresa.sitioWeb || ""}
                    onChange={(e) => actualizarCampo("sitioWeb", e.target.value)}
                    placeholder="https://www.empresa.com"
                  />
                </label>
              </div>
            </div>

            <div className="admin-company-section">
              <div className="admin-company-section__heading">
                <h2>Configuración de cotizaciones</h2>
                <p>Valores predeterminados para nuevas cotizaciones.</p>
              </div>

              <div className="admin-company-grid">
                <label>
                  <span>Moneda predeterminada</span>
                  <select
                    value={empresa.monedaPredeterminada || "PEN"}
                    onChange={(e) => actualizarCampo("monedaPredeterminada", e.target.value)}
                  >
                    <option value="PEN">Soles (PEN)</option>
                    <option value="USD">Dólares (USD)</option>
                  </select>
                </label>

                <label>
                  <span>IGV %</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={empresa.igvPorcentaje ?? 18}
                    onChange={(e) => actualizarCampo("igvPorcentaje", e.target.value)}
                  />
                </label>

                <label>
                  <span>Validez de cotización</span>
                  <input
                    type="number"
                    min="0"
                    max="3650"
                    value={empresa.validezDias ?? 7}
                    onChange={(e) => actualizarCampo("validezDias", e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="admin-company-section">
              <div className="admin-company-section__heading">
                <h2>Datos bancarios</h2>
                <p>Cuentas, CCI y referencias que aparecerán en nuevas cotizaciones.</p>
              </div>

              <label className="admin-company-field-full">
                <span>Datos bancarios</span>
                <textarea
                  value={empresa.datosBancarios || ""}
                  onChange={(e) => actualizarCampo("datosBancarios", e.target.value)}
                  placeholder="Cuentas, CCI y referencias bancarias"
                  rows="5"
                />
              </label>
            </div>

            <div className="admin-company-section">
              <div className="admin-company-section__heading">
                <h2>Identidad visual</h2>
                <p>Logo usado en nuevas cotizaciones y documentos PDF.</p>
              </div>

              <div className="admin-company-logo">
                <div>
                  <span>Logo actual</span>
                  <p>
                    Las nuevas cotizaciones copiarán esta URL al snapshot. Las
                    cotizaciones anteriores conservarán su logo histórico.
                  </p>
                </div>

                <div className="admin-company-logo__preview">
                  {empresa.logoUrl ? (
                    <img src={empresa.logoUrl} alt="Logo de empresa" />
                  ) : (
                    <span>Sin logo configurado</span>
                  )}
                </div>

                <label className="admin-company-logo__upload">
                  {uploadingLogo ? "Cargando logo..." : "Cambiar logo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={subirLogo}
                    disabled={uploadingLogo}
                  />
                </label>

                <input
                  value={empresa.logoUrl || ""}
                  onChange={(e) => actualizarCampo("logoUrl", e.target.value)}
                  placeholder="URL del logo"
                />
              </div>
            </div>

            <button className="admin-company-save" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        )}
      </section>
    </AdminLayout>
  )
}

export default AdminCompanySettings

