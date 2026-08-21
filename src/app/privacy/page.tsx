import Link from 'next/link';
import Navbar from '@/components/layouts/Navbar';

export default function PrivacyPage() {
  const lastUpdated = "August 2026";

  const policySections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "information-collection", title: "2. Information We Collect" },
    { id: "information-usage", title: "3. How We Use Your Information" },
    { id: "ai-processing", title: "4. AI & Model Training" },
    { id: "information-sharing", title: "5. Information Sharing" },
    { id: "data-security", title: "6. Data Security & Breaches" },
    { id: "data-retention", title: "7. Data Retention" },
    { id: "user-rights", title: "8. Your Rights (GDPR & CCPA)" },
    { id: "cookies", title: "9. Cookies and Tracking" },
    { id: "children-privacy", title: "10. Children's Privacy" },
    { id: "international-transfers", title: "11. International Data Transfers" },
    { id: "changes", title: "12. Changes to This Policy" },
    { id: "contact", title: "13. Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      {/* Header Section */}
      <div className="bg-card border-b border-border py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            Legal Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {lastUpdated} by Chirag Sharma
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Table of Contents Sidebar */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">On this page</h3>
              <nav className="flex flex-col space-y-3 text-sm">
                {policySections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <div className="space-y-12 text-foreground">
                
                <section id="introduction" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    1. Introduction
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Tidbit (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard
                    your information when you use our AI-powered learning platform. By accessing our services, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </section>

                <section id="information-collection" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    2. Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Personal Information:</strong> When you
                      create an account, we collect your name, email address, and password. If
                      you subscribe to a paid plan, we collect payment information through our
                      secure, PCI-compliant payment processor.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Learning Data:</strong> We collect
                      information about your learning activities, including courses enrolled,
                      progress data, quiz responses, time spent on content, and interactions with
                      the AI tutor.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Uploaded Content:</strong> If you are a
                      teacher, we collect the educational materials (PDFs, text, and other files) you
                      upload to create courses.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Usage & Device Data:</strong> We automatically
                      collect information about your device, browser, IP address, device identifiers, and how you
                      interact with the Service.
                    </p>
                  </div>
                </section>

                <section id="information-usage" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    3. How We Use Your Information
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Provide, maintain, and securely operate the Service</li>
                    <li>Personalize your learning experience using our proprietary AI</li>
                    <li>Generate adaptive content and study recommendations</li>
                    <li>Process payments and manage subscription tiers</li>
                    <li>Communicate with you regarding updates, security alerts, and support</li>
                    <li>Identify usage trends to improve and develop new features</li>
                    <li>Ensure platform security and prevent fraudulent activity</li>
                    <li>Comply with applicable legal obligations</li>
                  </ul>
                </section>

                <section id="ai-processing" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    4. AI & Model Training
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our AI systems process your learning data to provide personalized experiences. This includes analyzing your responses to adjust difficulty and generating tailored explanations.
                  </p>
                  <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Our Commitment to AI Privacy:</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li><strong className="text-foreground">No Public Training:</strong> We do not use your personal data or uploaded documents to train public foundational AI models.</li>
                      <li><strong className="text-foreground">Opt-Out Rights:</strong> Users on Pro and Enterprise tiers can opt out of internal model fine-tuning via their account settings.</li>
                      <li><strong className="text-foreground">Anonymization:</strong> Any data used for improving our internal models is strictly anonymized and stripped of Personally Identifiable Information (PII).</li>
                    </ul>
                  </div>
                </section>

                <section id="information-sharing" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    5. Information Sharing
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">We never sell your personal information.</strong> We only share your data under the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">Service Providers:</strong> Vetted third parties who help us operate (e.g., AWS for hosting, Stripe for payments, OpenAI for processing specific queries via secure API).
                    </li>
                    <li>
                      <strong className="text-foreground">Educators:</strong> If you are a student part of a registered institution, your teacher or administrator may view your progress metrics.
                    </li>
                    <li>
                      <strong className="text-foreground">Legal Requirements:</strong> When legally mandated by a valid subpoena or court order.
                    </li>
                    <li>
                      <strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, subject to strict confidentiality agreements.
                    </li>
                  </ul>
                </section>

                <section id="data-security" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    6. Data Security & Breaches
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We implement enterprise-grade security measures, including AES-256 encryption at rest and TLS 1.3 in transit. Access to personal data is strictly limited to authorized personnel.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Breach Notification:</strong> In the unlikely event of a data breach compromising your personal information, we will notify you and the relevant regulatory authorities within 72 hours of discovery, in accordance with global compliance standards.
                  </p>
                </section>

                <section id="data-retention" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    7. Data Retention
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your account data for as long as your account is active. If you delete your account, your personal data is hard-deleted from our active servers within 30 days, and from our secure backups within 90 days. Anonymized learning metrics may be retained indefinitely for statistical purposes.
                  </p>
                </section>

                <section id="user-rights" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    8. Your Rights (GDPR & CCPA)
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Depending on your jurisdiction (such as the EU/UK or California), you are entitled to comprehensive data rights:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong className="text-foreground">Right to Access:</strong> Request a copy of the data we hold about you.</li>
                    <li><strong className="text-foreground">Right to Rectification:</strong> Request corrections to inaccurate data.</li>
                    <li><strong className="text-foreground">Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request immediate deletion of your account and data.</li>
                    <li><strong className="text-foreground">Right to Portability:</strong> Export your data in a structured, machine-readable format (JSON/CSV).</li>
                    <li><strong className="text-foreground">Right to Restrict Processing:</strong> Limit how we use your data, including opting out of AI personalization.</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    To exercise these rights, email us or use the &quot;Privacy Dashboard&quot; in your account settings.
                  </p>
                </section>

                <section id="cookies" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    9. Cookies and Tracking
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies essential for platform functionality (like maintaining your login session) and analytical cookies to understand user behavior. You can manage your cookie preferences at any time via our Cookie Consent banner or your browser settings.
                  </p>
                </section>

                <section id="children-privacy" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    10. Children&apos;s Privacy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Tidbit is not intended for independent use by children under 13 (or 16 in the EU). We do not knowingly collect data from children without verifiable parental consent or institutional authorization via a registered school.
                  </p>
                </section>

                <section id="international-transfers" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    11. International Data Transfers
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our servers are primarily located in the United States. If you access Tidbit from outside the US, your data is protected under Standard Contractual Clauses (SCCs) and cross-border transfer agreements to ensure it receives equivalent protection to your home jurisdiction.
                  </p>
                </section>

                <section id="changes" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    12. Changes to This Policy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this policy to reflect changes in our practices or regulatory requirements. Material changes will be communicated via email and an in-app notification 30 days before they take effect.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                    13. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions, concerns, or data requests, please contact our Data Protection Officer at:
                  </p>
                  <div className="mt-6 bg-secondary/30 p-6 rounded-xl border border-border">
                    <ul className="list-none space-y-3 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <strong className="text-foreground">Email:</strong>{' '}
                        <a href="mailto:privacy@tidbit.ai" className="text-primary hover:underline font-medium">
                          privacy@tidbit.ai
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <strong className="text-foreground">Address:</strong> 
                        <span>IIT Mangliya Road, Indore, Madhya Pradesh, India</span>
                      </li>
                    </ul>
                  </div>
                </section>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                &larr; Back to Home
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tidbit AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}