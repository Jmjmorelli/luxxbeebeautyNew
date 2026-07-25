import { useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { BookingPanel } from './components/BookingPanel'
import { ServiceCard } from './components/ServiceCard'
import { categories, services } from './data/services'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Booking, Service } from './types'

function Home() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [bookings, setBookings] = useLocalStorage<Booking[]>('luxx-bookings', [])
  const navigate = useNavigate()
  const displayServices = useMemo(() => activeCategory === 'All' ? services : services.filter((service) => service.category === activeCategory), [activeCategory])

  function saveBooking(details: Omit<Booking, 'id' | 'service'>) {
    if (!selectedService) return
    setBookings((current) => [{ id: crypto.randomUUID(), service: selectedService, ...details }, ...current])
    setSelectedService(null)
    navigate('/appointments')
  }

  return <>
    <main>
      <section className="hero" id="home">
        <div className="hero__copy"><p className="eyebrow">Beauty, your way</p><h1>Feel like your <em>finest</em> self.</h1><p className="hero__description">Thoughtful beauty services, personalised to how you want to feel when you walk out the door.</p><button className="primary-button" onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}>Explore services <span>→</span></button></div>
        <div className="hero__art" aria-label="Abstract beauty illustration"><div className="hero__sun" /><div className="hero__arch" /><div className="hero__flower">✦</div><p>self-care<br/>is sacred</p></div>
      </section>
      <section className="intro"><p className="eyebrow">The Luxx experience</p><p>We’re here for the ritual, the refresh, and the confidence that follows.</p><span>01 — 03</span></section>
      <section className="services-section" id="services"><div className="section-heading"><div><p className="eyebrow">Treatments</p><h2>Made for your moment.</h2></div><div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div><div className="service-grid">{displayServices.map((service) => <ServiceCard key={service.id} service={service} onBook={setSelectedService} />)}</div></section>
      <section className="quote"><span>“</span><p>Beauty is not a look.<br />It’s a feeling you carry.</p><small>— LUXx BEE BEAUTY</small></section>
    </main>
    <BookingPanel service={selectedService} onClose={() => setSelectedService(null)} onSubmit={saveBooking} />
  </>
}

function Appointments() {
  const [bookings] = useLocalStorage<Booking[]>('luxx-bookings', [])
  return <main className="appointments"><p className="eyebrow">My appointments</p><h1>Your little moments of <em>luxury</em>.</h1>{bookings.length === 0 ? <div className="empty-state"><span>✦</span><h2>Nothing booked yet.</h2><p>When you’re ready for a little you-time, we’ll be here.</p><Link className="primary-button" to="/">Explore services <span>→</span></Link></div> : <div className="appointment-list">{bookings.map((booking) => <article className="appointment" key={booking.id}><div className={`appointment__icon service-card--${booking.service.accent}`}>✦</div><div><p>{booking.date} · {booking.time}</p><h2>{booking.service.name}</h2><span>{booking.service.duration} min · ${booking.service.price}</span></div><strong>Confirmed</strong></article>)}</div>}</main>
}

function Header() {
  const location = useLocation()
  return <header><Link className="brand" to="/">LUXX<span>✦</span>BEE<br/><small>BEAUTY STUDIO</small></Link><nav><a href={location.pathname === '/' ? '#services' : '/#services'}>Services</a><a href="#about">Our story</a><Link className={location.pathname === '/appointments' ? 'nav-active' : ''} to="/appointments">My appointments</Link></nav><Link className="header-book" to="/">Book now <span>↗</span></Link></header>
}

export default function App() { return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="/appointments" element={<Appointments />} /><Route path="*" element={<Home />} /></Routes><footer><span>LuxxBeeBeauty</span><p>Good hair. Good skin. Good energy.</p><small>© {new Date().getFullYear()} Luxx Bee Beauty Studio</small></footer></> }
