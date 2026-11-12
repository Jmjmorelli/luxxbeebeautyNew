import {Link} from 'react-router-dom'

export function CheckoutCancelled() {
    return <main className="checkout-page"><p style={{fontWeight: 'bold'}}>Checkout cancelled</p><h1>Your booking was not
        confirmed.</h1><p>Your selected appointment time will be released shortly. You can return to services whenever you are ready.</p><Link
        className="primary-button" to="/">Back to services <span>&rarr;</span></Link></main>
}
