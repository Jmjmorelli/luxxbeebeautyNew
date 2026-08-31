import {useMemo, useState} from 'react'
import {ServiceCard} from '../components/ServiceCard'
import {galleryImages} from '../data/gallery'
import frontPose from '../images/frontPose1.jpeg'
import type {Category, Service} from '../types'

type Props = {
    services: Service[]
    categories: Category[]
    cartServiceIds: Set<string>
    onAddToCart: (service: Service) => void
    onBookNow: (service: Service) => void
}

export function Home({services, categories, cartServiceIds, onAddToCart, onBookNow}: Props) {
    const [activeCategory, setActiveCategory] = useState<string>('All')
    const displayServices = useMemo(
        () => activeCategory === 'All' ? services : services.filter((service) => service.category === activeCategory),
        [activeCategory, services],
    )

    return <main id="main-content">
        <section className="hero" id="home">
            <div className="hero__copy"><p className="eyebrow"></p><h1>Beauty that feels
                like you</h1>
                <p className="hero__description">Unhurried appointments and intentional details for the version of you
                    that shows up with ease.</p>
                <button className="primary-button"
                        onClick={() => document.querySelector('#services')?.scrollIntoView({behavior: 'smooth'})}>Explore
                    services <span>&rarr;</span></button>
            </div>
            <div className="hero__portrait"><img src={frontPose} width="900" height="1200" fetchPriority="high"
                                                 alt="LuxxBeeBeauty lash artist holding pink lash tools"/><span>Made for your moment</span>
            </div>
        </section>
        <section className="services-section" id="services">
            <div className="section-heading">
                <div><p className="eyebrow"></p><h2>Choose your ritual</h2></div>
                <div className="category-tabs">
                    <button key="All" className={activeCategory === 'All' ? 'active' : ''}
                            onClick={() => setActiveCategory('All')}>All
                    </button>
                    {categories.map((category) => <button key={category.id}
                                                          className={activeCategory === category.name ? 'active' : ''}
                                                          onClick={() => setActiveCategory(category.name)}>{category.name}</button>)}
                </div>
            </div>
            <div className="service-grid">{displayServices.map((service) => <ServiceCard key={service.id}
                                                                                         service={service}
                                                                                         onBook={onBookNow}
                                                                                         onAddToCart={onAddToCart}
                                                                                         isInCart={cartServiceIds.has(service.id)}/>)}</div>
        </section>
        <section className="gallery-section" id="gallery" aria-labelledby="gallery-heading">
            <p className="eyebrow"></p><h2 id="gallery-heading">The details speak</h2>
            <div className="gallery-grid">{galleryImages.map(({src, alt}) => <img className="gallery-image" src={src}
                                                                                  width="800" height="1000"
                                                                                  alt={alt} loading="lazy"
                                                                                  key={src}/>)}</div>
        </section>
    </main>
}
