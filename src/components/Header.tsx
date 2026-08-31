import {Link, NavLink, useLocation} from 'react-router-dom'

type Props = {
    itemCount: number
}

export function Header({itemCount}: Props) {
    const location = useLocation()
    const homeSectionLink = (section: string) => location.pathname === '/' ? section : `/${section}`

    return <>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <header>
        <Link className="brand" to="/" translate="no">LUXXBEE<br/><span>BEAUTY</span></Link>
        <nav aria-label="Main navigation">
            <a href={homeSectionLink('#services')}>Services</a>
            <NavLink to="/about" className={({isActive}) => isActive ? 'nav-active' : undefined}>About me</NavLink>
            <a href={homeSectionLink('#gallery')}>Gallery</a>
        </nav>
        <Link className="header-book" to="/cart">Your cart{itemCount > 0 &&
            <span className="cart-count" aria-label={`${itemCount} services in cart`}>{itemCount}</span>}</Link>
    </header></>
}
