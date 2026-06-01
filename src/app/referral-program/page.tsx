import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Referral Program - Give $10, Get $10 | Cryptoelectro-au",
  description: "Refer a friend to Cryptoelectro-au and you both earn $10 in store credit. Share your code and start earning today.",
  openGraph: { title: "Refer a Friend, Earn $10 Each | Cryptoelectro-au", description: "Give $10, Get $10. Invite your friends to shop premium electronics with crypto." },
};

const steps = [
  { step: "01", title: "Get Your Code", description: "Sign up and get your unique referral code from your dashboard." },
  { step: "02", title: "Share With Friends", description: "Share your code or link with friends via WhatsApp, social media, or email." },
  { step: "03", title: "Friend Signs Up & Buys", description: "Your friend creates an account with your code and makes their first purchase." },
  { step: "04", title: "You Both Earn $10", description: "You and your friend each receive $10 in store credit automatically!" },
];

export default function ReferralProgramPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-success/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Breadcrumb items={[{ label: "Referral Program" }]} />
          <div className="text-center max-w-3xl mx-auto mt-8">
            <span className="badge badge-accent text-sm mb-4 inline-block">🎁 Give $10, Get $10</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">Refer Friends, <span className="text-gradient">Earn Together</span></h1>
            <p className="mt-6 text-lg text-text-primary/60 leading-relaxed">Invite your friends to Cryptoelectro-au. When they sign up and make their first purchase, you both get $10 in store credit. Simple, instant, and unlimited.</p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link href="/register" className="btn-primary text-base px-8 py-4">Get Your Code</Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-4">I Already Have an Account</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary-dark/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">How It <span className="text-gradient">Works</span></h2>
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.step} className="card p-6 flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0"><span className="text-lg font-heading font-bold text-accent">{s.step}</span></div>
                <div><h3 className="text-lg font-heading font-bold mb-1">{s.title}</h3><p className="text-sm text-text-primary/60">{s.description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Start Referring Today</h2>
          <p className="text-text-primary/60 mb-8">No limits. Refer 10 friends = $100. Refer 100 = $1,000. All in store credit.</p>
          <Link href="/register" className="btn-primary text-base px-8 py-4">Create Free Account</Link>
        </div>
      </section>
    </div>
  );
}