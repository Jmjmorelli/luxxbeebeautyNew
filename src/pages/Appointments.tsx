import {useState} from 'react'
import {Link} from 'react-router-dom'
import type {Booking} from '../types'

export function Appointments() {
    const [bookings] = useState<Booking[]>([])
    return <main className="appointments"><p className="eyebrow">My appointments</p><h1>Your little moments
        of <em>luxury</em>.</h1>{bookings.length === 0 &&
        <div className="empty-state"><span>&#10022;</span><h2>Nothing booked yet.</h2><p>When you&apos;re ready for a
            little you-time, we&apos;ll be here.</p><Link className="primary-button" to="/">Explore
            services <span>&rarr;</span></Link></div>}
    </main>
}
