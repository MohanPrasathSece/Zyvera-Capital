import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function TermsConditions() {
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
            Terms & <span className="text-gradient">Conditions</span>
          </h1>
          <p className="text-xs text-white/50 mt-2">Last Updated Date: July 1, 2026</p>
        </div>

        <div className="glass-strong noise rounded-3xl p-8 space-y-6 border border-white/10 text-white/80 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using the Zyvora Finance website and services, you signify your
              absolute agreement to be bound by these Terms & Conditions. If you do not accept these
              terms in full, you must cease using our resources immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Eligibility</h2>
            <p>
              The Services are intended solely for individuals who are eighteen (18) years of age or
              older. By registering or requesting access, you warrant that you possess the full
              legal capacity to enter into these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Website Purpose</h2>
            <p>
              Zyvora Finance provides a premium, interactive educational platform focused on cryptocurrency
              markets, blockchain protocols, and portfolio design principles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. User Responsibilities</h2>
            <p>
              You are responsible for keeping your credentials (email references) confidential. You
              agree to provide accurate, up-to-date contact information, specifically a valid Swiss
              telephone number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Acceptable Use</h2>
            <p>
              You must use this website only for lawful, educational research. You agree not to
              bypass authentication protocols or attempt to inject malicious code into our API
              routes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Prohibited Activities</h2>
            <p>
              Prohibited actions include reverse-engineering the site layout, scraping educational
              content, sending spam enquiries, or engaging in actions that compromise host server
              uptime.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Intellectual Property</h2>
            <p>
              All text, graphic illustrations, neomorphic chart designs, and code assets on this
              platform are the property of Zyvora Finance and are protected by applicable intellectual
              property statutes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">8. Accuracy of Information</h2>
            <p>
              While Zyvora Finance endeavors to present correct training guides, we do not warrant the
              absolute accuracy, completeness, or timeliness of market simulator numbers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">9. No Financial Advice</h2>
            <p>
              The content provided within Zyvora Finance's educational dashboard does not constitute
              financial advice. All educational inputs are for informational research purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">10. No Investment Advice</h2>
            <p>
              Zyvora Finance does not offer recommendation matrices for purchasing individual digital tokens
              or executing leveraged trading strategies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              11. Cryptocurrency Risk Disclosure
            </h2>
            <p>
              Trading and holding digital currencies involves substantial price volatility and
              systemic risk of complete capital loss. Markets run 24/7 without circuit breakers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">12. No Guarantee of Returns</h2>
            <p>
              Past simulations do not dictate future outcomes. Zyvora Finance makes no representation or
              warranty that any portfolio design will achieve positive yields.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">13. Limitation of Liability</h2>
            <p>
              To the absolute extent permitted by law, Zyvora Finance and its affiliates shall not be liable
              for any direct, indirect, incidental, or consequential damages resulting from your
              access to or inability to access our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">14. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Zyvora Finance, its directors, and technical
              developers from any claims or legal demands arising from your misuse of the platform
              or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">15. Third-Party Links</h2>
            <p>
              Our educational modules may link to external resources. We carry no liability or
              verification authority over those websites' guidelines or accuracy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">16. Privacy Policy Reference</h2>
            <p>
              Your submission of lead profiles is governed by our Privacy Policy. By agreeing to
              these Terms, you consent to the processing of your data as defined there.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">17. Suspension of Access</h2>
            <p>
              We reserve the right to restrict or terminate your access to the educational tabs at
              any time without warning for breach of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">18. Governing Law</h2>
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of
              Switzerland, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">19. Dispute Resolution</h2>
            <p>
              Any legal disputes relating to these terms shall be submitted to the exclusive
              jurisdiction of the competent courts of Geneva, Switzerland.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">20. Severability</h2>
            <p>
              If any provision of these terms is deemed unlawful or unenforceable by a court, the
              remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">21. Changes to Terms</h2>
            <p>
              We may revise these Terms & Conditions at our discretion. Your continued use of the
              platform after updates indicates your acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">22. Contact Information</h2>
            <p>
              For legal inquiries or details regarding our terms of operation, please contact us via our website advisory desk.
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
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
