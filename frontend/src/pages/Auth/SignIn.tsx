import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import "./Auth.css";

export default function SignIn() {
  return (
    <div className="auth-page">
      <header className="auth-topbar">
        <a className="auth-brand" href="/" aria-label="Dog Territory home">
          <span className="auth-brand-mark">🐾</span>
          <span className="auth-brand-copy">
            <strong>dog territory</strong>
            <small>EVERY DOG. EVERY LIFE.</small>
          </span>
        </a>
        <div className="auth-top-note">
          New to Dog Territory?
          <Link to="/signup">Create account</Link>
        </div>
      </header>

      <main className="auth-main">
        <aside className="auth-visual">
          <div className="auth-visual-top"><span /> COMMUNITY · CARE · SAFER STREETS</div>
          <div className="auth-visual-copy">
            <div className="auth-script">Every territory tells a story.</div>
            <h1>Good to have<br />you <em>back.</em></h1>
            <p>Sign in to help your community keep track of street dogs, follow welfare updates, and make every small act of care count.</p>
          </div>
          <div className="auth-visual-bottom">
            <div className="auth-avatar-stack"><span>♥</span><span>🐾</span><span>✿</span></div>
            <p><strong>A kinder city starts with us.</strong><span>Every dog. Every life.</span></p>
          </div>
        </aside>

        <section className="auth-form-side">
          <form className="auth-form">
            <div className="auth-eyebrow"><span /> WELCOME BACK</div>
            <h2>Sign in to your account</h2>
            <p className="auth-subtitle">Pick up where you left off. Your community is glad you're here.</p>

            <div className="auth-fields">
              <Input label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              <Input label="Password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required />
              <div className="auth-form-row">
                <label className="auth-check"><input type="checkbox" name="remember" /> Remember me</label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <Button className="auth-submit" type="submit">Sign In <span>→</span></Button>
            </div>

            {/* <div className="auth-divider">or continue with</div>
            <div className="auth-socials">
              <button type="button"><span className="auth-social-icon">G</span> Google</button>
              <button type="button"><span className="auth-social-icon">⌘</span> Apple</button>
            </div> */}

            <p className="auth-switch">Don't have an account? <Link to="/signup">Create one</Link></p>
            <p className="auth-legal">By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
          </form>
        </section>
      </main>

      <footer className="auth-footer">© 2026 Dog Territory · Built with <span>♥</span> for a more compassionate world</footer>
    </div>
  );
}
