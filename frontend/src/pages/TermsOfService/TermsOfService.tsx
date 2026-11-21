import PublicLayout from "../../components/layout/PublicLayout";
import "./TermsOfService.css";

const sections = [
  [
    "1. About Dog Territory",
    "Dog Territory is intended to help communities document street dogs, submit sightings, maintain welfare information and coordinate related activities. The platform is an information and coordination service; it is not an emergency rescue service, veterinary provider or substitute for professional advice.",
  ],
  [
    "2. Accounts",
    "You are responsible for providing accurate information when creating an account and for keeping your login credentials secure. You must not impersonate another person or create an account for fraudulent or misleading purposes.",
  ],
  [
    "3. Reports and submissions",
    "You must submit reports in good faith and provide accurate information to the best of your knowledge. Do not upload unlawful, abusive, misleading or irrelevant material. You should only submit photographs and personal information that you are entitled to share.",
  ],
  [
    "4. Dog profiles and welfare information",
    "Dog profiles and welfare records are intended to support continuity of community care. Do not knowingly add false identification, vaccination, sterilization, treatment or medical information. Medical records should be entered or verified by appropriately authorised people.",
  ],
  [
    "5. Volunteer activities and assignments",
    "Volunteer participation may require profile review or approval. If you accept an assignment, follow the instructions provided, work within your abilities, prioritise animal and personal safety, and submit truthful progress updates. Do not perform veterinary procedures unless appropriately qualified and authorised.",
  ],
  [
    "6. Community conduct",
    "You must communicate respectfully and must not harass, threaten, discriminate against or expose the private information of other users. Follow the Community Guidelines when using the platform.",
  ],
  [
    "7. Platform administration",
    "Administrators may review reports, moderate content, manage volunteer access and take reasonable steps to protect platform integrity. Any suspension, rejection or removal process should be applied consistently and communicated where appropriate.",
  ],
  [
    "8. Availability and changes",
    "Features may change, be interrupted or be unavailable during maintenance or development. Dog Territory may update these terms as the platform evolves. The current published version should identify its effective date.",
  ],
  [
    "9. Safety and limitation",
    "Information on the platform may be user-submitted and may not always be complete or verified. Do not rely on the platform as the sole basis for urgent animal-welfare, medical or safety decisions. Contact appropriate local professionals or authorities when needed.",
  ],
  [
    "10. Contact",
    "Questions about these terms can be sent through the Contact Us page. Add the legal operator's name, jurisdiction and any required formal notices before the terms are published.",
  ],
];

export default function TermsOfService() {
  return (
    <PublicLayout eyebrow="TERMS OF SERVICE">
      <div className="legal-page-layout">
      <article className="legal-document">
        <header className="legal-heading">
          <span className="page-eyebrow">
            <i /> USING DOG TERRITORY
          </span>
          <h1>
            Terms of <em>Service.</em>
          </h1>
          <p>
            Ground rules for using Dog Territory and contributing to community
            street-dog welfare.
          </p>
          <span className="legal-date">
            Draft for review · 17 November 2026
          </span>
        </header>
        <div className="legal-important">
          <strong>Before publishing:</strong> This is a plain-language starter
          draft, not legal advice. Add the legal operator's details, governing
          law, dispute process, liability provisions and any required statutory
          disclosures. Have the final terms reviewed for the jurisdiction in
          which the service operates.
        </div>
        <p className="legal-intro">
          By accessing or using Dog Territory, you agree to use the platform
          responsibly and follow these terms and the Community Guidelines. If
          you do not agree, do not use the service.
        </p>
        {sections.map(([title, body]) => {
          const [number, ...heading] = title.split(" ");
          return (
            <section className="legal-section" key={title}>
              <span className="legal-section-number">{number}</span>
              <div>
                <h2>{heading.join(" ")}</h2>
                <p>{body}</p>
              </div>
            </section>
          );
        })}
      </article>
      <aside className="legal-side-visual" aria-label="Community dogs deserve responsible care">
        <div className="legal-side-photo" role="img" aria-label="Street dogs resting together in their neighbourhood" />
        <div className="legal-side-caption"><span>RESPONSIBLE CARE</span><strong>Small actions build safer streets.</strong><p>Clear expectations help our community work together with care and respect.</p></div>
      </aside>
      </div>
    </PublicLayout>
  );
}
