import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "healthnav:location";

export type Region = {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  /** Multiplier vs. INR base for cost display estimates */
  rate: number;
  /** Locale used for Intl.NumberFormat */
  locale: string;
  cities: string[];
  /** Local accreditation/regulatory body shown in trust bar & cards */
  accreditation: string;
};

export const REGIONS: Region[] = [
  { code: "IN", name: "India", currency: "INR", symbol: "₹", rate: 1, locale: "en-IN",
    cities: ["Nagpur", "Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata"],
    accreditation: "NABH" },
  { code: "US", name: "United States", currency: "USD", symbol: "$", rate: 0.012, locale: "en-US",
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Boston", "Miami", "Seattle"],
    accreditation: "Joint Commission" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£", rate: 0.0095, locale: "en-GB",
    cities: ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Bristol"],
    accreditation: "CQC Rated" },
  { code: "EU", name: "European Union", currency: "EUR", symbol: "€", rate: 0.011, locale: "en-IE",
    cities: ["Berlin", "Paris", "Madrid", "Rome", "Amsterdam", "Vienna", "Lisbon"],
    accreditation: "JCI / ISO 9001" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "AED", rate: 0.044, locale: "en-AE",
    cities: ["Dubai", "Abu Dhabi", "Sharjah"], accreditation: "DOH / JCI" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "S$", rate: 0.016, locale: "en-SG",
    cities: ["Singapore"], accreditation: "MOH / JCI" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "A$", rate: 0.018, locale: "en-AU",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth"], accreditation: "ACHS" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "C$", rate: 0.016, locale: "en-CA",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary"], accreditation: "Accreditation Canada" },
  { code: "BR", name: "Brazil", currency: "BRL", symbol: "R$", rate: 0.064, locale: "pt-BR",
    cities: ["São Paulo", "Rio de Janeiro", "Brasília"], accreditation: "ONA" },
  { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R", rate: 0.22, locale: "en-ZA",
    cities: ["Johannesburg", "Cape Town", "Durban"], accreditation: "COHSASA" },
];

type Ctx = {
  region: Region;
  city: string;
  setRegion: (code: string) => void;
  setCity: (city: string) => void;
  /** Convert an INR amount to current region currency, formatted */
  format: (inrAmount: number) => string;
  /** Format a range, returning e.g. "₹1.8L – ₹2.9L" or "$2,200 – $3,500" */
  formatRange: (inrMin: number, inrMax: number) => string;
};

const LocationContext = createContext<Ctx | null>(null);

function compactIN(amount: number): string {
  // Indian Lakh formatting
  if (amount >= 10_000_000) return `${(amount / 10_000_000).toFixed(amount % 10_000_000 === 0 ? 0 : 1)}Cr`;
  if (amount >= 100_000) return `${(amount / 100_000).toFixed(amount % 100_000 === 0 ? 0 : 1)}L`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return `${amount}`;
}

const readStored = (): { regionCode: string; city: string } => {
  if (typeof window === "undefined") return { regionCode: "IN", city: REGIONS[0].cities[0] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { regionCode: "IN", city: REGIONS[0].cities[0] };
    const parsed = JSON.parse(raw) as { regionCode?: string; city?: string };
    const r = REGIONS.find((x) => x.code === parsed.regionCode) ?? REGIONS[0];
    const c = parsed.city && r.cities.includes(parsed.city) ? parsed.city : r.cities[0];
    return { regionCode: r.code, city: c };
  } catch {
    return { regionCode: "IN", city: REGIONS[0].cities[0] };
  }
};

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const initial = useMemo(readStored, []);
  const [regionCode, setRegionCode] = useState<string>(initial.regionCode);
  const region = useMemo(() => REGIONS.find((r) => r.code === regionCode) ?? REGIONS[0], [regionCode]);
  const [city, setCityState] = useState<string>(initial.city);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ regionCode, city }));
    } catch {
      /* ignore quota / private mode errors */
    }
  }, [regionCode, city]);

  const setRegion = (code: string) => {
    const r = REGIONS.find((x) => x.code === code) ?? REGIONS[0];
    setRegionCode(code);
    setCityState(r.cities[0]);
  };

  const setCity = (c: string) => setCityState(c);

  const format = (inr: number) => {
    const v = inr * region.rate;
    if (region.code === "IN") return `${region.symbol}${compactIN(v)}`;
    // Compact for other currencies
    if (v >= 1_000_000) return `${region.symbol}${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${region.symbol}${(v / 1_000).toFixed(v % 1_000 === 0 ? 0 : 1)}K`;
    return new Intl.NumberFormat(region.locale, {
      style: "currency", currency: region.currency, maximumFractionDigits: 0,
    }).format(v);
  };

  const formatRange = (a: number, b: number) => `${format(a)} – ${format(b)}`;

  return (
    <LocationContext.Provider value={{ region, city, setRegion, setCity, format, formatRange }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
  return ctx;
};
