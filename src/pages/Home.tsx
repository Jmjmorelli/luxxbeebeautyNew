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

    return <main>
        <section className="hero" id="home">
            <div className="hero__copy"><p className="eyebrow">Be The Beauty</p><h1>Feel like
                your <em>finest</em> self.</h1>
                <p className="hero__description">Thoughtful beauty services, personalised to how you want to feel when
                    you walk out the door.</p>
                <button className="primary-button"
                        onClick={() => document.querySelector('#services')?.scrollIntoView({behavior: 'smooth'})}>Explore
                    services <span>&rarr;</span></button>
            </div>
            <div className="hero__portrait"><img src={frontPose}
                                                 alt="LuxxBeeBeauty lash artist holding pink lash tools"/><span>Made with intention</span>
            </div>
        </section>
        <section className="services-section" id="services">
            <div className="section-heading"><h2>Services</h2>
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
            <h2 id="gallery-heading">Gallery</h2>
            <div className="gallery-grid">{galleryImages.map(({src, alt}) => <img className="gallery-image" src={src}
                                                                                  alt={alt} loading="lazy"
                                                                                  key={src}/>)}</div>
        </section>
    </main>
}
