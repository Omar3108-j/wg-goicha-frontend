import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useReveal } from "../hooks/useReveal"
import { obtenerProductosCatalogo } from "../services/productoService"
import {
  ChevronDown,
  FileText,
  House,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react"
import { API_URL } from "../config/api"

function Products({
  whatsappUrl,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  categorias = [],
}) {
  const [prodRef, prodVisible] = useReveal()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [variantesProducto, setVariantesProducto] = useState([])
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null)
  const [carrito, setCarrito] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  /* Checkout customer form UX V2 */
  const [checkoutMoreOpen, setCheckoutMoreOpen] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const categoriaActiva = categoriaSeleccionada || "TODOS"
  const [cartAnimado, setCartAnimado] = useState(false)
  const [paginaActual, setPaginaActual] = useState(1)
  const productosPorPagina = 8
  const [productosConVariantes, setProductosConVariantes] = useState([])
  const [preciosMinimosVariantes, setPreciosMinimosVariantes] = useState({})
  const [carritoCargado, setCarritoCargado] = useState(false)
  const [pedidoExitoso, setPedidoExitoso] = useState(null)
  const [whatsappPedidoUrl, setWhatsappPedidoUrl] = useState("")
  const [ultimoAgregadoKey, setUltimoAgregadoKey] = useState(null)
  const feedbackAgregadoTimeout = useRef(null)
  const productModalScrollPosition = useRef(0)
  const productsGridRef = useRef(null)

  const [form, setForm] = useState({
    cliente: "",
    telefono: "",
    correo: "",
    direccion: "",
    distrito: "",
    metodoPago: "",
    numeroOperacion: "",
    observaciones: "",
  })

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductosCatalogo()
        setProductos(data)

        setProductosConVariantes(
          data
            .filter((prod) => prod.tieneVariantesActivas)
            .map((prod) => prod.id)
        )
        setPreciosMinimosVariantes(
          Object.fromEntries(
            data
              .filter((prod) => prod.tieneVariantesActivas)
              .map((prod) => [prod.id, Number(prod.precioMinimo || 0)])
          )
        )
      } catch (error) {
        console.error("Error cargando productos:", error)
      } finally {
        setLoading(false)
      }
    }
    cargarProductos()
  }, [])

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("wg_carrito")
    // La hidratación inicial desde localStorage es intencional y ocurre una sola vez.
    if (carritoGuardado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCarrito(JSON.parse(carritoGuardado))
    }
    setCarritoCargado(true)
  }, [])

  useEffect(() => {
    if (carritoCargado) {
      localStorage.setItem("wg_carrito", JSON.stringify(carrito))
    }
  }, [carrito, carritoCargado])

  /* Lock body scroll while product modal is open V2 */
  /* Restore product catalog scroll position V2 */
  useEffect(() => {
    if (!selectedProduct) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    const previousHtmlOverflow = html.style.overflow

    productModalScrollPosition.current = scrollY
    html.style.overflow = "hidden"
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"
    body.style.overflow = "hidden"

    return () => {
      html.style.overflow = previousHtmlOverflow
      body.style.position = previousBodyStyles.position
      body.style.top = previousBodyStyles.top
      body.style.left = previousBodyStyles.left
      body.style.right = previousBodyStyles.right
      body.style.width = previousBodyStyles.width
      body.style.overflow = previousBodyStyles.overflow
      window.scrollTo(0, productModalScrollPosition.current)
    }
  }, [selectedProduct])

  /* Product modal UX V1 */
  const obtenerKeyCarrito = (productoId, varianteId = null) =>
    varianteId ? `${productoId}-${varianteId}` : `${productoId}`

  const varianteEstaEnCarrito = (productoId, varianteId) =>
    carrito.some(
      (item) => item.keyCarrito === obtenerKeyCarrito(productoId, varianteId)
    )

  const agregarAlCarrito = (producto) => {
    const keyCarrito = obtenerKeyCarrito(producto.id, producto.varianteId)
    const productoParaCarrito = {
      id: producto.id,
      keyCarrito,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: producto.precio || 0,
      varianteId: producto.varianteId || null,
      varianteNombre: producto.varianteNombre || null,
      cantidad: 1,
    }

    setCartAnimado(true)
    setTimeout(() => setCartAnimado(false), 600)
    setUltimoAgregadoKey(keyCarrito)
    clearTimeout(feedbackAgregadoTimeout.current)
    feedbackAgregadoTimeout.current = setTimeout(
      () => setUltimoAgregadoKey(null),
      1400
    )

    setCarrito((prev) => {
      const existe = prev.find(
        (item) => item.keyCarrito === productoParaCarrito.keyCarrito
      )
      if (existe) {
        return prev.map((item) =>
          item.keyCarrito === productoParaCarrito.keyCarrito
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, productoParaCarrito]
    })
  }

  useEffect(
    () => () => clearTimeout(feedbackAgregadoTimeout.current),
    []
  )

  const productoEstaEnCarrito = (productoId) => {
    return carrito.some((item) => item.id === productoId)
  }

  const obtenerCantidad = (keyCarrito) => {
    const item = carrito.find(p => p.keyCarrito === keyCarrito)
    return item ? item.cantidad : 0
  }

  /* Product variant label in PDF V1 */
  const obtenerNombreProductoConVariante = (item) => {
    const nombreProducto = String(item.nombre || item.productoNombre || "").trim()
    const nombreVariante = String(item.varianteNombre || "").trim()

    if (!nombreVariante) return nombreProducto

    const nombreNormalizado = nombreProducto.toLocaleLowerCase()
    const varianteNormalizada = nombreVariante.toLocaleLowerCase()

    return nombreNormalizado.includes(varianteNormalizada)
      ? nombreProducto
      : `${nombreProducto} - ${nombreVariante}`
  }

  const aumentarCantidad = (keyCarrito) => {
    const item = carrito.find(p => p.keyCarrito === keyCarrito)
    if (item) cambiarCantidad(keyCarrito, item.cantidad + 1)
  }

  const disminuirCantidad = (keyCarrito) => {
    const item = carrito.find(p => p.keyCarrito === keyCarrito)
    if (!item) return
    if (item.cantidad <= 1) {
      quitarDelCarrito(keyCarrito)
    } else {
      cambiarCantidad(keyCarrito, item.cantidad - 1)
    }
  }

  const cambiarCantidad = (keyCarrito, cantidad) => {
    if (cantidad <= 0) {
      quitarDelCarrito(keyCarrito)
      return
    }
    setCarrito((prev) =>
      prev.map((item) =>
        item.keyCarrito === keyCarrito ? { ...item, cantidad } : item
      )
    )
  }

  const quitarDelCarrito = (keyCarrito) => {
    setCarrito((prev) =>
      prev.filter((item) => item.keyCarrito !== keyCarrito)
    )
  }

  const total = carrito.reduce(
    (sum, item) => sum + Number(item.precio || 0) * item.cantidad,
    0
  )

  const totalItemsCarrito = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  )

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const cargarVariantes = (productoId) => {
    const producto = productos.find((item) => item.id === productoId)
    const variantes = producto?.variantesActivas || []

    setVariantesProducto(variantes)
    setVarianteSeleccionada(variantes[0] || null)
  }

  const confirmarPedido = async () => {
    if (carrito.length === 0) { alert("Agrega productos al carrito"); return }

    const telefonoLimpio = form.telefono.replace(/\D/g, "")
    if (!form.cliente.trim()) { alert("Ingresa tu nombre completo."); return }
    if (!telefonoLimpio) { alert("Ingresa tu número de WhatsApp."); return }
    if (telefonoLimpio.length < 9) { alert("El número de WhatsApp debe tener al menos 9 dígitos."); return }
    if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      alert("Ingresa un correo válido o deja el campo vacío.")
      return
    }

    const data = {
      ...form,
      detalles: carrito.map((item) => ({
        productoId: item.id,
        productoNombre: obtenerNombreProductoConVariante(item),
        productoImagen: item.imagen,
        cantidad: item.cantidad,
        precio: item.precio || 0,
      })),
    }

    try {
      const res = await axios.post(`${API_URL}/api/pedidos`, data)
      const pedido = res.data

      const mensaje = `
        🧾 *NUEVO PEDIDO WEB W&G*

        🔖 *Código:* ${pedido.codigo}

        👤 *Cliente:* ${form.cliente}
        📱 *Teléfono:* ${form.telefono}
        📧 *Correo:* ${form.correo || "-"}
        🏙️ *Distrito:* ${form.distrito || "-"}
        📍 *Dirección:* ${form.direccion || "-"}

        ━━━━━━━━━━━━━━━

        📦 *PRODUCTOS SOLICITADOS*

        ${carrito.map((item, index) => `
        ${index + 1}. ${obtenerNombreProductoConVariante(item)}
   📦 Cantidad: ${item.cantidad}
   💰 Precio unitario: S/ ${Number(item.precio || 0).toFixed(2)}
   🧾 Subtotal: S/ ${(item.cantidad * Number(item.precio || 0)).toFixed(2)}
        `).join("\n")}

        ━━━━━━━━━━━━━━━

        📊 *Total de unidades:* ${totalItemsCarrito}

        💰 *TOTAL REFERENCIAL:* S/ ${total.toFixed(2)}

        📝 *Observaciones:*
        ${form.observaciones || "Sin observaciones"}

        Gracias por contactarse con *W&G Corporación Goicha*.
        `

      const url = `https://wa.me/51994079602?text=${encodeURIComponent(mensaje)}`

      setPedidoExitoso({
        ...pedido,
        cliente: form.cliente,
        total,
        totalItems: totalItemsCarrito,
      })
      setWhatsappPedidoUrl(url)
      setCarrito([])
      localStorage.removeItem("wg_carrito")
      setForm({
        cliente: "", telefono: "", correo: "",
        direccion: "", distrito: "", metodoPago: "",
        numeroOperacion: "", observaciones: "",
      })
      setCheckoutOpen(false)
    } catch (error) {
      console.error("Error registrando pedido:", error)
      alert("No se pudo registrar el pedido")
    }
  }

  const categoriasDisponibles = [
    "TODOS",
    ...categorias.map((cat) => cat.nombre),
  ]

  // FIX: lógica de filtrado corregida
  // Mostrar si: tiene variantes activas (precio base puede ser 0)
  //          O: no tiene variantes y precio base > 0
  const productosFiltrados = productos.filter((prod) => {
    const tieneVariantesActivas = productosConVariantes.includes(prod.id)
    const precioBase = Number(prod.precio || 0)

    if (!tieneVariantesActivas && precioBase <= 0) return false

    const texto = `
      ${prod.nombre || ""}
      ${prod.marca || ""}
      ${prod.tipo || ""}
      ${prod.descripcion || ""}
      ${prod.categoria?.nombre || prod.categoria || ""}
    `.toLowerCase()

    const coincideBusqueda = texto.includes(busqueda.toLowerCase())

    const categoriaProducto =
      prod.categoria?.nombre || prod.categoria || prod.tipo || ""

    const coincideCategoria =
      categoriaActiva === "TODOS" ||
      categoriaProducto.toLowerCase() === categoriaActiva.toLowerCase()

    return coincideBusqueda && coincideCategoria
  })

  /* Reset pagination on filters V1 */
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina)
  const paginaActualSegura =
    totalPaginas > 0 ? Math.min(paginaActual, totalPaginas) : 1
  const indiceUltimoProducto = paginaActualSegura * productosPorPagina
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina
  const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto)

  /* Premium catalog pagination V1 */
  const obtenerPaginasVisibles = () => {
    if (totalPaginas <= 5) {
      return Array.from({ length: totalPaginas }, (_, index) => index + 1)
    }

    if (paginaActualSegura <= 3) {
      return [1, 2, 3, 4, "ellipsis-end", totalPaginas]
    }

    if (paginaActualSegura >= totalPaginas - 2) {
      return [1, "ellipsis-start", totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas]
    }

    return [
      1,
      "ellipsis-start",
      paginaActualSegura - 1,
      paginaActualSegura,
      paginaActualSegura + 1,
      "ellipsis-end",
      totalPaginas,
    ]
  }

  const cambiarPagina = (nuevaPagina) => {
    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas ||
      nuevaPagina === paginaActualSegura
    ) {
      return
    }

    setPaginaActual(nuevaPagina)
    window.setTimeout(() => {
      productsGridRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 50)
  }

  return (
    <section id="productos" ref={prodRef} className="catalog-section">
      <div className="catalog-dots" />
      <div className="catalog-glow" />

      <button
        className={`cart-floating-button ${cartAnimado ? "is-bouncing" : ""}`}
        onClick={() => setCartOpen(true)}
      >
        <ShoppingCart size={24} strokeWidth={2.2} />
        <span className="cart-count">
          {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
        </span>
      </button>

      <div className="section-container catalog-container">
        <div className="catalog-heading">
          <p>Disponible ahora</p>
          <h2>Nuestros productos</h2>
          <span>Agrega productos al carrito y envía tu pedido por WhatsApp.</span>
        </div>

        <div className="catalog-stats">
          <div><strong>500+</strong><span>Productos disponibles</span></div>
          <div><strong>15+</strong><span>Marcas aliadas</span></div>
          <div><strong>Stock</strong><span>Atención inmediata</span></div>
        </div>

        <div className="catalog-tools">
          <div className="catalog-search-box">
            <span className="catalog-search-icon" aria-hidden="true">
              <Search size={21} strokeWidth={2.2} />
            </span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value)
                setPaginaActual(1)
              }}
            />
          </div>
          <div className="catalog-filter-pills">
            {categoriasDisponibles.map((cat) => (
              <button
                key={cat}
                className={categoriaActiva === cat ? "active" : ""}
                onClick={() => {
                  setCategoriaSeleccionada(cat)
                  setPaginaActual(1)
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="catalog-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="product-skeleton-card">
                <div className="product-skeleton-image" />
                <div className="product-skeleton-body">
                  <span /><h3 /><p /><p /><strong />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && productos.length === 0 && (
          <p className="products-message">Aún no hay productos registrados.</p>
        )}

        {!loading && productos.length > 0 && productosFiltrados.length === 0 && (
          <div className="catalog-empty-results">
            <span>Sin resultados</span>
            <h3>No encontramos productos</h3>
            <p>Puede que el producto esté disponible en tienda física o por pedido especial.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              Consultar por WhatsApp →
            </a>
          </div>
        )}

        <div ref={productsGridRef} className="catalog-grid">
          {productosPaginados.map((prod, index) => {
            const tieneVariantes = productosConVariantes.includes(prod.id)

            return (
              <div
                key={prod.id || prod.nombre}
                className={`product-card ${prodVisible ? "is-visible" : ""}`}
                style={{ transitionDelay: `${index * 0.07}s` }}
              >
                {prod.tag && (
                  <div className={`product-badge ${prod.tag.toLowerCase()}`}>
                    {prod.tag}
                  </div>
                )}
                <div
                  className="product-card__image"
                  onClick={() => {
                    setSelectedProduct(prod)
                    cargarVariantes(prod.id)
                  }}
                >
                  {prod.imagen
                    ? <img src={prod.imagen} alt={prod.nombre} loading="lazy" />
                    : <span>🔧</span>
                  }
                </div>

                <div className="product-card__body">
                  <span className="product-stock">● STOCK</span>
                  <div className="product-meta">
                    {prod.marca && <span>{prod.marca}</span>}
                    {(prod.tipo || prod.categoria?.nombre) && (
                      <><b>·</b><span>{prod.tipo || prod.categoria?.nombre}</span></>
                    )}
                  </div>
                  <h3>{prod.nombre}</h3>
                  <p>{prod.descripcion}</p>

                  <div className="product-footer">
                    <span className="product-price">
                      {tieneVariantes ? (
                        <>
                          <span className="price-prefix">Desde</span>
                          S/ {Number(preciosMinimosVariantes[prod.id] || 0).toFixed(2)}
                        </>
                      ) : (
                        <>S/ {Number(prod.precio || 0).toFixed(2)}</>
                      )}
                    </span>

                    {tieneVariantes ? (
                      <button
                        onClick={() => {
                          setSelectedProduct(prod)
                          cargarVariantes(prod.id)
                        }}
                        className="product-cart-button"
                      >
                        Ver opciones
                      </button>
                    ) : productoEstaEnCarrito(prod.id) ? (
                      <div className="product-qty-controls">
                        <button onClick={() => disminuirCantidad(`${prod.id}`)}>-</button>
                        <input
                          className="product-qty-input"
                          type="number"
                          min="1"
                          value={obtenerCantidad(`${prod.id}`)}
                          onChange={(e) =>
                            cambiarCantidad(`${prod.id}`, Number(e.target.value || 1))
                          }
                        />
                        <button onClick={() => aumentarCantidad(`${prod.id}`)}>+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => agregarAlCarrito(prod)}
                        className="product-cart-button"
                      >
                        🛒 Agregar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!loading && totalPaginas > 1 && (
          <nav className="catalog-pagination" aria-label="Paginación del catálogo">
            <button
              type="button"
              className="catalog-pagination__nav"
              disabled={paginaActualSegura === 1}
              onClick={() => cambiarPagina(paginaActualSegura - 1)}
              aria-label="Página anterior"
            >
              <span aria-hidden="true">←</span>
              <span className="catalog-pagination__nav-label">Anterior</span>
            </button>

            <div className="catalog-pagination__pages">
              {obtenerPaginasVisibles().map((pagina) =>
                typeof pagina === "number" ? (
                  <button
                    key={pagina}
                    type="button"
                    className={`catalog-pagination__page ${
                      pagina === paginaActualSegura ? "is-active" : ""
                    }`}
                    onClick={() => cambiarPagina(pagina)}
                    aria-label={`Ir a la página ${pagina}`}
                    aria-current={pagina === paginaActualSegura ? "page" : undefined}
                  >
                    {pagina}
                  </button>
                ) : (
                  <span
                    key={pagina}
                    className="catalog-pagination__ellipsis"
                    aria-hidden="true"
                  >
                    …
                  </span>
                )
              )}
            </div>

            <button
              type="button"
              className="catalog-pagination__nav"
              disabled={paginaActualSegura === totalPaginas}
              onClick={() => cambiarPagina(paginaActualSegura + 1)}
              aria-label="Página siguiente"
            >
              <span className="catalog-pagination__nav-label">Siguiente</span>
              <span aria-hidden="true">→</span>
            </button>
          </nav>
        )}

        <div className="catalog-cta">
          <div>
            <p>¿No encuentras lo que buscas?</p>
            <h3>Más productos disponibles en stock</h3>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Consultar por WhatsApp →
          </a>
        </div>
      </div>

      {selectedProduct && (
        <div className="product-modal" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="product-modal__close" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="product-modal__image">
              {selectedProduct.imagen
                ? <img src={selectedProduct.imagen} alt={selectedProduct.nombre} loading="lazy" />
                : <span>🔧</span>
              }
            </div>
            <div className="product-modal__info">
              {/* Mobile modal UX improvements */}
              <button
                type="button"
                className="product-modal__back"
                onClick={() => setSelectedProduct(null)}
              >
                ← Volver a productos
              </button>
              <p className="product-modal__label">Detalle del producto</p>
              <h2>{selectedProduct.nombre}</h2>
              <div className="product-modal__badges">
                {selectedProduct.marca && <span>{selectedProduct.marca}</span>}
                {selectedProduct.tipo && <span>{selectedProduct.tipo}</span>}
                {selectedProduct.categoria?.nombre && <span>{selectedProduct.categoria.nombre}</span>}
              </div>
              <div className="product-modal__price">
                S/ {Number(varianteSeleccionada?.precio ?? selectedProduct.precio ?? 0).toFixed(2)}
              </div>
              {variantesProducto.length > 0 && (
                <div className="product-variants">
                  <label>Seleccione una medida:</label>
                  <div className="variant-options">
                    {variantesProducto.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        className={`variant-option ${
                          varianteSeleccionada?.id === v.id ? "active" : ""
                        } ${
                          varianteEstaEnCarrito(selectedProduct.id, v.id)
                            ? "in-cart"
                            : ""
                        }`}
                        onClick={() => setVarianteSeleccionada(v)}
                      >
                        <span>{v.nombre}</span>
                        <strong>S/ {Number(v.precio || 0).toFixed(2)}</strong>
                        {varianteEstaEnCarrito(selectedProduct.id, v.id) && (
                          <small>✓ En carrito</small>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="product-modal__description">
                {selectedProduct.descripcion || "Producto disponible para pedido."}
              </p>
              <button
                className={`product-modal__button ${
                  ultimoAgregadoKey ===
                  obtenerKeyCarrito(
                    selectedProduct.id,
                    varianteSeleccionada?.id
                  )
                    ? "is-added"
                    : ""
                }`}
                onClick={() => agregarAlCarrito({
                  ...selectedProduct,
                  precio: varianteSeleccionada?.precio ?? selectedProduct.precio,
                  varianteId: varianteSeleccionada?.id || null,
                  varianteNombre: varianteSeleccionada?.nombre || null,
                })}
              >
                {ultimoAgregadoKey ===
                obtenerKeyCarrito(
                  selectedProduct.id,
                  varianteSeleccionada?.id
                )
                  ? "✓ Agregado"
                  : "Agregar al carrito →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <div>
                <p>Carrito</p>
                <h2>Tu pedido</h2>
                {carrito.length > 0 && (
                  <button
                    type="button"
                    className="cart-clear-button"
                    onClick={() => {
                      setCarrito([])
                      localStorage.removeItem("wg_carrito")
                    }}
                  >
                    Vaciar carrito
                  </button>
                )}
              </div>
              <button onClick={() => setCartOpen(false)}>×</button>
            </div>

            {carrito.length === 0 ? (
              /* Empty cart CTA V1 */
              <div className="cart-empty">
                <div className="cart-empty__icon" aria-hidden="true">
                  <ShoppingCart size={30} strokeWidth={1.8} />
                </div>
                <h3>Tu carrito está vacío</h3>
                <p>Aún no has agregado productos.
                  Explora nuestro catálogo y encuentra las mejores opciones para tu compra.</p>
                <button
                  type="button"
                  className="cart-empty__button"
                  onClick={() => {
                    setCartOpen(false)
                    window.setTimeout(() => {
                      document.getElementById("productos")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }, 100)
                  }}
                >
                  Explorar productos
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {carrito.map((item) => (
                    <div key={item.keyCarrito || item.id} className="cart-item">
                      <div className="cart-item-img">
                        {item.imagen ? <img src={item.imagen} alt={item.nombre} /> : "🔧"}
                      </div>
                      <div className="cart-item-info">
                        <h3>{item.nombre}</h3>
                        {item.varianteNombre && (
                          <span className="cart-variant-badge">📏 {item.varianteNombre}</span>
                        )}
                        <div className="cart-price-unit">
                          S/ {Number(item.precio || 0).toFixed(2)}<small> c/u</small>
                        </div>
                        <div className="cart-qty">
                          <button onClick={() => cambiarCantidad(item.keyCarrito, item.cantidad - 1)}>−</button>
                          <input
                            className="cart-qty-input"
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => cambiarCantidad(item.keyCarrito, Number(e.target.value || 1))}
                          />
                          <button onClick={() => cambiarCantidad(item.keyCarrito, item.cantidad + 1)}>+</button>
                        </div>
                        <div className="cart-subtotal">
                          Subtotal: <strong>S/ {(Number(item.precio || 0) * item.cantidad).toFixed(2)}</strong>
                        </div>
                        <button className="cart-remove-button" onClick={() => quitarDelCarrito(item.keyCarrito)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer-sticky">
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>S/ {total.toFixed(2)}</strong>
                  </div>
                  {!checkoutOpen && (
                    <button
                      className="cart-confirm-button"
                      onClick={() => {
                        setCartOpen(false)
                        setCheckoutMoreOpen(false)
                        setCheckoutOpen(true)
                      }}
                    >
                      Continuar pedido
                    </button>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="checkout-overlay">
          <div className="checkout-page">
            <button className="checkout-close" onClick={() => setCheckoutOpen(false)}>×</button>
            <div className="checkout-form-card">
              <button className="checkout-back" onClick={() => { setCheckoutOpen(false); setCartOpen(true) }}>
                ← Volver al carrito
              </button>
              <p className="checkout-label">Finalizar compra</p>
              <h2>Datos para tu pedido</h2>
              <span>Completa tus datos para registrar tu pedido. Luego podrás enviar el resumen por WhatsApp.</span>
              <div className="checkout-form">
                <section className="checkout-form-section checkout-form-section--customer">
                  <h3>Información del cliente</h3>
                  <div className="checkout-section-grid">
                    <div className="checkout-group checkout-group--name">
                      <label htmlFor="checkout-cliente">Nombre completo *</label>
                      <span className="checkout-field-control">
                        <UserRound className="checkout-field-icon" size={18} aria-hidden="true" />
                        <input
                          id="checkout-cliente"
                          name="cliente"
                          value={form.cliente}
                          onChange={handleChange}
                          autoComplete="name"
                          required
                        />
                      </span>
                    </div>
                    <div className="checkout-group checkout-group--phone">
                      <label htmlFor="checkout-telefono">Teléfono / WhatsApp *</label>
                      <span className="checkout-field-control">
                        <Phone className="checkout-field-icon" size={18} aria-hidden="true" />
                        <input
                          id="checkout-telefono"
                          name="telefono"
                          type="tel"
                          value={form.telefono}
                          onChange={handleChange}
                          inputMode="numeric"
                          maxLength="15"
                          autoComplete="tel"
                          required
                        />
                      </span>
                    </div>
                  </div>
                </section>

                <button
                  type="button"
                  className={`checkout-more-toggle ${checkoutMoreOpen ? "is-open" : ""}`}
                  aria-expanded={checkoutMoreOpen}
                  aria-controls="checkout-optional-fields"
                  onClick={() => setCheckoutMoreOpen((open) => !open)}
                >
                  Más información (opcional)
                  <ChevronDown size={18} aria-hidden="true" />
                </button>

                <div
                  id="checkout-optional-fields"
                  className={`checkout-optional-fields ${checkoutMoreOpen ? "is-open" : ""}`}
                >
                  <section className="checkout-form-section checkout-form-section--address">
                    <h3>Dirección <span>(opcional)</span></h3>
                    <div className="checkout-section-grid">
                      <div className="checkout-group checkout-group--district">
                        <label htmlFor="checkout-distrito">Distrito</label>
                        <span className="checkout-field-control">
                          <MapPin className="checkout-field-icon" size={18} aria-hidden="true" />
                          <input
                            id="checkout-distrito"
                            name="distrito"
                            value={form.distrito}
                            onChange={handleChange}
                            autoComplete="address-level2"
                          />
                        </span>
                      </div>
                      <div className="checkout-group checkout-group--address">
                        <label htmlFor="checkout-direccion">Dirección</label>
                        <span className="checkout-field-control">
                          <House className="checkout-field-icon" size={18} aria-hidden="true" />
                          <input
                            id="checkout-direccion"
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            autoComplete="street-address"
                          />
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="checkout-form-section checkout-form-section--additional">
                    <h3>Información adicional <span>(opcional)</span></h3>
                    <div className="checkout-section-grid">
                      <div className="checkout-group checkout-group--email">
                        <label htmlFor="checkout-correo">Correo</label>
                        <span className="checkout-field-control">
                          <Mail className="checkout-field-icon" size={18} aria-hidden="true" />
                          <input
                            id="checkout-correo"
                            name="correo"
                            type="email"
                            value={form.correo}
                            onChange={handleChange}
                            autoComplete="email"
                          />
                        </span>
                      </div>
                      <div className="checkout-group checkout-group--observations">
                        <label htmlFor="checkout-observaciones">Observaciones</label>
                        <span className="checkout-field-control checkout-field-control--textarea">
                          <FileText className="checkout-field-icon" size={18} aria-hidden="true" />
                          <textarea
                            id="checkout-observaciones"
                            name="observaciones"
                            value={form.observaciones}
                            onChange={handleChange}
                          />
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
              <button className="checkout-confirm" onClick={confirmarPedido}>
                Registrar pedido
              </button>
            </div>
            <div className="checkout-summary-card">
              <h3>
                Resumen del pedido
                <span>{totalItemsCarrito} producto{totalItemsCarrito !== 1 ? "s" : ""}</span>
              </h3>
              {carrito.length === 0 ? (
                <p className="checkout-empty-summary">Aún no tienes productos en el pedido.</p>
              ) : (
                <div className="checkout-summary-items">
                  {carrito.map((item) => (
                    <div key={item.keyCarrito} className="checkout-summary-item premium">
                      <div className="checkout-summary-img">
                        {item.imagen ? <img src={item.imagen} alt={item.nombre} /> : <span>🔧</span>}
                      </div>
                      <div className="checkout-summary-info">
                        <strong>{item.nombre}</strong>
                        {item.varianteNombre && <small>📏 {item.varianteNombre}</small>}
                        <span>{item.cantidad} x S/ {Number(item.precio || 0).toFixed(2)}</span>
                      </div>
                      <b>S/ {(Number(item.precio || 0) * item.cantidad).toFixed(2)}</b>
                    </div>
                  ))}
                </div>
              )}
              <div className="checkout-summary-total">
                <span>Total</span>
                <strong>S/ {total.toFixed(2)}</strong>
              </div>
              <div className="checkout-note">
                <b>Nota:</b> Al confirmar, se registrará el pedido y luego podrás enviar el detalle por WhatsApp.
              </div>
            </div>
          </div>
        </div>
      )}

      {pedidoExitoso && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <p className="success-label">Pedido registrado</p>
            <h2>Tu pedido fue creado correctamente</h2>
            <div className="success-details">
              <span>Código</span>
              <strong>{pedidoExitoso.codigo}</strong>
            </div>
            <div className="success-details">
              <span>Cliente</span>
              <strong>{pedidoExitoso.cliente}</strong>
            </div>
            <div className="success-details">
              <span>Total</span>
              <strong>S/ {Number(pedidoExitoso.total || 0).toFixed(2)}</strong>
            </div>
            <p>Ahora puedes enviar el detalle del pedido por WhatsApp a nuestro asesor.</p>
            <div className="success-actions">
              <button
                className="success-whatsapp"
                onClick={() => {
                  window.open(whatsappPedidoUrl, "_blank")
                  setPedidoExitoso(null)
                  setWhatsappPedidoUrl("")
                }}
              >
                Enviar por WhatsApp
              </button>
              <button
                className="success-close"
                onClick={() => {
                  setPedidoExitoso(null)
                  setWhatsappPedidoUrl("")
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Products
