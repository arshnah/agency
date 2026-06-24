import { useLenis } from './lib/useLenis'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import DiffSlider from './components/DiffSlider'
import WorkCards from './components/WorkCards'
import Services from './components/Services'
import Water from './components/Water'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

export default function App() {
  useLenis()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <DiffSlider />
        <WorkCards />
        <Services />
        <Water />
        <About />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
