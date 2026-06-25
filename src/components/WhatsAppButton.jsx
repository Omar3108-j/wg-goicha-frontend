import { empresa } from "../data/empresa"

function WhatsAppButton() {
  const mensaje = `Hola, deseo cotizar productos de tuberías, conexiones y accesorios.`
  const url = `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(mensaje)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Cotizar por WhatsApp"
    >
      <span className="whatsapp-label">Cotizar</span>

      <span className="whatsapp-pulse">
        <svg
          viewBox="0 0 32 32"
          className="whatsapp-svg"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M16.02 3C8.84 3 3 8.7 3 15.72c0 2.25.61 4.45 1.76 6.37L3 29l7.1-1.83A13.2 13.2 0 0 0 16.02 28C23.2 28 29 22.3 29 15.28 29 8.7 23.2 3 16.02 3Zm0 22.76c-1.88 0-3.72-.5-5.33-1.46l-.38-.22-4.22 1.09 1.12-4.02-.25-.41a10.4 10.4 0 0 1-1.6-5.02c0-5.8 4.79-10.5 10.66-10.5 5.87 0 10.64 4.7 10.64 10.06 0 5.78-4.77 10.48-10.64 10.48Zm5.84-7.85c-.32-.16-1.9-.92-2.2-1.03-.29-.1-.5-.16-.72.16-.21.32-.83 1.03-1.02 1.24-.19.21-.37.24-.69.08-.32-.16-1.35-.49-2.57-1.55-.95-.84-1.59-1.88-1.78-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.7-.99-2.33-.26-.61-.52-.53-.72-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.08-1.12 2.63s1.15 3.06 1.31 3.27c.16.21 2.27 3.4 5.5 4.77.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.9-.76 2.17-1.5.27-.74.27-1.37.19-1.5-.08-.13-.29-.21-.61-.37Z"
          />
        </svg>
      </span>
    </a>
  )
}

export default WhatsAppButton
