import axios from "axios"
import { API_URL } from "../config/api"

/* Backend admin JWT auth V1 */
const ADMIN_TOKEN_KEY = "wg-admin-token"
const ADMIN_USER_KEY = "wg-admin-user"

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY)

export const getAdminUser = () => {
  try {
    const rawUser = localStorage.getItem(ADMIN_USER_KEY)
    return rawUser ? JSON.parse(rawUser) : null
  } catch {
    localStorage.removeItem(ADMIN_USER_KEY)
    return null
  }
}

export const saveAdminSession = ({ token, usuario }) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(usuario))
  sessionStorage.removeItem("adminAuth")
}

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  localStorage.removeItem("adminAuth")
  sessionStorage.removeItem("adminAuth")
}

export const loginAdmin = async ({ username, password }) => {
  const { data } = await axios.post(`${API_URL}/api/auth/login`, {
    username,
    password,
  })

  saveAdminSession(data)
  return data.usuario
}

export const loadCurrentAdminUser = async () => {
  if (!getAdminToken()) return null

  const { data } = await axios.get(`${API_URL}/api/auth/me`)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data))
  sessionStorage.removeItem("adminAuth")
  return data
}
