import { useState, useEffect } from "react"
import { empresa } from "../data/empresa"



const navLinks = [
  { href: "#inicio",      label: "Inicio" },
  { href: "#categorias",  label: "Categorías" },
  { href: "#productos",    label: "Productos" },
  { href: "#contacto",    label: "Contacto" },
]

const whatsappUrl = `https://wa.me/${empresa?.whatsapp}?text=${encodeURIComponent("Hola, deseo cotizar productos de tuberías y conexiones.")}`

function Header() {
  const [open,       setOpen]    = useState(false)
  const [scrolled,   setScrolled] = useState(false)
  const [active,     setActive]  = useState("#inicio")
 

  /* ── scroll listener ── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)

      const sections = navLinks
        .map(l => document.querySelector(l.href))
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

  /* ── body lock ── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const close = () => setOpen(false)

  /* ─────────────────────────────────────────── */
  return (
    <>
      {/* ─── HEADER BAR ─── */}
      <header className={`hdr ${scrolled ? "hdr--scrolled" : "hdr--top"}`}>
        <div className="hdr__inner">

          {/* Brand */}
          <a href="#inicio" className="hdr__brand" onClick={close}>
            <img
              src={scrolled ? "/logo-dark.png" : "/logo-light.png"}
              alt="W&G Corporación Goicha"
              className="hdr__logo"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hdr__nav">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={active === l.href ? "is-active" : ""}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="hdr__right">
            {/* CTA desktop */}
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hdr__cta">
              <svg width="15" height="15" viewBox="0 0 32 32" fill="currentColor">
                <path d="M19.11 17.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.5.7.3 1.25.47 1.67.6.7.22 1.33.2 1.83.12.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
                <path d="M16.03 3.2C9.2 3.2 3.66 8.74 3.66 15.57c0 2.18.57 4.3 1.65 6.17L3.2 28.8l7.26-1.9a12.3 12.3 0 0 0 5.57 1.34h.01c6.83 0 12.37-5.55 12.37-12.38 0-3.31-1.29-6.42-3.63-8.75A12.28 12.28 0 0 0 16.03 3.2zm0 22.95h-.01c-1.85 0-3.67-.5-5.25-1.43l-.38-.23-4.3 1.13 1.15-4.2-.25-.4a10.26 10.26 0 0 1-1.58-5.45c0-5.67 4.62-10.29 10.3-10.29 2.75 0 5.33 1.07 7.28 3.02a10.23 10.23 0 0 1 3.01 7.28c0 5.68-4.62 10.3-10.29 10.3z"/>
              </svg>
              Cotizar ahora
            </a>

            {/* Hamburger */}
            <button
              className={`hdr__burger ${open ? "is-open" : ""}`}
              onClick={() => setOpen(o => !o)}
              aria-label="Menú"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE DRAWER ─── */}
      <div
        className={`hdr__backdrop ${open ? "is-open" : ""}`}
        onClick={close}
        style={{ display: open ? "block" : "none" }}
      />

      <div className={`hdr__drawer ${open ? "is-open" : ""}`}>

        {/* Drawer header */}
        <div className="drawer__head">
          <a href="#inicio" className="drawer__brand" onClick={close}>
  <img
    src="/logo-header.png"
    alt="W&G Corporación Goicha"
    className="drawer__logo"
  />
</a>
          <button className="drawer__close" onClick={close} aria-label="Cerrar">✕</button>
        </div>

        {/* Nav links */}
        <nav className="drawer__nav">
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? "is-active" : ""}
              onClick={close}
            >
              <span className="nav-dot" />
              {l.label}
            </a>
          ))}
        </nav>
      
              {/* Footer CTAs */}
        <div className="drawer__footer">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="drawer__cta-main"
            onClick={close}
          >
            <svg width="17" height="17" viewBox="0 0 32 32" fill="currentColor">
              <path d="M19.11 17.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.5.7.3 1.25.47 1.67.6.7.22 1.33.2 1.83.12.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
              <path d="M16.03 3.2C9.2 3.2 3.66 8.74 3.66 15.57c0 2.18.57 4.3 1.65 6.17L3.2 28.8l7.26-1.9a12.3 12.3 0 0 0 5.57 1.34h.01c6.83 0 12.37-5.55 12.37-12.38 0-3.31-1.29-6.42-3.63-8.75A12.28 12.28 0 0 0 16.03 3.2zm0 22.95h-.01c-1.85 0-3.67-.5-5.25-1.43l-.38-.23-4.3 1.13 1.15-4.2-.25-.4a10.26 10.26 0 0 1-1.58-5.45c0-5.67 4.62-10.29 10.3-10.29 2.75 0 5.33 1.07 7.28 3.02a10.23 10.23 0 0 1 3.01 7.28c0 5.68-4.62 10.3-10.29 10.3z"/>
            </svg>
            Cotizar por WhatsApp
          </a>
          <a href="#productos" className="drawer__cta-sub" onClick={close}>
            Ver catálogo completo →
          </a>
        </div>
      </div>
    </>
  )
}

export default Header