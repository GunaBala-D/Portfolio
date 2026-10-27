import { CopyEmail } from '../components/CopyEmail';
import { FileText, Github, Linkedin, Mail } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { profile } from '../data/profile';

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="contact__panel glass glass--edge">
          <p className="eyebrow">
            <span className="eyebrow__index">05</span>
            <span className="eyebrow__rule" aria-hidden="true" />
            Contact
          </p>
          <h2 className="contact__title" id="contact-title">
            Let&rsquo;s talk about the <span className="grad-text">AI systems</span> you&rsquo;re building.
          </h2>
          <p className="lede">
            Email is the quickest way to reach me. I&rsquo;m based in {profile.location}, and my resume, code and
            certificates are linked below.
          </p>

          <a className="contact__email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>

          <div className="contact__actions">
            <a href={`mailto:${profile.email}`} className="btn btn--primary">
              <Mail /> Send an email
            </a>
            <CopyEmail />
            <a href={profile.resume} className="btn" target="_blank" rel="noopener">
              <FileText /> Resume (PDF)
            </a>
          </div>

          <ul role="list" className="contact__links">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin />
                <span>
                  <strong>LinkedIn</strong>
                  <span className="mono">{profile.linkedinLabel}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                <Github />
                <span>
                  <strong>GitHub</strong>
                  <span className="mono">{profile.githubLabel}</span>
                </span>
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
