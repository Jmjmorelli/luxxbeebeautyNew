import sidePose from '../images/sidePose.jpeg'

export function About() {
    return <main className="about-page" id="main-content">
        <section className="about-hero">
            <div className="about-hero__copy"><p className="eyebrow">The artist behind LuxxBeeBeauty</p><h1>Hi,
                I&apos;m <em>Erykah</em>.</h1>
                <p>I&apos;m a 22 year old Licensed Cosmetologist and I specialize in lashes and locs. I&apos;ve been
                    licensed for just over a year now and I&apos;m excited to see where this goes!! I&apos;d love to
                    have you in my chair.</p>
                <a className="primary-button" href="https://www.instagram.com/luxxbeebeauty" target="_blank"
                   rel="noreferrer">Follow on Instagram <span>&rarr;</span></a>
            </div>
            <div className="about-hero__portrait"><img src={sidePose} width="900" height="1200"
                                                       alt="Erykah, licensed cosmetologist and owner of LuxxBeeBeauty"/>
            </div>
        </section>
        <section className="about-details" aria-label="Contact details">
            <div><p className="eyebrow">Instagram</p><a href="https://www.instagram.com/luxxbeebeauty" target="_blank"
                                                        rel="noreferrer">@luxxbeebeauty</a></div>
            <div><p className="eyebrow">Website</p><a href="https://luxxbeebeauty.com" target="_blank"
                                                      rel="noreferrer">luxxbeebeauty.com</a></div>
            <div><p className="eyebrow">Visit the studio</p>
                <address>1930 Pennsylvania Ave, Ste B</address>
            </div>
        </section>
    </main>
}
