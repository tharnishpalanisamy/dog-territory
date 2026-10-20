import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import "./Auth.css"; 
import React from 'react' 

export default function SignUp() {
  async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault() 
    
    const formData = new FormData(event.currentTarget) 
    const username = formData.get('fullName') 
    const email = formData.get('email') 
    const password = formData.get('password') 
    const confirmPassword = formData.get('confirmPassword') 

    if ( password !== confirmPassword ) {
      return 'Passwords doesnt match' //replace with alerts
    }   
    const user = {
      'email' : email , 
      'username' : username,
      'password' : password ,  
      'created_at' : Date.now() , 
      'date_of_birth' : null  
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/signup' , {
        method:'POST' , 
        headers:{
          'Content-Type' : 'application/json'
        } , 
        body: JSON.stringify(user)
      }) 

      let data = await response.json() 
      console.log(data);
      
      return data
    } 
    catch(error) {
      console.log(error)
    }
  }
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
          Already a member?
          <Link to="/signin">Sign in</Link>
        </div>
      </header>

      <main className="auth-main">
        <aside className="auth-visual">
          <div className="auth-visual-top"><span /> COMMUNITY · CARE · SAFER STREETS</div>
          <div className="auth-visual-copy">
            <div className="auth-script">A little care goes a long way.</div>
            <h1>Be part of<br />something <em>kind.</em></h1>
            <p>Join people who care about the street dogs around them. Together, we can build a more informed, compassionate community—one sighting at a time.</p>
          </div>
          <div className="auth-visual-bottom">
            <div className="auth-avatar-stack"><span>♥</span><span>🐾</span><span>✿</span></div>
            <p><strong>Your community needs people like you.</strong><span>Every dog. Every life.</span></p>
          </div>
        </aside>

        <section className="auth-form-side">
          <form className="auth-form" onSubmit={(event) => handleSubmit(event)}>
            <div className="auth-eyebrow"><span /> JOIN THE COMMUNITY</div>
            <h2>Create your account</h2>
            <p className="auth-subtitle">Start helping your neighborhood's street dogs today.</p>

            <div className="auth-fields">
              <Input label="Full name" name="fullName" placeholder="Your name" autoComplete="name" required />
              <Input label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              <Input label="Password" name="password" type="password" placeholder="Create a strong password" autoComplete="new-password" required />
              <Input label="Confirm password" name="confirmPassword" type="password" placeholder="Enter your password again" autoComplete="new-password" required />
              <label className="auth-check"><input type="checkbox" name="terms" required /> I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</label>
              <Button className="auth-submit" type="submit">Create Account <span>→</span></Button>
            </div>

            {/* <div className="auth-divider">or sign up with</div>
            <div className="auth-socials">
              <button type="button"><span className="auth-social-icon">G</span> Google</button>
              <button type="button"><span className="auth-social-icon">⌘</span> Apple</button>
            </div> */}

            <p className="auth-switch">Already have an account? <Link to="/signin">Sign in</Link></p>
            <p className="auth-legal">Your details help us keep the Dog Territory community safe.</p>
          </form>
        </section>
      </main>

      <footer className="auth-footer">© 2026 Dog Territory · Built with <span>♥</span> for a more compassionate world</footer>
    </div>
  );
}
