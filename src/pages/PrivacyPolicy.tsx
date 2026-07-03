import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-24 pb-20">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,198,255,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(20,241,149,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />

      {/* Nav Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4">
        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full glass px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-white">Zyvora Finance</span>
          </Link>
          <Link
            to="/"
            className="text-xs text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-full px-4 py-2 transition"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-left">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-xs text-white/50 mt-2">Last Updated Date: July 1, 2026</p>
        </div>

        <div className="glass-strong noise rounded-3xl p-8 space-y-6 border border-white/10 text-white/80 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Introduction</h2>
            <p>
              Welcome to Zyvora Finance. We value your privacy and are committed to safeguarding the
              personal data you entrust to us. This Privacy Policy details the types of information
              we gather, how we process it, and your rights concerning your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Definitions</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Service:</strong> Refers to the Zyvora Finance website and associated educational
                tools.
              </li>
              <li>
                <strong>Personal Data:</strong> Information relating to an identified or
                identifiable natural person.
              </li>
              <li>
                <strong>Data Controller:</strong> The entity responsible for defining the purposes
                and methods of processing Personal Data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Information We Collect</h2>
            <p>
              We collect information in two main categories: information you explicitly provide to
              us when filling out our signup or contact forms, and automated technical data captured
              by our platform infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              4. Information You Voluntarily Provide
            </h2>
            <p>
              This includes your full name, email address, phone number, and any text message you
              enter when requesting access, signing up for the platform, or submitting an enquiry.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              5. Automatically Collected Information
            </h2>
            <p>
              When you browse our platform, we automatically collect basic log information,
              including your IP address, browser type, operating system, and interaction signals on
              the website (e.g. scrolling behaviors).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Purpose of Data Collection</h2>
            <p>
              We collect your data to handle incoming customer enquiries, run user authentication,
              verify Swiss identity requirements, analyze platform usage to optimize our layout
              animations, and connect leads with our advisory desks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Legal Basis for Processing</h2>
            <p>
              We process your personal data based on your explicit consent (e.g., when signing up),
              to perform pre-contractual steps (e.g., answering enquiries), and for our legitimate
              business interests in securing our digital resources.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              8. How Personal Information Is Used
            </h2>
            <p>
              Your personal information is used exclusively to facilitate access to our premium
              educational assets, follow up on advisory requests, protect our services against
              malicious actors, and sync contact lists with our affiliate structures.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              9. Third-Party Service Providers
            </h2>
            <p>
              We do not sell, lease, or distribute your contact information to third-party marketing entities. Information is only shared with trusted service providers essential to operating our secure platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">10. Cookies</h2>
            <p>
              We use functional cookies to maintain your login session (e.g. storing verification
              references in your local storage) and ensure consistent page styling across your
              visits.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">11. Tracking Technologies</h2>
            <p>
              In addition to cookies, we utilize standard server-side tracking indicators and script
              log hooks to analyze traffic vectors and defend against automated validation attacks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">12. Data Security</h2>
            <p>
              We employ high-end technical measures (SSL encryption, secure API proxying, secret
              separation) to prevent unauthorized access, alteration, disclosure, or destruction of
              your personal details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">13. Data Retention</h2>
            <p>
              We retain your personal database files for only as long as necessary to fulfill the
              educational or advisory relationships, or as mandated by Swiss regulatory
              record-keeping laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">14. International Data Transfers</h2>
            <p>
              Your database objects are stored within the European Union and Switzerland. In case of
              international server routing, we ensure adequate security guarantees are enforced.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">15. User Rights</h2>
            <p>
              You have the right to request access to your stored personal information, request
              corrections to invalid telephone records, or request complete erasure from our storage
              and operational layers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">16. Marketing Communications</h2>
            <p>
              You may opt out of receiving educational updates or strategic invitations by clicking
              the unsubscribe link in our correspondence or emailing our desk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">17. Children's Privacy</h2>
            <p>
              Our services are directed to institutional investors and individuals above the age of
              18. We do not knowingly compile databases of minors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">18. Third-Party Websites</h2>
            <p>
              Our website may link to third-party resources. We are not responsible for the privacy
              structures or content guidelines of outside entities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">19. Policy Updates</h2>
            <p>
              We reserve the right to revise this Privacy Policy at any time. Changes will take
              effect immediately upon updating this page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">20. Contact Information</h2>
            <p>
              For privacy concerns or to request data erasure, please submit an enquiry through our platform contact form.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" glow={false} />
            <span className="font-bold text-white">Zyvora Finance</span>
            <span className="text-xs text-white/40 ml-2">
              &copy; 2026 &middot; The Future of Digital Wealth
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link to="/privacy" className="hover:text-white text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
