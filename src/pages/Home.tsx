import Navbar from "@/sections/Navbar"
import Hero from "@/sections/Hero"
import About from "@/sections/About"
import Works from "@/sections/Works"
import Services from "@/sections/Services"
import Testimonials from "@/sections/Testimonials"
import Contact from "@/sections/Contact"
import Footer from "@/sections/Footer"
import ChatWidget from "@/components/ChatWidget"
import FloatingButtons from "@/components/FloatingButtons"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Works />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
      <ChatWidget />
      <FloatingButtons />
    </>
  )
}
