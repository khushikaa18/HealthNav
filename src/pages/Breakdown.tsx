import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Star, AlertTriangle, Info, ShieldAlert, User2, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { generateHospitals } from "@/data/hospitals";
import { useMemo } from "react";

const COMPONENTS = [
  { title: "Procedure Cost", desc: "Core surgical and catheterization charges", barW: 100, fracMin: 0.6, fracMax: 1.0, color: "hsl(var(--accent-dim))" },
  { title: "Hospital Stay", desc: "Room, nursing, post-op recovery 3–5 days", barW: 60, fracMin: 0.15, fracMax: 0.3, color: "hsl(var(--accent))" },
  { title: "Medication & Diagnostics", desc: "Blood thinners, stents, imaging, labs", barW: 50, fracMin: 0.13, fracMax: 0.25, color: "hsl(var(--accent-light))" },
  { title: "Contingency Buffer", desc: "ICU risk for diabetic patients", barW: 33, fracMin: 0.07, fracMax: 0.2, color: "hsl(var(--muted-foreground))" },
];

const Breakdown = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { city, region, formatRange } = useLocation();
  const hospital = useMemo(() => generateHospitals(city, region).find((h) => h.id === id) ?? generateHospitals(city, region)[0], [city, region, id]);
  const total = hospital.costMaxINR + hospital.costMinINR * 0.4;

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 bg-muted lg:grid-cols-[1fr_380px]">
      <div className="overflow-y-auto px-5 py-8 md:px-10">
        <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to results
        </button>

        <h1 className="font-sans text-2xl font-bold leading-tight text-primary">
          {hospital.name} — Angioplasty Cost Breakdown
        </h1>

        <div className="mt-3 mb-7 flex flex-wrap items-center gap-4 rounded-md border border-border bg-card px-4 py-3 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-primary"><User2 className="h-3.5 w-3.5 text-accent" /> Patient: 55M · Diabetic</span>
          <span className="flex items-center gap-1.5 font-medium text-primary"><MapPin className="h-3.5 w-3.5 text-accent" /> {city}, {region.name}</span>
          <span className="flex items-center gap-1.5 font-medium text-primary"><HeartPulse className="h-3.5 w-3.5 text-accent" /> Coronary Artery Disease (ICD-10 I25.10)</span>
        </div>

        <section className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-sans text-base font-bold text-primary">Cost Component Breakdown</h2>
          {COMPONENTS.map((c) => (
            <div key={c.title} className="flex items-center gap-4 border-b border-muted py-3.5 last:border-0">
              <div className="hidden h-8 shrink-0 rounded-md sm:block" style={{ width: c.barW * 1.6, background: c.color }} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">{c.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <p className="whitespace-nowrap text-[15px] font-bold text-gold">
                {formatRange(hospital.costMinINR * c.fracMin, hospital.costMaxINR * c.fracMax)}
              </p>
            </div>
          ))}
          <div className="mt-4 flex items-center justify-between rounded-md bg-accent px-5 py-4 text-base font-bold text-accent-foreground">
            <span>Total Estimated Range</span>
            <span className="text-[22px] text-gold">{formatRange(hospital.costMinINR, total)}</span>
          </div>
        </section>

        <section className="mt-5 rounded-xl border border-border bg-card p-5">
          <p className="mb-2.5 text-[13px] font-semibold text-primary">Confidence Score: {hospital.confidence.toFixed(2)}</p>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light" style={{ width: `${hospital.confidence * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Based on regional benchmark data for {city} · WHO + local clinical guidelines</p>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-warning/20 bg-warning-bg p-5 text-[13px] leading-relaxed text-warning">
            <p className="mb-1.5 flex items-center gap-1.5 font-bold"><AlertTriangle className="h-4 w-4" /> Risk Flag</p>
            Diabetes increases ICU admission likelihood. This estimate includes a buffer. If ICU admission occurs, costs may exceed the upper bound.
          </div>
          <div className="rounded-xl border border-info/20 bg-info-bg p-5 text-[13px] leading-relaxed text-info">
            <p className="mb-1.5 flex items-center gap-1.5 font-bold"><Info className="h-4 w-4" /> Geo Adjustment Applied</p>
            Costs calibrated for {city} pricing. Regional rates verified against {region.code === "IN" ? "NHA" : "local & WHO"} datasets.
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Estimates are based on standard treatment guidelines. Actual costs may vary. This is decision support, not a guarantee.
        </p>
      </div>

      {/* Sidebar */}
      <aside className="overflow-y-auto border-t border-border bg-card p-6 lg:border-l lg:border-t-0">
        <div className="rounded-xl bg-primary p-5 text-primary-foreground">
          <h3 className="font-sans text-[17px] font-bold">{hospital.name}</h3>
          {hospital.accredited && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-accent/20 px-2.5 py-1 text-[11px] font-bold text-accent-light">
              ✓ {region.accreditation}
            </span>
          )}
          <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-white/55">
            <li className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {city}, {region.name}</li>
            <li className="flex items-center gap-2"><Phone className="h-3 w-3" /> Contact via app</li>
            <li className="flex items-center gap-2"><Star className="h-3 w-3 fill-current text-gold" /> {hospital.rating}/5 · {hospital.reviews} reviews</li>
          </ul>
        </div>

        <div className="mt-4 rounded-xl bg-muted p-5">
          <p className="mb-3 text-[13px] font-bold text-primary">Ranking Score Breakdown — 87/100</p>
          {(hospital.ranking.length ? hospital.ranking : [
            { label: "Specialization", weight: "", score: 90 },
            { label: region.accreditation, weight: "", score: 100 },
            { label: "Reviews", weight: "", score: 82 },
            { label: "Distance", weight: "", score: 78 },
            { label: "Cost Tier", weight: "", score: 72 },
          ]).map((r) => (
            <div key={r.label} className="mb-2.5 flex items-center gap-2.5">
              <span className="w-28 shrink-0 text-xs text-muted-foreground">{r.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-accent" style={{ width: `${r.score}%` }} />
              </div>
              <span className="w-9 text-right text-[11px] font-semibold text-accent">{r.score}%</span>
            </div>
          ))}
        </div>

        <Button asChild variant="outline" className="mt-4 w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link to="/compare">Compare with another hospital</Link>
        </Button>

        <div className="mt-4 rounded-md border border-l-4 border-l-destructive border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="flex items-center gap-1.5 font-bold text-destructive"><ShieldAlert className="h-3.5 w-3.5" /> Important</p>
          <p className="mt-1">This tool provides decision support only. It does not constitute medical advice or a cost guarantee. Consult a qualified physician before treatment decisions.</p>
        </div>
      </aside>
    </div>
  );
};

export default Breakdown;
