import {useEffect, useMemo, useState, type FormEvent} from 'react'
import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import {createAppointment, isAppointmentAvailable, zonedDateTimeToIso} from '../data/appointments'
import type {CartItem} from '../types'

type Props = { items: CartItem[]; onPaymentSubmitted: () => void }

const timeSlots = [['09:00', '9:00 AM'], ['10:30', '10:30 AM'], ['12:00', '12:00 PM'], ['13:30', '1:30 PM'], ['15:00', '3:00 PM'], ['16:30', '4:30 PM']] as const
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

function PaymentForm({bookingId, onPaymentSubmitted}: {bookingId: string; onPaymentSubmitted: () => void}) {
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
            confirmParams: {return_url: `${window.location.origin}/checkout/success?booking=${encodeURIComponent(bookingId)}`},
            redirect: 'if_required',
        })
        if (result.error) {
            setError(result.error.message ?? 'Your payment could not be confirmed. Please try again.')
            setIsSubmitting(false)
            return
        }
        onPaymentSubmitted()
    }

    return <form className="checkout-form" onSubmit={submit} aria-busy={isSubmitting}>
        <PaymentElement options={{layout: 'tabs'}}/>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="primary-button" disabled={!stripe || isSubmitting} type="submit">{isSubmitting ? 'Confirming payment…' : 'Pay deposit & request booking'} <span>→</span></button>
    </form>
}

export function Checkout({items, onPaymentSubmitted}: Props) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]
    const [date, setDate] = useState(minDate)
    const [time, setTime] = useState<string | null>(null)
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [isLoadingTimes, setIsLoadingTimes] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [session, setSession] = useState<{bookingId: string; clientSecret: string} | null>(null)
    const durationMinutes = useMemo(() => items.reduce((total, {service, quantity}) => total + service.duration * quantity, 0), [items])
    const total = items.reduce((sum, {service, quantity}) => sum + service.price * quantity, 0)

    useEffect(() => {
        let cancelled = false
        setTime(null)
        setError(null)
        setIsLoadingTimes(true)
        Promise.all(timeSlots.map(async ([value]) => ({value, available: await isAppointmentAvailable(zonedDateTimeToIso(date, value), durationMinutes)})))
            .then((results) => { if (!cancelled) setAvailableTimes(results.filter((result) => result.available).map((result) => result.value)) })
            .catch((caught) => { if (!cancelled) setError(caught instanceof Error ? caught.message : 'We could not check availability.') })
            .finally(() => { if (!cancelled) setIsLoadingTimes(false) })
        return () => { cancelled = true }
    }, [date, durationMinutes])

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!time) return setError('Please choose an available appointment time.')
        setIsSubmitting(true)
        setError(null)
        const form = new FormData(event.currentTarget)
        try {
            setSession(await createAppointment({items, name: String(form.get('name')), email: String(form.get('email')), phone: String(form.get('phone')), startsAt: zonedDateTimeToIso(date, time)}))
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'We could not create your appointment.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (items.length === 0) return <main className="checkout-page" id="main-content"><h1>Your cart is empty.</h1></main>
    if (!stripePromise) return <main className="checkout-page" id="main-content"><h1>Payments are not configured.</h1><p>Add <code>VITE_STRIPE_PUBLISHABLE_KEY</code> before opening checkout.</p></main>
    if (session) return <main className="checkout-page" id="main-content"><p className="eyebrow">Deposit</p><h1>Confirm your booking.</h1><p className="checkout-note">Your selected time is temporarily reserved while you complete the $20 deposit.</p><Elements stripe={stripePromise} options={{clientSecret: session.clientSecret, appearance: {theme: 'stripe'}}}><PaymentForm bookingId={session.bookingId} onPaymentSubmitted={onPaymentSubmitted}/></Elements></main>
    return <main className="checkout-page" id="main-content"><h1>Booking details</h1>
        <section className="checkout-summary" aria-label="Selected services"><p style={{fontWeight: 'bold'}}>Your services</p>
            <ul>{items.map(({service, quantity}) => <li key={service.id}><span>{service.name}{quantity > 1 ? ` × ${quantity}` : ''}</span><strong>${service.price * quantity}</strong></li>)}</ul>
            <div><span>Estimated total</span><strong>${total}</strong></div>
        </section>
        <form className="checkout-form" onSubmit={submit} aria-busy={isSubmitting}>
            <label>Date<input required name="date" type="date" min={minDate} value={date} onChange={(event) => setDate(event.target.value)}/></label>
            <fieldset><legend>Available times</legend>
                {isLoadingTimes ? <p className="checkout-note">Checking availability…</p> : availableTimes.length === 0 ? <p className="checkout-note">No times are available on this date. Please choose another.</p> :
                    <div className="time-grid">{timeSlots.filter(([value]) => availableTimes.includes(value)).map(([value, label]) => <button type="button" className={time === value ? 'selected' : ''} onClick={() => setTime(value)} key={value}>{label}</button>)}</div>}
            </fieldset>
            <label>Your name<input required name="name" autoComplete="name" placeholder="Jane Smith…"/></label>
            <label>Email address<input required name="email" type="email" autoComplete="email" spellCheck={false} placeholder="jane@example.com…"/></label>
            <label>Phone number<input required name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-0123"/></label>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <button className="primary-button" disabled={isSubmitting || isLoadingTimes || !time} type="submit">{isSubmitting ? 'Preparing payment…' : 'Continue to deposit'} <span>→</span></button>
        </form>
    </main>
}
