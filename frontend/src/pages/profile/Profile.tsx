import { useState, type FormEvent } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Profile.css'

const profileNav = [
  { label: 'Dashboard', to: '/dashboard', icon: '▦' },
  { label: 'Explore Dogs', to: '/dogs', icon: '♧' },
  { label: 'Report a Sighting', to: '/report', icon: '⌖' },
  { label: 'My Reports', to: '/reports', icon: '▤' },
  { label: 'My Profile', to: '/profile', icon: '♙' },
]

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
  }

  return <div className="profile-app">
    <button className={`profile-scrim ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} aria-label="Close navigation"/>
    <aside className={`profile-sidebar ${menuOpen ? 'open' : ''}`}>
      <Link to="/dashboard" className="profile-brand"><span>♧</span><b>dog territory<small>EVERY DOG. EVERY LIFE.</small></b></Link>
      <span className="profile-nav-title">WORKSPACE</span>
      <nav>{profileNav.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/profile'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `profile-nav-link ${isActive ? 'active' : ''}`}><span>{item.icon}</span>{item.label}</NavLink>)}</nav>
      <div className="profile-sidebar-bottom"><Link to="/support" className="profile-nav-link"><span>ⓘ</span>Help &amp; Support</Link><Link to="/signin" className="profile-nav-link profile-logout"><span>⇥</span>Logout</Link><small>Made with <i>♥</i> for kinder streets</small></div>
    </aside>
    <main className="profile-main">
      <header className="profile-header"><button className="profile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">☰</button><div className="profile-crumb"><span>Workspace</span><b>/</b><strong>My Profile</strong></div><div className="profile-header-user"><button aria-label="Notifications" className="profile-bell">♧<i/></button><span className="profile-avatar-small">T</span><span><b>Tharnish</b><small>Community Member</small></span></div></header>
      <div className="profile-content">
        <div className="profile-page-heading"><div><span className="profile-eyebrow">YOUR ACCOUNT</span><h1>My profile</h1><p>Manage your personal details and community presence.</p></div></div>
        <section className="profile-banner"><div className="profile-banner-shape shape-one"/><div className="profile-banner-shape shape-two"/><div className="profile-avatar-large">T<span className="profile-avatar-check">✓</span></div><div className="profile-banner-copy"><span className="profile-member-label">COMMUNITY MEMBER</span><h2>Tharnish</h2><p>Member since October 2025 <span>·</span> Bengaluru, Karnataka</p></div><button className="profile-edit-avatar" type="button" aria-label="Change profile photo">✎</button></section>
        <div className="profile-layout">
          <form className="profile-card profile-form" onSubmit={handleSubmit}>
            <div className="profile-card-heading"><div><h2>Personal information</h2><p>Update your details so your community knows who you are.</p></div><span className="profile-lock">⌑ Private to you</span></div>
            <div className="profile-form-grid"><label>Full name<input defaultValue="Tharnish" name="name" autoComplete="name"/></label><label>Email address<input defaultValue="tharnish@example.com" name="email" type="email" autoComplete="email"/></label><label>Phone number<input defaultValue="+91 98765 43210" name="phone" type="tel" autoComplete="tel"/></label><label>Neighborhood<input defaultValue="Indiranagar" name="neighborhood" autoComplete="address-level3"/></label><label className="profile-wide">About you<textarea name="bio" rows={4} defaultValue="I care about the dogs in my neighborhood and want to help make sure they get the support they need."/></label></div>
            <div className="profile-form-footer"><span className={saved ? 'profile-saved' : ''}>{saved ? '✓ Changes saved locally' : 'Your information stays in your control.'}</span><button type="submit" className="profile-save">Save changes <span>→</span></button></div>
          </form>
          <aside className="profile-side-column">
            <section className="profile-card profile-community-card"><span className="profile-eyebrow">YOUR CONTRIBUTION</span><h2>Making a difference, one day at a time.</h2><div className="profile-contrib"><span className="contrib-icon">▤</span><span><b>12</b><small>Reports shared</small></span></div><div className="profile-contrib"><span className="contrib-icon teal">✓</span><span><b>8</b><small>Sightings verified</small></span></div><Link to="/reports">See my reports <span>→</span></Link></section>
            <section className="profile-card profile-preferences"><span className="profile-eyebrow">PREFERENCES</span><h2>Community updates</h2><p>Stay in the loop when there’s activity around your neighborhood.</p><label className="profile-toggle"><input type="checkbox" defaultChecked/><span className="toggle-track"/><span>Email updates</span></label><label className="profile-toggle"><input type="checkbox" defaultChecked/><span className="toggle-track"/><span>Nearby dog alerts</span></label></section>
            <div className="profile-help"><span>♡</span><div><b>Here to help</b><p>Questions about your account?</p><Link to="/support">Visit Help &amp; Support →</Link></div></div>
          </aside>
        </div>
        <footer className="profile-footer"><span>© 2026 Dog Territory</span><span>Every dog. Every life. <b>♥</b></span><Link to="/support">Need a hand?</Link></footer>
      </div>
    </main>
  </div>
}
