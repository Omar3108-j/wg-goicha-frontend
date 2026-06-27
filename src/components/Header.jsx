import { useState, useEffect } from "react"
import { empresa } from "../data/empresa"
import { FaFacebookF, FaWhatsapp } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa6"
import { Search, ShoppingCart } from "lucide-react"

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#categorias", label: "Categorías" },
  { href: "#productos", label: "Productos" },
  { href: "#contacto", label: "Contacto" },
]

const whatsappUrl = `https://wa.me/${empresa?.whatsapp}?text=${encodeURIComponent(
  "Hola, deseo cotizar productos de tuberías y conexiones."
)}`

const trustMessages = [
  "🚚 Envíos a todo el Perú",
  "⭐ Más de 500 productos",
  "✓ Stock permanente",
  "📱 Atención inmediata",
  "🔒 Compra segura",
]

const getStoredCartSummary = () => {
  try {
    const items = JSON.parse(localStorage.getItem("wg_carrito") || "[]")
    return items.reduce(
      (summary, item) => ({
        count: summary.count + Number(item.cantidad || 0),
        total:
          summary.total +
          Number(item.precio || 0) * Number(item.cantidad || 0),
      }),
      { count: 0, total: 0 }
    )
  } catch {
    return { count: 0, total: 0 }
  }
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("#inicio")
  const [trustMessageIndex, setTrustMessageIndex] = useState(0)
  const [cartSummary, setCartSummary] = useState(getStoredCartSummary)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)

      const sections = navLinks
        .map((l) => document.querySelector(l.href))
        .filter(Boolean)

      const y = window.scrollY + 120

      for (const s of sections) {
        if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
          setActive(`#${s.id}`)
          break
        }
      }
    }

    onScroll()
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTrustMessageIndex((current) => (current + 1) % trustMessages.length)
    }, 3200)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const updateCartSummary = (event) => {
      setCartSummary(event.detail || getStoredCartSummary())
    }

    window.addEventListener("wg:cart-updated", updateCartSummary)
    return () =>
      window.removeEventListener("wg:cart-updated", updateCartSummary)
  }, [])

  const close = () => setOpen(false)
  const openCart = () => {
    close()
    window.dispatchEvent(new CustomEvent("wg:open-cart"))
  }

  return (
    <>
      <header className={`hdr ${scrolled ? "hdr--scrolled" : "hdr--top"}`}>
        {/* Premium public header V2 */}
        <div className="hdr__trust" aria-live="polite">
          <span key={trustMessageIndex}>
            {trustMessages[trustMessageIndex]}
          </span>
          <span className="hdr__availability">
            <i aria-hidden="true" />
            Asesores disponibles
          </span>
        </div>

        <div className="hdr__shell">
          <div className="hdr__inner">
            <a href="#inicio" className="hdr__brand" onClick={close}>
              <img
                src={scrolled ? "/logo-dark.png" : "/logo-light.png"}
                alt="W&G Corporación Goicha"
                className="hdr__logo"
              />
            </a>

            <nav className="hdr__nav">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={active === l.href ? "is-active" : ""}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="header-actions">
              <a
                href="#productos"
                className="hdr__search-ready"
                aria-label="Ir al buscador de productos"
                title="Buscar productos"
              >
                <Search size={18} strokeWidth={2.2} />
              </a>

              <button
                type="button"
                className={`hdr__cart ${cartSummary.count ? "has-items" : ""}`}
                onClick={openCart}
                aria-label={
                  cartSummary.count
                    ? `Abrir carrito con ${cartSummary.count} productos`
                    : "Abrir carrito vacío"
                }
              >
                <ShoppingCart size={18} strokeWidth={2.2} />
                <span className="hdr__cart-copy">
                  {cartSummary.count ? (
                    <>
                      <strong>{cartSummary.count} producto(s)</strong>
                      <small>S/ {cartSummary.total.toFixed(2)}</small>
                    </>
                  ) : (
                    <>
                      <strong>Carrito</strong>
                      <small>Vacío</small>
                    </>
                  )}
                </span>
                {cartSummary.count > 0 && (
                  <b className="hdr__cart-count">{cartSummary.count}</b>
                )}
              </button>

              <div className="social-links">
                <a
                  href={empresa.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>

                <a
                  href={empresa.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                >
                  <FaTiktok />
                </a>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="quote-btn"
              >
                <FaWhatsapp />
                <span>Comprar / Cotizar</span>
              </a>

              <button
                type="button"
                className={`hdr__burger ${open ? "is-open" : ""}`}
                onClick={() => setOpen((o) => !o)}
                aria-label="Menú"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`hdr__backdrop ${open ? "is-open" : ""}`}
        onClick={close}
        style={{ display: open ? "block" : "none" }}
      />

      <aside className={`hdr__drawer ${open ? "is-open" : ""}`}>
        <div className="drawer__head">
          <a href="#inicio" className="drawer__brand" onClick={close}>
            <img
              src="/logo-light.png"
              alt="W&G Corporación Goicha"
              className="drawer__logo"
            />
          </a>

          <button
            type="button"
            className="drawer__close"
            onClick={close}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <nav className="drawer__nav">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? "is-active" : ""}
              onClick={close}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="drawer__footer">
          <button
            type="button"
            className="drawer__cart"
            onClick={openCart}
          >
            <ShoppingCart size={19} />
            <span>
              {cartSummary.count
                ? `${cartSummary.count} producto(s) · S/ ${cartSummary.total.toFixed(2)}`
                : "Carrito vacío"}
            </span>
          </button>

          <a
  href={whatsappUrl}
  target="_blank"
  rel="noreferrer"
  className="drawer__cta-main drawer__cta-outline"
  onClick={close}
>
  <FaWhatsapp className="drawer__cta-icon" />
  <span>Cotizar por WhatsApp</span>
  <span className="drawer__cta-arrow">→</span>
</a>

          <a href="#productos" className="drawer__cta-sub" onClick={close}>
            Ver catálogo completo →
          </a>

          <div className="drawer-socials">
            <a
              href={empresa.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href={empresa.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Header
