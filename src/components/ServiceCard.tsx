import type {Service} from '../types'

type Props = { service: Service; onBook: (service: Service) => void }

export function ServiceCard({service, onBook}: Props) {
    return (
        <article className={`service-card service-card--${service.accent}`}>
            <div className="service-card__top"><span>{service.category}</span><span>{service.duration} min</span></div>
            <div className="service-card__mark">✦</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="service-card__footer">
                <strong>${service.price}</strong>
                <button className="text-button" onClick={() => onBook(service)}>Book now <span>→</span></button>
            </div>
        </article>
    )
}
