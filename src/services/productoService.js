const API_URL = "http://localhost:8080/api/productos"

export async function obtenerProductos() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("Error al obtener productos")
  }

  return response.json()
}
export async function obtenerProductosDestacados() {
  const response = await fetch(`${API_URL}/destacados`)

  if (!response.ok) {
    throw new Error("Error al obtener productos destacados")
  }

  return response.json()
}