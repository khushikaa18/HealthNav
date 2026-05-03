import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, AlertTriangle, Check, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { useLocation } from "@/contexts/LocationContext";
import { generateHospitals, type Hospital } from "@/data/hospitals";

const SPECIALITIES = ["Cardiology", "Orthopedics", "Oncology", "Neurology"];
const HOSP_TYPES = ["Accredited", "Private", "Government", "Teaching Hospital"];

type Sort = "best" | "cost-asc" | "distance" | "rating";

const FilterPanel = ({
  hospType, setHospType, distance, setDistance, costMax, setCostMax, specs, setSpecs, onApply, summary,
}: any) => (
  <div className="space-y-6">
    <div className="rounded-xl bg-primary p-4 text-primary-foreground">
      <p className="text-sm font-bold">{summary.condition}</p>
      <p className="mt-1 text-xs text-white/50">{summary.details}</p>
    </div>

    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary font-sans">Hospital Type</h3>
      {HOSP_TYPES.map((t) => (
        <label key={t} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-muted-foreground">
          <Checkbox
            checked={hospType.includes(t)}
            onCheckedChange={(v) => setHospType(v ? [...hospType, t] : hospType.filter((x: string) => x !== t))}
          />
          {t}
        </label>
      ))}
    </div>

    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary font-sans">Distance</h3>
      <Slider value={[distance]} onValueChange={(v) => setDistance(v[0])} min={1} max={50} />
      <p className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
        <span>1 km</span><span>{distance} km</span>
      </p>
    </div>

    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary font-sans">Max Cost (relative)</h3>
      <Slider value={[costMax]} onValueChange={(v) => setCostMax(v[0])} min={20} max={100} />
      <p className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
        <span>Low</span><span>{costMax}%</span><span>High</span>
      </p>
    </div>

    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary font-sans">Specialization</h3>
      {SPECIALITIES.map((s) => (
        <label key={s} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-muted-foreground">
          <Checkbox
            checked={specs.includes(s)}
            onCheckedChange={(v) => setSpecs(v ? [...specs, s] : specs.filter((x: string) => x !== s))}
          />
          {s}
        </label>
      ))}
    </div>

    <Button onClick={onApply} className="w-full bg-accent text-accent-foreground hover:bg-accent-light">
      Apply Filters
    </Button>
  </div>
);

const HospitalCard = ({ h, onOpen, formatRange }: { h: Hospital; onOpen: () => void; formatRange: (a: number, b: number) => string }) => (
  <article
    onClick={onOpen}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
    tabIndex={0}
    role="button"
    aria-label={`View ${h.name}`}
    className={`mb-3.5 cursor-pointer rounded-xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated md:p-6 ${
      h.bestMatch ? "border-2 border-accent" : "border-border"
    }`}
  >
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
      <div className="flex-1">
        {h.bestMatch && (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-xl bg-success-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-success">
            <Check className="h-3 w-3" /> Best Match
          </span>
        )}
        <h3 className="font-sans text-[17px] font-bold text-primary">{h.name}</h3>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {h.accredited && (
            <span className="rounded-xl bg-info-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-info">
              Accredited
            </span>
          )}
          <span>•</span><span>{h.speciality}</span>
          <span>•</span><span>{h.distanceKm} km away</span>
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-current text-gold" />
          <span className="font-bold text-gold">{h.rating}</span>
          <span className="text-[12px] text-muted-foreground">{h.reviews} reviews</span>
        </p>
        {h.withinBudget && (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-success-bg px-2.5 py-1 text-xs font-medium text-success">
            <Check className="h-3 w-3" /> Within Budget
          </span>
        )}
      </div>

      <div className={`min-w-[170px] rounded-xl px-4 py-3.5 text-right ${h.bestMatch ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
        <p className="text-[11px] opacity-75">Estimated Cost</p>
        <p className="text-[22px] font-bold leading-tight text-gold">{formatRange(h.costMinINR, h.costMaxINR)}</p>
        <p className="mt-1 text-[11px] opacity-75">Confidence: {h.confidence.toFixed(2)}</p>
      </div>
    </div>

    {h.bestMatch && h.ranking.length > 0 && (
      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {h.ranking.map((r) => (
          <div key={r.label} className="text-center">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-accent" style={{ width: `${r.score}%` }} />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">{r.label} {r.weight}</p>
          </div>
        ))}
      </div>
    )}

    {h.flag && (
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-warning-bg px-2.5 py-1.5 text-xs font-medium text-warning">
        <AlertTriangle className="h-3.5 w-3.5" /> {h.flag}
      </p>
    )}
  </article>
);

const Results = () => {
  const navigate = useNavigate();
  const { city, region, formatRange } = useLocation();
  const [hospType, setHospType] = useState<string[]>(["Accredited", "Private"]);
  const [distance, setDistance] = useState(25);
  const [costMax, setCostMax] = useState(100);
  const [specs, setSpecs] = useState<string[]>(["Cardiology"]);
  const [sort, setSort] = useState<Sort>("best");

  const all = useMemo(() => generateHospitals(city, region), [city, region]);
  const filtered = useMemo(() => {
    let out = all.filter((h) => h.distanceKm <= distance);
    if (hospType.includes("Accredited")) out = out.filter((h) => h.accredited);
    out = out.filter((h) => h.costMaxINR <= 200_000 * (costMax / 100) * 1.6);
    if (sort === "cost-asc") out.sort((a, b) => a.costMinINR - b.costMinINR);
    if (sort === "distance") out.sort((a, b) => a.distanceKm - b.distanceKm);
    if (sort === "rating") out.sort((a, b) => b.rating - a.rating);
    if (sort === "best") out.sort((a, b) => Number(!!b.bestMatch) - Number(!!a.bestMatch));
    return out;
  }, [all, hospType, distance, costMax, sort]);

  const summary = { condition: "Coronary Artery Disease", details: `${city} · ${region.symbol}3L budget · 55M · Diabetic` };

  const filterProps = { hospType, setHospType, distance, setDistance, costMax, setCostMax, specs, setSpecs, onApply: () => {}, summary };

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[320px_1fr]">
      {/* Desktop filter */}
      <aside className="hidden overflow-y-auto border-r border-border bg-card p-6 lg:block">
        <FilterPanel {...filterProps} />
      </aside>

      <div className="bg-muted px-4 py-6 md:px-8 md:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-sans text-[17px] font-bold text-primary">
            Showing <span className="text-accent">{filtered.length} hospital{filtered.length !== 1 ? "s" : ""}</span> for Coronary Artery Disease in {city}
          </h1>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-1.5 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-4"><FilterPanel {...filterProps} /></div>
              </SheetContent>
            </Sheet>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-md border border-border bg-card px-3 py-2 text-[13px] text-primary"
              aria-label="Sort"
            >
              <option value="best">Sort: Best Match</option>
              <option value="cost-asc">Sort: Cost low → high</option>
              <option value="distance">Sort: Distance</option>
              <option value="rating">Sort: Rating</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No hospitals match. Try widening filters.
          </div>
        )}

        {filtered.map((h) => (
          <HospitalCard key={h.id} h={h} onOpen={() => navigate(`/breakdown/${h.id}`)} formatRange={formatRange} />
        ))}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-3.5 text-xs leading-relaxed text-muted-foreground">
          <p>📋 Estimates use guideline-based benchmarks. Actual costs may vary. Decision support only — not a quote.</p>
          {filtered.length >= 2 && (
            <Button asChild size="sm" variant="outline"><Link to="/compare">Compare top 2 →</Link></Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
