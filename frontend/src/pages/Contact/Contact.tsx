import { useState, type FormEvent } from "react";
import PublicLayout from "../../components/layout/PublicLayout";
import "./Contact.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState("General enquiry");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <PublicLayout eyebrow="CONTACT US">
      <section className="contact-heading">
        <span className="page-eyebrow"><i /> CONTACT PREVIEW</span>
        <h1>Start a <em>conversation.</em></h1>
        <p>Use this form to preview your message. It is not sent to the team yet.</p>
      </section>
      <section className="contact-layout">
        <aside className="contact-aside">
          <div className="contact-aside-icon" aria-hidden="true">@</div>
          <h2>How can we help?</h2>
          <p>Choose the topic that best matches your message so it can be directed to the right team.</p>
          <div className="contact-topic"><b>Report support</b><span>Questions about a submitted sighting or its status.</span></div>
          <div className="contact-topic"><b>Volunteer support</b><span>Questions about applications, availability or assignments.</span></div>
          <div className="contact-topic"><b>Platform support</b><span>Issues with your account or using the website.</span></div>
          <div className="contact-note">For an injured or distressed animal needing urgent assistance, contact an appropriate local animal-welfare or veterinary service directly. This website is not an emergency response service.</div>
        </aside>
        <div className="contact-form-wrap">
          <h2>Preview a message</h2>
          <p>Required fields are marked with an asterisk. This form does not send or store information.</p>
          {submitted ? (
            <div className="contact-form-notice" role="status">
              <strong>Preview only</strong>
              <span>Your message was not sent or stored. The contact form is not connected to a backend endpoint.</span>
              <button type="button" onClick={() => setSubmitted(false)}>Back to form</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Full name *<input name="name" autoComplete="name" required placeholder="Your name" /></label>
              <label>Email address *<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
              <label>What is this about? *<select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)}><option>General enquiry</option><option>Report support</option><option>Volunteer support</option><option>Technical support</option><option>Partnership / collaboration</option></select></label>
              <label>Message *<textarea name="message" required rows={6} placeholder="Tell us how we can help..." /></label>
              <button className="button button-primary" type="submit">Preview submission <span aria-hidden="true">&gt;</span></button>
              <small className="contact-form-footnote">No information is transmitted or stored.</small>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
