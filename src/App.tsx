import {useEffect, useMemo, useState} from 'react'
import {Link, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import {Checkout} from './components/Checkout'
import {ServiceCard} from './components/ServiceCard'
import {categories, fetchServices} from './data/services'
import type {Booking, CartItem, Service} from './types'
import frontPose from './images/frontPose1.jpeg'
import browResult from './images/eyebrow1.jpeg'
import fullSet from './images/eyelash5.jpeg'
import lashCloseUp from './images/eyelash1.jpeg'
import lashDetail from './images/eyelash2.jpeg'
import lashSet from './images/eyelash3.jpeg'
import lashLift from './images/lashlift1.jpeg'
import tools from './images/holdingTweezers1.jpeg'

const galleryImages = [
    {src: fullSet, alt: 'Close-up of a full lash set'},
    {src: lashCloseUp, alt: 'Lash extension application in progress'},
    {src: browResult, alt: 'Freshly shaped brows'},
    {src: lashDetail, alt: 'Close-up of a finished lash set'},
    {src: lashLift, alt: 'Lash treatment being performed'},
    {src: lashSet, alt: 'Finished lashes reflected in a mirror'},
    {src: tools, alt: 'Lash artist holding application tools'}
]

type HomeProps = {
    services: Service[];
    cartServiceIds: Set<string>;
    onAddToCart: (service: Service) => void;
    onBookNow: (service: Service) => void
}

function Home({services, cartServiceIds, onAddToCart, onBookNow}: HomeProps) {
    const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All')
    const displayServices = useMemo(() => activeCategory === 'All' ? services : services.filter((service) => service.category === activeCategory), [activeCategory, services])

    return <main>
        <section className="hero" id="home">
            <div className="hero__copy"><p className="eyebrow">Beauty, your way</p><h1>Feel like
                your <em>finest</em> self.</h1>
                <p className="hero__description">Thoughtful beauty services, personalised to how you want to feel
                    when you walk out the door.</p>
                <button className="primary-button"
                        onClick={() => document.querySelector('#services')?.scrollIntoView({behavior: 'smooth'})}>Explore
                    services <span>&rarr;</span></button>
            </div>
            <div className="hero__portrait"><img src={frontPose}
                                                 alt="LuxxBeeBeauty lash artist holding pink lash tools"/>
                <span>Made with intention</span></div>
        </section>
        <section className="services-section" id="services">
            <div className="section-heading">
                <div><h2>Services</h2></div>
                <div className="category-tabs">{categories.map((category) => <button key={category}
                                                                                     className={activeCategory === category ? 'active' : ''}
                                                                                     onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
            </div>
            <div className="service-grid">{displayServices.map((service) => <ServiceCard key={service.id}
                                                                                         service={service}
                                                                                         onBook={onBookNow}
                                                                                         onAddToCart={onAddToCart}
                                                                                         isInCart={cartServiceIds.has(service.id)}/>)}</div>
        </section>
        <section className="gallery-section" id="gallery" aria-labelledby="gallery-heading">
            <h2 id="gallery-heading">Gallery</h2>
            <div className="gallery-grid">{galleryImages.map(({src, alt}) => <img className="gallery-image"
                                                                                  src={src} alt={alt} loading="lazy"
                                                                                  key={src}/>)}</div>
        </section>
    </main>
}

type CartProps = { items: CartItem[]; onRemove: (serviceId: string) => void; onClear: () => void }

function Cart({items, onRemove, onClear}: CartProps) {
    const total = items.reduce((sum, item) => sum + item.service.price * item.quantity, 0)
    const serviceCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return <main className="cart-page"><p className="eyebrow">Your selection</p><h1>Your beauty <em>cart</em>.</h1>
        {items.length === 0 ?
            <div className="empty-state"><span>&#10022;</span><h2>Your cart is empty.</h2><p>Add the services you would
                like to book, then review them here.</p><Link className="primary-button" to="/">Explore
                services <span>&rarr;</span></Link></div> :
            <div className="cart-layout">
                <section className="cart-list" aria-label="Cart items">{items.map(({service, serviceId, quantity}) =>
                    <article className="cart-item" key={serviceId}>
                        <div className={`appointment__icon service-card--${service.accent}`}>&#10022;</div>
                        <div><p>{service.category} &middot; {service.duration} min</p><h2>{service.name}</h2>
                            <span>{quantity > 1 ? `${quantity} appointments` : '1 appointment'}</span></div>
                        <strong>${service.price * quantity}</strong>
                        <button className="text-button cart-item__remove" onClick={() => onRemove(serviceId)}>Remove
                        </button>
                    </article>)}</section>
                <aside className="cart-summary"><p className="eyebrow">Summary</p>
                    <p>{serviceCount} {serviceCount === 1 ? 'service' : 'services'}</p>
                    <div><strong>Estimated total</strong><strong>${total}</strong></div>
                    <p className="cart-summary__note">Your details and preferred appointment time will be collected at
                        checkout.</p>
                    <Link className="primary-button" to="/checkout">Continue to booking <span>&rarr;</span></Link>
                    <button className="text-button" type="button" onClick={onClear}>Clear cart</button>
                </aside>
            </div>}
    </main>
}

function Appointments() {
    const [bookings] = useState<Booking[]>([])
    return <main className="appointments"><p className="eyebrow">My appointments</p><h1>Your little moments
        of <em>luxury</em>.</h1>{bookings.length === 0 ?
        <div className="empty-state"><span>&#10022;</span><h2>Nothing booked yet.</h2><p>When you&apos;re ready for a
            little you-time, we&apos;ll be here.</p><Link className="primary-button" to="/">Explore
            services <span>&rarr;</span></Link></div> : null}</main>
}

function CheckoutSuccess() {
    return <main className="checkout-page"><p className="eyebrow">Payment received</p><h1>Your booking is <em>being
        confirmed</em>.</h1><p>We&apos;ll email you as soon as the appointment is confirmed.</p><Link
        className="primary-button" to="/">Back to services <span>&rarr;</span></Link></main>
}

function Header({itemCount}: { itemCount: number }) {
    const location = useLocation()
    return <header><Link className="brand" to="/">LuxxBeeBeauty<br/></Link>
        <nav><a href={location.pathname === '/' ? '#services' : '/#services'}>Services</a><a
            href={location.pathname === '/' ? '#gallery' : '/#gallery'}>Gallery</a></nav>
        <Link className="header-book" to="/cart">Cart{itemCount > 0 &&
            <span className="cart-count" aria-label={`${itemCount} services in cart`}>{itemCount}</span>}</Link>
    </header>
}

export default function App() {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [paymentSubmitted, setPaymentSubmitted] = useState(false)
    const navigate = useNavigate()
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const cartServiceIds = useMemo(() => new Set(cartItems.map((item) => item.serviceId)), [cartItems])

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)
        setError(null)
        fetchServices()
            .then((data) => {
                if (!cancelled) setServices(data)
            })
            .catch((caught) => {
                if (!cancelled) setError(caught instanceof Error ? caught.message : 'Could not load services.')
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    function addToCart(service: Service) {
        setCartItems((current) => current.some((item) => item.serviceId === service.id)
            ? current
            : [...current, {serviceId: service.id, service, quantity: 1}])
    }

    function bookNow(service: Service) {
        addToCart(service)
        navigate('/checkout')
    }

    function removeFromCart(serviceId: string) {
        setCartItems((current) => current.filter((item) => item.serviceId !== serviceId))
    }

    const homeElement = isLoading ? (
        <main className="checkout-page"><p className="eyebrow">Loading</p><h1>Finding your services…</h1></main>
    ) : error ? (
        <main className="checkout-page"><p className="eyebrow">Error</p><h1>We couldn&apos;t load services.</h1>
            <p>{error}</p></main>
    ) : (
        <Home services={services} cartServiceIds={cartServiceIds} onAddToCart={addToCart} onBookNow={bookNow}/>
    )

    return <><Header itemCount={itemCount}/><Routes><Route path="/" element={homeElement}/><Route
        path="/cart"
        element={<Cart items={cartItems} onRemove={removeFromCart} onClear={() => setCartItems([])}/>}/><Route
        path="/checkout"
        element={paymentSubmitted ? <CheckoutSuccess/> : <Checkout items={cartItems} onPaymentSubmitted={() => {
            setCartItems([]);
            setPaymentSubmitted(true)
        }}/>}/>
        <Route path="/checkout/success" element={<CheckoutSuccess/>}/>
        <Route
            path="/appointments" element={<Appointments/>}/><Route path="*"
                                                                   element={homeElement}/></Routes>
        <footer><span>LuxxBeeBeauty</span><p>Slogan Here!!</p>
            <small>&copy; {new Date().getFullYear()} LuxxBeeBeauty</small></footer>
    </>
}
