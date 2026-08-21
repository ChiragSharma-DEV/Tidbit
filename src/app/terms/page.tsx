'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layouts/Navbar';
import { 
  FileText, 
  ShieldCheck, 
  User, 
  UserX, 
  Key, 
  CreditCard, 
  AlertTriangle, 
  Scale, 
  XCircle, 
  Gavel, 
  Mail, 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';

interface TermSection {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
  summary?: string;
}

export default function TermsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('acceptance');

  const sections: TermSection[] = [
    {
      id: 'acceptance',
      number: '1',
      title: 'Acceptance of Terms',
      icon: ShieldCheck,
      summary: 'By using Tidbit, you agree to these legal terms and future revisions.',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          By accessing or using Tidbit (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
        </p>
      ),
    },
    {
      id: 'description',
      number: '2',
      title: 'Description of Service',
      icon: Sparkles,
      summary: 'Tidbit provides AI-powered tools, courses, tutoring, and tracking.',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Tidbit is an AI-powered educational platform that provides personalized learning experiences. The Service includes course creation tools for teachers, interactive learning modules for students, AI tutoring features, progress tracking, and assessment tools.
        </p>
      ),
    },
    {
      id: 'accounts',
      number: '3',
      title: 'User Accounts',
      icon: User,
      summary: 'You are responsible for keeping your credentials safe and accurate.',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            To access certain features of the Service, you must create an account. You agree to:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            {[
              'Provide accurate and complete account details',
              'Maintain strict security over credentials',
              'Notify us immediately of unauthorized access',
              'Take responsibility for all account activities',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'conduct',
      number: '4',
      title: 'User Conduct',
      icon: UserX,
      summary: 'Do not misuse the platform, scrape data, or violate rights.',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            To preserve a safe educational environment, you agree not to engage in any prohibited activities:
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            {[
              'Use the Service for any unlawful purpose',
              'Upload IP-infringing content',
              'Harass, abuse, or harm other users',
              'Gain unauthorized system access',
              'Scrape or collect data automatically',
              'Interfere with proper service functions',
            ].map((rule, i) => (
              <li key={i} className="flex items-center gap-2.5 p-2.5 rounded-md bg-destructive/5 text-destructive-foreground border border-destructive/10">
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
                <span className="text-foreground/90">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'content-ip',
      number: '5',
      title: 'Content & Intellectual Property',
      icon: Key,
      summary: 'You own what you upload; Tidbit owns platform materials.',
      content: (
        <div className="space-y-4 text-muted-foreground">
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> User Content
            </h4>
            <p className="text-sm leading-relaxed">
              You retain ownership of content you upload to the Service. By uploading content, you grant Tidbit a non-exclusive, worldwide license to use, display, and distribute your content in connection with the Service.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Tidbit Content
            </h4>
            <p className="text-sm leading-relaxed">
              All content provided by Tidbit, including AI-generated materials, is owned by Tidbit or its licensors. You may not copy, modify, or distribute this content without express permission.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'payments',
      number: '6',
      title: 'Payment & Subscriptions',
      icon: CreditCard,
      summary: 'Subscriptions auto-renew unless canceled prior to the period end.',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Certain features require a paid subscription. By subscribing, you agree to pay the applicable fees. Subscriptions automatically renew unless canceled before the renewal date. Refunds are provided strictly in accordance with our posted refund policy.
        </p>
      ),
    },
    {
      id: 'disclaimer',
      number: '7',
      title: 'Disclaimer of Warranties',
      icon: AlertTriangle,
      summary: 'Service is provided "AS IS". AI content may have errors.',
      content: (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-sm leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
            <Info className="w-4 h-4" /> Important Notice on AI Content
          </div>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
          </p>
          <p className="font-medium text-foreground/90">
            AI-generated content may contain inaccuracies and should not be relied upon as the sole source of information.
          </p>
        </div>
      ),
    },
    {
      id: 'limitation',
      number: '8',
      title: 'Limitation of Liability',
      icon: Scale,
      summary: 'Tidbit is not liable for indirect or consequential damages.',
      content: (
        <p className="text-muted-foreground leading-relaxed uppercase text-xs tracking-wider font-semibold bg-muted/30 p-4 rounded-lg border border-border">
          To the maximum extent permitted by law, Tidbit shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.
        </p>
      ),
    },
    {
      id: 'termination',
      number: '9',
      title: 'Termination',
      icon: XCircle,
      summary: 'We may suspend accounts that breach terms. You can leave anytime.',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We may terminate or suspend your account at any time for violation of these terms. Upon termination, your right to use the Service will immediately cease. You may also delete your account at any time through your account settings.
        </p>
      ),
    },
    {
      id: 'law',
      number: '10',
      title: 'Governing Law',
      icon: Gavel,
      summary: 'Governed by the laws of the State of California.',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
        </p>
      ),
    },
    {
      id: 'contact',
      number: '11',
      title: 'Contact Us',
      icon: Mail,
      summary: 'Questions? Reach out to legal@Tidbit.ai.',
      content: (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20">
          <div>
            <h4 className="font-semibold text-foreground">Have legal questions?</h4>
            <p className="text-sm text-muted-foreground">Our team is here to assist with any clarification on these terms.</p>
          </div>
          <a
            href="mailto:legal@Tidbit.ai"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shrink-0"
          >
            <Mail className="w-4 h-4" />
            legal@Tidbit.ai
          </a>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar />

      {/* Header Banner */}
      <header className="relative border-b border-border bg-gradient-to-b from-primary/5 via-transparent to-transparent pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
            <FileText className="w-3.5 h-3.5" /> Legal Transparency
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using Tidbit. Everything you need to know about our service agreement in simple words.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-card px-3 py-1.5 rounded-md border border-border shadow-xs">
            <span>Last updated:</span>
            <time className="font-medium text-foreground">August 2026</time>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar / Table of Contents */}
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/70"
                />
              </div>

              {/* Navigation List */}
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {filteredSections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left flex items-center justify-between p-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                          : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                        <span className="truncate">{sec.number}. {sec.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 shrink-0 ${isActive ? 'text-primary-foreground' : ''}`} />
                    </button>
                  );
                })}

                {filteredSections.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No matching terms found.</p>
                )}
              </nav>
            </div>

            {/* Help Callout */}
            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Info className="w-4 h-4 text-primary" /> Need clarification?
              </p>
              <p>Contact our support team if you have questions regarding user safety or policy compliance.</p>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-8 space-y-6">
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <article
                  id={sec.id}
                  key={sec.id}
                  className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs transition-shadow hover:shadow-md space-y-4 scroll-mt-28"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-primary tracking-wider uppercase">Section {sec.number}</span>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{sec.title}</h2>
                      </div>
                    </div>
                  </div>

                  {/* Summary Highlight Pill */}
                  {sec.summary && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/40 text-xs text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold text-foreground shrink-0">Summary:</span>
                      <span>{sec.summary}</span>
                    </div>
                  )}

                  <div className="pt-2 text-sm sm:text-base">{sec.content}</div>
                </article>
              );
            })}

            {/* Back Home Button */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Tidbit AI</span> &copy; {new Date().getFullYear()} All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <a href="mailto:legal@Tidbit.ai" className="hover:text-foreground transition-colors">Contact Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}