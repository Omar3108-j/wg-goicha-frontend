import { useEffect, useRef, useState } from "react"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"
import AdminModuleFormHeader from "../../components/admin/AdminModuleFormHeader"
import AdminPagination from "../../components/admin/AdminPagination"
import { API_URL } from "../../config/api"
import { useAdminNotifications } from "../../components/admin/useAdminNotifications"
import {
  ChevronDown,
  FileText,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react"

/* Cotizaciones draft V1 */
const QUOTATION_DRAFT_KEY = "wg-admin-quotation-draft"

const clienteVacio = {
  cliente: "",
  ruc: "",
  telefono: "",
  correo: "",
  direccion: "",
  observaciones: "",
}

/* Quotation PDF display options V1 */
const opcionesPdfVacias = {
  moneda: "PEN",
  mostrarDetalleIgvPdf: true,
}

const itemVacio = {
  descripcion: "",
  cantidad: 1,
  precioUnitario: "",
}

/* Clean new quotation form V1 */
const crearItemVacio = () => ({ ...itemVacio })

const obtenerSimboloMoneda = (moneda) => (moneda === "USD" ? "US$" : "S/")

/* Catalog quotation items V1 */
const normalizarTextoBusqueda = (valor) =>
  String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const leerBorradorCotizacion = () => {
  try {
    const borrador = localStorage.getItem(QUOTATION_DRAFT_KEY)
    return borrador ? JSON.parse(borrador) : null
  } catch (error) {
    console.error("Error recuperando borrador de cotización:", error)
    localStorage.removeItem(QUOTATION_DRAFT_KEY)
    return null
  }
}

function AdminQuotations() {
  const { showToast } = useAdminNotifications()
  /* Excel-like quotation rows V1 */
  const itemInputRefs = useRef({
    descripcion: [],
    cantidad: [],
    precioUnitario: [],
  })
  const pendingItemFocus = useRef(null)
  /* Scroll to quotation form on edit V1 */
  const quotationFormRef = useRef(null)

  const [borradorInicial] = useState(leerBorradorCotizacion)
  const [cotizaciones, setCotizaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [cotizacionEditandoId, setCotizacionEditandoId] = useState(null)
  const [filtroCotizacion, setFiltroCotizacion] = useState("")
  /* Quotation filters V2 */
  const [filtroEstado, setFiltroEstado] = useState("TODAS")
  const [filtroFecha, setFiltroFecha] = useState("TODAS")
  /* Quotation pagination V2 */
  const [cotizacionesPorPagina, setCotizacionesPorPagina] = useState(10)
  const [paginaCotizaciones, setPaginaCotizaciones] = useState(1)
  const [productosCatalogo, setProductosCatalogo] = useState([])
  const [sugerencias, setSugerencias] = useState({})
  const [importOpen, setImportOpen] = useState(false)
  const [textoImportacion, setTextoImportacion] = useState("")
  const [modoDuplicado, setModoDuplicado] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  /* Mobile quotation UX V2 */
  const [itemEliminando, setItemEliminando] = useState(null)
  /* Mobile quotation customer accordion V1 */
  const [customerMoreOpen, setCustomerMoreOpen] = useState(false)
  const [avisoBorrador, setAvisoBorrador] = useState(
    borradorInicial ? "Borrador recuperado" : ""
  )

  const [cliente, setCliente] = useState(() => ({
    ...clienteVacio,
    ...(borradorInicial?.cliente || {}),
  }))

  const [opcionesPdf, setOpcionesPdf] = useState(() => ({
    ...opcionesPdfVacias,
    ...(borradorInicial?.opcionesPdf || {}),
  }))

  const [items, setItems] = useState(() =>
    Array.isArray(borradorInicial?.items) && borradorInicial.items.length
      ? borradorInicial.items
      : [crearItemVacio()]
  )

  const cargarCotizaciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cotizaciones`)
setCotizaciones(Array.isArray(res.data) ? res.data : [])
      setCotizaciones(res.data)
    } catch (error) {
      console.error("Error cargando cotizaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cargarCotizacionesIniciales = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/cotizaciones`)
        setCotizaciones(Array.isArray(res.data) ? res.data : [])
      } catch (error) {
        console.error("Error cargando cotizaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarCotizacionesIniciales()
  }, [])

  useEffect(() => {
    const cargarProductosCatalogo = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos/catalogo`)
        setProductosCatalogo(Array.isArray(res.data) ? res.data : [])
      } catch (error) {
        console.error("Error cargando productos del catálogo:", error)
      }
    }

    cargarProductosCatalogo()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const clienteTieneDatos = Object.values(cliente).some((valor) =>
        String(valor || "").trim()
      )
      const productosTienenDatos = items.some(
        (item) =>
          String(item.descripcion || "").trim() ||
          Number(item.precioUnitario || 0) !== 0 ||
          Number(item.cantidad ?? 1) !== 1
      )

      if (!clienteTieneDatos && !productosTienenDatos) {
        localStorage.removeItem(QUOTATION_DRAFT_KEY)
        return
      }

      localStorage.setItem(
        QUOTATION_DRAFT_KEY,
        JSON.stringify({ cliente, items, opcionesPdf })
      )
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [cliente, items, opcionesPdf])

  useEffect(() => {
    if (!avisoBorrador) return undefined

    const timeoutId = setTimeout(() => setAvisoBorrador(""), 3500)
    return () => clearTimeout(timeoutId)
  }, [avisoBorrador])

  useEffect(() => {
    if (!pendingItemFocus.current) return undefined

    const animationFrame = requestAnimationFrame(() => {
      const { field, index } = pendingItemFocus.current
      itemInputRefs.current[field]?.[index]?.focus()
      pendingItemFocus.current = null
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [items.length])

  const limpiarBorrador = () => {
    localStorage.removeItem(QUOTATION_DRAFT_KEY)
    setCliente({ ...clienteVacio })
    setOpcionesPdf({ ...opcionesPdfVacias })
    setItems([crearItemVacio()])
    setCotizacionEditandoId(null)
    setModoDuplicado(false)
    setAvisoBorrador("Borrador limpiado")
  }

  const handleClienteChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    })
  }

  const handleOpcionesPdfChange = (e) => {
    const { name, type, checked, value } = e.target

    setOpcionesPdf((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const buscarProductosCatalogo = (index, texto) => {
  if (!texto || texto.length < 3) {
    setSugerencias({})
    return
  }

  const textoNormalizado = normalizarTextoBusqueda(texto)
  const sugerenciasCatalogo = productosCatalogo
    .flatMap((producto) => {
      const variantes = Array.isArray(producto.variantesActivas)
        ? producto.variantesActivas
        : []

      if (variantes.length > 0) {
        return variantes.map((variante) => ({
          id: `variante-${variante.id}`,
          nombre: `${producto.nombre} - ${variante.nombre}`,
          precio: variante.precio || producto.precioMinimo || producto.precio || 0,
        }))
      }

      return [
        {
          id: `producto-${producto.id}`,
          nombre: producto.nombre,
          precio: producto.precio || producto.precioMinimo || 0,
        },
      ]
    })
    .filter((producto) =>
      normalizarTextoBusqueda(producto.nombre).includes(textoNormalizado)
    )
    .slice(0, 8)

  setSugerencias({
    [index]: sugerenciasCatalogo,
  })
}

  const handleItemChange = (index, field, value) => {
    const nuevosItems = [...items]
    nuevosItems[index][field] = value
    setItems(nuevosItems)
  }

  const agregarItem = () => {
    setItems((prev) => [...prev, crearItemVacio()])
  }

  /* Excel-like navigation V2 */
  const handleItemNavigation = (event, index, field) => {
    const isEnter = event.key === "Enter"
    const isArrowDown = event.key === "ArrowDown"
    const isArrowUp = event.key === "ArrowUp"

    if (!isEnter && !isArrowDown && !isArrowUp) return

    event.preventDefault()

    if (isArrowUp) {
      if (index > 0) {
        itemInputRefs.current[field]?.[index - 1]?.focus()
      }
      return
    }

    const nextIndex = index + 1

    if (nextIndex < items.length) {
      itemInputRefs.current[field]?.[nextIndex]?.focus()
      return
    }

    if (isEnter) {
      pendingItemFocus.current = { field, index: nextIndex }
      agregarItem()
    }
  }

  const inicioDelDia = (fecha) =>
    new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())

  const cotizacionCoincideFecha = (cot) => {
    if (filtroFecha === "TODAS") return true

    const fechaCotizacion = new Date(cot.fechaCreacion)
    if (Number.isNaN(fechaCotizacion.getTime())) return false

    const hoy = inicioDelDia(new Date())
    const fecha = inicioDelDia(fechaCotizacion)

    if (filtroFecha === "HOY") {
      return fecha.getTime() === hoy.getTime()
    }

    if (filtroFecha === "SEMANA") {
      const inicioSemana = new Date(hoy)
      const diaSemana = (hoy.getDay() + 6) % 7
      inicioSemana.setDate(hoy.getDate() - diaSemana)
      return fecha >= inicioSemana && fecha <= hoy
    }

    if (filtroFecha === "MES") {
      return (
        fecha.getFullYear() === hoy.getFullYear() &&
        fecha.getMonth() === hoy.getMonth()
      )
    }

    return true
  }

  const cotizacionesFiltradas = cotizaciones.filter((cot) => {
    const texto =
      `${cot.codigo || ""} ${cot.cliente || ""} ${cot.ruc || ""} ${cot.telefono || ""}`.toLowerCase()
    const coincideBusqueda = texto.includes(filtroCotizacion.toLowerCase())
    const coincideEstado =
      filtroEstado === "TODAS" ||
      (cot.estado || "GENERADA").toUpperCase() === filtroEstado

    return coincideBusqueda && coincideEstado && cotizacionCoincideFecha(cot)
  })

  const totalCotizaciones = cotizaciones.length
  const totalGeneradas = cotizaciones.filter(
    (cot) => (cot.estado || "GENERADA").toUpperCase() === "GENERADA"
  ).length
  const totalAprobadas = cotizaciones.filter(
    (cot) => (cot.estado || "").toUpperCase() === "APROBADA"
  ).length
  const totalAnuladas = cotizaciones.filter(
    (cot) => (cot.estado || "").toUpperCase() === "ANULADA"
  ).length

  const totalPaginasCotizaciones = Math.max(
    1,
    Math.ceil(cotizacionesFiltradas.length / cotizacionesPorPagina)
  )
  const paginaCotizacionesSegura = Math.min(
    paginaCotizaciones,
    totalPaginasCotizaciones
  )
  const indiceInicialCotizaciones =
    (paginaCotizacionesSegura - 1) * cotizacionesPorPagina
  const cotizacionesPaginadas = cotizacionesFiltradas.slice(
    indiceInicialCotizaciones,
    indiceInicialCotizaciones + cotizacionesPorPagina
  )

  const quitarItem = (index) => {
    if (items.length === 1) {
      setItems([crearItemVacio()])
      setSugerencias({})
      return
    }
    setItems(items.filter((_, i) => i !== index))
  }

  const quitarItemConAnimacion = (index) => {
    const esMobile = window.matchMedia("(max-width: 700px)").matches

    if (!esMobile) {
      quitarItem(index)
      return
    }

    if (items.length === 1 || itemEliminando !== null) return

    setItemEliminando(index)
    window.setTimeout(() => {
      quitarItem(index)
      setItemEliminando(null)
    }, 220)
  }

  const total = items.reduce((acc, item) => {
  return acc + Number(item.cantidad || 0) * Number(item.precioUnitario || 0)
}, 0)

const subtotal = total / 1.18
const igv = total - subtotal
const simboloMoneda = obtenerSimboloMoneda(opcionesPdf.moneda)

const editarCotizacion = (cot) => {
  setMostrarFormulario(true)
  setCotizacionEditandoId(cot.id)
  setModoDuplicado(false)

  setCliente({
    cliente: cot.cliente || "",
    ruc: cot.ruc || "",
    telefono: cot.telefono || "",
    correo: cot.correo || "",
    direccion: cot.direccion || "",
    observaciones: cot.observaciones || "",
  })

  setItems(
    cot.detalles?.length
      ? cot.detalles.map((item) => ({
          descripcion: item.descripcion || "",
          cantidad: item.cantidad || 1,
          precioUnitario: item.precioUnitario || 0,
        }))
      : [
          {
            ...crearItemVacio(),
          },
        ]
  )

  setOpcionesPdf({
    moneda: cot.moneda || "PEN",
    mostrarDetalleIgvPdf: cot.mostrarDetalleIgvPdf !== false,
  })

  showToast("Cotización cargada para edición", "info")

  setTimeout(() => {
    quotationFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, 100)
}

const duplicarCotizacion = (cot) => {
  setMostrarFormulario(true)
  setCotizacionEditandoId(null)
  setModoDuplicado(true)

  setCliente({
    cliente: cot.cliente || "",
    ruc: cot.ruc || "",
    telefono: cot.telefono || "",
    correo: cot.correo || "",
    direccion: cot.direccion || "",
    observaciones: cot.observaciones || "",
  })

  setItems(
    cot.detalles?.length
      ? cot.detalles.map((item) => ({
          descripcion: item.descripcion || "",
          cantidad: item.cantidad || 1,
          precioUnitario: item.precioUnitario || 0,
        }))
      : [
          {
            ...crearItemVacio(),
          },
        ]
  )

  setOpcionesPdf({
    moneda: cot.moneda || "PEN",
    mostrarDetalleIgvPdf: cot.mostrarDetalleIgvPdf !== false,
  })

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

const cancelarEdicion = () => {
  setMostrarFormulario(false)
  setCotizacionEditandoId(null)
  setModoDuplicado(false)

  setCliente({
    cliente: "",
    ruc: "",
    telefono: "",
    correo: "",
    direccion: "",
    observaciones: "",
  })

  setOpcionesPdf({ ...opcionesPdfVacias })

  setItems([
    {
      ...crearItemVacio(),
    },
  ])
}

const nuevaCotizacion = () => {
  localStorage.removeItem(QUOTATION_DRAFT_KEY)
  setCotizacionEditandoId(null)
  setModoDuplicado(false)
  setCliente({ ...clienteVacio })
  setItems([crearItemVacio()])
  setOpcionesPdf({ ...opcionesPdfVacias })
  setSugerencias({})
  setCustomerMoreOpen(false)
  setAvisoBorrador("")
  setMostrarFormulario(true)
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const volverAlListadoCotizaciones = () => {
  if (cotizacionEditandoId || modoDuplicado) {
    cancelarEdicion()
    return
  }

  setMostrarFormulario(false)
}

const procesarImportacion = () => {
  const lineas = textoImportacion
  .split("\n")
  .map((linea) =>
    linea
      .trim()
      .replace(/^[-•*]+/, "")
      .trim()
  )
  .filter(Boolean)
  .filter((linea) => !linea.endsWith(":"))

  if (lineas.length === 0) {
    showToast("Pega al menos una línea de productos", "warning")
    return
  }

  const nuevosItems = lineas.map((linea) => {
    let cantidad = 1
let precioUnitario = 0
let descripcion = linea

const palabrasCantidad = {
  una: 1,
  un: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
}

    if (linea.includes("|")) {
      const partes = linea.split("|").map((p) => p.trim())

      if (partes.length >= 3) {
        cantidad = Number(partes[0]) || 1
        descripcion = partes[1] || ""
        precioUnitario = Number(partes[2]) || 0
      } else if (partes.length === 2) {
        cantidad = Number(partes[0]) || 1
        descripcion = partes[1] || ""
      }
    } else {
      const tokens = linea.split(/\s+/)

      const primero = tokens[0]
      const ultimo = tokens[tokens.length - 1]

      const primeroNormalizado = primero?.toLowerCase()
const primeroEsNumero = !isNaN(Number(primero))
const primeroEsCantidadTexto = palabrasCantidad[primeroNormalizado]
      const ultimoEsNumero = !isNaN(Number(ultimo))

      if (primeroEsNumero && tokens.length > 1) {
  cantidad = Number(primero) || 1
  tokens.shift()
} else if (primeroEsCantidadTexto && tokens.length > 1) {
  cantidad = primeroEsCantidadTexto
  tokens.shift()
}

      const penultimo = tokens[tokens.length - 2] || ""

const pareceMedida =
  penultimo.toLowerCase() === "x" ||
  penultimo.includes("x") ||
  linea.includes(" x ")

const ultimoNumero = Number(ultimo)

const parecePrecio =
  ultimoEsNumero &&
  !pareceMedida &&
  (
    ultimoNumero <= 999 ||
    ultimo.includes(".")
  )

if (parecePrecio && tokens.length > 1) {
  precioUnitario = ultimoNumero || 0
  tokens.pop()
}

      descripcion = tokens.join(" ").trim()
    }

    return {
      descripcion,
      cantidad,
      precioUnitario,
    }
  })

  setItems((prev) => {
    const prevLimpio =
      prev.length === 1 &&
      !prev[0].descripcion &&
      Number(prev[0].precioUnitario || 0) === 0
        ? []
        : prev

    return [...prevLimpio, ...nuevosItems]
  })

  setTextoImportacion("")
  setImportOpen(false)
}

/* Persist quotation status V1 */
const cambiarEstadoCotizacion = async (cot, nuevoEstado) => {
  const estadoAnterior = cot.estado || "GENERADA"

  setCotizaciones((prev) =>
    prev.map((item) =>
      item.id === cot.id ? { ...item, estado: nuevoEstado } : item
    )
  )

  try {
    const res = await axios.patch(
      `${API_URL}/api/cotizaciones/${cot.id}/estado`,
      {
      estado: nuevoEstado,
      }
    )

    setCotizaciones((prev) =>
      prev.map((item) =>
        item.id === cot.id
          ? { ...item, estado: res.data?.estado || nuevoEstado }
          : item
      )
    )
    showToast("Estado de la cotización actualizado", "success")
  } catch (error) {
    console.error("Error actualizando estado:", error)

    setCotizaciones((prev) =>
      prev.map((item) =>
        item.id === cot.id ? { ...item, estado: estadoAnterior } : item
      )
    )

    showToast("No se pudo actualizar el estado", "error")
    throw error
  }
}

const obtenerUrlPdfCotizacion = (cotizacionId) =>
  `${API_URL}/api/cotizaciones/${cotizacionId}/pdf`

const descargarPdfCotizacion = (cotizacionId) => {
  const descarga = document.createElement("iframe")
  descarga.src = obtenerUrlPdfCotizacion(cotizacionId)
  descarga.title = "Descarga de cotización"
  descarga.style.display = "none"
  document.body.appendChild(descarga)

  window.setTimeout(() => descarga.remove(), 60000)
}

/* Quotation WhatsApp message cleanup V1 */
const enviarCotizacion = async (cot) => {
  const codigo =
    cot.codigo || `COT-${String(cot.id).padStart(5, "0")}`
  const mensaje = [ `Hola *${cot.cliente || ""}* 👋`,
    "", `Te compartimos la cotización *${codigo}* preparada por *W&G Corporación Goicha E.I.R.L.*`,
    "", `💰 *Total cotizado:* ${obtenerSimboloMoneda(cot.moneda)} ${Number(cot.total || 0).toFixed(2)}`, "",
    "En el archivo adjunto encontrarás el detalle completo de la cotización.",
    "",
    "Quedamos atentos a cualquier consulta o a tu confirmación para coordinar tu pedido.",
    "", "Saludos cordiales,",
    "*Equipo W&G Corporación Goicha E.I.R.L.*"
  ].join("\n")

  descargarPdfCotizacion(cot.id)
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
  const whatsappWindow = window.open(whatsappUrl, "_blank")

  if (whatsappWindow) {
    whatsappWindow.opener = null
  } else {
    window.setTimeout(() => window.location.assign(whatsappUrl), 300)
  }

  try {
    await cambiarEstadoCotizacion(cot, "ENVIADA")
  } catch (error) {
    console.error("Error enviando cotización:", error)
  }
}

  const guardarCotizacion = async () => {
    const estabaEditando = Boolean(cotizacionEditandoId)

    const itemsValidos = items.filter((item) => item.descripcion.trim())

    if (itemsValidos.length === 0) {
      showToast("Agrega al menos un producto", "warning")
      return
    }

    const data = {
      ...cliente,
      moneda: opcionesPdf.moneda,
      mostrarDetalleIgvPdf: opcionesPdf.mostrarDetalleIgvPdf,
      detalles: itemsValidos.map((item) => ({
        descripcion: item.descripcion,
        /* PDF quantity format V1: se envía como número; el formato visual pertenece al generador PDF. */
        cantidad: Number(item.cantidad || 1),
        precioUnitario: Number(item.precioUnitario || 0),
      })),
    }

    try {
      if (cotizacionEditandoId) {
  await axios.put(
    `${API_URL}/api/cotizaciones/${cotizacionEditandoId}`,
    data
  )
} else {
  await axios.post(`${API_URL}/api/cotizaciones`, data)
}

      showToast(
        estabaEditando
          ? "Cotización actualizada correctamente"
          : "Cotización registrada correctamente",
        "success"
      )

      setCliente({
        cliente: "",
        ruc: "",
        telefono: "",
        correo: "",
        direccion: "",
        observaciones: "",
      })

      setOpcionesPdf({ ...opcionesPdfVacias })

      setItems([
        {
          ...crearItemVacio(),
        },
      ])

      setCotizacionEditandoId(null)
      setModoDuplicado(false)
      setMostrarFormulario(false)
      localStorage.removeItem(QUOTATION_DRAFT_KEY)
      setAvisoBorrador("")

      cargarCotizaciones()
    } catch (error) {
      console.error("Error guardando cotización:", error)
      showToast("No se pudo guardar la cotización", "error")
    }
  }

  return (
    <AdminLayout>
      <section className="admin-dashboard-premium">
        {!mostrarFormulario && (
        <div className="admin-dashboard-hero admin-quotation-hero admin-module-view">
          <div>
            <p className="admin-badge">Cotizaciones</p>
            <h1>Gestión de cotizaciones</h1>
            <span>
              Consulta, filtra y administra las cotizaciones comerciales.
            </span>
          </div>

          <div className="admin-quotation-hero__actions">
            <div className="admin-dashboard-status">
              <span>Total</span>
              <strong>{cotizaciones.length}</strong>
            </div>
            <button type="button" onClick={nuevaCotizacion}>
              + Nueva cotización
            </button>
          </div>
        </div>
        )}

        {mostrarFormulario && (
        <div className="admin-module-view quotation-form-flow">
          <AdminModuleFormHeader
            backLabel="Volver a cotizaciones"
            description={
              cotizacionEditandoId
                ? "Actualiza los datos, productos e importes de la cotización."
                : "Completa los datos del cliente y agrega los productos a cotizar."
            }
            editing={Boolean(cotizacionEditandoId)}
            eyebrow="Cotizaciones"
            onBack={volverAlListadoCotizaciones}
            title={
              cotizacionEditandoId
                ? `Editando cotización ${
                    cotizaciones.find((cot) => cot.id === cotizacionEditandoId)
                      ?.codigo ||
                    `COT-${String(cotizacionEditandoId).padStart(5, "0")}`
                  }`
                : "Nueva cotización"
            }
          />
        <div className="quotation-layout">
          <div className="quotation-form-card" ref={quotationFormRef}>
            {/* Customer information UI V2 */}
            <div className="quotation-customer-header">
              <span>Datos del cliente</span>
              <h2>Información comercial</h2>
              <p>Complete la información del cliente para generar la cotización.</p>
            </div>

            <div className="quotation-client-grid">
              <label className="quotation-customer-field quotation-customer-field--full">
                <span>Cliente *</span>
                <span className="quotation-customer-control">
                  <UserRound size={18} aria-hidden="true" />
                  <input
                    name="cliente"
                    placeholder="Ingrese el nombre del cliente"
                    value={cliente.cliente}
                    onChange={handleClienteChange}
                  />
                </span>
              </label>

              <label className="quotation-customer-field">
                <span>Teléfono</span>
                <span className="quotation-customer-control">
                  <Phone size={18} aria-hidden="true" />
                  <input
                    name="telefono"
                    placeholder="Teléfono o WhatsApp"
                    value={cliente.telefono}
                    onChange={handleClienteChange}
                  />
                </span>
              </label>

              <button
                type="button"
                className={`quotation-customer-more-toggle ${
                  customerMoreOpen ? "is-open" : ""
                }`}
                aria-expanded={customerMoreOpen}
                aria-controls="quotation-customer-optional-fields"
                onClick={() => setCustomerMoreOpen((open) => !open)}
              >
                Más información (opcional)
                <ChevronDown size={18} aria-hidden="true" />
              </button>

              <div
                id="quotation-customer-optional-fields"
                className={`quotation-customer-optional-fields ${
                  customerMoreOpen ? "is-open" : ""
                }`}
              >
                <label className="quotation-customer-field">
                  <span>RUC / DNI</span>
                  <span className="quotation-customer-control">
                    <IdCard size={18} aria-hidden="true" />
                    <input
                      name="ruc"
                      placeholder="Ingrese RUC o DNI"
                      value={cliente.ruc}
                      onChange={handleClienteChange}
                    />
                  </span>
                </label>

                <label className="quotation-customer-field quotation-customer-field--full">
                  <span>Correo</span>
                  <span className="quotation-customer-control">
                    <Mail size={18} aria-hidden="true" />
                    <input
                      name="correo"
                      placeholder="Correo electrónico (opcional)"
                      value={cliente.correo}
                      onChange={handleClienteChange}
                    />
                  </span>
                </label>

                <label className="quotation-customer-field quotation-customer-field--full">
                  <span>Dirección</span>
                  <span className="quotation-customer-control">
                    <MapPin size={18} aria-hidden="true" />
                    <input
                      name="direccion"
                      placeholder="Dirección del cliente (opcional)"
                      value={cliente.direccion}
                      onChange={handleClienteChange}
                    />
                  </span>
                </label>

                <label className="quotation-customer-field quotation-customer-field--full">
                  <span>Observaciones</span>
                  <span className="quotation-customer-control quotation-customer-control--textarea">
                    <FileText size={18} aria-hidden="true" />
                    <textarea
                      name="observaciones"
                      placeholder="Observaciones de la cotización"
                      value={cliente.observaciones}
                      onChange={handleClienteChange}
                    />
                  </span>
                </label>
              </div>
            </div>

            {/* Quotation PDF display options V1 */}
            <div className="quotation-pdf-options">
              <div className="quotation-pdf-options__heading">
                <span>Opciones del PDF</span>
                <strong>Formato comercial</strong>
              </div>

              <label className="quotation-option-field">
                <span>Moneda</span>
                <select
                  name="moneda"
                  value={opcionesPdf.moneda}
                  onChange={handleOpcionesPdfChange}
                >
                  <option value="PEN">Soles (S/)</option>
                  <option value="USD">Dólares (US$)</option>
                </select>
              </label>

              <label className="quotation-option-toggle">
                <input
                  type="checkbox"
                  name="mostrarDetalleIgvPdf"
                  checked={opcionesPdf.mostrarDetalleIgvPdf}
                  onChange={handleOpcionesPdfChange}
                />
                <span aria-hidden="true" />
                <b>Mostrar Subtotal e IGV 18% en PDF</b>
              </label>
            </div>

            <div className="quotation-products-header">
              <h2>Productos</h2>
              <div className="quotation-product-actions">
  <button
    type="button"
    className="quotation-clear-draft"
    onClick={limpiarBorrador}
  >
    Limpiar borrador
  </button>

  <button type="button" onClick={() => setImportOpen(true)}>
    Importar lista
  </button>

  <button type="button" onClick={agregarItem}>
    + Agregar producto
  </button>
</div>
            </div>

            {avisoBorrador && (
              <div className="quotation-draft-notice" role="status">
                {avisoBorrador}
              </div>
            )}

            <div className="quotation-items">
              {items.map((item, index) => (

                <div
                  key={index}
                  className={`quotation-item-row ${
                    itemEliminando === index ? "is-removing" : ""
                  }`}
                >
                <div className="quotation-item-number">
                  <span className="quotation-item-number__desktop">{index + 1}</span>
                  <span className="quotation-item-number__mobile">
                    {index + 1}
                  </span>
                </div>
                  <div className="quotation-autocomplete">
  <input
    ref={(element) => {
      itemInputRefs.current.descripcion[index] = element
    }}
    className="quotation-description"
    placeholder="Descripción del producto"
    value={item.descripcion}
    onKeyDown={(event) =>
      handleItemNavigation(event, index, "descripcion")
    }
    onBlur={() => {
      window.setTimeout(() => setSugerencias({}), 160)
    }}
    onChange={(e) => {
      handleItemChange(index, "descripcion", e.target.value)
      buscarProductosCatalogo(index, e.target.value)
    }}
  />

  {sugerencias[index]?.length > 0 && (
    <div className="quotation-suggestions">
      {sugerencias[index].map((prod) => (
        <button
          key={prod.id}
          type="button"
          onClick={() => {
            handleItemChange(index, "descripcion", prod.nombre)
            handleItemChange(index, "precioUnitario", prod.precio || 0)
            setSugerencias({})
          }}
        >
          <span>{prod.nombre}</span>
          <strong>S/ {Number(prod.precio || 0).toFixed(2)}</strong>
        </button>
      ))}
    </div>
  )}
</div>

                  <label className="quotation-mobile-field quotation-mobile-field--quantity">
                    <span>Cant.</span>
                    <input
                      ref={(element) => {
                        itemInputRefs.current.cantidad[index] = element
                      }}
                      type="number"
                      placeholder="Cant."
                      value={item.cantidad}
                      min="0"
                      step="0.01"
                      onKeyDown={(event) =>
                        handleItemNavigation(event, index, "cantidad")
                      }
                      onWheel={(event) => event.currentTarget.blur()}
                      onChange={(e) =>
                        handleItemChange(index, "cantidad", e.target.value)
                      }
                    />
                  </label>

                  <label className="quotation-mobile-field quotation-mobile-field--price">
                    <span>P. Unit</span>
                    <input
                      ref={(element) => {
                        itemInputRefs.current.precioUnitario[index] = element
                      }}
                      type="number"
                      placeholder="P. Unit."
                      value={item.precioUnitario}
                      min="0"
                      step="0.01"
                      onFocus={() => {
                        if (Number(item.precioUnitario || 0) === 0) {
                          handleItemChange(index, "precioUnitario", "")
                        }
                      }}
                      onKeyDown={(event) =>
                        handleItemNavigation(event, index, "precioUnitario")
                      }
                      onWheel={(event) => event.currentTarget.blur()}
                      onChange={(e) =>
                        handleItemChange(index, "precioUnitario", e.target.value)
                      }
                    />
                  </label>

                  <strong className="quotation-item-subtotal">
                    <span>Subtotal</span>
                    <b>
                      {simboloMoneda}{" "}
                      {(
                        Number(item.cantidad || 0) *
                        Number(item.precioUnitario || 0)
                      ).toFixed(2)}
                    </b>
                  </strong>

                  <button
                    type="button"
                    className="quotation-remove"
                    aria-label="Eliminar producto"
                    title="Eliminar producto"
                    disabled={itemEliminando !== null}
                    onClick={() => quitarItemConAnimacion(index)}
                  >
                    <span className="quotation-remove__desktop">×</span>
                    <span className="quotation-remove__mobile" aria-hidden="true">
                      <Trash2 size={18} strokeWidth={2.2} />
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {(cotizacionEditandoId || modoDuplicado) && (
  <button
    type="button"
    className="quotation-cancel-edit"
    onClick={cancelarEdicion}
  >
    {modoDuplicado ? "Cancelar duplicado" : "Cancelar edición"}
  </button>
)}

            <button className="quotation-save-button" onClick={guardarCotizacion}>
              {cotizacionEditandoId ? "Actualizar cotización" : "Guardar cotización"}
            </button>
          </div>

          <div className="quotation-summary-wrapper">
  <div className="quotation-summary-card">
    
            <h3>Resumen</h3>

            <div className="quotation-total-line">
              <span>Subtotal</span>
              <strong>{simboloMoneda} {subtotal.toFixed(2)}</strong>
            </div>

            <div className="quotation-total-line">
              <span>IGV 18%</span>
              <strong>{simboloMoneda} {igv.toFixed(2)}</strong>
            </div>

            <div className="quotation-total-main">
              <span>Total</span>
              <strong>{simboloMoneda} {total.toFixed(2)}</strong>
            </div>

            <p>
              Los productos ingresados manualmente se guardarán como productos internos
              para futuras cotizaciones.
            </p>
          </div>
        </div>
        </div>
        </div>
        )}


        {!mostrarFormulario && (
        <div className="admin-module-view">
        <div className="quotation-list-card">
          <h2>Cotizaciones recientes</h2>

          <div className="quotation-list-stats">
            <div>
              <strong>{totalCotizaciones}</strong>
              <span>Total</span>
            </div>
            <div>
              <strong>{totalGeneradas}</strong>
              <span>Generadas</span>
            </div>
            <div>
              <strong>{totalAprobadas}</strong>
              <span>Aprobadas</span>
            </div>
            <div>
              <strong>{totalAnuladas}</strong>
              <span>Anuladas</span>
            </div>
          </div>

          {loading && <p className="admin-empty">Cargando cotizaciones...</p>}

          {!loading && cotizaciones.length === 0 && (
            <p className="admin-empty">Aún no hay cotizaciones registradas.</p>
          )}

          <div className="quotation-filter">
            <input
              placeholder="Buscar por código, cliente, RUC o teléfono..."
              value={filtroCotizacion}
              onChange={(e) => {
                setFiltroCotizacion(e.target.value)
                setPaginaCotizaciones(1)
              }}
            />

            <select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value)
                setPaginaCotizaciones(1)
              }}
            >
              <option value="TODAS">Todos los estados</option>
              <option value="GENERADA">Generada</option>
              <option value="APROBADA">Aprobada</option>
              <option value="ANULADA">Anulada</option>
            </select>

            <select
              value={filtroFecha}
              onChange={(e) => {
                setFiltroFecha(e.target.value)
                setPaginaCotizaciones(1)
              }}
            >
              <option value="TODAS">Todas las fechas</option>
              <option value="HOY">Hoy</option>
              <option value="SEMANA">Esta semana</option>
              <option value="MES">Este mes</option>
            </select>

            <select
              value={cotizacionesPorPagina}
              onChange={(e) => {
                setCotizacionesPorPagina(Number(e.target.value))
                setPaginaCotizaciones(1)
              }}
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
</div>

          <div className="quotation-list">
  {cotizacionesPaginadas.map((cot) => (
    <div key={cot.id} className="quotation-list-item">
      <div className="quotation-list-main">
        <div>
          <div className="quotation-list-top">
            <span>{cot.codigo || `COT-${String(cot.id).padStart(5, "0")}`}</span>
            <select
  className={`quotation-status-select ${(cot.estado || "GENERADA").toLowerCase()}`}
  value={cot.estado || "GENERADA"}
  onChange={(e) => cambiarEstadoCotizacion(cot, e.target.value)}
>
  <option value="GENERADA">GENERADA</option>
  <option value="ENVIADA">ENVIADA</option>
  <option value="APROBADA">APROBADA</option>
  <option value="ANULADA">ANULADA</option>
  <option value="RECHAZADA">RECHAZADA</option>
</select>
          </div>

          <strong>{cot.cliente}</strong>

          <p>
            {cot.fechaCreacion?.replace("T", " ").slice(0, 16)} ·{" "}
            {cot.detalles?.length || 0} producto(s)
          </p>
        </div>
      </div>

      <div className="quotation-list-side">
        <div className="quotation-total-box">
          <small>Total</small>
          <b>{obtenerSimboloMoneda(cot.moneda)} {Number(cot.total || 0).toFixed(2)}</b>
        </div>

        <div className="quotation-list-actions">
          <a
            href={obtenerUrlPdfCotizacion(cot.id)}
            target="_blank"
            rel="noreferrer"
            className="quotation-pdf-button"
          >
            PDF
          </a>

          <button
            className="quotation-whatsapp-button"
            onClick={() => enviarCotizacion(cot)}
          >
            WhatsApp
          </button>

          <button
            className="quotation-edit-button"
            onClick={() => editarCotizacion(cot)}
          >
            Editar
          </button>

          <button
            className="quotation-duplicate-button"
            onClick={() => duplicarCotizacion(cot)}
          >
            Duplicar
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

        {!loading && cotizacionesFiltradas.length === 0 && cotizaciones.length > 0 && (
          <p className="quotation-list-empty">
            No hay cotizaciones que coincidan con los filtros.
          </p>
        )}

        {!loading && cotizacionesFiltradas.length > 0 && (
          <AdminPagination
            currentPage={paginaCotizacionesSegura}
            totalPages={totalPaginasCotizaciones}
            onPageChange={setPaginaCotizaciones}
          />
        )}
        </div>
        )}

        {importOpen && (
  <div className="import-modal-overlay">
    <div className="import-modal">
      <div className="import-modal-header">
        <div>
          <p>Importación rápida</p>
          <h2>Importar productos</h2>
        </div>

        <button onClick={() => setImportOpen(false)}>×</button>
      </div>

      <p className="import-help">
        Pega una lista desde Excel, WhatsApp o texto. Puede incluir cantidad,
        descripción y precio. Si falta cantidad o precio, el sistema lo completará
        automáticamente.
      </p>

      <textarea
        value={textoImportacion}
        onChange={(e) => setTextoImportacion(e.target.value)}
        placeholder={`Ejemplos:
100 | TUBO PVC 1/2 | 15.00
TUBO PVC 3/4
50 ADAPTADOR 1" TIGER
PEGAMENTO 1/4 40.00`}
      />

      <div className="import-actions">
        <button className="import-cancel" onClick={() => setImportOpen(false)}>
          Cancelar
        </button>

        <button className="import-process" onClick={procesarImportacion}>
          Procesar productos
        </button>
      </div>
    </div>
  </div>
)}    

      </section>
    </AdminLayout>
  )
}

export default AdminQuotations
