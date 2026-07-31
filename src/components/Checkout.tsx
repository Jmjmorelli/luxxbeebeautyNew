import {useState, type FormEvent} from 'react'
import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import type {CartItem} from '../types'

type BookingDetails = {
    date: string
    time: string
    clientName: string
    email: string
}

type CheckoutSession = {
    bookingId: string
    clientSecret: string
}

type Props = {
    items: CartItem[]
    onPaymentSubmitted: () => void
}

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined
const stripePromise = stripeKey ? loadStripe(stripeKey) : null
const timeSlots = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM']

async function createCheckout(items: CartItem[], details: BookingDetails): Promise<CheckoutSession> {
    const response = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/bookings/checkout`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            items: items.map(({serviceId, quantity}) => ({serviceId, quantity})),
            appointment: details
        })
    })

    if (!response.ok) {
        const body = await response.json().catch(() => null) as {message?: string} | null
        throw new Error(body?.message ?? 'We could not start your secure checkout. Please try again.')
    }
    return response.json() as Promise<CheckoutSession>
}

function PaymentForm({bookingId, onPaymentSubmitted}: { bookingId: string; onPaymentSubmitted: () => void }) {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!stripe || !elements) return

        setIsSubmitting(true)
        setError(null)
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success?booking=${encodeURIComponent(bookingId)}`
            },
            redirect: 'if_required'
        })

        if (result.error) {
            setError(result.error.message ?? 'Your payment could not be confirmed. Please try again.')
            setIsSubmitting(false)
            return
        }
        onPaymentSubmitted()
    }

    return <form className="checkout-form" onSubmit={submit}>
        <PaymentElement options={{layout: 'tabs'}}/>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="primary-button" disabled={!stripe || isSubmitting} type="submit">
            {isSubmitting ? 'Confirming payment…' : 'Pay and confirm booking'} <span>→</span>
        </button>
    </form>
}

export function Checkout({items, onPaymentSubmitted}: Props) {
    const [time, setTime] = useState(timeSlots[0])
    const [session, setSession] = useState<CheckoutSession | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]
    const total = items.reduce((sum, {service, quantity}) => sum + service.price * quantity, 0)

    async function submitDetails(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsCreating(true)
        setError(null)
        const form = new FormData(event.currentTarget)
        try {
            setSession(await createCheckout(items, {
                date: String(form.get('date')),
                time,
                clientName: String(form.get('name')),
                email: String(form.get('email'))
            }))
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'We could not start checkout.')
        } finally {
            setIsCreating(false)
        }
    }

    if (items.length === 0) return <main className="checkout-page"><h1>Your cart is empty.</h1></main>
    if (!stripePromise) return <main className="checkout-page"><h1>Payments are not configured.</h1><p>Add <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to your frontend environment before opening checkout.</p></main>
    if (session) return <main className="checkout-page"><p className="eyebrow">Secure checkout</p><h1>Confirm your <em>booking</em>.</h1><p className="checkout-note">Your appointment is reserved while you complete payment.</p><Elements stripe={stripePromise} options={{clientSecret: session.clientSecret, appearance: {theme: 'stripe'}}}><PaymentForm bookingId={session.bookingId} onPaymentSubmitted={onPaymentSubmitted}/></Elements></main>

    return <main className="checkout-page"><p className="eyebrow">Almost there</p><h1>Booking <em>details</em>.</h1>
        <section className="checkout-summary" aria-label="Selected services">
            <p className="eyebrow">Your services</p>
            <ul>{items.map(({service}) => <li key={service.id}><span>{service.name}</span><strong>${service.price}</strong></li>)}</ul>
            <div><span>Estimated total</span><strong>${total}</strong></div>
        </section>
        <form className="checkout-form" onSubmit={submitDetails}>
            <label>Date<input required name="date" type="date" min={minDate} defaultValue={minDate}/></label>
            <fieldset><legend>Available times</legend><div className="time-grid">{timeSlots.map((slot) => <button type="button" className={time === slot ? 'selected' : ''} onClick={() => setTime(slot)} key={slot}>{slot}</button>)}</div></fieldset>
            <label>Your name<input required name="name" placeholder="Jane Smith"/></label>
            <label>Email address<input required name="email" type="email" placeholder="jane@email.com"/></label>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <button className="primary-button" disabled={isCreating} type="submit">{isCreating ? 'Preparing secure checkout…' : 'Continue to payment'} <span>→</span></button>
        </form>
    </main>
}
