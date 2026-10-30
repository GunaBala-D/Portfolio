import { CopyEmail } from '../components/CopyEmail';
import { External, FileText, Github, Linkedin, Mail } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { SectionBar } from '../components/Section';
import { profile } from '../data/profile';

export function Contact() {
  return (
    <section className="section contact" id="contact" data-choreo aria-labelledby="contact-title">
      <span className="section__rule" data-draw-rule aria-hidden="true" />
      <div className="frame">
        <span className="tick tick--half tick--tl" data-draw-tick aria-hidden="true" />
        <span className="tick tick--half tick--tr" data-draw-tick aria-hidden="true" />
        <SectionBar index="05" label="Contact" note={profile.location} />

        <div className="section__head section__head--center contact__head">
          <Reveal as="p" className="hud-label faint">
            Email · LinkedIn · GitHub
          </Reveal>
          <Reveal as="h2" className="contact__title" id="contact-title">
            Let&rsquo;s talk about the <span className="serif">AI systems</span> you&rsquo;re building.
          </Reveal>
        </div>

        <div className="ruled contact__cols" data-reveal-group>
          <div className="contact__col" data-reveal>
            <h3 className="h-card">Email</h3>
            <p className="muted">
              The quickest way to reach me. I&rsquo;m based in {profile.location}.
            </p>
            <a className="contact__email display" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="contact__actions">
              <a href={`mailto:${profile.email}`} className="btn btn--primary">
                <Mail /> Send an email
              </a>
              <CopyEmail />
            </div>
          </div>

          <div className="contact__col" data-reveal>
            <h3 className="h-card">Everything else</h3>
            <p className="muted">My resume, code and professional profile.</p>
            <ul role="list" className="contact__links">
              <li>
                <a href={profile.resume} target="_blank" rel="noopener">
                  <FileText />
                  <span>Resume (PDF)</span>
                  <External />
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin />
                  <span>LinkedIn</span>
                  <External />
                </a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  <Github />
                  <span>GitHub</span>
                  <External />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
