import type {Service} from '../types'

type Props = {
    service: Service
    onBook: (service: Service) => void
    onAddToCart: (service: Service) => void
    isInCart: boolean
}

export function ServiceCard({service, onBook, onAddToCart, isInCart}: Props) {
    return (
        <article className={`service-card service-card--${service.accent}`}>
            <div className="service-card__top"><span>{service.category}</span><span>{service.duration} min</span></div>
            <div className="service-card__mark"></div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="service-card__footer">
                <strong>${service.price}</strong>
                <div className="service-card__actions">
                    <button className="text-button service-card__add-button" onClick={() => onAddToCart(service)}
                            disabled={isInCart}
                            aria-label={isInCart ? `${service.name} is already in your cart` : `Add ${service.name} to your cart`}>
                        {isInCart ? 'Added to cart' : 'Add to cart'}
                    </button>
                    <button className="text-button" onClick={() => onBook(service)}>Book now <span>&rarr;</span>
                    </button>
                </div>
            </div>
        </article>
    )
}
