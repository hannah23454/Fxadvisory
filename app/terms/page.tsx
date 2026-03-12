"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Disclaimer from "@/components/disclaimer"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#12261f] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Legal &amp; Compliance</h1>
          <p className="text-[#A8C5BA] text-lg">
            Privacy Policy, Terms of Service, and Compliance information for SwitchYard FX Advisory.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Privacy Policy */}
        <section id="privacy">
          <h2 className="text-3xl font-bold text-[#12261f] mb-6 border-b border-gray-200 pb-4">
            Privacy Policy
          </h2>
          <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
            <p>
              SwitchYard FX Advisory ABN 49 691 362 553, AFSL 520548 (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to
              protecting the privacy of your personal information in accordance with the <em>Privacy Act 1988</em> (Cth)
              and the Australian Privacy Principles (APPs).
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Information We Collect</h3>
            <p>
              We collect personal information such as name, email address, phone number, business details, and
              financial information necessary to provide our FX advisory and hedging services. Information is
              collected directly from you, from third-party verification providers, and through your use of our
              website or platform.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">How We Use Your Information</h3>
            <p>
              Your information is used to provide and improve our services, comply with legal and regulatory
              obligations, communicate with you about your account and market updates, and for internal analytics.
              We do not sell your personal information to third parties.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Data Security</h3>
            <p>
              We employ industry-standard security measures including encryption, secure servers, and access
              controls to protect your personal information. Despite these measures, no method of transmission
              over the internet is entirely secure.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <p>
              For privacy-related enquiries, contact our Privacy Officer at{" "}
              <a href="mailto:admin@switchyard.com.au" className="text-[#2D6A4F] hover:underline">
                admin@switchyard.com.au
              </a>.
            </p>
          </div>
        </section>

        {/* Terms of Service */}
        <section id="terms">
          <h2 className="text-3xl font-bold text-[#12261f] mb-6 border-b border-gray-200 pb-4">
            Terms of Service
          </h2>
          <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
            <p>
              By accessing or using SwitchYard FX Advisory&apos;s website, platform, or services, you agree to be bound
              by these Terms of Service. Please read them carefully before proceeding.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Services</h3>
            <p>
              SwitchYard FX Advisory provides foreign exchange advisory, hedging strategy, and related financial
              services to eligible wholesale and sophisticated investors as defined under the <em>Corporations Act 2001</em> (Cth).
              Our services are not available to retail clients or individuals under 18 years of age.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">General Advice Warning</h3>
            <p>
              Any information provided through our platform or communications constitutes general financial
              advice only and does not take into account your personal objectives, financial situation, or needs.
              You should consider obtaining independent financial advice before making any financial decision.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Intellectual Property</h3>
            <p>
              All content on this website, including text, graphics, logos, and software, is the property of
              SwitchYard FX Advisory and is protected by applicable intellectual property laws. You may not
              reproduce or distribute any content without prior written consent.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, SwitchYard FX Advisory is not liable for any indirect,
              incidental, or consequential losses arising from your use of our services or reliance on
              information provided through our platform.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Governing Law</h3>
            <p>
              These terms are governed by the laws of New South Wales, Australia. You submit to the exclusive
              jurisdiction of the courts of New South Wales.
            </p>
          </div>
        </section>

        {/* Compliance */}
        <section id="compliance">
          <h2 className="text-3xl font-bold text-[#12261f] mb-6 border-b border-gray-200 pb-4">
            Compliance
          </h2>
          <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
            <p>
              SwitchYard FX Advisory operates under an Australian Financial Services Licence (AFSL) and is
              regulated by the Australian Securities and Investments Commission (ASIC).
            </p>
            <h3 className="text-lg font-semibold text-gray-800">AML / CTF</h3>
            <p>
              We maintain a comprehensive Anti-Money Laundering and Counter-Terrorism Financing (AML/CTF)
              program in compliance with the <em>Anti-Money Laundering and Counter-Terrorism Financing Act 2006</em> (Cth).
              All clients are subject to identity verification and ongoing due-diligence procedures.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Client Classification</h3>
            <p>
              We provide services exclusively to wholesale clients under section 761G of the <em>Corporations Act 2001</em>.
              Prior to onboarding, clients are required to provide evidence of their wholesale client status.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">Complaints &amp; Disputes</h3>
            <p>
              We have an internal complaints handling procedure. If you are unsatisfied with the outcome, you
              may escalate to the Australian Financial Complaints Authority (AFCA) at{" "}
              <a href="https://www.afca.org.au" target="_blank" rel="noopener noreferrer" className="text-[#2D6A4F] hover:underline">
                www.afca.org.au
              </a>.
            </p>
            <h3 className="text-lg font-semibold text-gray-800">ASIC Register</h3>
            <p>
              You can verify our licence details on the ASIC Connect Professional Registers at{" "}
              <a href="https://connectonline.asic.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#2D6A4F] hover:underline">
                connectonline.asic.gov.au
              </a>.
            </p>
          </div>
        </section>

      </div>

      <Disclaimer />
      <Footer />
    </main>
  )
}
