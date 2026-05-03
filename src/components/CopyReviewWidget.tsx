import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, X, Wand2, Check, ClipboardCopy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { reviewText, applyReplacement, CATEGORY_STYLES, type Suggestion } from "@/lib/copyReview";

const SAMPLE = `In today's fast-paced world, our cutting-edge platform leverages AI to seamlessly empower patients to navigate the complexities of healthcare. We utilize a wide range of world-class hospitals to deliver a truly bespoke, end-to-end experience.`;

function HighlightedText({ text, suggestions, activeIndex, onPick }: {
  text: string;
  suggestions: Suggestion[];
  activeIndex: number | null;
  onPick: (i: number) => void;
}) {
  if (suggestions.length === 0) {
    return <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">{text}</p>;
  }
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  suggestions.forEach((s, i) => {
    if (s.start > cursor) parts.push(<span key={`t-${i}`}>{text.slice(cursor, s.start)}</span>);
    parts.push(
      <button
        key={`m-${i}`}
        onClick={() => onPick(i)}
        className={`inline rounded px-1 py-0.5 border text-xs font-medium align-baseline transition ${CATEGORY_STYLES[s.category]} ${
          activeIndex === i ? "ring-2 ring-accent ring-offset-1" : "hover:opacity-80"
        }`}
        title={s.reason}
        type="button"
      >
        {text.slice(s.start, s.end)}
      </button>
    );
    cursor = s.end;
  });
  if (cursor < text.length) parts.push(<span key="tail">{text.slice(cursor)}</span>);
  return <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">{parts}</p>;
}

export const CopyReviewWidget = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [active, setActive] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const suggestions = useMemo(() => reviewText(text), [text]);

  useEffect(() => {
    if (open && !text) setText(SAMPLE);
  }, [open, text]);

  useEffect(() => {
    if (active !== null && active >= suggestions.length) setActive(null);
  }, [suggestions, active]);

  const replace = (i: number, alt: string) => {
    const s = suggestions[i];
    if (!s) return;
    setHistory((h) => [...h, text]);
    setText(applyReplacement(text, s, alt));
    setActive(null);
  };

  const undo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setText(prev);
      return h.slice(0, -1);
    });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Cleaned-up copy is on your clipboard." });
  };

  const counts = suggestions.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Review copy for clichés"
        className="fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <Sparkles className="h-4 w-4 text-accent-light" />
        <span className="hidden sm:inline">Review copy</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-accent" /> Originality review
            </DialogTitle>
            <DialogDescription>
              Paste your copy. We'll flag tired phrases and AI-sounding language, then suggest plainer swaps.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <textarea
              ref={taRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Paste a paragraph here…"
              className="w-full rounded-lg border-2 border-border bg-background p-3 text-sm leading-relaxed text-primary focus:border-accent focus:outline-none"
              aria-label="Text to review"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-normal">
                {suggestions.length} {suggestions.length === 1 ? "issue" : "issues"}
              </Badge>
              {Object.entries(counts).map(([k, v]) => (
                <span key={k} className={`rounded border px-2 py-0.5 text-[11px] font-medium ${CATEGORY_STYLES[k as Suggestion["category"]]}`}>
                  {k} · {v}
                </span>
              ))}
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline" onClick={undo} disabled={history.length === 0}>
                  <RotateCcw className="mr-1 h-3.5 w-3.5" /> Undo
                </Button>
                <Button size="sm" variant="outline" onClick={copy} disabled={!text}>
                  <ClipboardCopy className="mr-1 h-3.5 w-3.5" /> Copy
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-4">
              {suggestions.length === 0 ? (
                <p className="flex items-center gap-2 text-sm text-success">
                  <Check className="h-4 w-4" /> Looks clean — no tired phrases detected.
                </p>
              ) : (
                <HighlightedText
                  text={text}
                  suggestions={suggestions}
                  activeIndex={active}
                  onPick={setActive}
                />
              )}
            </div>

            {active !== null && suggestions[active] && (
              <div className="rounded-lg border-l-4 border-l-accent bg-card p-4 shadow-soft">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {suggestions[active].category}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-primary">
                      "{suggestions[active].match}"
                    </p>
                    <p className="text-xs text-muted-foreground">{suggestions[active].reason}</p>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    aria-label="Dismiss"
                    className="rounded p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions[active].alternatives.map((alt, j) => (
                    <button
                      key={j}
                      onClick={() => replace(active, alt)}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-primary transition hover:border-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      {alt === "" ? "Remove phrase" : `Use "${alt}"`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CopyReviewWidget;
