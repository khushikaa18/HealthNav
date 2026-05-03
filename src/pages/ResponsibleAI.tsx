import { Shield, TrendingUp, AlertTriangle, Siren, FileText, Scale } from "lucide-react";

const PRINCIPLES = [
  { icon: Shield, title: "We help, we don't diagnose", desc: "HealthNav is a thinking partner, not a doctor. We never diagnose or prescribe, and a clear note saying so sits on every screen." },
  { icon: TrendingUp, title: "Honest about uncertainty", desc: "Every cost or estimate comes with a confidence score. We tell you what we're sure about and what's a best-guess." },
  { icon: AlertTriangle, title: "Risks shown up front", desc: "If something like diabetes is likely to change your treatment or bill, we say so right next to the number — not buried in fine print." },
  { icon: Siren, title: "Safety first, always", desc: "If your description sounds like a heart attack or stroke, we stop everything and point you to emergency help. No ifs, no buts." },
  { icon: FileText, title: "We keep our receipts", desc: "Every answer is logged with the model and version that produced it. Low-confidence answers get a second look from a human." },
  { icon: Scale, title: "Built within the rules", desc: "Designed around WHO ethics, India's ICMR and DPDP, US HIPAA, EU GDPR — and the IndiaAI Mission 2024 principles." },
];

const SOURCES = ["WHO ICD-10", "SNOMED CT", "Local Standard Treatment Guidelines", "NABH / JCI / CQC", "OpenStreetMap", "IndiaAI Mission 2024", "ICMR AI Ethics", "MeitY AI Governance"];

const ResponsibleAI = () => (
  <section className="bg-muted px-6 py-16 md:px-10 md:py-20">
    <header className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">What we promise you</p>
      <h1 className="mt-3 text-[clamp(2rem,4vw,2.625rem)] leading-tight text-primary">Built carefully, on purpose.</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Health decisions are personal. So every choice we make as a team is weighed against your safety,
        your privacy, and your right to a clear answer — no matter where in the world you're using HealthNav.
      </p>
    </header>

    <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
        <article key={title} className="rounded-xl border border-border bg-card p-7 shadow-soft transition hover:shadow-elevated">
          <Icon className="mb-3.5 h-7 w-7 text-accent" />
          <h3 className="font-sans text-[15px] font-bold text-primary">{title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
        </article>
      ))}
    </div>

    <div className="mx-auto mt-12 max-w-5xl rounded-xl border border-border bg-card p-6 sm:p-8">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">Data & Frameworks</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {SOURCES.map((s) => (
          <span key={s} className="rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
            {s}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default ResponsibleAI;
