import { useState } from "react";
import "./Home.css";
import Button from '../../components/ui/Button'

const mockStats = [
  { label: "Dogs Documented", value: 1248, icon: "paw" },
  { label: "Reports Reviewed", value: 3562, icon: "file" },
  { label: "Welfare Records", value: 892, icon: "heart" },
  { label: "Active Community Members", value: 320, icon: "users" },
];

const dogs = [
  {
    name: "Roxy",
    area: "Riverdale Park",
    status: "Verified",
    tags: ["Spayed", "Vaccinated"],
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Milo",
    area: "Lake View Road",
    status: "Verified",
    tags: ["Vaccinated", "Friendly"],
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Chutney",
    area: "Market Street",
    status: "Needs review",
    tags: ["Community cared"],
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85",
  },
];

const features = [
  {
    icon: "⌖",
    color: "mint",
    title: "Interactive Map",
    description:
      "Explore verified dog locations, sightings, and territories across your city.",
    image:
      "https://images.unsplash.com/photo-1524666041070-9b8767618fce?auto=format&fit=crop&w=900&q=85",
    alt: "Map with streets and location markers",
  },
  {
    icon: "♡",
    color: "coral",
    title: "Detailed Profiles",
    description:
      "View comprehensive profiles for each dog, including photos, identifying features, and history.",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=85",
    alt: "Two dogs sitting together",
  },
  {
    icon: "✚",
    color: "mint",
    title: "Health Records",
    description:
      "Track vaccinations, sterilization, treatments, and welfare updates over time.",
    image:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=900&q=85",
    alt: "Veterinarian caring for a dog",
  },
  {
    icon: "♧",
    color: "lavender",
    title: "Community Impact",
    description:
      "Join a growing community of people who care about street dog welfare.",
    image:
      "https://images.unsplash.com/photo-1551730459-92db2a308d6a?auto=format&fit=crop&w=900&q=85",
    alt: "Volunteers helping dogs",
  },
];

function Icon({ name }: { name: string }) {
  const common = {
    width: 23,
    height: 23,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "paw")
    return <svg {...common}><circle cx="7" cy="7" r="2.1" /><circle cx="12" cy="5" r="2.1" /><circle cx="17" cy="7" r="2.1" /><circle cx="19" cy="12" r="1.8" /><path d="M5.2 15.3c0-2.5 3-4.6 6.8-4.6s6.8 2.1 6.8 4.6c0 2.1-2 3.2-4 2.5-1.9-.7-3.7-.7-5.6 0-2 .7-4-.4-4-2.5Z" /></svg>;
  if (name === "file")
    return <svg {...common}><path d="M7 3.5h7l4 4V21H7z" /><path d="M14 3.5V8h4M10 12h5M10 16h5" /></svg>;
  if (name === "heart")
    return <svg {...common}><path d="M20.5 8.7c0 5-8.5 10-8.5 10s-8.5-5-8.5-10A4.5 4.5 0 0 1 12 6.2a4.5 4.5 0 0 1 8.5 2.5Z" /></svg>;
  if (name === "users")
    return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h1a5.5 5.5 0 0 1 5.5 5.5V20M16 5.5a3 3 0 0 1 0 5.8M18 13.5a4.5 4.5 0 0 1 2.5 4V20" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Dog Territory home">
          <span className="brand-mark"><Icon name="paw" /></span>
          <span className="brand-copy"><strong>dog territory</strong><small>EVERY DOG. EVERY LIFE.</small></span>
        </a>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">☰</button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a className="active" href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#map" onClick={() => setMenuOpen(false)}>Explore Map</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#impact" onClick={() => setMenuOpen(false)}>Our Impact</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
        <div className="header-actions">
          <Button variant="secondary" size="small" className="signin-button" href="/signin">Sign In</Button>
          <Button variant="signup" size="small" href="/signup">Create Account</Button>
          <Button variant="primary" size="small" className="report-button" href="/report">Report a Sighting <span>↗</span></Button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-photo" />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-dot" /> COMMUNITY · CARE · SAFER STREETS</div>
            <h1>Every territory<br />tells <em>a story.</em></h1>
            <p className="hero-lead">Report, track, and support street dogs in your community. Dog Territory connects people, locations, and welfare information to build safer, healthier neighborhoods for every dog.</p>
            <div className="hero-buttons">
              <Button href="/report">Report a Sighting <span>→</span></Button>
              <Button variant="secondary" href="#map">Explore the Map <span>↗</span></Button>
            </div>
            <div className="hero-trust">
              <div><span className="trust-icon">✿</span><p><b>Verified information</b><small>Reviewed by administrators</small></p></div>
              <div><span className="trust-icon">♧</span><p><b>Community driven</b><small>People make a difference</small></p></div>
              <div><span className="trust-icon">♥</span><p><b>Better welfare</b><small>Healthier, safer communities</small></p></div>
            </div>
          </div>
          <div className="hero-note">Same streets.<br />Same stories.<br /><strong>Brighter futures</strong> <span>♡</span></div>
          <div className="map-float" id="map">
            <div className="mini-map">
              <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
              <span className="map-pin pin-one">♥</span><span className="map-pin pin-two">♥</span><span className="map-pin pin-three">✦</span>
              <span className="map-water" />
            </div>
            <div className="dog-float-card">
              <img src={dogs[0].image} alt="Roxy the community dog" />
              <div className="dog-card-info"><strong>{dogs[0].name} <span className="verified">✓ Verified</span></strong><small>◉ {dogs[0].area}</small><div className="tag-row">{dogs[0].tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href="#features">View Profile →</a></div>
            </div>
          </div>
          <div className="hero-doodle">Real dogs<br />Real communities<br />Real change</div>
        </section>

        <section className="stats-strip" aria-label="Community statistics">
          {mockStats.map((stat) => <div className="stat" key={stat.label}><span className={`stat-icon ${stat.icon}`}><Icon name={stat.icon} /></span><strong>{stat.value.toLocaleString("en-IN")}</strong><span>{stat.label}</span></div>)}
        </section>

        <section className="how-section section-wrap" id="how-it-works">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot blue" /> HOW IT WORKS</div><h2>From a sighting<br />to a <em className="green-text">safer tomorrow.</em></h2></div>
            <p>A simple process that turns community reports into verified information and ongoing care.</p>
          </div>
          <div className="process">
            <div className="process-art"><span className="city-line">⌂</span><span className="little-dog">♟</span></div>
            <div className="process-step"><div className="step-icon lavender"><Icon name="file" /></div><span className="step-number">01</span><h3>Report a Sighting</h3><p>Share a location, photo, and details about a street dog in your area.</p></div>
            <div className="process-connector">⌁ ⌁ ⌁</div>
            <div className="process-step"><div className="step-icon mint"><Icon name="heart" /></div><span className="step-number">02</span><h3>Review &amp; Verify</h3><p>Our administrators review reports to ensure accurate information.</p></div>
            <div className="process-connector">⌁ ⌁ ⌁</div>
            <div className="process-step"><div className="step-icon coral"><Icon name="heart" /></div><span className="step-number">03</span><h3>Track Welfare</h3><p>Maintain health records, vaccinations, sterilization, and ongoing care.</p></div>
          </div>
        </section>

        <section className="features-section section-wrap" id="features">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot blue" /> KEY FEATURES</div><h2>Tools for kinder,<br />more informed communities.</h2></div>
            <p>Everything you need to explore, report, and support street dogs in one place.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => <article className="feature-card" key={feature.title}>
              <div className={`feature-icon ${feature.color}`}>{feature.icon}</div><h3>{feature.title}</h3><p>{feature.description}</p><img src={feature.image} alt={feature.alt} loading="lazy" />
            </article>)}
          </div>
        </section>

        <section className="impact-banner" id="impact">
          <div className="impact-photo" role="img" aria-label="A rescued dog resting peacefully" />
          <div className="impact-copy"><div className="eyebrow light-eyebrow"><span className="eyebrow-dot" /> OUR IMPACT</div><h2>Real people.<br />Real <em>change.</em></h2><p>Every report, every profile, and every act of care helps build safer streets and healthier communities for street dogs.</p><Button href="/report">Be part of the change <span>→</span></Button></div>
          <div className="impact-points"><div><span>⌂</span><p><b>Safer neighborhoods</b><small>Better understanding of local dog populations.</small></p></div><div><span>♡</span><p><b>Improved welfare</b><small>More vaccinations and sterilizations.</small></p></div><div><span>♧</span><p><b>Stronger communities</b><small>People coming together for a kinder city.</small></p></div></div>
        </section>

        <section className="stories-section section-wrap" id="about">
          <div className="story-copy"><div className="eyebrow"><span className="eyebrow-dot blue" /> COMMUNITY STORIES</div><h2>Small actions.<br />Big impact.</h2><div className="teal-rule" /><blockquote>“Dog Territory has helped us better understand and care for the street dogs in our community. It’s easy to use and makes a real difference.”</blockquote><p className="quote-credit">— Community Volunteer</p></div>
          <div className="story-collage"><img className="story-main" src={dogs[1].image} alt="A friendly street dog" loading="lazy" /><div className="sticky-note">“A more compassionate<br />city for every dog.” <span>♡</span></div><div className="handwritten">Kind communities<br />Brighter tomorrows <span>✿</span></div><img className="story-small story-small-one" src={dogs[2].image} alt="A dog being cared for" loading="lazy" /><img className="story-small story-small-two" src={features[3].image} alt="Community volunteers" loading="lazy" /></div>
        </section>

        <section className="final-cta">
          <div className="cta-paws">✿　·　✿</div><div><div className="eyebrow"><span className="eyebrow-dot blue" /> KNOW A STREET DOG?</div><h2>Help its story be seen.</h2><p>Your report can make a real difference. Together, we can build a safer, more compassionate community for every dog.</p></div><div className="cta-actions"><Button href="/report">Report a Sighting <span>→</span></Button><Button variant="secondary" href="#how-it-works">Learn More ↗</Button></div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand"><a className="brand" href="#home"><span className="brand-mark"><Icon name="paw" /></span><span className="brand-copy"><strong>dog territory</strong><small>EVERY DOG. EVERY LIFE.</small></span></a><p>Every territory tells a story.<br />Let’s make it a story of care.</p><div className="socials"><a href="#about" aria-label="Facebook">f</a><a href="#about" aria-label="Instagram">◎</a><a href="#about" aria-label="X">𝕏</a><a href="#about" aria-label="YouTube">▶</a></div></div>
          <div className="footer-col"><h4>Platform</h4><a href="#map">Explore Map</a><a href="/report">Report a Sighting</a><a href="#how-it-works">How It Works</a><a href="#impact">Our Impact</a></div>
          <div className="footer-col"><h4>Community</h4><a href="/signup">Create an Account</a><a href="/signin">Sign In</a><a href="#about">Community Guidelines</a><a href="#about">Volunteer</a></div>
          <div className="footer-col"><h4>Legal</h4><a href="#about">Privacy Policy</a><a href="#about">Terms of Service</a><a href="#about">Cookie Policy</a><a href="#about">Contact Us</a></div>
          <div className="footer-stamp"><Icon name="paw" /><b>Safer streets.<br />Healthier dogs.<br />Stronger communities.</b></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Dog Territory. All rights reserved.</span><span>Built with <b>♥</b> for a more compassionate world</span></div>
      </footer>

    </div>
  );
}

export default Home;



