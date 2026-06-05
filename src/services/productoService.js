import { API_URL } from "../config/api"

const PRODUCTOS_URL = `${API_URL}/api/productos`

export async function obtenerProductos() {
  const response = await fetch(PRODUCTOS_URL)

  if (!response.ok) {
    throw new Error("Error al obtener productos")
  }

  return response.json()
}

export async function obtenerProductosDestacados() {
  const response = await fetch(`${PRODUCTOS_URL}/destacados`)

  if (!response.ok) {
    throw new Error("Error al obtener productos destacados")
  }

  return response.json()
}