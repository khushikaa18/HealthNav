import { Check, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { generateHospitals } from "@/data/hospitals";
import { useMemo } from "react";

const Compare = () => {
  const { city, region, formatRange } = useLocation();
  const hospitals = useMemo(() => generateHospitals(city, region).slice(0, 2), [city, region]);
  const [a, b] = hospitals;

  const rows: { label: string; va: React.ReactNode; vb: React.ReactNode; aHi?: boolean; bHi?: boolean }[] = [
    {
      label: "Overall Match Score",
      va: <span className="inline-block rounded-md bg-accent px-3.5 py-1.5 text-base font-bold text-accent-foreground">87/100</span>,
      vb: <span className="inline-block rounded-md bg-muted-foreground/70 px-3.5 py-1.5 text-base font-bold text-card">74/100</span>,
    },
    { label: `${region.accreditation}`, va: <span className="font-bold text-success">✓ Yes</span>, vb: <span className="font-bold text-success">✓ Yes</span> },
    { label: "Distance", va: `${a.distanceKm} km`, vb: `${b.distanceKm} km`, aHi: true },
    { label: "Overall Rating", va: <span className="text-gold">★ {a.rating}</span>, vb: <span className="text-gold">★ {b.rating}</span> },
    { label: "Review Sentiment", va: "Positive 91%", vb: "Positive 83%", aHi: true },
    { label: "Cardiology Capability", va: a.speciality, vb: b.speciality, aHi: true },
    { label: "Estimated Cost", va: <span className="font-bold text-gold">{formatRange(a.costMinINR, a.costMaxINR)}</span>, vb: <span className="font-bold text-gold">{formatRange(b.costMinINR, b.costMaxINR)}</span> },
    { label: "Confidence Score", va: a.confidence.toFixed(2), vb: b.confidence.toFixed(2), aHi: true },
    { label: "ICU Facilities", va: <span className="font-bold text-success">✓ Yes</span>, vb: <span className="font-bold text-success">✓ Yes</span> },
    { label: "Diabetes Risk Flag", va: <span className="font-medium text-warning">⚠ Flagged</span>, vb: <span className="font-medium text-warning">⚠ Flagged</span> },
  ];

  return (
    <div className="bg-muted px-4 py-10 md:px-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7">
          <h1 className="font-sans text-3xl text-primary md:text-4xl">A side-by-side look at two hospitals in {city}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tuned to your situation: 55-year-old, diabetic, with a budget around {region.symbol}3L.</p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
          <div className="grid grid-cols-[140px_1fr_1fr] gap-2 bg-primary px-5 py-4 text-primary-foreground sm:grid-cols-[200px_1fr_1fr] sm:px-6">
            <div className="text-xs font-bold uppercase text-white/40">Attribute</div>
            <div className="text-sm font-bold sm:text-[15px]">{a.name}</div>
            <div className="text-sm font-bold sm:text-[15px]">{b.name}</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`grid grid-cols-[140px_1fr_1fr] items-center gap-2 border-b border-border px-5 py-3.5 sm:grid-cols-[200px_1fr_1fr] sm:px-6 last:border-0 ${
                i % 2 === 1 ? "bg-[hsl(var(--bg-card))]" : ""
              }`}
            >
              <div className="text-[13px] font-semibold text-muted-foreground">{r.label}</div>
              <div className={`text-sm sm:px-4 ${r.aHi ? "font-bold text-accent" : "text-primary"}`}>{r.va}</div>
              <div className={`text-sm sm:px-4 ${r.bHi ? "font-bold text-accent" : "text-primary"}`}>{r.vb}</div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-accent px-8 text-accent-foreground hover:bg-accent-light">Choose {a.name.split(" ").slice(0, 2).join(" ")}</Button>
          <Button size="lg" variant="outline" className="border-2 border-accent px-8 text-accent hover:bg-accent hover:text-accent-foreground">
            Choose {b.name.split(" ").slice(0, 2).join(" ")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Compare;
