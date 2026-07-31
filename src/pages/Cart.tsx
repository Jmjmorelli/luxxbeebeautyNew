import {Link} from 'react-router-dom'
import type {CartItem} from '../types'

type Props = { items: CartItem[]; onRemove: (serviceId: string) => void; onClear: () => void }

export function Cart({items, onRemove, onClear}: Props) {
    const total = items.reduce((sum, item) => sum + item.service.price * item.quantity, 0)
    const serviceCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return <main className="cart-page"><p className="eyebrow">Your selection</p><h1>Your beauty <em>cart</em>.</h1>
        {items.length === 0 ? <div className="empty-state"><span></span><h2>Your cart is empty.</h2><p>Add the services you would like to book, then review them here.</p><Link className="primary-button" to="/">Explore services <span>&rarr;</span></Link></div> :
            <div className="cart-layout"><section className="cart-list" aria-label="Cart items">{items.map(({service, serviceId, quantity}) => <article className="cart-item" key={serviceId}>
                <div className={`service-card--${service.accent}`}></div><div><p>{service.category} &middot; {service.duration} min</p><h2>{service.name}</h2><span>{quantity > 1 ? `${quantity} appointments` : '1 appointment'}</span></div><strong>${service.price * quantity}</strong>
                <button className="text-button cart-item__remove" onClick={() => onRemove(serviceId)}>Remove</button>
            </article>)}</section>
                <aside className="cart-summary"><p className="eyebrow">Summary</p><p>{serviceCount} {serviceCount === 1 ? 'service' : 'services'}</p><div><strong>Estimated total</strong><strong>${total}</strong></div><p className="cart-summary__note">Your details and preferred appointment time will be collected at checkout.</p><Link className="primary-button" to="/checkout">Continue to booking <span>&rarr;</span></Link><button className="text-button" type="button" onClick={onClear}>Clear cart</button></aside>
            </div>}
    </main>
}
