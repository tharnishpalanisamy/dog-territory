import PublicLayout from "../../components/layout/PublicLayout";
import "./CommunityGuidelines.css";

const guidelines = [
  {
    n: "01",
    title: "Put animal welfare first",
    body: "Treat every community dog with patience and respect. Do not chase, frighten, provoke, injure or attempt to handle an animal beyond your training.",
  },
  {
    n: "02",
    title: "Make reports accurate",
    body: "Share genuine sightings and provide the most accurate location and description you can. Do not knowingly submit false, misleading or duplicate reports.",
  },
  {
    n: "03",
    title: "Upload appropriate photographs",
    body: "Only upload images relevant to the report or dog profile. Avoid images that expose private information about people without their permission.",
  },
  {
    n: "04",
    title: "Respect people and neighbourhoods",
    body: "Communicate respectfully with residents, volunteers, veterinarians and administrators. Do not publish private contact details or use the platform to harass anyone.",
  },
  {
    n: "05",
    title: "Work within your abilities",
    body: "Do not attempt medical treatment, rescue handling or transport unless you are qualified or have been appropriately guided. Seek help from suitable animal-welfare professionals.",
  },
  {
    n: "06",
    title: "Keep updates honest",
    body: "If you accept an assignment, provide truthful progress updates. Do not mark work complete unless the activity has actually been completed.",
  },
];

export default function CommunityGuidelines() {
  return (
    <PublicLayout eyebrow="COMMUNITY GUIDELINES">
      <section className="guidelines-hero">
        <span className="page-eyebrow">
          <i /> OUR COMMUNITY STANDARD
        </span>
        <h1>
          A kinder community starts with <em>responsible care.</em>
        </h1>
        <p>
          Dog Territory brings people together around street-dog welfare. These
          guidelines help keep the platform useful, respectful and focused on
          animal wellbeing.
        </p>
        <div className="guidelines-callout">
          <strong>Our shared principle</strong>
          <span>
            Respect the dogs. Respect the community. Share information
            responsibly.
          </span>
        </div>
      </section>
      <section className="guidelines-list">
        {guidelines.map((item) => (
          <article className="guideline-item" key={item.n}>
            <span>{item.n}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="guidelines-report">
        <div className="guidelines-report-copy">
          <span className="guidelines-report-label">
            <i /> COMMUNITY SAFETY
          </span>
          <h2>
            Help us keep Dog Territory <span>safe and constructive.</span>
          </h2>
          <p>
            Encountered harmful, abusive or misleading activity? Let our team
            know so we can review it and help protect our community.
          </p>
          <a className="button button-primary guidelines-report-button" href="/contact">
            <span className="guidelines-report-button-copy">
              <small>WE'RE HERE TO HELP</small>
              Contact the team
            </span>
            <span className="guidelines-report-button-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
        <div className="guidelines-report-note" aria-hidden="true">
          <span>02</span>
          <strong>
            Speak up
            <br />
            for safety.
          </strong>
          <i>Every report helps.</i>
          <b>!</b>
        </div>
      </section>
    </PublicLayout>
  );
}
