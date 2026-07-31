import {Link} from 'react-router-dom'

export function CheckoutSuccess() {
    return <main className="checkout-page"><p className="eyebrow">Payment received</p><h1>Your booking is <em>being confirmed</em>.</h1><p>We&apos;ll email you as soon as the appointment is confirmed.</p><Link className="primary-button" to="/">Back to services <span>&rarr;</span></Link></main>
}
