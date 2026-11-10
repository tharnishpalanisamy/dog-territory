import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Button from '../../components/ui/Button'
import './Dashboard.css'

type IconName = 'grid' | 'map' | 'pin' | 'file' | 'user' | 'help' | 'logout' | 'menu' | 'search' | 'bell' | 'paw' | 'check' | 'clock' | 'heart' | 'arrow' | 'close'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1.2-2 1.5-2 3m0 3h.01"/></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/></>,
    paw: <><ellipse cx="12" cy="15.5" rx="5.5" ry="4"/><ellipse cx="5.5" cy="10" rx="2" ry="2.7"/><ellipse cx="10" cy="6.5" rx="2" ry="2.6"/><ellipse cx="15" cy="6.5" rx="2" ry="2.6"/><ellipse cx="18.5" cy="10" rx="2" ry="2.7"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    heart: <><path d="M20.8 8.7c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const navigation: { label: string; to: string; icon: IconName }[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'grid' }, { label: 'Explore Dogs', to: '/dogs', icon: 'paw' },
  { label: 'Report a Sighting', to: '/report', icon: 'pin' }, { label: 'My Reports', to: '/reports', icon: 'file' }, { label: 'My Profile', to: '/profile', icon: 'user' },
]
const dogs = [
  { name: 'Milo', code: 'DT-2048', area: 'Indiranagar, Bengaluru', image: 'photo-1551717743-49959800b1f6', tags: ['Vaccinated', 'Friendly'], color: 'mint' },
  { name: 'Chutki', code: 'DT-1972', area: 'Jubilee Hills, Hyderabad', image: 'photo-1583337130417-3346a1be7dee', tags: ['Sterilized', 'Friendly'], color: 'lavender' },
  { name: 'Biscuit', code: 'DT-2163', area: 'Koramangala, Bengaluru', image: 'photo-1543466835-00a7907e9de1', tags: ['Vaccinated', 'Sterilized'], color: 'peach' },
]
const reports = [
  { id: '#DT-00842', subject: 'New dog sighting', place: 'Indiranagar, Bengaluru', date: 'Nov 04, 2026', status: 'Verified' },
  { id: '#DT-00831', subject: 'Welfare concern', place: 'Domlur, Bengaluru', date: 'Nov 02, 2026', status: 'Under Review' },
  { id: '#DT-00816', subject: 'Update dog profile', place: 'Indiranagar, Bengaluru', date: 'Oct 29, 2026', status: 'Pending' },
]

function Sidebar({ collapsed, mobileOpen, onClose, onToggle }: { collapsed: boolean; mobileOpen: boolean; onClose: () => void; onToggle: () => void }) {
  return <><button className={`dt-scrim ${mobileOpen ? 'is-visible' : ''}`} onClick={onClose} aria-label="Close navigation" />
    <aside className={`dt-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-open' : ''}`}>
      <div className="dt-brand"><span className="dt-brand-icon"><Icon name="paw" size={22}/></span><span className="dt-brand-name">dog territory<small>EVERY DOG. EVERY LIFE.</small></span><button className="dt-collapse" onClick={onToggle} aria-label="Collapse sidebar">‹</button><button className="dt-close-nav" onClick={onClose} aria-label="Close navigation"><Icon name="close"/></button></div>
      <div className="dt-nav-caption">WORKSPACE</div>
      <nav className="dt-nav">{navigation.map(item => <NavLink key={item.label} to={item.to} end={item.to === '/dashboard'} onClick={onClose} className={({ isActive }) => `dt-nav-link ${isActive ? 'active' : ''}`} title={item.label}><Icon name={item.icon}/><span>{item.label}</span></NavLink>)}</nav>
      <div className="dt-sidebar-bottom"><Link to="/support" className="dt-nav-link" onClick={onClose} title="Help & Support"><Icon name="help"/><span>Help &amp; Support</span></Link><Link to="/signin" className="dt-nav-link dt-logout" onClick={onClose} title="Logout"><Icon name="logout"/><span>Logout</span></Link><div className="dt-sidebar-foot">Made with <span>♥</span> for kinder streets</div></div>
    </aside></>
}

function Header({ onMenu }: { onMenu: () => void }) {
  return <header className="dt-header"><button className="dt-menu" onClick={onMenu} aria-label="Open navigation"><Icon name="menu"/></button><div className="dt-breadcrumb"><span>Workspace</span><b>/</b><strong>Dashboard</strong></div><div className="dt-header-actions"><label className="dt-search"><Icon name="search" size={18}/><input aria-label="Search" placeholder="Search dogs, reports..."/><kbd>⌘ K</kbd></label><button className="dt-notification" aria-label="Notifications"><Icon name="bell"/><i/></button><div className="dt-user"><div className="dt-avatar">T</div><div><strong>Tharnish</strong><span>Community Member</span></div><span className="dt-chevron">⌄</span></div></div></header>
}

function StatCard({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: IconName; tone: string }) {
  return <article className="dt-stat"><div className={`dt-stat-icon ${tone}`}><Icon name={icon}/></div><span className="dt-stat-label">{label}</span><strong className="dt-stat-value">{value}</strong><span className="dt-stat-detail">{detail}</span></article>
}

function DogCard({ dog }: { dog: typeof dogs[number] }) {
  return <article className="dt-dog-card"><div className="dt-dog-image"><img src={`https://images.unsplash.com/${dog.image}?auto=format&fit=crop&w=640&q=85`} alt={`${dog.name}, a community street dog`} loading="lazy"/><span className="dt-verified"><Icon name="check" size={13}/> Verified</span><button aria-label={`Save ${dog.name}`} className="dt-save"><Icon name="heart" size={17}/></button></div><div className="dt-dog-content"><div className="dt-dog-heading"><div><h3>{dog.name}</h3><span>{dog.code}</span></div><span className="dt-dog-arrow"><Icon name="arrow" size={17}/></span></div><p className="dt-dog-location"><Icon name="pin" size={15}/>{dog.area}</p><div className="dt-tags">{dog.tags.map(tag => <span className={dog.color} key={tag}>{tag}</span>)}</div></div></article>
}

function MapPreview() {
  return <section className="dt-panel dt-map-panel"><div className="dt-panel-heading"><div><span className="dt-overline">YOUR NEIGHBORHOOD</span><h2>Explore your territory</h2><p>See the dogs and sightings closest to you.</p></div><Link className="dt-text-link" to="/map">Full map <Icon name="arrow" size={16}/></Link></div><div className="dt-map"><div className="dt-map-block block-a"/><div className="dt-map-block block-b"/><div className="dt-map-block block-c"/><div className="dt-map-block block-d"/><div className="dt-map-park"><span>COMMUNITY PARK</span></div><i className="dt-road road-a"/><i className="dt-road road-b"/><i className="dt-road road-c"/><i className="dt-road road-d"/><span className="dt-map-pin pin-a"><Icon name="paw" size={15}/></span><span className="dt-map-pin pin-b"><Icon name="paw" size={15}/></span><span className="dt-map-pin pin-c"><Icon name="paw" size={15}/></span><span className="dt-map-pin pin-d"><Icon name="paw" size={15}/></span><div className="dt-map-label"><span className="dt-live-dot"/> 12 sightings nearby</div><div className="dt-map-zoom"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button></div></div></section>
}

function RecentReports() {
  return <section className="dt-panel dt-reports"><div className="dt-panel-heading"><div><span className="dt-overline">YOUR ACTIVITY</span><h2>Recent reports</h2></div><Link className="dt-text-link" to="/reports">All reports <Icon name="arrow" size={16}/></Link></div><div className="dt-table-wrap"><table><thead><tr><th>REPORT ID</th><th>DOG / REPORT TYPE</th><th>LOCATION</th><th>SUBMITTED</th><th>STATUS</th></tr></thead><tbody>{reports.map(report => <tr key={report.id}><td className="dt-report-id">{report.id}</td><td>{report.subject}</td><td>{report.place}</td><td>{report.date}</td><td><span className={`dt-status ${report.status.toLowerCase().replace(' ', '-')}`}><i/>{report.status}</span></td></tr>)}</tbody></table></div></section>
}

function ImpactCard() {
  return <section className="dt-impact"><div className="dt-impact-art"><span className="dt-impact-orbit orbit-one"/><span className="dt-impact-orbit orbit-two"/><span className="dt-impact-paw"><Icon name="paw" size={36}/></span><span className="dt-impact-heart">♥</span></div><div className="dt-impact-copy"><span className="dt-overline">CARE TRAVELS FURTHER</span><h2>A little care changes a whole community.</h2><p>Every verified sighting helps neighbors share trusted information, support street dogs, and make the places we share safer for everyone.</p><Link to="/about" className="dt-impact-link">See how it works <Icon name="arrow" size={16}/></Link></div><div className="dt-impact-points"><div><span><Icon name="user" size={18}/></span><strong>Community led</strong><small>Neighbors looking out for neighbors</small></div><div><span><Icon name="check" size={18}/></span><strong>Verified together</strong><small>Reliable information builds trust</small></div><div><span><Icon name="heart" size={18}/></span><strong>Welfare first</strong><small>Every dog deserves kindness</small></div></div></section>
}

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  return <div className="dt-app"><Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onToggle={() => setCollapsed(v => !v)}/><main className={`dt-main ${collapsed ? 'sidebar-collapsed' : ''}`}><Header onMenu={() => setMobileOpen(true)}/><div className="dt-content"><section className="dt-welcome"><div className="dt-welcome-copy"><span className="dt-overline"><span className="dt-live-dot"/> YOUR COMMUNITY, IN FOCUS</span><h1>Good morning, Tharnish<span>✳</span></h1><p>Every small act of care makes a difference. Here’s what’s happening in your territory.</p><div className="dt-welcome-actions"><Button href="/report"> <Icon name="pin" size={17}/> Report a sighting</Button><Link to="/dogs" className="dt-secondary-action">Explore dogs <Icon name="arrow" size={16}/></Link></div></div><div className="dt-welcome-art" aria-hidden="true"><div className="dt-sun"/><div className="dt-welcome-circle"><img src="https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=500&q=85" alt=""/></div><span className="dt-art-star star-a">✳</span><span className="dt-art-star star-b">✦</span><span className="dt-art-caption">good things<br/>grow together</span></div></section>
      <section className="dt-stat-grid" aria-label="Your community statistics"><StatCard label="Dogs documented" value="1,284" detail="Across your community" icon="paw" tone="purple"/><StatCard label="My reports" value="12" detail="3 this month" icon="file" tone="teal"/><StatCard label="Verified sightings" value="08" detail="Thanks for helping!" icon="check" tone="blue"/><StatCard label="Pending reports" value="02" detail="Usually reviewed in 24h" icon="clock" tone="amber"/></section>
      <div className="dt-section-top"><div><span className="dt-overline">MEET YOUR NEIGHBORS</span><h2>Dogs around your community</h2><p>Some familiar faces making your neighborhood brighter.</p></div><Link className="dt-text-link" to="/dogs">Browse all dogs <Icon name="arrow" size={16}/></Link></div>
      <section className="dt-dog-grid" aria-label="Dogs around your community">{dogs.map(dog => <DogCard key={dog.code} dog={dog}/>)}</section>
      <div className="dt-lower-grid"><MapPreview/><section className="dt-panel dt-quick-panel"><span className="dt-overline">A GOOD PLACE TO START</span><h2>Small actions. Real impact.</h2><p>Every new sighting helps your neighborhood keep its dog directory up to date.</p><div className="dt-quick-illustration"><div className="dt-quick-circle"><Icon name="paw" size={31}/></div><span className="quick-spark spark-one">✦</span><span className="quick-spark spark-two">✳</span><span className="quick-dash dash-one"/><span className="quick-dash dash-two"/></div><Button href="/report" size="small">Share a sighting <Icon name="arrow" size={16}/></Button><div className="dt-quick-note"><Icon name="clock" size={15}/> Takes less than a minute</div></section></div>
      <RecentReports/><ImpactCard/><footer className="dt-footer"><span>© 2026 Dog Territory</span><span>Every dog. Every life. <b>♥</b></span><Link to="/support">Need a hand?</Link></footer>
      </div></main></div>
}
