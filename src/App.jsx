import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminLayout from "./components/admin/AdminLayout"

import "./App.css"

import Home from "./pages/Home"

import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AddProduct from "./pages/admin/AddProduct"
import EditProduct from "./pages/admin/EditProduct"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminQuotations from "./pages/admin/AdminQuotations"
import CategoriasAdmin from "./components/admin/CategoriasAdmin"

import ProtectedRoute from "./routes/ProtectedRoute"

function App() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODOS")
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin"element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
        <Route path="/admin/dashboard"element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
        <Route path="/admin/productos"element={<ProtectedRoute><AdminProducts /></ProtectedRoute>}/>
        <Route path="/admin/categorias"element={<ProtectedRoute><AdminLayout><CategoriasAdmin /></AdminLayout></ProtectedRoute>}/>
        <Route path="/admin/productos/nuevo"element={<ProtectedRoute><AddProduct /></ProtectedRoute>}/>
        <Route path="/admin/productos/editar/:id"element={<ProtectedRoute><EditProduct /></ProtectedRoute>}/>
        <Route path="/admin/pedidos"element={<ProtectedRoute><AdminOrders /></ProtectedRoute>}/>
        <Route path="/admin/cotizaciones"element={<ProtectedRoute><AdminQuotations/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
