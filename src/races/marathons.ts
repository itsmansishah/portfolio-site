// Race data for <MarathonReceipts />. Edit freely.
//
// Stats: duration ("HH:MM:SS"), avgPace ("MM'SS''" per km), avgHr, elevation (m gain),
//   calories. Anything left null prints as "—".
// Upcoming races: targetTime, targetPace and startTime (ISO, drives the countdown).
// Receipt lines: every receipt prints bib, corral/wave, shoes, start weather and
//   spectators, then anything in `extras` as [label, value] pairs for race-specific lines,
//   and always ends with toenails lost.
// route: course line from routes.ts as [lat, lng] points, start to finish.

import { ROUTES } from "./routes";

export type Point = [number, number];

export type Race = {
  id: string;
  status: "completed" | "upcoming";
  type: "full" | "half";
  name: string;
  short: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // ISO, drives the countdown on upcoming races
  distanceKm: number;
  duration?: string | null;
  avgPace?: string | null;
  avgHr?: number | null;
  elevation?: number | null;
  calories?: number | null;
  targetTime?: string | null;
  targetPace?: string | null;
  bib?: string | null;
  corral?: string | null;
  shoes?: string | null;
  startWeather?: string | null;
  spectators?: string | null;
  toenailsLost?: number | null;
  extras?: [string, string | number][];
  quote: string;
  route: Point[];
};

export type LedgerTotals = {
  marathonPr?: string;
  halfPr?: string;
  retiredShoes?: number;
};

// Projects lat/lng to flat x/y (y grows downward) so the course keeps its real shape.
const course = (latlng: Point[]): Point[] => {
  const lat0 = (latlng[0][0] * Math.PI) / 180;
  return latlng.map(([lat, lng]): Point => [lng * Math.cos(lat0) * 1000, -lat * 1000]);
};

export const MARATHONS: Race[] = [
  {
    id: "portland-marathon-2023",
    status: "completed",
    type: "full",
    name: "PORTLAND MARATHON",
    short: "PORTLAND",
    location: "PORTLAND, OR",
    date: "2023-10-01",
    distanceKm: 42.195,
    duration: null,
    avgPace: null,
    avgHr: null,
    elevation: null,
    calories: null,
    bib: "6739",
    corral: "WAVE 0",
    shoes: "NIKE VAPORFLY NEXT% 2",
    startWeather: "45°F / 100%",
    spectators: null,
    toenailsLost: 2,
    extras: [],
    quote: "26.2 miles through the Rose City.",
    route: course(ROUTES["portland-marathon-2023"]),
  },
  {
    id: "london-marathon-2024",
    status: "completed",
    type: "full",
    name: "LONDON MARATHON",
    short: "LONDON",
    location: "LONDON, UK",
    date: "2024-04-21",
    distanceKm: 42.195,
    duration: null,
    avgPace: null,
    avgHr: null,
    elevation: null,
    calories: null,
    bib: "10922",
    corral: "WAVE 4, CORRAL 6",
    shoes: "NIKE VAPORFLY NEXT% 2",
    startWeather: "47°F / 55%",
    spectators: "~750,000",
    toenailsLost: 1,
    extras: [
      ["GELS CONSUMED", 8],
      ["MY SUPPORT CREW", "10 FOLKS"],
      ["INJURIES", "1 SPRAIN"],
    ],
    quote: "Tower Bridge at halfway, then The Mall.",
    route: course(ROUTES["london-marathon-2024"]),
  },
  {
    id: "houston-marathon-2025",
    status: "completed",
    type: "full",
    name: "HOUSTON MARATHON",
    short: "HOUSTON",
    location: "HOUSTON, TX",
    date: "2025-01-19",
    distanceKm: 42.195,
    duration: null,
    avgPace: null,
    avgHr: null,
    elevation: null,
    calories: null,
    bib: "A3736",
    corral: "WAVE A",
    shoes: "NIKE ALPHAFLY NEXT% 3",
    startWeather: "32°F / 57%",
    spectators: "250,000+",
    toenailsLost: 2,
    extras: [
      ["GELS CONSUMED", 7],
      ["MY SUPPORT CREW", "4 FOLKS"],
    ],
    quote: "The Heights, the Galleria, and back downtown.",
    route: course(ROUTES["houston-marathon-2025"]),
  },
  {
    id: "berlin-marathon-2025",
    status: "completed",
    type: "full",
    name: "BERLIN MARATHON",
    short: "BERLIN",
    location: "BERLIN, DE",
    date: "2025-09-21",
    distanceKm: 42.195,
    duration: null,
    avgPace: null,
    avgHr: null,
    elevation: null,
    calories: null,
    bib: "81674",
    corral: "WAVE 2, BLOCK E",
    shoes: "NIKE ALPHAFLY NEXT% 3",
    startWeather: "68°F / 78%",
    spectators: "1,000,000+",
    toenailsLost: 2,
    extras: [
      ["GELS CONSUMED", 8],
      ["MY SUPPORT CREW", "4 FOLKS"],
    ],
    quote: "Last 400 m through the Brandenburg Gate.",
    route: course(ROUTES["berlin-marathon-2025"]),
  },
  {
    id: "chicago-marathon-2026",
    status: "upcoming",
    type: "full",
    name: "CHICAGO MARATHON",
    short: "CHICAGO",
    location: "CHICAGO, IL",
    date: "2026-10-11",
    startTime: "2026-10-11T07:30:00-05:00",
    distanceKm: 42.195,
    targetTime: null,
    targetPace: null,
    bib: null,
    corral: "WAVE 1, CORRAL E",
    shoes: null,
    startWeather: "FORECAST TBD",
    spectators: "~1.7M EXPECTED",
    toenailsLost: null,
    extras: [],
    quote: "Training in progress.",
    route: course(ROUTES["chicago-marathon-2026"]),
  },
];

// Totals printed in the ledger. marathonPr overrides the PR worked out from race durations.
export const LEDGER: LedgerTotals = {
  marathonPr: "03:31",
  retiredShoes: 7,
};
