import { useState, useEffect } from "react"
import { empresa } from "../data/empresa"
import { FaFacebookF, FaWhatsapp } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa6"

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#categorias", label: "Categorías" },
  { href: "#productos", label: "Productos" },
  { href: "#contacto", label: "Contacto" },
]

const whatsappUrl = `https://wa.me/${empresa?.whatsapp}?text=${encodeURIComponent(
  "Hola, deseo cotizar productos de tuberías y conexiones."
)}`

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("#inicio")

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

  const close = () => setOpen(false)

  return (
    <>
      <header className={`hdr ${scrolled ? "hdr--scrolled" : "hdr--top"}`}>
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
              <span>Cotizar ahora</span>
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
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="drawer__cta-main"
            onClick={close}
          >
            <FaWhatsapp />
            <span>Cotizar por WhatsApp</span>
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