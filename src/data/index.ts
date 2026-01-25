// Centrální datový soubor pro BHLA
// Všechna data jsou zde sdílená mezi komponenty

// Místa konání
export const venues = {
  soběslav: {
    id: "soběslav",
    name: "Zimní stadion Soběslav",
    address: "Wilsonova 628, 392 01 Soběslav",
    lat: 49.2591,
    lng: 14.7206,
    mapUrl: "https://maps.google.com/maps?q=49.2591,14.7206&z=15&output=embed",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=49.2591,14.7206",
  },
  veselí: {
    id: "veselí",
    name: "Zimní stadion Veselí nad Lužnicí",
    address: "K Zastávce 800, 391 81 Veselí nad Lužnicí",
    lat: 49.1836,
    lng: 14.6975,
    mapUrl: "https://maps.google.com/maps?q=49.1836,14.6975&z=15&output=embed",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=49.1836,14.6975",
  },
} as const;

export type VenueKey = keyof typeof venues;

// Týmy BHLA
export const teams = [
  {
    id: "1",
    name: "HC Dolní Bukovsko",
    shortName: "BUK",
    color: "#D61F2C",
    founded: 2008,
    description: "Jeden ze zakládajících týmů BHLA s dlouhou tradicí.",
    stats: { played: 17, wins: 12, losses: 5, goalsFor: 58, goalsAgainst: 35, points: 36 },
  },
  {
    id: "2",
    name: "HC Fantom",
    shortName: "FAN",
    color: "#144A86",
    founded: 2008,
    description: "Tradční tým ligy známý svou houževnatostí.",
    stats: { played: 17, wins: 11, losses: 6, goalsFor: 52, goalsAgainst: 38, points: 33 },
  },
  {
    id: "3",
    name: "HC Roudné",
    shortName: "ROU",
    color: "#2E7D32",
    founded: 2010,
    description: "Tým z Roudného s bojovným duchem.",
    stats: { played: 17, wins: 10, losses: 7, goalsFor: 48, goalsAgainst: 42, points: 30 },
  },
  {
    id: "4",
    name: "HC Kostelec",
    shortName: "KOS",
    color: "#FF9800",
    founded: 2009,
    description: "Kostelecký tým s věrnou fanouškovskou základnou.",
    stats: { played: 17, wins: 9, losses: 8, goalsFor: 45, goalsAgainst: 44, points: 27 },
  },
  {
    id: "5",
    name: "HC Hlavatce",
    shortName: "HLA",
    color: "#9C27B0",
    founded: 2012,
    description: "Hlavatecký tým s mladým kádrem.",
    stats: { played: 17, wins: 7, losses: 10, goalsFor: 40, goalsAgainst: 48, points: 21 },
  },
  {
    id: "6",
    name: "HC Křída",
    shortName: "KRI",
    color: "#0B1F3B",
    founded: 2015,
    description: "Nováček ligy s ambicemi prosadit se.",
    stats: { played: 17, wins: 5, losses: 12, goalsFor: 32, goalsAgainst: 55, points: 15 },
  },
] as const;

export type Team = typeof teams[number];

// Helper funkce pro získání týmu podle ID
export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

// Helper funkce pro získání týmu podle zkratky
export function getTeamByShortName(shortName: string): Team | undefined {
  return teams.find(t => t.shortName === shortName);
}

// Tabulka (seřazená podle bodů)
export const standings = [...teams].sort((a, b) => b.stats.points - a.stats.points).map((team, index) => ({
  position: index + 1,
  ...team,
}));

// Zápasy
export interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    color: string;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    color: string;
  };
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: VenueKey;
  status: "scheduled" | "finished";
  // Detailní statistiky zápasu (pouze pro odehrané)
  periods?: {
    period: number;
    homeScore: number;
    awayScore: number;
  }[];
  stats?: {
    homeShots: number;
    awayShots: number;
    homePenalties: number;
    awayPenalties: number;
    homeSaves: number;
    awaySaves: number;
  };
  goals?: {
    period: number;
    time: string;
    team: "home" | "away";
    scorer: string;
    assists: string[];
  }[];
  penalties?: {
    period: number;
    time: string;
    team: "home" | "away";
    player: string;
    reason: string;
    minutes: number;
  }[];
}

// Demo zápasy
export const matches: Match[] = [
  // Odehrané zápasy
  {
    id: "last-1",
    homeTeam: { id: "1", name: "HC Dolní Bukovsko", shortName: "BUK", color: "#D61F2C" },
    awayTeam: { id: "2", name: "HC Fantom", shortName: "FAN", color: "#144A86" },
    homeScore: 5,
    awayScore: 3,
    date: "2025-01-18",
    time: "18:00",
    venue: "soběslav",
    status: "finished",
    periods: [
      { period: 1, homeScore: 2, awayScore: 1 },
      { period: 2, homeScore: 1, awayScore: 2 },
      { period: 3, homeScore: 2, awayScore: 0 },
    ],
    stats: {
      homeShots: 32,
      awayShots: 28,
      homePenalties: 4,
      awayPenalties: 6,
      homeSaves: 25,
      awaySaves: 27,
    },
    goals: [
      { period: 1, time: "05:23", team: "home", scorer: "Jan Novák", assists: ["Petr Svoboda"] },
      { period: 1, time: "12:45", team: "away", scorer: "Martin Dvořák", assists: ["Tomáš Horák", "Jakub Marek"] },
      { period: 1, time: "18:30", team: "home", scorer: "Lukáš Procházka", assists: [] },
      { period: 2, time: "03:12", team: "away", scorer: "David Černý", assists: ["Martin Dvořák"] },
      { period: 2, time: "11:55", team: "home", scorer: "Jan Novák", assists: ["Karel Veselý"] },
      { period: 2, time: "19:02", team: "away", scorer: "Filip Král", assists: [] },
      { period: 3, time: "08:44", team: "home", scorer: "Petr Svoboda", assists: ["Jan Novák", "Lukáš Procházka"] },
      { period: 3, time: "17:33", team: "home", scorer: "Karel Veselý", assists: ["Petr Svoboda"] },
    ],
    penalties: [
      { period: 1, time: "07:15", team: "away", player: "Tomáš Horák", reason: "Držení", minutes: 2 },
      { period: 1, time: "14:22", team: "home", player: "Michal Pokorný", reason: "Vysoká hůl", minutes: 2 },
      { period: 2, time: "06:45", team: "away", player: "Jakub Marek", reason: "Podražení", minutes: 2 },
      { period: 2, time: "15:30", team: "home", player: "Jan Novák", reason: "Sekání", minutes: 2 },
      { period: 3, time: "04:18", team: "away", player: "David Černý", reason: "Vražení na hrazení", minutes: 2 },
    ],
  },
  {
    id: "past-2",
    homeTeam: { id: "3", name: "HC Roudné", shortName: "ROU", color: "#2E7D32" },
    awayTeam: { id: "4", name: "HC Kostelec", shortName: "KOS", color: "#FF9800" },
    homeScore: 4,
    awayScore: 4,
    date: "2025-01-12",
    time: "19:00",
    venue: "veselí",
    status: "finished",
    periods: [
      { period: 1, homeScore: 1, awayScore: 2 },
      { period: 2, homeScore: 2, awayScore: 1 },
      { period: 3, homeScore: 1, awayScore: 1 },
    ],
    stats: {
      homeShots: 30,
      awayShots: 31,
      homePenalties: 3,
      awayPenalties: 4,
      homeSaves: 27,
      awaySaves: 26,
    },
  },
  {
    id: "past-3",
    homeTeam: { id: "5", name: "HC Hlavatce", shortName: "HLA", color: "#9C27B0" },
    awayTeam: { id: "6", name: "HC Křída", shortName: "KRI", color: "#0B1F3B" },
    homeScore: 6,
    awayScore: 2,
    date: "2025-01-10",
    time: "18:00",
    venue: "soběslav",
    status: "finished",
    periods: [
      { period: 1, homeScore: 2, awayScore: 0 },
      { period: 2, homeScore: 3, awayScore: 1 },
      { period: 3, homeScore: 1, awayScore: 1 },
    ],
    stats: {
      homeShots: 35,
      awayShots: 22,
      homePenalties: 2,
      awayPenalties: 5,
      homeSaves: 20,
      awaySaves: 29,
    },
  },
  // Nadcházející zápasy
  {
    id: "next-1",
    homeTeam: { id: "1", name: "HC Dolní Bukovsko", shortName: "BUK", color: "#D61F2C" },
    awayTeam: { id: "2", name: "HC Fantom", shortName: "FAN", color: "#144A86" },
    date: "2025-02-15",
    time: "18:00",
    venue: "soběslav",
    status: "scheduled",
  },
  {
    id: "next-2",
    homeTeam: { id: "3", name: "HC Roudné", shortName: "ROU", color: "#2E7D32" },
    awayTeam: { id: "1", name: "HC Dolní Bukovsko", shortName: "BUK", color: "#D61F2C" },
    date: "2025-02-18",
    time: "19:30",
    venue: "veselí",
    status: "scheduled",
  },
  {
    id: "next-3",
    homeTeam: { id: "2", name: "HC Fantom", shortName: "FAN", color: "#144A86" },
    awayTeam: { id: "4", name: "HC Kostelec", shortName: "KOS", color: "#FF9800" },
    date: "2025-02-20",
    time: "18:30",
    venue: "soběslav",
    status: "scheduled",
  },
  {
    id: "next-4",
    homeTeam: { id: "5", name: "HC Hlavatce", shortName: "HLA", color: "#9C27B0" },
    awayTeam: { id: "3", name: "HC Roudné", shortName: "ROU", color: "#2E7D32" },
    date: "2025-02-22",
    time: "18:00",
    venue: "veselí",
    status: "scheduled",
  },
  {
    id: "next-5",
    homeTeam: { id: "6", name: "HC Křída", shortName: "KRI", color: "#0B1F3B" },
    awayTeam: { id: "5", name: "HC Hlavatce", shortName: "HLA", color: "#9C27B0" },
    date: "2025-02-25",
    time: "19:00",
    venue: "soběslav",
    status: "scheduled",
  },
  {
    id: "next-6",
    homeTeam: { id: "4", name: "HC Kostelec", shortName: "KOS", color: "#FF9800" },
    awayTeam: { id: "6", name: "HC Křída", shortName: "KRI", color: "#0B1F3B" },
    date: "2025-03-01",
    time: "18:00",
    venue: "veselí",
    status: "scheduled",
  },
];

// Helper funkce pro zápasy
export function getUpcomingMatches(limit?: number): Match[] {
  const upcoming = matches
    .filter(m => m.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getFinishedMatches(limit?: number): Match[] {
  const finished = matches
    .filter(m => m.status === "finished")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return limit ? finished.slice(0, limit) : finished;
}

export function getLastMatch(): Match | undefined {
  return getFinishedMatches(1)[0];
}

export function getNextMatch(): Match | undefined {
  return getUpcomingMatches(1)[0];
}

// Kalendářové události (odvozené ze zápasů + vlastní události)
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "match" | "training" | "meeting" | "other";
  location: string;
  matchId?: string;
}

export function getCalendarEvents(): CalendarEvent[] {
  // Převedeme zápasy na události
  const matchEvents: CalendarEvent[] = matches.map(match => ({
    id: `match-${match.id}`,
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    date: match.date,
    time: match.time,
    type: "match" as const,
    location: venues[match.venue].name,
    matchId: match.id,
  }));

  // Přidáme další události
  const otherEvents: CalendarEvent[] = [
    { id: "meeting-1", title: "Schůze vedení ligy", date: "2025-02-22", time: "17:00", type: "meeting", location: "Restaurace U Kohouta, Soběslav" },
    { id: "other-1", title: "Turnaj přípravek", date: "2025-03-01", time: "09:00", type: "other", location: venues.soběslav.name },
  ];

  return [...matchEvents, ...otherEvents].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// Hráči s statistikami
export interface Player {
  id: string;
  name: string;
  number: number;
  position: "brankář" | "obránce" | "útočník";
  teamId: string;
  stats: {
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    penaltyMinutes: number;
    // Pro brankáře
    saves?: number;
    goalsAgainst?: number;
    savePercentage?: number;
  };
}

export const players: Player[] = [
  // HC Dolní Bukovsko
  { id: "p1", name: "Jan Novák", number: 9, position: "útočník", teamId: "1", stats: { gamesPlayed: 17, goals: 15, assists: 12, points: 27, penaltyMinutes: 8 } },
  { id: "p2", name: "Petr Svoboda", number: 11, position: "útočník", teamId: "1", stats: { gamesPlayed: 17, goals: 10, assists: 14, points: 24, penaltyMinutes: 4 } },
  { id: "p3", name: "Karel Veselý", number: 7, position: "útočník", teamId: "1", stats: { gamesPlayed: 16, goals: 8, assists: 9, points: 17, penaltyMinutes: 6 } },
  { id: "p4", name: "Lukáš Procházka", number: 23, position: "obránce", teamId: "1", stats: { gamesPlayed: 17, goals: 4, assists: 11, points: 15, penaltyMinutes: 12 } },
  { id: "p5", name: "Michal Pokorný", number: 1, position: "brankář", teamId: "1", stats: { gamesPlayed: 14, goals: 0, assists: 1, points: 1, penaltyMinutes: 2, saves: 378, goalsAgainst: 28, savePercentage: 93.1 } },

  // HC Fantom
  { id: "p6", name: "Martin Dvořák", number: 19, position: "útočník", teamId: "2", stats: { gamesPlayed: 17, goals: 14, assists: 10, points: 24, penaltyMinutes: 10 } },
  { id: "p7", name: "Tomáš Horák", number: 14, position: "útočník", teamId: "2", stats: { gamesPlayed: 17, goals: 9, assists: 13, points: 22, penaltyMinutes: 14 } },
  { id: "p8", name: "Jakub Marek", number: 5, position: "obránce", teamId: "2", stats: { gamesPlayed: 17, goals: 3, assists: 15, points: 18, penaltyMinutes: 8 } },
  { id: "p9", name: "David Černý", number: 22, position: "útočník", teamId: "2", stats: { gamesPlayed: 15, goals: 7, assists: 8, points: 15, penaltyMinutes: 6 } },
  { id: "p10", name: "Filip Král", number: 33, position: "brankář", teamId: "2", stats: { gamesPlayed: 15, goals: 0, assists: 0, points: 0, penaltyMinutes: 4, saves: 402, goalsAgainst: 32, savePercentage: 92.6 } },

  // HC Roudné
  { id: "p11", name: "Ondřej Malý", number: 17, position: "útočník", teamId: "3", stats: { gamesPlayed: 17, goals: 12, assists: 8, points: 20, penaltyMinutes: 6 } },
  { id: "p12", name: "Radek Kučera", number: 8, position: "útočník", teamId: "3", stats: { gamesPlayed: 17, goals: 9, assists: 10, points: 19, penaltyMinutes: 12 } },

  // HC Kostelec
  { id: "p13", name: "Štěpán Beneš", number: 10, position: "útočník", teamId: "4", stats: { gamesPlayed: 17, goals: 11, assists: 7, points: 18, penaltyMinutes: 8 } },
  { id: "p14", name: "Pavel Růžička", number: 21, position: "útočník", teamId: "4", stats: { gamesPlayed: 16, goals: 8, assists: 9, points: 17, penaltyMinutes: 4 } },

  // HC Hlavatce
  { id: "p15", name: "Vojtěch Fiala", number: 15, position: "útočník", teamId: "5", stats: { gamesPlayed: 17, goals: 10, assists: 6, points: 16, penaltyMinutes: 10 } },

  // HC Křída
  { id: "p16", name: "Jiří Bartoš", number: 13, position: "útočník", teamId: "6", stats: { gamesPlayed: 17, goals: 7, assists: 5, points: 12, penaltyMinutes: 14 } },
];

// Helper funkce pro hráče
export function getPlayersByTeam(teamId: string): Player[] {
  return players.filter(p => p.teamId === teamId);
}

export function getTopScorers(limit?: number): Player[] {
  const sorted = [...players].sort((a, b) => b.stats.points - a.stats.points);
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getTopGoalScorers(limit?: number): Player[] {
  const sorted = [...players].sort((a, b) => b.stats.goals - a.stats.goals);
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getGoalkeepers(): Player[] {
  return players.filter(p => p.position === "brankář").sort((a, b) =>
    (b.stats.savePercentage || 0) - (a.stats.savePercentage || 0)
  );
}

// Formátovací funkce
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
}

export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateCalendarUrl(match: Match): string {
  const venue = venues[match.venue];
  const startDate = new Date(`${match.date}T${match.time}:00`);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const formatForCalendar = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const title = `${match.homeTeam.name} vs ${match.awayTeam.name} - BHLA`;
  const details = `Hokejový zápas BHLA\n${match.homeTeam.name} vs ${match.awayTeam.name}`;
  const location = `${venue.name}, ${venue.address}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatForCalendar(startDate)}/${formatForCalendar(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}
