import PublicLayout from "../../components/layout/PublicLayout";
import "./VolunteerInfo.css";

const opportunities = [
  {
    number: "01",
    title: "Rescue assistance",
    text: "Help coordinate safe assistance for dogs that are injured, distressed or in need of support.",
  },
  {
    number: "02",
    title: "Transport support",
    text: "Support the safe movement of dogs to clinics or other approved care locations.",
  },
  {
    number: "03",
    title: "Vaccination & sterilization",
    text: "Assist authorised welfare teams with community vaccination and sterilization activities.",
  },
  {
    number: "04",
    title: "Feeding & local care",
    text: "Support responsible, consistent care for community dogs in your neighbourhood.",
  },
];

export default function VolunteerInfo() {
  return (
    <PublicLayout eyebrow="VOLUNTEER">
      <section className="volunteer-hero">
        <div className="volunteer-hero-copy">
          <span className="page-eyebrow">
            <i /> COMMUNITY / CARE / ACTION
          </span>
          <h1>
            Be there for the dogs who <em>share our streets.</em>
          </h1>
          <p>
            Local care makes a lasting difference. Join a community that helps
            document, coordinate and improve the welfare of street dogs.
          </p>
          <div className="volunteer-hero-actions">
            <a className="button button-primary" href="/signin">
              Become a volunteer <span>→</span>
            </a>

            <a className="volunteer-secondary-link" href="#opportunities">
              Explore opportunities
              <span>↓</span>
            </a>
          </div>
          <div className="volunteer-trust">
            <span>Neighbourhood-led</span>
            <span>Welfare-focused</span>
            <span>Community-powered</span>
          </div>
        </div>
        <div
          className="volunteer-hero-image"
          role="img"
          aria-label="Indian community dogs being cared for by local volunteers"
        />
      </section>

      <section className="page-section" id="opportunities">
        <div className="section-intro">
          <span className="page-eyebrow">
            <i /> HOW YOU CAN HELP
          </span>
          <h2>
            Different skills. <em>One kinder community.</em>
          </h2>
          <p>
            Choose activities that match your skills, availability and comfort
            level. Some activities may require training or coordination with an
            authorised welfare professional.
          </p>
        </div>
        <div className="opportunity-grid">
          {opportunities.map((item) => (
            <article className="opportunity-card" key={item.number}>
              <span className="opportunity-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="opportunity-card-accent" />
            </article>
          ))}
        </div>
      </section>

      <section className="volunteer-steps">
        <div>
          <span className="page-eyebrow">
            <i /> GET STARTED
          </span>
          <h2>
            From joining to <em>making a difference.</em>
          </h2>
          <p>
            Your volunteer profile helps the team understand where and how you
            can contribute.
          </p>
        </div>
        <ol>
          <li>
            <b>Create an account</b>
            <span>Register on Dog Territory with your basic details.</span>
          </li>
          <li>
            <b>Complete your volunteer profile</b>
            <span>
              Share your location, service PIN codes and availability.
            </span>
          </li>
          <li>
            <b>Wait for review</b>
            <span>
              Volunteer applications are reviewed before access is approved.
            </span>
          </li>
          <li>
            <b>Get involved responsibly</b>
            <span>
              Review suitable assignments and share accurate progress updates.
            </span>
          </li>
        </ol>
      </section>

      <section className="volunteer-cta">
        <div className="volunteer-cta-copy">
          <span className="page-eyebrow">
            <i /> READY TO HELP
          </span>
          <h2>
            Small steps can make <em>a kinder neighbourhood.</em>
          </h2>
          <p>
            Create your account and tell us how you would like to support
            community dogs.
          </p>
          <a
            className="button button-primary volunteer-cta-button"
            href="/signup"
          >
            <span className="volunteer-cta-button-copy">
              <small>READY WHEN YOU ARE</small>
              Create your account
            </span>
            <span className="volunteer-cta-button-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
        <div className="volunteer-cta-note" aria-hidden="true">
          <span>01</span>
          <strong>
            Start where
            <br />
            you are.
          </strong>
          <i>Every act of care matters.</i>
          <b>!</b>
        </div>
      </section>
    </PublicLayout>
  );
}
