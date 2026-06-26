import { API_URL } from "../config/api"

const PRODUCTOS_URL = `${API_URL}/api/productos`
const CATEGORIAS_URL = `${API_URL}/api/categorias`
let catalogoPromise
let categoriasPromise

export async function obtenerProductos() {
  const response = await fetch(`${PRODUCTOS_URL}/activos`)

  if (!response.ok) {
    throw new Error("Error al obtener productos")
  }

  return response.json()
}

export async function obtenerProductosCatalogo() {
  if (!catalogoPromise) {
    catalogoPromise = fetch(`${PRODUCTOS_URL}/catalogo`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener el catálogo")
        }

        return response.json()
      })
      .catch((error) => {
        catalogoPromise = null
        throw error
      })
  }

  return catalogoPromise
}

export async function obtenerCategorias() {
  if (!categoriasPromise) {
    categoriasPromise = fetch(CATEGORIAS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener categorías")
        }

        return response.json()
      })
      .catch((error) => {
        categoriasPromise = null
        throw error
      })
  }

  return categoriasPromise
}

export async function obtenerProductosDestacados() {
  const response = await fetch(`${PRODUCTOS_URL}/destacados`)

  if (!response.ok) {
    throw new Error("Error al obtener productos destacados")
  }

  return response.json()
}
