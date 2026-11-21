import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import "./PublicLayout.css";

type PublicLayoutProps = { children: ReactNode; eyebrow?: string };

function PawMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="7" r="2.1" />
      <circle cx="12" cy="5" r="2.1" />
      <circle cx="17" cy="7" r="2.1" />
      <circle cx="19" cy="12" r="1.8" />
      <path d="M5.2 15.3c0-2.5 3-4.6 6.8-4.6s6.8 2.1 6.8 4.6c0 2.1-2 3.2-4 2.5-1.9-.7-3.7-.7-5.6 0-2 .7-4-.4-4-2.5Z" />
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

export default function PublicLayout({ children, eyebrow = "DOG TERRITORY" }: PublicLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="public-shell">
      <header className="topbar public-nav">
        <a className="brand public-brand" href="/" aria-label="Dog Territory home" onClick={closeMenu}>
          <span className="brand-mark public-brand-mark"><PawMark /></span>
          <span className="brand-copy public-brand-copy"><strong>dog territory</strong><small>EVERY DOG. EVERY LIFE.</small></span>
        </a>
        <button className="mobile-menu public-mobile-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav className={`nav-links public-nav-links ${menuOpen ? "nav-open public-nav-open" : ""}`} aria-label="Main navigation">
          <a className={pathname === "/" ? "active" : ""} href="/#home" onClick={closeMenu}>Home</a>
          <a href="/#map-under-development" onClick={closeMenu}>Explore Map</a>
          <a href="/#how-it-works" onClick={closeMenu}>How It Works</a>
          <a href="/#impact" onClick={closeMenu}>Our Impact</a>
          <a href="/#about" onClick={closeMenu}>About</a>
          <a className={pathname === "/volunteer-info" ? "active" : ""} href="/volunteer-info" onClick={closeMenu}>Volunteer</a>
        </nav>
        <div className="header-actions public-nav-actions">
          <Button variant="secondary" size="small" className="signin-button" href="/signin">Sign In</Button>
          <Button variant="signup" size="small" href="/signup">Create Account</Button>
        </div>
      </header>

      <main className="public-main">
        <div className="public-breadcrumb"><a href="/">Home</a><span>/</span><span>{eyebrow}</span></div>
        {children}
      </main>

      <footer className="footer public-footer">
        <div className="footer-main public-footer-main">
          <div className="footer-brand public-footer-brand">
            <a className="brand" href="/" aria-label="Dog Territory home">
              <span className="brand-mark"><PawMark /></span>
              <span className="brand-copy"><strong>dog territory</strong><small>EVERY DOG. EVERY LIFE.</small></span>
            </a>
            <p>Every street dog has a story. <br />Let us make it a story of care.</p>
            <div className="socials">
              <a href="/#about" aria-label="Facebook"><SocialIcon name="facebook" /></a>
              <a href="/#about" aria-label="Instagram"><SocialIcon name="instagram" /></a>
              <a href="/#about" aria-label="X"><SocialIcon name="x" /></a>
              <a href="/#about" aria-label="YouTube"><SocialIcon name="youtube" /></a>
            </div>
          </div>
          <div className="footer-col public-footer-column">
            <h4>Platform</h4>
            <a href="/#map-under-development">Explore Map <span className="footer-dev-badge">In development</span></a>
            <a href="/report">Report a Sighting</a>
            <a href="/#how-it-works">How It Works</a>
            <a href="/#impact">Our Impact</a>
          </div>
          <div className="footer-col public-footer-column">
            <h4>Community</h4>
            <Link to="/signup">Create an Account</Link>
            <Link to="/signin">Sign In</Link>
            <Link to="/community-guidelines">Community Guidelines</Link>
            <Link to="/volunteer-info">Volunteer</Link>
          </div>
          <div className="footer-col public-footer-column">
            <h4>Legal</h4>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms of Service</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-stamp">
            <span className="footer-stamp-icon"><PawMark /></span>
            <b>Safer streets.<br />Healthier dogs.<br />Stronger communities.</b>
          </div>
        </div>
        <div className="footer-bottom public-footer-bottom">
          <span>© 2026 Dog Territory. All rights reserved.</span>
          <span>Built with <b>*</b> for a more compassionate world</span>
        </div>
      </footer>
    </div>
  );
}

