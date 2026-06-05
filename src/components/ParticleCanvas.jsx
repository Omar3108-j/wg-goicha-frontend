import { useEffect, useRef } from "react"
import { API_URL } from "../config/api"

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    let animId
    let W, H, particles

    const isMobile = () => window.innerWidth < 600
    const COUNT = () => (isMobile() ? 50 : 95)
    const MAX_DIST = () => (isMobile() ? 105 : 145)
    const SPEED = 0.42

    function resize() {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function mkParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.8 + 0.8,
      }
    }

    function init() {
      resize()
      particles = Array.from({ length: COUNT() }, mkParticle)
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const maxD = MAX_DIST()

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < maxD) {
            const alpha = (1 - d / maxD) * 0.32

            ctx.beginPath()
            ctx.strokeStyle = `rgba(229,57,53,${alpha})`
            ctx.lineWidth = 0.9
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(229,57,53,0.52)"
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    draw()

    const ro = new ResizeObserver(init)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

export default ParticleCanvas