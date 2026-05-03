import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Activity, Check, AlertTriangle, Mic, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";

type Msg =
  | { kind: "user"; text: string }
  | { kind: "ai"; condition: string; pathway: string; flag?: string };

const RECENT = [
  { name: "Knee replacement", sub: "2 days ago" },
  { name: "Cataract surgery", sub: "5 days ago" },
  { name: "Angioplasty", sub: "1 week ago" },
];

function aiReply(input: string, city: string): Msg {
  const lower = input.toLowerCase();
  let condition = "ICD-10 I25.10: Coronary Artery Disease";
  let pathway = "Angiography → Angioplasty";
  if (lower.includes("knee")) {
    condition = "ICD-10 M17.11: Unilateral primary osteoarthritis, right knee";
    pathway = "MRI → Total Knee Replacement";
  } else if (lower.includes("cataract") || lower.includes("eye")) {
    condition = "ICD-10 H25.9: Age-related cataract, unspecified";
    pathway = "Slit-lamp exam → Phacoemulsification";
  }
  const flag = /diab|sugar|insulin/.test(lower)
    ? "Comorbidity detected: Diabetes — increased ICU likelihood. Cost estimate adjusted upward."
    : undefined;
  return { kind: "ai", condition, pathway, flag };
}

const Chat = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { city, region, setCity } = useLocation();
  const initial = params.get("q") ?? "";
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // seed with initial query if provided
  useEffect(() => {
    if (initial && msgs.length === 0) {
      setMsgs([{ kind: "user", text: initial }, aiReply(initial, city)]);
    } else if (msgs.length === 0) {
      const seed = `chest pain when I walk, 55 years old, diabetic, ${city}, budget under 3 lakhs`;
      setMsgs([{ kind: "user", text: seed }, aiReply(seed, city)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { kind: "user", text }, aiReply(text, city)]);
    setInput("");
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-r border-white/5 bg-primary p-4 text-primary-foreground lg:flex lg:flex-col">
        <Button className="my-3 w-full bg-accent text-accent-foreground hover:bg-accent-light" onClick={() => setMsgs([])}>
          <Plus className="mr-1.5 h-4 w-4" /> New Search
        </Button>
        <p className="mt-2 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">Recent searches</p>
        <ul className="mt-2 space-y-0.5">
          {RECENT.map((r) => (
            <li key={r.name}>
              <button className="w-full rounded-md px-2.5 py-2 text-left text-sm text-white/65 transition hover:bg-white/5">
                <span className="block font-medium">{r.name}</span>
                <span className="text-[11px] text-white/30">{city} · {r.sub}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-auto border-t border-white/5 pt-3 text-[11px] leading-relaxed text-white/25">
          HealthNav is decision support only. Not medical advice. Always consult a qualified physician.
        </p>
      </aside>

      {/* Main */}
      <div className="flex min-h-0 flex-col bg-muted">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
          <p className="text-[13px] text-muted-foreground">
            Home / <span className="font-semibold text-primary">Search</span>
          </p>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-md border border-border bg-muted px-3 py-1.5 text-[13px] font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
            aria-label="Select city"
          >
            {region.cities.map((c) => <option key={c}>📍 {c}</option>)}
          </select>
        </div>

        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
          {msgs.map((m, i) =>
            m.kind === "user" ? (
              <div key={i} className="mb-5 flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm leading-relaxed text-accent-foreground sm:max-w-[60%]">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i} className="mb-5 flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-l-4 border-l-accent bg-card p-5 shadow-soft sm:max-w-[75%]">
                  <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                    <Activity className="h-3.5 w-3.5" /> HealthNav AI
                  </p>
                  <p className="mb-3 text-base font-bold text-primary">Clinical mapping complete.</p>
                  <p className="flex items-start gap-2 border-b border-border/50 py-2.5 text-[13px]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span><span className="text-muted-foreground">Condition →</span> <span className="font-semibold text-primary">{m.condition}</span></span>
                  </p>
                  <p className="flex items-start gap-2 py-2.5 text-[13px]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span><span className="text-muted-foreground">Recommended pathway →</span> <span className="font-semibold text-primary">{m.pathway}</span></span>
                  </p>
                  {m.flag && (
                    <p className="mt-3 flex items-center gap-2 rounded-md bg-warning-bg px-3 py-2.5 text-[13px] font-medium text-warning">
                      <AlertTriangle className="h-4 w-4" /> {m.flag}
                    </p>
                  )}
                  <Button
                    onClick={() => navigate("/results")}
                    className="mt-4 bg-accent text-accent-foreground hover:bg-accent-light"
                    size="sm"
                  >
                    Show me hospitals and costs →
                  </Button>
                </div>
              </div>
            )
          )}
        </div>

        <form onSubmit={send} className="flex shrink-0 items-center gap-3 border-t border-border bg-card px-4 py-3 md:px-10">
          <button type="button" aria-label="Voice input" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-accent hover:text-accent">
            <Mic className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your condition or procedure..."
            aria-label="Chat input"
            className="flex-1 rounded-xl border-2 border-border px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <button type="submit" aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground transition hover:bg-accent-light">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
