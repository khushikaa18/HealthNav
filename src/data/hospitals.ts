/**
 * Mock hospital generator. Names adapt to the current city so every
 * location returns plausible, recognizable-sounding hospitals.
 */
import type { Region } from "@/contexts/LocationContext";

export type Hospital = {
  id: string;
  name: string;
  accredited: boolean;
  speciality: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  bestMatch?: boolean;
  withinBudget?: boolean;
  flag?: string;
  costMinINR: number; // base in INR — formatRange will convert
  costMaxINR: number;
  confidence: number;
  ranking: { label: string; weight: string; score: number }[];
};

/**
 * Curated, city-specific names. Falls back to generic "${city} ..." templates
 * for any city not explicitly listed.
 */
const CITY_HOSPITALS: Record<string, string[]> = {
  // India
  Nagpur: ["Wockhardt Hospital Nagpur", "Orange City Hospital", "KRIMS Hospitals", "AIIMS Nagpur", "Alexis Multi-Speciality Hospital"],
  Mumbai: ["Kokilaben Dhirubhai Ambani Hospital", "Lilavati Hospital", "Nanavati Max Super Speciality", "Hinduja Hospital", "Jaslok Hospital"],
  Delhi: ["AIIMS New Delhi", "Max Super Speciality Saket", "Fortis Escorts Heart Institute", "Sir Ganga Ram Hospital", "Apollo Indraprastha"],
  Bengaluru: ["Manipal Hospital Old Airport Road", "Narayana Health City", "Apollo Bannerghatta", "Fortis Bannerghatta", "Sakra World Hospital"],
  Chennai: ["Apollo Hospitals Greams Road", "MIOT International", "Fortis Malar Hospital", "SIMS Hospital", "Sri Ramachandra Medical Centre"],
  Hyderabad: ["Apollo Hospitals Jubilee Hills", "KIMS Hospitals", "Yashoda Hospitals Somajiguda", "Care Hospitals Banjara Hills", "AIG Hospitals"],
  Pune: ["Ruby Hall Clinic", "Jehangir Hospital", "Deenanath Mangeshkar Hospital", "Sahyadri Super Speciality", "Aditya Birla Memorial"],
  Kolkata: ["Apollo Gleneagles Hospital", "AMRI Hospital Salt Lake", "Fortis Hospital Anandapur", "Belle Vue Clinic", "Medica Superspecialty"],

  // US
  "New York": ["NewYork-Presbyterian Hospital", "Mount Sinai Hospital", "NYU Langone Health", "Memorial Sloan Kettering", "Lenox Hill Hospital"],
  "Los Angeles": ["Cedars-Sinai Medical Center", "UCLA Ronald Reagan Medical Center", "Keck Hospital of USC", "Good Samaritan Hospital", "Children's Hospital LA"],
  Chicago: ["Northwestern Memorial Hospital", "Rush University Medical Center", "University of Chicago Medicine", "Advocate Christ Medical", "Loyola University Medical"],
  Houston: ["Houston Methodist Hospital", "Memorial Hermann-Texas Medical Center", "MD Anderson Cancer Center", "Texas Children's Hospital", "St. Luke's Health"],
  Boston: ["Massachusetts General Hospital", "Brigham and Women's Hospital", "Beth Israel Deaconess", "Boston Children's Hospital", "Tufts Medical Center"],
  Miami: ["Jackson Memorial Hospital", "Baptist Hospital of Miami", "Mount Sinai Medical Center Miami", "University of Miami Hospital", "Mercy Hospital Miami"],
  Seattle: ["UW Medical Center", "Virginia Mason Medical Center", "Swedish Medical Center", "Harborview Medical Center", "Seattle Children's Hospital"],

  // UK
  London: ["Guy's Hospital", "St Thomas' Hospital", "Royal London Hospital", "King's College Hospital", "Chelsea and Westminster"],
  Manchester: ["Manchester Royal Infirmary", "Salford Royal Hospital", "Wythenshawe Hospital", "North Manchester General", "Trafford General"],
  Birmingham: ["Queen Elizabeth Hospital Birmingham", "Heartlands Hospital", "City Hospital Birmingham", "Good Hope Hospital", "Birmingham Children's"],
  Edinburgh: ["Royal Infirmary of Edinburgh", "Western General Hospital", "Royal Hospital for Children & Young People", "St John's Hospital Livingston", "Liberton Hospital"],
  Glasgow: ["Queen Elizabeth University Hospital", "Glasgow Royal Infirmary", "Royal Alexandra Hospital", "Stobhill Hospital", "Victoria Infirmary"],
  Bristol: ["Bristol Royal Infirmary", "Southmead Hospital", "St Michael's Hospital Bristol", "Bristol Royal Hospital for Children", "Frenchay Hospital"],

  // EU
  Berlin: ["Charité – Universitätsmedizin Berlin", "Vivantes Klinikum Neukölln", "DRK Kliniken Berlin Westend", "Helios Klinikum Berlin-Buch", "Sankt Gertrauden-Krankenhaus"],
  Paris: ["Hôpital Pitié-Salpêtrière", "Hôpital Européen Georges-Pompidou", "Hôpital Necker-Enfants Malades", "Hôpital Saint-Louis", "Hôpital Cochin"],
  Madrid: ["Hospital Universitario La Paz", "Hospital Clínico San Carlos", "Hospital 12 de Octubre", "Hospital Ramón y Cajal", "Hospital La Princesa"],
  Rome: ["Policlinico Umberto I", "Ospedale Gemelli", "Ospedale San Giovanni Addolorata", "Ospedale Sant'Andrea", "Bambino Gesù Hospital"],
  Amsterdam: ["Amsterdam UMC", "OLVG Ziekenhuis", "BovenIJ Ziekenhuis", "Antoni van Leeuwenhoek", "Slotervaart Hospital"],
  Vienna: ["AKH Wien (General Hospital)", "Krankenhaus Hietzing", "Wilhelminenspital", "Rudolfstiftung Hospital", "Krankenhaus Nord"],
  Lisbon: ["Hospital de Santa Maria", "Hospital São José", "Hospital da Luz Lisboa", "CUF Descobertas Hospital", "Hospital Beatriz Ângelo"],

  // UAE
  Dubai: ["Mediclinic City Hospital", "American Hospital Dubai", "Rashid Hospital", "Dubai Hospital", "King's College Hospital London Dubai"],
  "Abu Dhabi": ["Cleveland Clinic Abu Dhabi", "Sheikh Khalifa Medical City", "Burjeel Hospital", "NMC Royal Hospital", "Mafraq Hospital"],
  Sharjah: ["Al Qassimi Hospital", "Zulekha Hospital Sharjah", "University Hospital Sharjah", "NMC Royal Hospital Sharjah", "Al Zahra Hospital Sharjah"],

  // Singapore
  Singapore: ["Singapore General Hospital", "Mount Elizabeth Hospital", "Raffles Hospital", "Tan Tock Seng Hospital", "National University Hospital"],

  // Australia
  Sydney: ["Royal Prince Alfred Hospital", "St Vincent's Hospital Sydney", "Westmead Hospital", "Prince of Wales Hospital", "Sydney Adventist Hospital"],
  Melbourne: ["Royal Melbourne Hospital", "The Alfred Hospital", "St Vincent's Hospital Melbourne", "Epworth HealthCare", "Cabrini Hospital"],
  Brisbane: ["Royal Brisbane and Women's Hospital", "Princess Alexandra Hospital", "Mater Hospital Brisbane", "Wesley Hospital", "St Andrew's War Memorial"],
  Perth: ["Sir Charles Gairdner Hospital", "Royal Perth Hospital", "Fiona Stanley Hospital", "St John of God Subiaco", "Joondalup Health Campus"],

  // Canada
  Toronto: ["Toronto General Hospital", "Mount Sinai Hospital Toronto", "St. Michael's Hospital", "Sunnybrook Health Sciences", "The Hospital for Sick Children"],
  Vancouver: ["Vancouver General Hospital", "St. Paul's Hospital", "BC Children's Hospital", "Lions Gate Hospital", "Mount Saint Joseph Hospital"],
  Montreal: ["McGill University Health Centre", "CHUM (Centre Hospitalier de l'Université de Montréal)", "Jewish General Hospital", "Sainte-Justine Hospital", "Maisonneuve-Rosemont"],
  Calgary: ["Foothills Medical Centre", "Peter Lougheed Centre", "Rockyview General Hospital", "South Health Campus", "Alberta Children's Hospital"],

  // Brazil
  "São Paulo": ["Hospital Albert Einstein", "Hospital Sírio-Libanês", "Hospital das Clínicas FMUSP", "Hospital Oswaldo Cruz", "Hospital Samaritano"],
  "Rio de Janeiro": ["Hospital Copa D'Or", "Hospital Quinta D'Or", "Hospital Samaritano Rio", "Hospital Pró-Cardíaco", "Hospital São Lucas Copacabana"],
  Brasília: ["Hospital Santa Lúcia", "Hospital Sírio-Libanês Brasília", "Hospital DF Star", "Hospital Brasília", "Hospital Anchieta"],

  // South Africa
  Johannesburg: ["Charlotte Maxeke Johannesburg Hospital", "Netcare Milpark Hospital", "Life Fourways Hospital", "Sandton Mediclinic", "Helen Joseph Hospital"],
  "Cape Town": ["Groote Schuur Hospital", "Red Cross War Memorial Children's", "Mediclinic Cape Town", "Netcare Christiaan Barnard", "Tygerberg Hospital"],
  Durban: ["Inkosi Albert Luthuli Central Hospital", "Netcare St Augustine's Hospital", "Life Westville Hospital", "Addington Hospital", "King Edward VIII Hospital"],
};

const FALLBACK_TEMPLATES = [
  (city: string) => `${city} Multispeciality Hospital`,
  (city: string) => `${city} Heart & Vascular Institute`,
  (city: string) => `${city} Medical Centre`,
  (city: string) => `St. Michael's Hospital — ${city}`,
  (city: string) => `${city} Cardiac Care Centre`,
];

function namesFor(city: string): string[] {
  const curated = CITY_HOSPITALS[city];
  if (curated && curated.length >= 4) return curated;
  return FALLBACK_TEMPLATES.map((fn) => fn(city));
}

export function generateHospitals(city: string, region: Region): Hospital[] {
  const accred = region.accreditation;
  const baseCost = 200_000; // INR baseline for angioplasty
  const names = namesFor(city);

  return [
    {
      id: "h1",
      name: names[0],
      accredited: true,
      speciality: "Cardiology Centre of Excellence",
      distanceKm: 3.2,
      rating: 4.5,
      reviews: 312,
      bestMatch: true,
      flag: "Diabetes may increase ICU costs",
      costMinINR: baseCost * 0.9,
      costMaxINR: baseCost * 1.45,
      confidence: 0.76,
      ranking: [
        { label: `Specialization`, weight: "30%", score: 90 },
        { label: accred, weight: "25%", score: 95 },
        { label: "Reviews", weight: "20%", score: 82 },
        { label: "Distance", weight: "15%", score: 75 },
        { label: "Cost", weight: "10%", score: 70 },
      ],
    },
    {
      id: "h2",
      name: names[1],
      accredited: true,
      speciality: "Cardiology",
      distanceKm: 5.1,
      rating: 4.2,
      reviews: 187,
      costMinINR: baseCost * 0.75,
      costMaxINR: baseCost * 1.25,
      confidence: 0.68,
      ranking: [],
    },
    {
      id: "h3",
      name: names[2],
      accredited: false,
      speciality: "General Medicine",
      distanceKm: 2.8,
      rating: 3.9,
      reviews: 94,
      withinBudget: true,
      costMinINR: baseCost * 0.6,
      costMaxINR: baseCost * 1.0,
      confidence: 0.61,
      ranking: [],
    },
    {
      id: "h4",
      name: names[3],
      accredited: true,
      speciality: "Cardiology",
      distanceKm: 7.4,
      rating: 4.3,
      reviews: 241,
      costMinINR: baseCost * 0.85,
      costMaxINR: baseCost * 1.3,
      confidence: 0.7,
      ranking: [],
    },
  ];
}
