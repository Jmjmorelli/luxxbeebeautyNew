import type {CartItem} from '../types'
import {apiUrl} from './api'

const TIMEZONE = 'America/New_York'

type AvailabilityResponse = boolean | {
    available?: boolean;
    isAvailable?: boolean;
    data?: { available?: boolean; isAvailable?: boolean }
}

function availabilityValue(response: AvailabilityResponse): boolean {
    if (typeof response === 'boolean') return response
    return response.available ?? response.isAvailable ?? response.data?.available ?? response.data?.isAvailable ?? false
}

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

export async function isAppointmentAvailable(startsAt: string, durationMinutes: number): Promise<boolean> {
    const endsAt = new Date(new Date(startsAt).getTime() + durationMinutes * 60_000).toISOString()
    const url = apiUrl('/api/v1/lux/availability')
    url.searchParams.set('startsAt', startsAt)
    url.searchParams.set('endsAt', endsAt)
    const response = await fetch(url)
    if (!response.ok) throw new Error('We could not check availability. Please try again.')
    return availabilityValue(await response.json() as AvailabilityResponse)
}

export async function startCheckout({items, name, email, phone, startsAt}: {
    items: CartItem[];
    name: string;
    email: string;
    phone: string;
    startsAt: string
}): Promise<{ checkoutUrl: string }> {
    const response = await fetch(apiUrl('/api/v1/lux/checkout'), {
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
    } | null
    if (response.ok) {
        if (body?.checkoutUrl) return {checkoutUrl: body.checkoutUrl}
        throw new Error('The appointment was created, but checkout could not be initialized. Please contact us before trying again.')
    }
    throw new Error(body?.error ?? body?.message ?? 'We could not create your appointment. Please try again.')
}
