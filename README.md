# HealthNav — Hospital Cost & Care Navigator

**HealthNav** is an open, privacy-first web application that helps patients understand what a medical procedure is likely to cost at nearby hospitals — before they walk through the door. Users describe their condition in plain language; the app maps it to clinical codes, surfaces relevant hospitals, and shows a transparent cost estimate with a confidence score and risk flags.

> **Decision support only — not medical advice.** Always consult a qualified physician before making any treatment decisions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [Pages & Routing](#pages--routing)
- [Key Components](#key-components)
- [Data & Regions](#data--regions)
- [Responsible AI Principles](#responsible-ai-principles)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Millions of people lack clear, accessible information about healthcare costs. HealthNav addresses this by:

- Letting users describe symptoms or procedures in everyday language (no medical jargon required)
- Mapping their description to standard ICD-10 / SNOMED CT codes
- Shortlisting accredited hospitals in their city with transparent cost ranges
- Displaying a **confidence score** for every estimate and surfacing risk flags (e.g. comorbidities that may increase cost)
- Supporting **10 regions** across India, the US, UK, EU, UAE, Singapore, Australia, Canada, Brazil, and South Africa — with local currency, accreditation labels, and city-level data

The interface is fully responsive, keyboard-navigable, and built with accessibility as a first-class concern.

---

## Features

| Feature | Description |
|---|---|
| **Natural language intake** | Describe chest pain, budget, age and location in a single sentence |
| **AI clinical mapping** | Input is mapped to ICD-10 codes with a recommended diagnostic / treatment pathway |
| **Comorbidity detection** | Keywords like "diabetic" trigger adjusted cost estimates and ICU risk warnings |
| **Hospital results** | Filterable, sortable list of nearby hospitals with cost range, rating, and match score |
| **Cost breakdown** | Per-component cost view (procedure, stay, medication, contingency) for any hospital |
| **Confidence scoring** | Every estimate carries a 0–1 confidence score derived from regional benchmark data |
| **Side-by-side compare** | Compare two hospitals across cost, rating, and speciality fit |
| **Region & city switcher** | Instantly switch between 10 countries and 40+ cities; all numbers re-denominate |
| **Responsible AI page** | Transparent principles page covering diagnosis disclaimers, data sourcing, and compliance |
| **Copy review widget** | Built-in tool that flags AI-sounding or clichéd language in any text |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vitejs.dev/) with SWC compiler |
| Routing | [React Router v6](https://reactrouter.com/) |
| UI primitives | [Radix UI](https://www.radix-ui.com/) (accessible, unstyled) |
| Component library | [shadcn/ui](https://ui.shadcn.com/) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) |
| Charts | [Recharts](https://recharts.org/) |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |

---

## Project Structure

```
healthnav/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives (accordion, button, card, …)
│   │   ├── CopyReviewWidget.tsx # In-app text originality checker
│   │   ├── Layout.tsx           # TopNav, Footer, Logo, RegionPicker
│   │   └── NavLink.tsx          # Styled NavLink wrapper
│   ├── contexts/
│   │   └── LocationContext.tsx  # Region / city state + currency formatting
│   ├── data/
│   │   └── hospitals.ts         # City-aware mock hospital generator
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── copyReview.ts        # Cliché / AI-tell detection rules engine
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx            # Landing / hero page
│   │   ├── Chat.tsx             # Conversational intake UI
│   │   ├── Results.tsx          # Filtered hospital listing
│   │   ├── Breakdown.tsx        # Per-hospital cost breakdown
│   │   ├── Compare.tsx          # Side-by-side hospital comparison
│   │   ├── HowItWorks.tsx       # Step-by-step explainer
│   │   ├── Lenders.tsx          # Lender / insurer-facing view
│   │   ├── ResponsibleAI.tsx    # AI ethics & data sourcing page
│   │   └── NotFound.tsx         # 404 fallback
│   ├── test/
│   │   ├── example.test.ts
│   │   └── setup.ts
│   ├── App.tsx                  # Route definitions
│   ├── App.css
│   ├── index.css                # Tailwind base + CSS custom properties
│   └── main.tsx                 # React entry point
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.app.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18 (LTS recommended)
- **npm** >= 9 — or **bun** (a `bun.lockb` is included)

### Installation

```bash
# Clone the repository
git clone https://github.com/khushikaa18/HealthNav.git
cd healthnav

# Install dependencies
npm install
# or
bun install
```

### Running Locally

```bash
npm run dev
```

The dev server starts at **http://localhost:8080** with hot-module replacement enabled.

### Building for Production

```bash
npm run build
```

Output lands in `dist/`. Preview the production build locally with:

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Pages & Routing

| Path | Page | Description |
|---|---|---|
| `/` | `Index` | Hero section with natural-language search bar and headline stats |
| `/chat` | `Chat` | Conversational intake — type symptoms, receive ICD-10 mapping |
| `/results` | `Results` | Filterable hospital list (type, distance, cost, speciality) |
| `/breakdown/:id` | `Breakdown` | Itemised cost breakdown for a specific hospital |
| `/compare` | `Compare` | Side-by-side comparison of two hospitals |
| `/how-it-works` | `HowItWorks` | Five-step visual explainer with an example chat |
| `/lenders` | `Lenders` | Partner-facing view for insurers and health lenders |
| `/responsible-ai` | `ResponsibleAI` | Ethical principles, data sources, and compliance information |
| `*` | `NotFound` | 404 fallback |

---

## Key Components

### `LocationContext`

Provides a React context that holds the current **region** (country) and **city**. It exposes:

- `region` — full `Region` object (code, name, currency, symbol, exchange rate, locale, cities, accreditation body)
- `city` — selected city string
- `setRegion(code)` / `setCity(city)` — state setters persisted to `localStorage`
- `format(inrAmount)` — converts an INR base amount to the current region's currency
- `formatRange(inrMin, inrMax)` — returns a human-readable cost range string (e.g. `₹1.8L – ₹2.9L` or `$2,200 – $3,500`)

### `hospitals.ts`

A deterministic mock generator. `generateHospitals(city, region)` returns an array of `Hospital` objects with plausible names, distances, ratings, cost ranges, confidence scores, and ranking breakdowns. Hospital names are drawn from a curated `CITY_HOSPITALS` lookup keyed by city name, with generic fallbacks for unlisted cities.

### `copyReview.ts`

A pure client-side text-analysis module. `analyzeText(text)` runs regex-based rules over the input and returns `Suggestion[]` objects, each with:

- character `start` / `end` offsets
- `category` — one of `ai-tell`, `cliché`, `jargon`, `filler`, `wordy`
- `reason` and `alternatives[]`

This powers the `CopyReviewWidget` component, which lets users paste any text and receive inline improvement suggestions.

---

## Data & Regions

All cost data is expressed internally in **Indian Rupees (INR)** and converted at display time using per-region exchange-rate multipliers stored in `LocationContext`. This keeps the data layer simple while supporting multi-currency display.

Supported regions:

| Code | Country | Currency | Accreditation body |
|---|---|---|---|
| `IN` | India | ₹ INR | NABH |
| `US` | United States | $ USD | Joint Commission |
| `GB` | United Kingdom | £ GBP | CQC |
| `EU` | European Union | € EUR | JCI / ISO 9001 |
| `AE` | United Arab Emirates | AED | DOH / JCI |
| `SG` | Singapore | S$ SGD | MOH / JCI |
| `AU` | Australia | A$ AUD | ACHS |
| `CA` | Canada | C$ CAD | Accreditation Canada |
| `BR` | Brazil | R$ BRL | ONA |
| `ZA` | South Africa | R ZAR | COHSASA |

Clinical data references: WHO ICD-10, SNOMED CT, NHA benchmark data (India), local Standard Treatment Guidelines, and WHO clinical guidelines.

---

## Responsible AI Principles

HealthNav is built around six commitments, visible on the `/responsible-ai` page:

1. **We help, we don't diagnose** — every screen carries a clear "decision support only" disclaimer
2. **Honest about uncertainty** — confidence scores accompany every cost estimate
3. **Risks shown up front** — comorbidity flags appear next to numbers, not in footnotes
4. **Safety first** — descriptions suggestive of cardiac or stroke emergencies redirect to emergency services
5. **We keep our receipts** — responses are logged with the model version that produced them; low-confidence answers are flagged for human review
6. **Built within the rules** — designed around WHO ethics, India's ICMR and DPDP Act, US HIPAA, EU GDPR, and the IndiaAI Mission 2024 principles

---

## Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch
```

Tests live in `src/test/` and use **Vitest** with **jsdom** and **Testing Library**.

---

## Contributing

Contributions are welcome. Please:

1. Fork the repository and create a feature branch (`git checkout -b feat/your-feature`)
2. Keep commits focused and write clear commit messages
3. Ensure `npm run lint` and `npm test` pass before opening a PR
4. Open a pull request against `main` with a short description of what changed and why

For larger changes, open an issue first to discuss the approach.

