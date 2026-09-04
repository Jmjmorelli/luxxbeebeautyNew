import {Link} from 'react-router-dom'

export function CheckoutSuccess() {
    return <main className="checkout-page"><p style={{fontWeight: "bold"}}>Deposit received</p><h1>Your booking is being
        confirmed.</h1><p>Please check your email, details will be sent.</p><Link
        className="primary-button" to="/">Back to services <span>&rarr;</span></Link></main>
}
