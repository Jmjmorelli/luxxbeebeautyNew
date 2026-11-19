import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {getBookingConfirmation, type BookingConfirmation} from '../data/appointments'

const confirmationTokenKey = 'luxBookingConfirmationToken'

export function CheckoutSuccess() {
    const [booking, setBooking] = useState<BookingConfirmation | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const confirmationToken = sessionStorage.getItem(confirmationTokenKey)
        if (!confirmationToken) {
            setError('We could not find this booking confirmation. Please contact us if your deposit was charged.')
            return
        }

        let cancelled = false
        let timer: number | undefined
        const load = async () => {
            try {
                const confirmation = await getBookingConfirmation(confirmationToken)
                if (cancelled) return
                setBooking(confirmation)
                setError(null)
                if (confirmation.paymentStatus === 'requires_payment') timer = window.setTimeout(load, 2_000)
            } catch (caught) {
                if (cancelled) return
                setError(caught instanceof Error ? caught.message : 'We could not confirm your booking yet.')
                timer = window.setTimeout(load, 2_000)
            }
        }
        void load()
        return () => {
            cancelled = true
            if (timer !== undefined) window.clearTimeout(timer)
        }
    }, [])

    const isConfirmed = booking?.paymentStatus === 'paid'
    const isPending = booking?.paymentStatus === 'requires_payment'
    const deposit = booking ? (booking.paidAmountCents / 100).toFixed(2) : null
    const remainingBalance = booking ? (booking.outstandingBalanceCents / 100).toFixed(2) : null

    return <main className="checkout-page">
        <p style={{fontWeight: 'bold'}}>{isConfirmed ? 'Deposit received' : 'Confirming your deposit'}</p>
        <h1>{isConfirmed ? 'Your booking is confirmed.' : 'Your booking is being confirmed.'}</h1>
        {isConfirmed && <p>Your ${deposit} deposit was received. The remaining balance is ${remainingBalance} and is due at your appointment.</p>}
        {isPending && !error && <p>Stripe is confirming your payment. This usually takes only a few seconds.</p>}
        {booking && !isConfirmed && !isPending && <p>Your payment was not confirmed. Please return to services to book another time.</p>}
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <Link className="primary-button" to="/">Back to services <span>&rarr;</span></Link>
    </main>
}
