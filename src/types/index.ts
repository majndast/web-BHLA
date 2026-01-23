// Týmy
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  color: string;
  founded?: number;
  description?: string;
}

// Hráči
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: "brankář" | "obránce" | "útočník";
  teamId: string;
  photo?: string;
  birthDate?: string;
  height?: number;
  weight?: number;
}

// Statistiky hráče
export interface PlayerStats {
  playerId: string;
  seasonId: string;
  games: number;
  goals: number;
  assists: number;
  points: number;
  penaltyMinutes: number;
  plusMinus: number;
}

// Statistiky brankáře
export interface GoalieStats {
  playerId: string;
  seasonId: string;
  games: number;
  wins: number;
  losses: number;
  goalsAgainst: number;
  saves: number;
  shutouts: number;
}

// Zápasy
export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  seasonId: string;
  status: "scheduled" | "live" | "finished" | "postponed";
}

// Tabulka ligy
export interface Standing {
  teamId: string;
  seasonId: string;
  position: number;
  played: number;
  wins: number;
  losses: number;
  otWins: number;
  otLosses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

// Sezóna
export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

// Události / Kalendář
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  type: "match" | "training" | "meeting" | "other";
}

// Galerie
export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  date: string;
  images: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
}

// Novinky
export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  publishedAt: string;
  author?: string;
}

// Uživatelé (pro admin)
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  createdAt: string;
}
