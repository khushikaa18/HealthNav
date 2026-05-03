// Lightweight in-app "originality" reviewer.
// Flags overused / clichéd / AI-sounding phrases and proposes simpler alternatives.
// Pure client-side, no network calls.

export type Suggestion = {
  start: number;
  end: number;
  match: string;
  category: "cliché" | "jargon" | "filler" | "ai-tell" | "wordy";
  reason: string;
  alternatives: string[];
};

type Rule = {
  pattern: RegExp;
  category: Suggestion["category"];
  reason: string;
  alternatives: string[];
};

// Case-insensitive, word-bounded patterns. Keep the list tight & high-signal.
const RULES: Rule[] = [
  // AI tells / marketing fluff
  { pattern: /\bin today's (fast-paced|ever-changing|digital) world\b/gi, category: "ai-tell", reason: "Generic AI opener.", alternatives: ["Today,", "Right now,"] },
  { pattern: /\bunlock(?:ing)? (the )?(full )?potential\b/gi, category: "cliché", reason: "Marketing cliché.", alternatives: ["get more from", "make the most of"] },
  { pattern: /\bgame[- ]chang(?:er|ing)\b/gi, category: "cliché", reason: "Overused.", alternatives: ["a real shift", "a big change", "different"] },
  { pattern: /\bcutting[- ]edge\b/gi, category: "cliché", reason: "Overused.", alternatives: ["new", "modern", "current"] },
  { pattern: /\bstate[- ]of[- ]the[- ]art\b/gi, category: "cliché", reason: "Overused.", alternatives: ["modern", "current", "advanced"] },
  { pattern: /\bworld[- ]class\b/gi, category: "cliché", reason: "Vague brag.", alternatives: ["excellent", "top", "trusted"] },
  { pattern: /\bbest[- ]in[- ]class\b/gi, category: "cliché", reason: "Vague brag.", alternatives: ["leading", "strong", "top-rated"] },
  { pattern: /\bseamless(?:ly)?\b/gi, category: "ai-tell", reason: "AI buzzword.", alternatives: ["smooth", "easy", "simple"] },
  { pattern: /\beffortless(?:ly)?\b/gi, category: "ai-tell", reason: "AI buzzword.", alternatives: ["easy", "simple"] },
  { pattern: /\bempower(?:s|ing|ed)?\b/gi, category: "ai-tell", reason: "Corporate filler.", alternatives: ["help", "let", "give you"] },
  { pattern: /\bleverag(?:e|ing|ed)\b/gi, category: "jargon", reason: "Use a plain verb.", alternatives: ["use", "apply"] },
  { pattern: /\butiliz(?:e|ing|ed|ation)\b/gi, category: "wordy", reason: "Use 'use'.", alternatives: ["use"] },
  { pattern: /\bsynerg(?:y|ies|ize)\b/gi, category: "jargon", reason: "Buzzword.", alternatives: ["work together", "fit"] },
  { pattern: /\brevolutioniz(?:e|ing|ed)\b/gi, category: "cliché", reason: "Overstated.", alternatives: ["change", "improve"] },
  { pattern: /\bnext[- ]generation\b/gi, category: "cliché", reason: "Marketing-speak.", alternatives: ["new", "newer"] },
  { pattern: /\bend[- ]to[- ]end\b/gi, category: "jargon", reason: "Vague.", alternatives: ["complete", "from start to finish"] },
  { pattern: /\bone[- ]stop[- ]shop\b/gi, category: "cliché", reason: "Tired phrase.", alternatives: ["one place for", "single home for"] },
  { pattern: /\bat the end of the day\b/gi, category: "filler", reason: "Filler.", alternatives: ["ultimately", "in short", ""] },
  { pattern: /\bneedless to say\b/gi, category: "filler", reason: "If needless, drop it.", alternatives: [""] },
  { pattern: /\bit('?s| is) important to note that\b/gi, category: "filler", reason: "Drop the throat-clearing.", alternatives: ["Note:", ""] },
  { pattern: /\bin order to\b/gi, category: "wordy", reason: "Use 'to'.", alternatives: ["to"] },
  { pattern: /\bdue to the fact that\b/gi, category: "wordy", reason: "Use 'because'.", alternatives: ["because"] },
  { pattern: /\ba wide range of\b/gi, category: "wordy", reason: "Be specific or shorten.", alternatives: ["many", "various"] },
  { pattern: /\bplethora of\b/gi, category: "wordy", reason: "Use a plain word.", alternatives: ["many", "lots of"] },
  { pattern: /\bmyriad of\b/gi, category: "wordy", reason: "Use 'many'.", alternatives: ["many", "countless"] },
  { pattern: /\bdelve into\b/gi, category: "ai-tell", reason: "Classic AI tell.", alternatives: ["look at", "explore", "dig into"] },
  { pattern: /\btapestry\b/gi, category: "ai-tell", reason: "Classic AI tell.", alternatives: ["mix", "range"] },
  { pattern: /\bnavigat(?:e|ing) the (complexities|landscape) of\b/gi, category: "ai-tell", reason: "AI cliché.", alternatives: ["working through", "dealing with"] },
  { pattern: /\bin the realm of\b/gi, category: "ai-tell", reason: "AI tell.", alternatives: ["in", "for"] },
  { pattern: /\bfoster(?:s|ing|ed)?\b/gi, category: "ai-tell", reason: "Common AI verb.", alternatives: ["build", "support", "grow"] },
  { pattern: /\bharness(?:es|ing|ed)?\b/gi, category: "ai-tell", reason: "Common AI verb.", alternatives: ["use", "tap"] },
  { pattern: /\brobust\b/gi, category: "jargon", reason: "Vague.", alternatives: ["strong", "reliable", "solid"] },
  { pattern: /\bholistic\b/gi, category: "jargon", reason: "Vague.", alternatives: ["complete", "whole-picture"] },
  { pattern: /\bparadigm shift\b/gi, category: "cliché", reason: "Overused.", alternatives: ["a real change", "a new approach"] },
  { pattern: /\bmoving forward\b/gi, category: "filler", reason: "Filler.", alternatives: ["next", "from now on", ""] },
  { pattern: /\bgoing forward\b/gi, category: "filler", reason: "Filler.", alternatives: ["next", "from now on", ""] },
  { pattern: /\bthink outside the box\b/gi, category: "cliché", reason: "Cliché.", alternatives: ["try a fresh angle", "rethink it"] },
  { pattern: /\blow[- ]hanging fruit\b/gi, category: "cliché", reason: "Cliché.", alternatives: ["easy wins", "quick wins"] },
  { pattern: /\bcircle back\b/gi, category: "jargon", reason: "Office-speak.", alternatives: ["follow up", "come back to this"] },
  { pattern: /\btouch base\b/gi, category: "jargon", reason: "Office-speak.", alternatives: ["check in", "talk"] },
  { pattern: /\bdeep dive\b/gi, category: "jargon", reason: "Office-speak.", alternatives: ["close look", "detailed look"] },
  { pattern: /\bsingle source of truth\b/gi, category: "jargon", reason: "Jargon.", alternatives: ["one place to check", "the canonical record"] },
  { pattern: /\bbespoke\b/gi, category: "jargon", reason: "Often overused.", alternatives: ["custom", "tailored"] },
  { pattern: /\bcurated\b/gi, category: "ai-tell", reason: "Overused.", alternatives: ["chosen", "picked", "selected"] },
  { pattern: /\bvery unique\b/gi, category: "wordy", reason: "Unique can't be modified.", alternatives: ["unique", "rare"] },
  { pattern: /\babsolutely essential\b/gi, category: "wordy", reason: "Essential is enough.", alternatives: ["essential"] },
  { pattern: /\bcompletely eliminate\b/gi, category: "wordy", reason: "Eliminate is enough.", alternatives: ["eliminate", "remove"] },
];

export function reviewText(text: string): Suggestion[] {
  const found: Suggestion[] = [];
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.pattern.exec(text)) !== null) {
      found.push({
        start: m.index,
        end: m.index + m[0].length,
        match: m[0],
        category: rule.category,
        reason: rule.reason,
        alternatives: rule.alternatives,
      });
      if (m[0].length === 0) rule.pattern.lastIndex++;
    }
  }
  // Sort by position; drop overlaps (keep first).
  found.sort((a, b) => a.start - b.start);
  const out: Suggestion[] = [];
  let cursor = -1;
  for (const s of found) {
    if (s.start >= cursor) {
      out.push(s);
      cursor = s.end;
    }
  }
  return out;
}

export function applyReplacement(text: string, s: Suggestion, replacement: string): string {
  // Preserve leading capitalization of the match.
  const original = text.slice(s.start, s.end);
  let repl = replacement;
  if (repl && original[0] && original[0] === original[0].toUpperCase()) {
    repl = repl[0].toUpperCase() + repl.slice(1);
  }
  let next = text.slice(0, s.start) + repl + text.slice(s.end);
  // Tidy up double spaces / space-before-punct from empty replacements.
  next = next.replace(/[ \t]{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1");
  return next;
}

export const CATEGORY_STYLES: Record<Suggestion["category"], string> = {
  "cliché": "bg-warning-bg text-warning border-warning/30",
  "ai-tell": "bg-accent/10 text-accent border-accent/30",
  "jargon": "bg-muted text-primary border-border",
  "filler": "bg-secondary text-secondary-foreground border-border",
  "wordy": "bg-destructive/10 text-destructive border-destructive/30",
};
