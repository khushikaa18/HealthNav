import { Link, NavLink, useLocation as useRouterLocation } from "react-router-dom";
import { Activity, Menu, X, MapPin, Globe } from "lucide-react";
import { useState } from "react";
import { useLocation, REGIONS } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

const links = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/chat", label: "For Patients" },
  { to: "/lenders", label: "For Lenders" },
  { to: "/responsible-ai", label: "Responsible AI" },
];

export const Logo = ({ inverted = true }: { inverted?: boolean }) => (
  <Link to="/" className="flex items-center gap-2.5" aria-label="HealthNav home">
    <div className="grid h-9 w-9 place-items-center rounded-[9px] bg-accent">
      <Activity className="h-5 w-5 text-accent-foreground" strokeWidth={2.5} />
    </div>
    <span className={`text-lg font-bold tracking-tight ${inverted ? "text-primary-foreground" : "text-primary"}`}>
      HealthNav
    </span>
  </Link>
);

const RegionPicker = ({ compact = false }: { compact?: boolean }) => {
  const { region, setRegion, city, setCity } = useLocation();
  return (
    <div className={`flex ${compact ? "flex-col gap-2" : "items-center gap-2"}`}>
      <Select value={region.code} onValueChange={setRegion}>
        <SelectTrigger className="h-9 min-w-[140px] border-white/15 bg-white/5 text-white hover:bg-white/10 focus:ring-accent/40">
          <Globe className="mr-1 h-3.5 w-3.5 opacity-70" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map((r) => (
            <SelectItem key={r.code} value={r.code}>{r.name} · {r.symbol}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger className="h-9 min-w-[140px] border-white/15 bg-white/5 text-white hover:bg-white/10 focus:ring-accent/40">
          <MapPin className="mr-1 h-3.5 w-3.5 opacity-70" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {region.cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
};

export const TopNav = () => {
  const [open, setOpen] = useState(false);
  const router = useRouterLocation();
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90">
      <div className="mx-auto flex h-15 max-w-[1400px] items-center justify-between px-4 py-3 md:px-10" style={{ height: 64 }}>
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-accent-light" : "text-white/65 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <RegionPicker />
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent-light">
            <Link to="/chat">Try it free</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent-light">
            <Link to="/chat">Try free</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="grid h-10 w-10 place-items-center rounded-md text-white hover:bg-white/10"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-primary text-primary-foreground">
              <SheetHeader>
                <SheetTitle className="text-left text-primary-foreground">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <RegionPicker compact />
                <div className="my-2 h-px bg-white/10" />
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2 text-base font-medium ${
                        isActive ? "bg-white/10 text-accent-light" : "text-white/80 hover:bg-white/5"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <p className="mt-4 text-xs text-white/40">Decision support only — not medical advice.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <p className="hidden border-t border-white/5 px-10 py-1.5 text-[11px] text-white/35 lg:block">
        Decision support only — not medical advice. Current path: {router.pathname}
      </p>
    </header>
  );
};

export const Footer = () => (
  <footer className="border-t border-border bg-primary py-8 text-primary-foreground">
    <div className="mx-auto max-w-[1400px] px-6 md:flex md:items-center md:justify-between md:px-10">
      <Logo />
      <p className="mt-4 text-xs text-white/45 md:mt-0">
        © {new Date().getFullYear()} HealthNav. Decision support only — not medical advice.
      </p>
    </div>
  </footer>
);
