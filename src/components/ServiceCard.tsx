import type {Service} from '../types'

type Props = {
    service: Service
    onBook: (service: Service) => void
    onAddToCart: (service: Service) => void
}

export function ServiceCard({service, onBook, onAddToCart}: Props) {
    return (
        <article className={`service-card service-card--${service.accent}`}>
            <div className="service-card__top"><span>{service.category}</span><span>{service.duration} min</span></div>
            <div className="service-card__mark">&#10022;</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="service-card__footer">
                <strong>${service.price}</strong>
                <div className="service-card__actions">
                    <button className="text-button" onClick={() => onAddToCart(service)}>Add to cart</button>
                    <button className="text-button" onClick={() => onBook(service)}>Book now <span>&rarr;</span></button>
                </div>
            </div>
        </article>
    )
}
