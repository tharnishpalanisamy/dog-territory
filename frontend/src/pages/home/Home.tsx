import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Button from "../../components/ui/Button";
import api from "../../lib/api";
import type { Statistics, StatCard } from "../../types/statistics";
import DogProfileModal, { type DogProfile } from "./DogProfileModal";

async function get_statistics() {
  const response = await api.get<Statistics>("/public/stats");
  return response.data;
}

async function get_dog() {
  const response = await api.get<DogPreview | null>("/public/dog");
  return response.data;
}

type DogPreview = DogProfile;
// const dogs = [
//   {
//     name: "Muthu",
//     area: "Example neighbourhood",
//     status: "Profile preview",
//     tags: ["Street dog", "Sample record"],
//     image: "https://images.pexels.com/photos/12631184/pexels-photo-12631184.jpeg?auto=compress&cs=tinysrgb&w=1200",
//   },
//   {
//     name: "Chutney",
//     area: "Gandhipuram",
//     status: "Verified",
//     tags: ["Vaccinated", "Community cared"],
//     image: "https://images.pexels.com/photos/30630829/pexels-photo-30630829.jpeg?auto=compress&cs=tinysrgb&w=1200",
//   },
//   {
//     name: "Ponni",
//     area: "Vadavalli",
//     status: "Needs review",
//     tags: ["Community cared"],
//     image: "https://images.pexels.com/photos/34728031/pexels-photo-34728031.jpeg?auto=compress&cs=tinysrgb&w=1200",
//   },
// ];

const features = [
  {
    title: "Community Reports",
    description:
      "Submit street-dog sightings, add photos and location details, and follow reports through review.",
    color: "mint",
    icon: <Icon name="users" />,
    image:
      "https://www.humaneworld.org/sites/default/files/styles/responsive_3_2_800w/public/2025-03/DSC00217_Original%20file%20lucknow%20India%20dog%20Abhishek%20Rastogi.jpg.webp?h=56d0ca2e&itok=qLzD5Hr5",
    alt: "Dog in a community",
  },
  {
    title: "Detailed Profiles",
    description:
      "View each dog's photos, identifying features, location and welfare history in one organised profile.",
    color: "coral",
    icon: <Icon name="heart" />,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLFcXOW861tq5Uxi_W692_kRkqO4W2r-TrAQgCJMPy4w&s=10",
    alt: "Detailed dog portrait",
  },
  {
    title: "Health Records",
    description:
      "Keep track of vaccinations, sterilization, treatments and ongoing welfare updates.",
    color: "teal",
    icon: <Icon name="file" />,
    image:
      "https://t4.ftcdn.net/jpg/05/51/80/53/360_F_551805312_jQWSYyx9RXvQOKqfu9HD6o1bATvGBouP.jpg",
    alt: "Dogs together",
  },
  {
    title: "Community Care",
    description:
      "Bring local residents and volunteers together to support street dogs in their neighbourhoods.",
    color: "purple",
    icon: <Icon name="users" />,
    image:
      "https://img.magnific.com/free-photo/dog-farm_181624-369.jpg?semt=ais_hybrid&w=740&q=80",
    alt: "Dogs receiving care",
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
    return (
      <svg {...common}>
        <circle cx="7" cy="7" r="2.1" />
        <circle cx="12" cy="5" r="2.1" />
        <circle cx="17" cy="7" r="2.1" />
        <circle cx="19" cy="12" r="1.8" />
        <path d="M5.2 15.3c0-2.5 3-4.6 6.8-4.6s6.8 2.1 6.8 4.6c0 2.1-2 3.2-4 2.5-1.9-.7-3.7-.7-5.6 0-2 .7-4-.4-4-2.5Z" />
      </svg>
    );

  if (name === "file")
    return (
      <svg {...common}>
        <path d="M7 3.5h7l4 4V21H7z" />
        <path d="M14 3.5V8h4M10 12h5M10 16h5" />
      </svg>
    );

  if (name === "heart")
    return (
      <svg {...common}>
        <path d="M20.5 8.7c0 5-8.5 10-8.5 10s-8.5-5-8.5-10A4.5 4.5 0 0 1 12 6.2a4.5 4.5 0 0 1 8.5 2.5Z" />
      </svg>
    );

  if (name === "users")
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h1a5.5 5.5 0 0 1 5.5 5.5V20M16 5.5a3 3 0 0 1 0 5.8M18 13.5a4.5 4.5 0 0 1 2.5 4V20" />
      </svg>
    );

  // Community Reports
  if (name === "map-pin")
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );

  // Health Records
  if (name === "stethoscope")
    return (
      <svg {...common}>
        <path d="M6 3v5a5 5 0 0 0 10 0V3" />
        <path d="M6 3H4M16 3h2M11 13v2a5 5 0 0 0 10 0v-2" />
        <circle cx="21" cy="11" r="2" />
        <circle cx="11" cy="20" r="2" />
      </svg>
    );

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function SocialIcon({ name }: { name: "facebook" | "instagram" | "x" | "youtube" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "facebook") return <svg {...common}><path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9a1 1 0 0 1 1-1Z" /></svg>;
  if (name === "instagram") return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.7" r=".8" fill="currentColor" stroke="none" /></svg>;
  if (name === "youtube") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></svg>;
  return <svg {...common}><path d="M5 4h4.2l9.8 16h-4.2L5 4Z" /><path d="m19 4-6.2 7.1M5 20l6.4-7.3" /></svg>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState<Statistics>({
    dogs_count: 0,
    reports_count: 0,
    resolved_count: 0,
    volunteers_count: 0,
  });

  const [dog, setDog] = useState<DogPreview>({
    dog_code: "641025-1",
    area: "edayarpalayam",
    status: "Vaccinated",
    tags: ["street dog", "sample record"],
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Street_Dog.jpg",
  });
  useEffect(() => {
    get_statistics()
      .then((data) => setStats(data))
      .catch((error) => console.log(error));
    get_dog()
      .then((data) => {
        if (data) setDog(data);
      })
      .catch((error) => console.error("Failed to load featured dog", error));
  }, []);

  const statistics: StatCard[] = [
    { label: "Dogs Documented", value: stats.dogs_count, icon: "paw" },
    { label: "Reports Received", value: stats.reports_count, icon: "file" },
    { label: "Reports Resolved", value: stats.resolved_count, icon: "heart" },
    {
      label: "Active Community Members",
      value: stats.volunteers_count,
      icon: "users",
    },
  ];

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Dog Territory home">
          <span className="brand-mark">
            <Icon name="paw" />
          </span>
          <span className="brand-copy">
            <strong>dog territory</strong>
            <small>EVERY DOG. EVERY LIFE.</small>
          </span>
        </a>
        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a className="active" href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="#map-under-development" onClick={() => setMenuOpen(false)}>
            Explore Map
          </a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
            How It Works
          </a>
          <a href="#impact" onClick={() => setMenuOpen(false)}>
            Our Impact
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
        </nav>
        <div className="header-actions">
          <Button
            variant="secondary"
            size="small"
            className="signin-button"
            href="/signin"
          >
            Sign In
          </Button>
          <Button variant="signup" size="small" href="/signup">
            Create Account
          </Button>
          {/* <Button variant="primary" size="small" className="report-button" href="/report">Report a Sighting <span>↗</span></Button> */}
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-photo" />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> COMMUNITY · CARE · SAFER STREETS
            </div>
            <h1>
              Every territory
              <br />
              tells <em>a story.</em>
            </h1>
            <p className="hero-lead">
              Report, track, and support street dogs in your community. Dog
              Territory connects people and welfare information to help build
              safer, healthier neighbourhoods for every dog.
            </p>
            <div className="hero-buttons">
              <Button href="/signup">
                Get Started<span>→</span>
              </Button>
              <div className="map-link-wrap">
                <Button variant="secondary" href="#map-under-development">
                  Explore the Map <span>↗</span>
                </Button>
              </div>
            </div>
            <div className="hero-trust">
              <div>
                <span className="trust-icon">✿</span>
                <p>
                  <b>Verified information</b>
                  <small>Reviewed by administrators</small>
                </p>
              </div>
              <div>
                <span className="trust-icon">♧</span>
                <p>
                  <b>Community driven</b>
                  <small>People make a difference</small>
                </p>
              </div>
              <div>
                <span className="trust-icon">♥</span>
                <p>
                  <b>Better welfare</b>
                  <small>Healthier, safer communities</small>
                </p>
              </div>
            </div>
          </div>
          <div className="hero-note">
            Same streets.
            <br />
            Same stories.
            <br />
            <strong>Brighter futures</strong> <span>♡</span>
          </div>
          <div className="dog-profile-float">
            <div className="dog-float-card">
              <img
                src={dog.image || features[0].image}
                alt={`${dog.dog_code}, a community street dog`}
              />
              <div className="dog-card-info">
                <strong>
                  {dog.dog_code} <span className="verified">{dog.status}</span>
                </strong>
                <small>⌖ {dog.area}</small>
                <div className="tag-row">
                  {dog.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <button
                  className="dog-profile-trigger"
                  type="button"
                  onClick={() => setProfileOpen(true)}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
          <div className="hero-doodle">
            Real dogs
            <br />
            Real communities
            <br />
            Real change
          </div>
        </section>

        <div
          className="map-development-note"
          id="map-under-development"
          role="note"
        >
          <span className="map-development-icon">⌖</span>
          <p>
            <strong>Interactive map is under development.</strong> You can still
            report sightings, browse dog profiles and follow welfare updates.
          </p>
          <span className="map-development-status">COMING SOON</span>
        </div>

        <section className="stats-strip" aria-label="Community statistics">
          {statistics.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className={`stat-icon ${stat.icon}`}>
                <Icon name={stat.icon} />
              </span>
              <strong>{stat.value.toLocaleString("en-IN")}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="how-section section-wrap" id="how-it-works">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot blue" /> HOW IT WORKS
              </div>
              <h2>
                From a sighting
                <br />
                to a <em className="green-text">safer tomorrow.</em>
              </h2>
            </div>
            <p>
              A simple process that turns community reports into verified
              information and ongoing care.
            </p>
          </div>
          <div className="process">
            <div className="process-art">
              <span className="city-line">⌂</span>
              <span className="little-dog">♟</span>
            </div>
            <div className="process-step">
              <div className="step-icon lavender">
                <Icon name="file" />
              </div>
              <span className="step-number">01</span>
              <h3>Report a Sighting</h3>
              <p>
                Share a location, photo, and details about a street dog in your
                area.
              </p>
            </div>
            <div className="process-connector">⌁ ⌁ ⌁</div>
            <div className="process-step">
              <div className="step-icon mint">
                <Icon name="heart" />
              </div>
              <span className="step-number">02</span>
              <h3>Review &amp; Verify</h3>
              <p>
                Our administrators review reports to ensure accurate
                information.
              </p>
            </div>
            <div className="process-connector">⌁ ⌁ ⌁</div>
            <div className="process-step">
              <div className="step-icon coral">
                <Icon name="heart" />
              </div>
              <span className="step-number">03</span>
              <h3>Track Welfare</h3>
              <p>
                Maintain health records, vaccinations, sterilization, and
                ongoing care.
              </p>
            </div>
          </div>
        </section>

        <section className="features-section section-wrap" id="features">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot blue" /> KEY FEATURES
              </div>
              <h2>
                Tools for kinder,
                <br />
                more informed communities.
              </h2>
            </div>
            <p>
              Everything you need to report, document and support street dogs in
              one place.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className={`feature-icon ${feature.color}`}>
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                {/* Wrapped image in a container for consistent sizing */}
                <div className="feature-image-container">
                  <img src={feature.image} alt={feature.alt} loading="lazy" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="impact-banner" id="impact">
          <div
            className="impact-photo"
            role="img"
            aria-label="An Indian street dog in its neighbourhood"
          />
          <div className="impact-copy">
            <div className="eyebrow light-eyebrow">
              <span className="eyebrow-dot" /> OUR IMPACT
            </div>
            <h2>
              Real people.
              <br />
              Real <em>change.</em>
            </h2>
            <p>
              Every report, every profile, and every act of care helps build
              safer streets and healthier communities for street dogs.
            </p>
            <Button href="/report">
              Be part of the change <span>→</span>
            </Button>
          </div>
          <div className="impact-points">
            <div>
              <span>⌂</span>
              <p>
                <b>Safer neighborhoods</b>
                <small>Better understanding of local dog populations.</small>
              </p>
            </div>
            <div>
              <span>♡</span>
              <p>
                <b>Improved welfare</b>
                <small>More vaccinations and sterilizations.</small>
              </p>
            </div>
            <div>
              <span>♧</span>
              <p>
                <b>Stronger communities</b>
                <small>People coming together for a kinder city.</small>
              </p>
            </div>
          </div>
        </section>

        <section className="stories-section section-wrap" id="about">
          <div className="story-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot blue" /> COMMUNITY STORIES
            </div>
            <h2>
              Small actions.
              <br />
              Big impact.
            </h2>
            <div className="teal-rule" />
            <blockquote>
              “Dog Territory has helped us better understand and care for the
              street dogs in our community. It’s easy to use and makes a real
              difference.”
            </blockquote>
            <p className="quote-credit">— Community Volunteer</p>
          </div>
          <div className="story-collage">
            <img
              className="story-main"
              src="https://img.magnific.com/free-photo/urban-city-homeless-dog-lonely_53876-31128.jpg?semt=ais_hybrid&w=740&q=80"
              alt="An Indian community street dog"
              loading="lazy"
            />
            <div className="sticky-note">
              “A more compassionate
              <br />
              city for every dog.” <span>♡</span>
            </div>
            <div className="handwritten">
              Kind communities
              <br />
              Brighter tomorrows <span>✿</span>
            </div>
            <img
              className="story-small story-small-one"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDRs5iE5etaVNtkd4RW81_G92d2lIEw1v_B3AWyUcTfQ&s=10"
              alt="A street puppy in its neighbourhood"
              loading="lazy"
            />
            <img
              className="story-small story-small-two"
              src={features[3].image}
              alt="Street puppies in a neighbourhood"
              loading="lazy"
            />
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-paws">✿　·　✿</div>
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot blue" /> KNOW A STREET DOG?
            </div>
            <h2>Help its story be seen.</h2>
            <p>
              Your report can make a real difference. Together, we can build a
              safer, more compassionate community for every dog.
            </p>
          </div>
          <div className="cta-actions">
            <Button href="/signin">
              Report a Sighting <span>→</span>
            </Button>
            <Button variant="secondary" href="#how-it-works">
              Learn More ↗
            </Button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#home">
              <span className="brand-mark">
                <Icon name="paw" />
              </span>
              <span className="brand-copy">
                <strong>dog territory</strong>
                <small>EVERY DOG. EVERY LIFE.</small>
              </span>
            </a>
            <p>
              Every street dog has a story. <br />
              Let’s make it a story of care.
            </p>
            <div className="socials">
              <a href="#about" aria-label="Facebook"><SocialIcon name="facebook" /></a>
              <a href="#about" aria-label="Instagram"><SocialIcon name="instagram" /></a>
              <a href="#about" aria-label="X"><SocialIcon name="x" /></a>
              <a href="#about" aria-label="YouTube"><SocialIcon name="youtube" /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#map">
              Explore Map{" "}
              <span className="footer-dev-badge">In development</span>
            </a>
            <a href="/report">Report a Sighting</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#impact">Our Impact</a>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <Link to="/signup">Create an Account</Link>
            <Link to="/signin">Sign In</Link>
            <Link to="/community-guidelines">Community Guidelines</Link>
            <Link to="/volunteer-info">Volunteer</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms of Service</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-stamp">
            <Icon name="paw" />
            <b>
              Safer streets.
              <br />
              Healthier dogs.
              <br />
              Stronger communities.
            </b>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Dog Territory. All rights reserved.</span>
          <span>
            Built with <b>♥</b> for a more compassionate world
          </span>
        </div>
      </footer>

      {profileOpen && (
        <DogProfileModal
          dog={dog}
          fallbackImage={features[0].image}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
