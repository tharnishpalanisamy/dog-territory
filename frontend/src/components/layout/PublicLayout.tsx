import type { ReactNode } from "react";
import "./PublicLayout.css";

type PublicLayoutProps = {
  children: ReactNode;
  eyebrow?: string;
};

export default function PublicLayout({
  children,
  eyebrow = "DOG TERRITORY",
}: PublicLayoutProps) {
  return (
    <div className="public-shell">
      <header className="public-nav">
        <a className="public-brand" href="/" aria-label="Dog Territory home">
          <span className="public-brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="2.1" /><circle cx="12" cy="5" r="2.1" /><circle cx="17" cy="7" r="2.1" /><circle cx="19" cy="12" r="1.8" /><path d="M5.2 15.3c0-2.5 3-4.6 6.8-4.6s6.8 2.1 6.8 4.6c0 2.1-2 3.2-4 2.5-1.9-.7-3.7-.7-5.6 0-2 .7-4-.4-4-2.5Z" /></svg></span>
          <span>
            <strong>dog territory</strong>
            <small>EVERY DOG. EVERY LIFE.</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/volunteer-info">Volunteer</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="public-nav-actions">
          <a className="public-signin" href="/signin">
            Sign in
          </a>
          <a className="public-button public-button-small" href="/signup">
            Create account <span>Ã¢â€ â€”</span>
          </a>
        </div>
      </header>

      <main className="public-main">
        <div className="public-breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        {children}
      </main>

      <footer className="public-footer">
        <div className="public-footer-main">
          <div className="public-footer-brand">
            <a className="public-brand" href="/">
              <span className="public-brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="2.1" /><circle cx="12" cy="5" r="2.1" /><circle cx="17" cy="7" r="2.1" /><circle cx="19" cy="12" r="1.8" /><path d="M5.2 15.3c0-2.5 3-4.6 6.8-4.6s6.8 2.1 6.8 4.6c0 2.1-2 3.2-4 2.5-1.9-.7-3.7-.7-5.6 0-2 .7-4-.4-4-2.5Z" /></svg></span>
              <span>
                <strong>dog territory</strong>
                <small>EVERY DOG. EVERY LIFE.</small>
              </span>
            </a>
            <p>
              Every street dog has a story.
              <br />
              LetÃ¢â‚¬â„¢s make it a story of care.
            </p>
          </div>
          <div>
            <h4>Platform</h4>
            <a href="/map">Explore Map</a>
            <a href="/report">Report a Sighting</a>
            <a href="/#how-it-works">How It Works</a>
          </div>
          <div>
            <h4>Community</h4>
            <a href="/signup">Create an Account</a>
            <a href="/community-guidelines">Community Guidelines</a>
            <a href="/volunteer">Volunteer</a>
          </div>
          <div>
            <h4>Legal & support</h4>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
        <div className="public-footer-bottom">
          <span>Ã‚Â© {new Date().getFullYear()} Dog Territory.</span>
          <span>Built with care for community dogs.</span>
        </div>
      </footer>
    </div>
  );
}
