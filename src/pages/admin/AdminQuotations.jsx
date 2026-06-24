import { useEffect, useRef, useState } from "react"
import axios from "axios"
import AdminLayout from "../../components/admin/AdminLayout"
import { API_URL } from "../../config/api"

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

const itemVacio = {
  descripcion: "",
  cantidad: 1,
  precioUnitario: 0,
}

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
  /* Excel-like quotation rows V1 */
  const itemInputRefs = useRef({
    descripcion: [],
    cantidad: [],
    precioUnitario: [],
  })
  const pendingItemFocus = useRef(null)

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
  const [sugerencias, setSugerencias] = useState({})
  const [importOpen, setImportOpen] = useState(false)
  const [textoImportacion, setTextoImportacion] = useState("")
  const [modoDuplicado, setModoDuplicado] = useState(false)
  const [avisoBorrador, setAvisoBorrador] = useState(
    borradorInicial ? "Borrador recuperado" : ""
  )

  const [cliente, setCliente] = useState(() => ({
    ...clienteVacio,
    ...(borradorInicial?.cliente || {}),
  }))

  const [items, setItems] = useState(() =>
    Array.isArray(borradorInicial?.items) && borradorInicial.items.length
      ? borradorInicial.items
      : [{ ...itemVacio }]
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
    cargarCotizaciones()
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
        JSON.stringify({ cliente, items })
      )
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [cliente, items])

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
    setItems([{ ...itemVacio }])
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

  const buscarProductosInternos = async (index, texto) => {
  if (!texto || texto.length < 3) {
    setSugerencias({
      ...sugerencias,
      [index]: [],
    })
    return
  }

  try {
    const res = await axios.get(
      `${API_URL}/api/productos-internos?buscar=${encodeURIComponent(texto)}`
    )

    setSugerencias({
      ...sugerencias,
      [index]: res.data.slice(0, 8),
    })
  } catch (error) {
    console.error("Error buscando productos internos:", error)
  }
}

  const handleItemChange = (index, field, value) => {
    const nuevosItems = [...items]
    nuevosItems[index][field] = value
    setItems(nuevosItems)
  }

  const agregarItem = () => {
    setItems((prev) => [...prev, { ...itemVacio }])
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
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce((acc, item) => {
  return acc + Number(item.cantidad || 0) * Number(item.precioUnitario || 0)
}, 0)

const subtotal = total / 1.18
const igv = total - subtotal

const editarCotizacion = (cot) => {
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
            descripcion: "",
            cantidad: 1,
            precioUnitario: 0,
          },
        ]
  )

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

const duplicarCotizacion = (cot) => {
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
            descripcion: "",
            cantidad: 1,
            precioUnitario: 0,
          },
        ]
  )

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

const cancelarEdicion = () => {
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

  setItems([
    {
      descripcion: "",
      cantidad: 1,
      precioUnitario: 0,
    },
  ])
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
    alert("Pega al menos una línea de productos")
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

const cambiarEstadoCotizacion = async (cot, nuevoEstado) => {
  try {
    await axios.put(`${API_URL}/api/cotizaciones/${cot.id}`, {
      ...cot,
      estado: nuevoEstado,
    })

    setCotizaciones((prev) =>
      prev.map((item) =>
        item.id === cot.id ? { ...item, estado: nuevoEstado } : item
      )
    )
  } catch (error) {
    console.error("Error actualizando estado:", error)
    alert("No se pudo actualizar el estado")
  }
}

const enviarCotizacion = async (cot) => {
  try {
    await cambiarEstadoCotizacion(cot, "ENVIADA")

    const mensaje = `Hola ${cot.cliente || ""} 👋

Adjuntamos su cotización ${
      cot.codigo || `COT-${String(cot.id).padStart(5, "0")}`
    }.

Total: S/ ${Number(cot.total || 0).toFixed(2)}

Gracias por confiar en W&G Corporación Goicha.`

    window.open(
      `https://wa.me/?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    )
  } catch (error) {
    console.error("Error enviando cotización:", error)
  }
}

  const guardarCotizacion = async () => {
    

    const itemsValidos = items.filter((item) => item.descripcion.trim())

    if (itemsValidos.length === 0) {
      alert("Agrega al menos un producto")
      return
    }

    const data = {
      ...cliente,
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

      alert("Cotización registrada correctamente")

      setCliente({
        cliente: "",
        ruc: "",
        telefono: "",
        correo: "",
        direccion: "",
        observaciones: "",
      })

      setItems([
        {
          descripcion: "",
          cantidad: 1,
          precioUnitario: 0,
        },
      ])

      setCotizacionEditandoId(null)
      localStorage.removeItem(QUOTATION_DRAFT_KEY)
      setAvisoBorrador("")

      cargarCotizaciones()
    } catch (error) {
      console.error("Error guardando cotización:", error)
      alert("No se pudo guardar la cotización")
    }
  }

  return (
    <AdminLayout>
      <section className="admin-dashboard-premium">
        <div className="admin-dashboard-hero admin-quotation-hero">
          <div>
            <p className="admin-badge">Cotizaciones</p>
            <h1>Crear cotización</h1>
            <span>
              Registra productos manualmente, calcula importes y genera una cotización profesional.
            </span>
          </div>

          <div className="admin-dashboard-status">
            <span>Total</span>
            <strong>{cotizaciones.length}</strong>
          </div>
        </div>

        <div className="quotation-layout">
          <div className="quotation-form-card">
            <h2>Datos del cliente</h2>

            <div className="quotation-client-grid">
              <input
                name="cliente"
                placeholder="Cliente / Razón social"
                value={cliente.cliente}
                onChange={handleClienteChange}
              />

              <input
                name="ruc"
                placeholder="RUC / DNI"
                value={cliente.ruc}
                onChange={handleClienteChange}
              />

              <input
                name="telefono"
                placeholder="Teléfono"
                value={cliente.telefono}
                onChange={handleClienteChange}
              />

              <input
                name="correo"
                placeholder="Correo"
                value={cliente.correo}
                onChange={handleClienteChange}
              />
            </div>

            <input
              name="direccion"
              placeholder="Dirección"
              value={cliente.direccion}
              onChange={handleClienteChange}
            />

            <textarea
              name="observaciones"
              placeholder="Observaciones de la cotización"
              value={cliente.observaciones}
              onChange={handleClienteChange}
            />

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

                <div key={index} className="quotation-item-row">
                <div className="quotation-item-number">
                  {index + 1}
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
    onChange={(e) => {
      handleItemChange(index, "descripcion", e.target.value)
      buscarProductosInternos(index, e.target.value)
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

            setSugerencias({
              ...sugerencias,
              [index]: [],
            })
          }}
        >
          <span>{prod.nombre}</span>
          <strong>S/ {Number(prod.precio || 0).toFixed(2)}</strong>
        </button>
      ))}
    </div>
  )}
</div>

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

                  <input
                    ref={(element) => {
                      itemInputRefs.current.precioUnitario[index] = element
                    }}
                    type="number"
                    placeholder="P. Unit."
                    value={item.precioUnitario}
                    min="0"
                    step="0.01"
                    onKeyDown={(event) =>
                      handleItemNavigation(event, index, "precioUnitario")
                    }
                    onWheel={(event) => event.currentTarget.blur()}
                    onChange={(e) =>
                      handleItemChange(index, "precioUnitario", e.target.value)
                    }
                  />

                  <strong>
                    S/{" "}
                    {(
                      Number(item.cantidad || 0) *
                      Number(item.precioUnitario || 0)
                    ).toFixed(2)}
                  </strong>

                  <button
                    className="quotation-remove"
                    onClick={() => quitarItem(index)}
                  >
                    ×
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
              <strong>S/ {subtotal.toFixed(2)}</strong>
            </div>

            <div className="quotation-total-line">
              <span>IGV 18%</span>
              <strong>S/ {igv.toFixed(2)}</strong>
            </div>

            <div className="quotation-total-main">
              <span>Total</span>
              <strong>S/ {total.toFixed(2)}</strong>
            </div>

            <p>
              Los productos ingresados manualmente se guardarán como productos internos
              para futuras cotizaciones.
            </p>
          </div>
        </div>
        </div>


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
          <b>S/ {Number(cot.total || 0).toFixed(2)}</b>
        </div>

        <div className="quotation-list-actions">
          <a
            href={`${API_URL}/api/cotizaciones/${cot.id}/pdf`}
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
          <div className="quotation-pagination">
            <button
              type="button"
              disabled={paginaCotizacionesSegura === 1}
              onClick={() =>
                setPaginaCotizaciones(
                  Math.max(1, paginaCotizacionesSegura - 1)
                )
              }
            >
              Anterior
            </button>

            <span>
              Página {paginaCotizacionesSegura} de {totalPaginasCotizaciones}
            </span>

            <button
              type="button"
              disabled={paginaCotizacionesSegura === totalPaginasCotizaciones}
              onClick={() =>
                setPaginaCotizaciones(
                  Math.min(
                    totalPaginasCotizaciones,
                    paginaCotizacionesSegura + 1
                  )
                )
              }
            >
              Siguiente
            </button>
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
