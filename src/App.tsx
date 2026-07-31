import {useEffect, useMemo, useState} from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom'
import {Checkout} from './components/Checkout'
import {Footer} from './components/Footer'
import {Header} from './components/Header'
import {fetchServices} from './data/services'
import {About} from './pages/About'
import {Appointments} from './pages/Appointments'
import {Cart} from './pages/Cart'
import {CheckoutSuccess} from './pages/CheckoutSuccess'
import {Home} from './pages/Home'
import type {CartItem, Category, Service} from './types'

export default function App() {
    const [services, setServices] = useState<Service[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [paymentSubmitted, setPaymentSubmitted] = useState(false)
    const navigate = useNavigate()
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const cartServiceIds = useMemo(() => new Set(cartItems.map((item) => item.serviceId)), [cartItems])

    useEffect(() => {
        let cancelled = false
        fetchServices().then((data) => {
            if (!cancelled) {
                setServices(data.services)
                setCategories(data.categories)
            }
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
        setCartItems((current) => current.some((item) => item.serviceId === service.id) ? current : [...current, {
            serviceId: service.id,
            service,
            quantity: 1
        }])
    }

    function bookNow(service: Service) {
        addToCart(service);
        navigate('/checkout')
    }

    const homeElement = isLoading ?
        <main className="checkout-page"><p className="eyebrow">Loading</p><h1>Finding your services&hellip;</h1>
        </main> : error ?
            <main className="checkout-page"><p className="eyebrow">Error</p><h1>We couldn&apos;t load services.</h1>
                <p>{error}</p></main> :
            <Home services={services} categories={categories} cartServiceIds={cartServiceIds} onAddToCart={addToCart}
                         onBookNow={bookNow}/>

    return <><Header itemCount={itemCount}/><Routes>
        <Route path="/" element={homeElement}/><Route path="/about" element={<About/>}/>
        <Route path="/cart" element={<Cart items={cartItems}
                                           onRemove={(serviceId) => setCartItems((current) => current.filter((item) => item.serviceId !== serviceId))}
                                           onClear={() => setCartItems([])}/>}/>
        <Route path="/checkout"
               element={paymentSubmitted ? <CheckoutSuccess/> : <Checkout items={cartItems} onPaymentSubmitted={() => {
                   setCartItems([]);
                   setPaymentSubmitted(true)
               }}/>}/>
        <Route path="/checkout/success" element={<CheckoutSuccess/>}/><Route path="/appointments"
                                                                             element={<Appointments/>}/><Route path="*"
                                                                                                               element={homeElement}/>
    </Routes><Footer/></>
}
