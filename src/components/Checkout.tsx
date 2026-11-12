import {useEffect, useMemo, useState, type FormEvent} from 'react'
import {isAppointmentAvailable, startCheckout, zonedDateTimeToIso} from '../data/appointments'
import type {CartItem} from '../types'

type Props = { items: CartItem[] }

const timeSlots = [['09:00', '9:00 AM'], ['10:30', '10:30 AM'], ['12:00', '12:00 PM'], ['13:30', '1:30 PM'], ['15:00', '3:00 PM'], ['16:30', '4:30 PM']] as const
const blockedBookingWeekdays = new Set(
    ((import.meta.env.VITE_BLOCKED_BOOKING_WEEKDAYS as string | undefined) ?? '')
        .split(',')
        .map((day) => Number(day.trim()))
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6),
)

function isBlockedBookingDate(date: string): boolean {
    return blockedBookingWeekdays.has(new Date(`${date}T00:00:00`).getDay())
}

function nextAvailableBookingDate(date: Date): string {
    const nextDate = new Date(date)
    while (isBlockedBookingDate(nextDate.toISOString().split('T')[0])) {
        nextDate.setDate(nextDate.getDate() + 1)
    }
    return nextDate.toISOString().split('T')[0]
}

export function Checkout({items}: Props) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]
    const [date, setDate] = useState(() => nextAvailableBookingDate(tomorrow))
    const [time, setTime] = useState<string | null>(null)
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [isLoadingTimes, setIsLoadingTimes] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const durationMinutes = useMemo(() => items.reduce((total, {service, quantity}) => total + service.duration * quantity, 0), [items])
    const total = items.reduce((sum, {service, quantity}) => sum + service.price * quantity, 0)

    useEffect(() => {
        let cancelled = false
        setTime(null)
        setError(null)
        setIsLoadingTimes(true)
        if (isBlockedBookingDate(date)) {
            setAvailableTimes([])
            setIsLoadingTimes(false)
            return () => { cancelled = true }
        }
        Promise.all(timeSlots.map(async ([value]) => ({value, available: await isAppointmentAvailable(zonedDateTimeToIso(date, value), durationMinutes)})))
            .then((results) => { if (!cancelled) setAvailableTimes(results.filter((result) => result.available).map((result) => result.value)) })
            .catch((caught) => { if (!cancelled) setError(caught instanceof Error ? caught.message : 'We could not check availability.') })
            .finally(() => { if (!cancelled) setIsLoadingTimes(false) })
        return () => { cancelled = true }
    }, [date, durationMinutes])

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (isBlockedBookingDate(date)) return setError('Bookings are temporarily unavailable on this day. Please choose another date.')
        if (!time) return setError('Please choose an available appointment time.')
        setIsSubmitting(true)
        setError(null)
        const form = new FormData(event.currentTarget)
        try {
            const {checkoutUrl} = await startCheckout({items, name: String(form.get('name')), email: String(form.get('email')), phone: String(form.get('phone')), startsAt: zonedDateTimeToIso(date, time)})
            window.location.assign(checkoutUrl)
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'We could not start checkout.')
            setIsSubmitting(false)
        }
    }

    if (items.length === 0) return <main className="checkout-page" id="main-content"><h1>Your cart is empty.</h1></main>
    return <main className="checkout-page" id="main-content"><h1>Booking details</h1>
        <section className="checkout-summary" aria-label="Selected services"><p style={{fontWeight: 'bold'}}>Your services</p>
            <ul>{items.map(({service, quantity}) => <li key={service.id}><span>{service.name}{quantity > 1 ? ` × ${quantity}` : ''}</span><strong>${service.price * quantity}</strong></li>)}</ul>
            <div><span>Estimated total</span><strong>${total}</strong></div>
        </section>
        <form className="checkout-form" onSubmit={submit} aria-busy={isSubmitting}>
            <label>Date<input required name="date" type="date" min={minDate} value={date} onChange={(event) => {
                if (isBlockedBookingDate(event.target.value)) {
                    setError('Tuesday through Thursday are temporarily unavailable. Please choose another date.')
                    return
                }
                setError(null)
                setDate(event.target.value)
            }}/></label>
            <fieldset><legend>Available times</legend>
                {isLoadingTimes ? <p className="checkout-note">Checking availability…</p> : availableTimes.length === 0 ? <p className="checkout-note">No times are available on this date. Please choose another.</p> :
                    <div className="time-grid">{timeSlots.filter(([value]) => availableTimes.includes(value)).map(([value, label]) => <button type="button" className={time === value ? 'selected' : ''} onClick={() => setTime(value)} key={value}>{label}</button>)}</div>}
            </fieldset>
            <label>Your name<input required name="name" autoComplete="name" placeholder="Jane Smith…"/></label>
            <label>Email address<input required name="email" type="email" autoComplete="email" spellCheck={false} placeholder="jane@example.com…"/></label>
            <label>Phone number<input required name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-0123"/></label>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <button className="primary-button" disabled={isSubmitting || isLoadingTimes || !time} type="submit">{isSubmitting ? 'Redirecting to checkout…' : 'Continue to secure checkout'} <span>→</span></button>
        </form>
    </main>
}
