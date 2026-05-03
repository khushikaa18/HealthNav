import { ClipboardList, HeartPulse, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Lenders = () => (
  <>
    <section className="gradient-hero relative overflow-hidden px-6 py-20 text-center md:px-10 md:py-24">
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent-light">For banks & NBFCs</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] leading-tight text-primary-foreground">
          Know what a medical loan is
          <br /> really for — before you approve it.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/55 sm:text-lg">
          Skip the back-and-forth on hospital quotes. Each application comes with a grounded cost
          estimate built from clinical guidelines and local pricing — wherever your borrower lives.
        </p>
        <Button size="lg" className="mt-7 bg-accent px-8 text-accent-foreground hover:bg-accent-light">
          Talk to our team →
        </Button>
      </div>
    </section>

    <section className="grid gap-5 bg-muted px-6 py-16 md:grid-cols-3 md:px-10">
      {[
        { icon: ClipboardList, title: "One clean cost report", desc: "Every loan file gets a tidy, structured breakdown of what the treatment costs and where the money goes — no PDFs, no chasing." },
        { icon: HeartPulse, title: "Risk that's actually called out", desc: "If a borrower has diabetes, blood pressure issues or other conditions that often push costs up, we say so up front." },
        { icon: BarChart3, title: "Honest confidence levels", desc: "Each estimate comes with a confidence score so your team knows how solid the number is — not just a single figure." },
      ].map(({ icon: Icon, title, desc }) => (
        <article key={title} className="rounded-xl border border-border bg-card p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated">
          <div className="mb-3.5 grid h-11 w-11 place-items-center rounded-md bg-accent/10 text-accent">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-sans text-[15px] font-bold text-primary">{title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
        </article>
      ))}
    </section>

    <section className="bg-background px-6 py-16 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-sans text-xl font-bold text-primary">A peek at the API</h2>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[#1a2535] p-6 font-mono text-[13px] leading-relaxed text-[#a8d8c8]">
{`// POST /v1/estimate — example response
{
  "patient_id": "anon_8472",
  "condition": "Coronary artery disease (ICD-10 I25.10)",
  "procedure": "Angioplasty",
  "location": "auto-detected (any supported region)",
  "currency": "auto",
  "procedure_cost_range": { "min": 120000, "max": 200000 },
  "hospital_stay_range":  { "min":  30000, "max":  60000 },
  "total_range":          { "min": 175000, "max": 350000 },
  "comorbidity_risk_multiplier": 1.22,
  "comorbidity_flags": ["diabetes_t2"],
  "geo_adjustment_factor": 0.81,
  "confidence_score": 0.72,
  "data_sources": ["WHO_ICD10", "LOCAL_REGISTRY", "ACCREDITATION_BODY"],
  "disclaimer": "Decision support only. Not a quote or guarantee."
}`}
        </pre>
        <p className="mt-4 text-sm text-muted-foreground">
          <strong className="text-primary">You can be live in an afternoon.</strong> A simple REST API,
          ready-to-use Python and Node.js helpers, and a sandbox to play in. Encrypted end-to-end and
          built to respect DPDP, GDPR and HIPAA rules.
        </p>
      </div>
    </section>
  </>
);

export default Lenders;
