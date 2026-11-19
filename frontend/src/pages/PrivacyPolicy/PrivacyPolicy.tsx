import PublicLayout from "../../components/layout/PublicLayout";
import "./PrivacyPolicy.css";

const sections = [
  ["1. Information that may be collected", "Depending on the features you use, Dog Territory may process account details such as your name, email address and username; information you submit in reports; dog profile information; photographs; and volunteer profile details such as service area, PIN codes and availability."],
  ["2. Location and photographs", "Reports may include a location, area or PIN code so that sightings and welfare activities can be understood in context. Images you upload may be associated with a report or dog profile. Avoid uploading private or identifying information about other people unless you have a lawful reason and permission to do so."],
  ["3. How information is used", "Information may be used to create and maintain accounts, display dog profiles and reports, review submissions, coordinate volunteer assignments, maintain welfare histories, respond to support requests and protect the platform from misuse."],
  ["4. Visibility and access", "Some dog, report and community information may be visible to other platform users or the public, depending on the feature and its access controls. Account credentials and private account details should not be displayed publicly. Confirm the actual visibility rules in the deployed application before publishing this policy."],
  ["5. Sharing", "Information should only be shared with administrators, authorised volunteers, veterinary or welfare partners, service providers, or other parties where necessary for the platform's operation and with an appropriate lawful basis. Do not claim that data is shared with a particular partner unless that integration is actually in use."],
  ["6. Retention and deletion", "Information should be retained only for as long as needed for the purposes for which it was collected, including legitimate record-keeping and safety needs. The deployed service should provide a clear process for account and data requests. Add the actual retention periods and deletion process before launch."],
  ["7. Security", "Dog Territory should use reasonable technical and organisational safeguards to protect account and platform information. No internet service can guarantee absolute security. Never share your password or authentication tokens with anyone."],
  ["8. Your choices and requests", "You may contact the Dog Territory team to ask about the personal information associated with your account, request correction, or raise a deletion or privacy concern. Requests may be subject to identity verification and applicable legal requirements."],
  ["9. Changes to this policy", "This policy may be updated as the platform changes. The effective date should be updated whenever a revised version is published. Material changes should be communicated through an appropriate platform notice."],
];

export default function PrivacyPolicy() {
  return (
    <PublicLayout eyebrow="PRIVACY POLICY">
      <article className="legal-document"><header className="legal-heading"><span className="page-eyebrow"><i /> YOUR INFORMATION MATTERS</span><h1>Privacy <em>Policy.</em></h1><p>How Dog Territory handles information used to support community street-dog welfare.</p><span className="legal-date">Draft for review · 17 November 2026</span></header>
        <div className="legal-important"><strong>Before publishing:</strong> This is a starter policy based on the features described for Dog Territory. Verify the deployed database, public visibility, hosting, analytics, integrations, retention periods and applicable legal requirements. Replace any statements that do not match actual practice and obtain appropriate legal review.</div>
        <p className="legal-intro">Dog Territory is a platform for documenting street dogs, receiving community reports and coordinating welfare-related activities. This draft explains the types of information the platform may handle and the safeguards and choices that should apply.</p>
        {sections.map(([title, body]) => <section className="legal-section" key={title}><h2>{title}</h2><p>{body}</p></section>)}
        <section className="legal-section"><h2>10. Contact</h2><p>For privacy questions or data requests, use the <a href="/contact">Contact Us</a> page. Add the organisation's legal name and a monitored privacy contact address here before publication.</p></section>
      </article>
    </PublicLayout>
  );
}
