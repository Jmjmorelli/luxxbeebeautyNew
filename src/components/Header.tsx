import {Link, NavLink, useLocation} from 'react-router-dom'

type Props = {
    itemCount: number
}

export function Header({itemCount}: Props) {
    const location = useLocation()
    const homeSectionLink = (section: string) => location.pathname === '/' ? section : `/${section}`

    return <header>
        <Link className="brand" to="/">LuxxBeeBeauty</Link>
        <nav aria-label="Main navigation">
            <a href={homeSectionLink('#services')}>Services</a>
            <NavLink to="/about" className={({isActive}) => isActive ? 'nav-active' : undefined}>About me</NavLink>
            <a href={homeSectionLink('#gallery')}>Gallery</a>
        </nav>
        <Link className="header-book" to="/cart">Cart{itemCount > 0 &&
            <span className="cart-count" aria-label={`${itemCount} services in cart`}>{itemCount}</span>}</Link>
    </header>
}
