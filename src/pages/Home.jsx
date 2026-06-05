import Header from "../components/Header"
import WhatsAppButton from "../components/WhatsAppButton"
import Hero from "../components/Hero"
import Categories from "../components/Categories"
import Products from "../products/products"
import { empresa } from "../data/empresa"
import { useState } from "react"
import Footer from "../components/Footer"
import Brands from "../components/Brands"
import WhyChoose from "../components/WhyChoose"
import CompanyShowcase from "../components/CompanyShowcase"
import FeaturedProducts from "../components/FeaturedProducts"
import Testimonials from "../components/Testimonials"
import LocationMap from "../components/LocationMap"

function Home() {
  const mensaje = "Hola, deseo cotizar productos de tuberías y conexiones."
  const whatsappUrl = `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(mensaje)}`
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODOS")

  return (
    <>
      <Header />

      <main className="page-main">

        <section id="inicio">
          <Hero whatsappUrl={whatsappUrl} />
        </section>

        <WhyChoose />

        <CompanyShowcase />

        <section id="categorias">
          <Categories
            whatsappUrl={whatsappUrl}
            onSelectCategory={setCategoriaSeleccionada}
          />
        </section>

        <Brands />

        <FeaturedProducts />

        <section id="productos">
          <Products
            whatsappUrl={whatsappUrl}
            categoriaSeleccionada={categoriaSeleccionada}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />

          <Testimonials />

          <LocationMap />
          
          <Footer />
        </section>
      </main>

      <WhatsAppButton />
    </>
  )
}

export default Home