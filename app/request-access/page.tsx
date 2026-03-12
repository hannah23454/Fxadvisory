import AccessRequestForm from "@/components/access-request-form"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { FileText, LayoutDashboard, TrendingUp } from "lucide-react"

export const metadata = {
  title: "Request Access — SwitchYard FX",
  description: "Request a hedge piece, dashboard access, or market insights from SwitchYard FX.",
}

const features = [
  {
    icon: FileText,
    title: "Hedge Piece",
    desc: "Sample FX hedge policy template tailored for mid-market CFOs and treasury managers.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Access",
    desc: "Live FX rates, trade uploads, personalised insights, and direct messaging.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    desc: "Weekly strategic FX commentary covering major pairs, risk events, and positioning ideas.",
  },
]

export default function RequestAccessPage() {
  return (
    <main className="min-h-screen bg-[#FAFBFA]">
      <Header />

      {/* Hero */}
      <section className="relative bg-[#12261f] text-white pb-24 sm:pb-28">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F] text-[#A8C5BA] mb-6 tracking-wider uppercase">
            Get Started
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-[1.1] tracking-tight">
            Request Access
          </h1>
          <p className="text-lg text-[#A8C5BA] leading-relaxed max-w-xl mx-auto">
            Tell us what you need and we'll reach out. No commitment, no pressure — just
            intelligent FX support.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — what you get */}
          <div>
            <h2 className="text-2xl font-bold text-[#12261F] mb-8">What you can request</h2>
            <div className="space-y-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 bg-white rounded-2xl border border-[#DCE5E1] shadow-sm"
                >
                  <div className="w-11 h-11 bg-[#E8EEEB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#12261F] mb-1">{title}</h3>
                    <p className="text-sm text-[#4A5A55] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-[#E8EEEB] rounded-2xl">
              <p className="text-sm text-[#12261F] font-semibold mb-1">Already have an account?</p>
              <p className="text-sm text-[#4A5A55] mb-3">
                Log in to access your personalised dashboard and insights directly.
              </p>
              <Link
                href="/login"
                className="inline-block px-5 py-2.5 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] transition-all"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-block ml-3 px-5 py-2.5 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] text-sm font-semibold hover:bg-[#2D6A4F] hover:text-white transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl border border-[#DCE5E1] shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#12261F] mb-1">Submit Your Request</h2>
            <p className="text-sm text-[#52796F] mb-6">
              Fill in your details and we'll be in touch soon.
            </p>
            <AccessRequestForm />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
