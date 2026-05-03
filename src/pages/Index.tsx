import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { generateHospitals } from "@/data/hospitals";

const PILLS = ["By Procedure", "By Location", "By Budget"];

const Index = () => {
  const navigate = useNavigate();
  const { region, city, formatRange } = useLocation();
  const [q, setQ] = useState("");
  const featured = useMemo(() => generateHospitals(city, region)[0], [city, region]);

  const placeholder =
    region.code === "IN"
      ? `e.g. knee replacement in ${city}, chest pain 55 years diabetic`
      : `e.g. knee replacement in ${city}, chest pain 55 years old`;

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate(`/chat${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/12 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-accent-light">
              <Sparkles className="h-3 w-3" /> A friendlier way to plan care · works worldwide
            </span>

            <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-primary-foreground">
              Pick a hospital with
              <br />
              <span className="text-accent-light">your eyes wide open.</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
              Tell us what's going on in your own words. We'll line up nearby hospitals,
              show what treatment usually costs there, and explain how sure we are about each number.
              Currently helping people in {region.name}.
            </p>

            <form
              onSubmit={submit}
              className="mt-8 flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 p-1.5 pl-4 transition focus-within:border-accent focus-within:bg-white/10"
            >
              <Search className="h-4 w-4 shrink-0 text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Describe your condition"
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-white placeholder:text-white/35 focus:outline-none"
              />
              <Button type="submit" className="bg-accent px-5 text-accent-foreground hover:bg-accent-light">
                Show me options →
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {PILLS.map((p) => (
                <button
                  key={p}
                  onClick={submit}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/60 transition hover:border-accent hover:text-accent-light"
                >
                  {p}
                </button>
              ))}
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {[
                ["800M+", "people without easy access to clear care info"],
                [`${formatRange(500_000, 3_000_000)}`, "how much the same procedure can vary"],
                ["16–18%", "yearly rise in demand in smaller cities"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="block text-[22px] font-bold leading-tight text-gold">{v}</dt>
                  <dd className="mt-0.5 text-[11px] text-white/40">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Floating result card */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <article className="relative w-full max-w-sm rounded-2xl bg-card p-6 text-card-foreground shadow-dramatic [transform:rotate(2deg)]">
              <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br from-accent/15 to-accent/5" />
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-success-bg px-2.5 py-1 text-[11px] font-semibold text-success">
                <ShieldCheck className="h-3 w-3" /> Best Match
              </span>
              <h3 className="mt-2.5 font-sans text-[17px] font-bold text-primary">
                {featured.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {region.accreditation} · {featured.speciality} · {featured.distanceKm} km
              </p>
              <div className="mt-3.5 rounded-md bg-accent p-3.5 text-accent-foreground">
                <p className="text-[11px] opacity-80">Estimated Cost Range</p>
                <p className="text-[26px] font-bold leading-none text-gold">
                  {formatRange(180_000, 290_000)}
                </p>
                <p className="mt-0.5 text-[11px] opacity-75">Confidence Score: 0.76</p>
              </div>
              <p className="mt-3 flex items-center gap-1.5 rounded-md bg-warning-bg px-3 py-2 text-xs font-medium text-warning">
                <AlertTriangle className="h-3.5 w-3.5" /> Diabetes may increase ICU costs
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-white/5 bg-primary-light">
        <ul className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-8 gap-y-2 px-6 py-3.5 text-[11px] font-medium text-white/35 md:px-10">
          <li>Data from {region.code === "IN" ? "NHA" : "WHO & local registries"}</li>
          <li className="h-3.5 w-px bg-white/10" aria-hidden />
          <li>{region.accreditation}</li>
          <li className="h-3.5 w-px bg-white/10" aria-hidden />
          <li>ICD-10 / SNOMED CT</li>
          <li className="h-3.5 w-px bg-white/10" aria-hidden />
          <li>Privacy-first · DPDP / GDPR / HIPAA aligned</li>
          <li className="h-3.5 w-px bg-white/10" aria-hidden />
          <li>WHO clinical guidelines</li>
        </ul>
      </div>

      {/* Quick CTA */}
      <section className="bg-background px-6 py-16 text-center md:px-10 md:py-20">
        <h2 className="text-3xl text-primary md:text-4xl">Less guessing. More peace of mind.</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Ask one honest question — we'll do the homework. Or take a quick tour of how the rankings work.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent-light">
            <Link to="/chat">Ask a question</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/how-it-works">Take the tour</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
