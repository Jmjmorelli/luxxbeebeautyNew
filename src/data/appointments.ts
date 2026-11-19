import type {CartItem} from '../types'
import {apiUrl} from './api'

const TIMEZONE = 'America/New_York'

/** Converts the date and clock time selected in the studio's timezone to an ISO instant. */
export function zonedDateTimeToIso(date: string, time: string, timeZone = TIMEZONE): string {
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)
    const targetUtc = Date.UTC(year, month - 1, day, hours, minutes)
    let timestamp = targetUtc
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    })
    for (let index = 0; index < 2; index++) {
        const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]))
        const displayedUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute))
        timestamp = targetUtc - (displayedUtc - timestamp)
    }
    return new Date(timestamp).toISOString()
}

export async function startCheckout({items, name, email, phone, startsAt}: {
    items: CartItem[];
    name: string;
    email: string;
    phone: string;
    startsAt: string
}): Promise<{ checkoutUrl: string; confirmationToken: string }> {
    const response = await fetch(apiUrl('/api/v3/lux/bookings/checkout'), {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            customer: {name, email, phone},
            startsAt,
            timezone: TIMEZONE,
            services: items.map(({serviceId, quantity}) => ({serviceId, quantity}))
        }),
    })
    const body = await response.json().catch(() => null) as {
        message?: string;
        error?: string;
        checkoutUrl?: string;
        confirmationToken?: string;
    } | null
    if (response.ok) {
        if (body?.checkoutUrl && body.confirmationToken) return {checkoutUrl: body.checkoutUrl, confirmationToken: body.confirmationToken}
        throw new Error('The appointment was created, but checkout could not be initialized. Please contact us before trying again.')
    }
    throw new Error(body?.error ?? body?.message ?? 'We could not create your appointment. Please try again.')
}

export type BookingConfirmation = {
    bookingId: string;
    bookingStatus: string;
    paymentStatus: string;
    totalAmountCents: number;
    depositAmountCents: number;
    paidAmountCents: number;
    outstandingBalanceCents: number;
    updatedAt: string;
}

export async function getBookingConfirmation(confirmationToken: string): Promise<BookingConfirmation> {
    const response = await fetch(apiUrl(`/api/v3/lux/bookings/confirmations/${encodeURIComponent(confirmationToken)}`))
    if (!response.ok) throw new Error('We could not confirm your booking yet. Please refresh in a moment.')
    return response.json() as Promise<BookingConfirmation>
}
