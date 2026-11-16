import SmoothScroll from './components/SmoothScroll'
import Nav from './components/Nav'
import WhatsAppFab from './components/WhatsAppFab'
import Marquee from './components/Marquee'
import Hero from './sections/Hero'
import Services from './sections/Services'
import Process from './sections/Process'
import Projects from './sections/Projects'
import BeforeAfter from './sections/BeforeAfter'
import About from './sections/About'
import Testimonials from './sections/Testimonials'
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import { MARQUEE_ITEMS } from './data/site'

export default function App() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      {/* Marco de la página: padding alrededor y secciones con bordes de 20px */}
      <main className="flex flex-col gap-3 p-3">
        <Hero />
        <Marquee items={MARQUEE_ITEMS} />
        <Services />
        <Process />
        <Projects />
        <BeforeAfter />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
        <Footer />
      </main>
      <WhatsAppFab />
    </>
  )
}