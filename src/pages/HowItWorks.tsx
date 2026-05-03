import { Activity, Check, AlertTriangle } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";

const STEPS = [
  { n: 1, title: "Tell us, your way", desc: "Type or speak what's bothering you, where you live, and what you can spend — no medical words needed." },
  { n: 2, title: "We pick out the details", desc: "Behind the scenes we figure out your condition, age, any other health issues, location and budget from what you wrote." },
  { n: 3, title: "Match to a real condition", desc: "Your description is matched to recognised medical codes so the rest of the answer is grounded in proper guidelines." },
  { n: 4, title: "Shortlist nearby hospitals", desc: "We pick a handful of nearby hospitals and explain in plain terms why each one made the list." },
  { n: 5, title: "Show what it usually costs", desc: "You see a likely price range broken down by part of the bill, adjusted for your city, with anything risky called out." },
];

const HowItWorks = () => {
  const { city } = useLocation();
  return (
    <section className="bg-background px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">How it works</p>
        <h1 className="mt-3 text-[clamp(1.875rem,4vw,2.625rem)] leading-tight text-primary">
          From a worried question to a clear answer.
        </h1>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-2">
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute left-[55%] top-5 hidden h-0.5 w-full lg:block"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, hsl(var(--accent)) 0 6px, transparent 6px 14px)",
                  }}
                />
              )}
              <div className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground shadow-[0_0_0_6px_hsl(var(--accent)/0.1)]">
                {s.n}
              </div>
              <h3 className="mt-4 font-sans text-sm font-bold text-primary">{s.title}</h3>
              <p className="mt-1.5 px-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>

        {/* Example chat */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-muted p-6 sm:p-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            What a real chat looks like
          </p>
          <div className="ml-auto mb-4 max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm text-accent-foreground">
            My chest hurts when I walk uphill. I'm 55, diabetic, in {city}, and can spend up to about 3 lakhs.
          </div>
          <div className="rounded-2xl rounded-bl-sm border border-l-4 border-l-accent bg-card p-5">
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-accent">
              <Activity className="h-3.5 w-3.5" /> HealthNav AI
            </p>
            {[
              ["Most likely:", "Coronary artery disease (a narrowed heart artery)"],
              ["Usual next steps:", "An angiogram first, then possibly an angioplasty"],
            ].map(([l, v]) => (
              <p key={l as string} className="flex items-start gap-2 border-b border-border py-2 text-[13px] text-primary last:border-0">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span><span className="text-muted-foreground">{l}</span> <span className="font-semibold">{v}</span></span>
              </p>
            ))}
            <p className="mt-3 flex items-center gap-2 rounded-md bg-warning-bg px-3 py-2.5 text-[13px] font-medium text-warning">
              <AlertTriangle className="h-4 w-4" />
              Heads up: diabetes can mean a higher chance of needing the ICU. Here are the top 3 places near {city}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
