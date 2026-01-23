"use client";

import { useState } from "react";

// Demo data
const matches = [
  {
    id: "1",
    homeTeam: { name: "HC Blatná", shortName: "BLA", color: "#D61F2C" },
    awayTeam: { name: "SK Lední Medvědi", shortName: "LME", color: "#144A86" },
    homeScore: 4,
    awayScore: 2,
    date: "2025-01-10",
    time: "18:00",
    venue: "Zimní stadion Blatná",
    status: "finished" as const,
  },
  {
    id: "2",
    homeTeam: { name: "TJ Hokej Strakonice", shortName: "STR", color: "#0B1F3B" },
    awayTeam: { name: "HC Vlci Písek", shortName: "VLP", color: "#2E7D32" },
    homeScore: 3,
    awayScore: 3,
    date: "2025-01-12",
    time: "19:00",
    venue: "Zimní stadion Strakonice",
    status: "finished" as const,
  },
  {
    id: "3",
    homeTeam: { name: "HC Blatná", shortName: "BLA", color: "#D61F2C" },
    awayTeam: { name: "SK Lední Medvědi", shortName: "LME", color: "#144A86" },
    date: "2025-02-15",
    time: "18:00",
    venue: "Zimní stadion Blatná",
    status: "scheduled" as const,
  },
  {
    id: "4",
    homeTeam: { name: "TJ Hokej Strakonice", shortName: "STR", color: "#0B1F3B" },
    awayTeam: { name: "HC Blatná", shortName: "BLA", color: "#D61F2C" },
    date: "2025-02-18",
    time: "19:30",
    venue: "Zimní stadion Strakonice",
    status: "scheduled" as const,
  },
  {
    id: "5",
    homeTeam: { name: "SK Lední Medvědi", shortName: "LME", color: "#144A86" },
    awayTeam: { name: "HC Vlci Písek", shortName: "VLP", color: "#2E7D32" },
    date: "2025-02-20",
    time: "18:30",
    venue: "Zimní stadion Blatná",
    status: "scheduled" as const,
  },
];

type FilterType = "all" | "scheduled" | "finished";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MatchesPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    return match.status === filter;
  });

  const scheduledMatches = filteredMatches.filter((m) => m.status === "scheduled");
  const finishedMatches = filteredMatches.filter((m) => m.status === "finished");

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Zápasy</h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Rozpis zápasů a výsledky Blatské Hokejové Ligy Amatérů
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: "all", label: "Všechny" },
            { key: "scheduled", label: "Nadcházející" },
            { key: "finished", label: "Odehrané" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as FilterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === item.key
                  ? "bg-primary text-white"
                  : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Upcoming Matches */}
        {scheduledMatches.length > 0 && (filter === "all" || filter === "scheduled") && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Nadcházející zápasy</h2>
            <div className="space-y-4">
              {scheduledMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Teams */}
                    <div className="flex items-center justify-center gap-6 flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: match.homeTeam.color }}
                        >
                          {match.homeTeam.shortName}
                        </div>
                        <span className="font-semibold text-primary">{match.homeTeam.name}</span>
                      </div>

                      <div className="text-2xl font-bold text-secondary">vs</div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-primary">{match.awayTeam.name}</span>
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: match.awayTeam.color }}
                        >
                          {match.awayTeam.shortName}
                        </div>
                      </div>
                    </div>

                    {/* Date & Venue */}
                    <div className="text-center md:text-right">
                      <div className="font-semibold text-primary">{formatDate(match.date)}</div>
                      <div className="text-accent font-bold text-lg">{match.time}</div>
                      <div className="text-sm text-secondary">{match.venue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finished Matches */}
        {finishedMatches.length > 0 && (filter === "all" || filter === "finished") && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">Odehrané zápasy</h2>
            <div className="space-y-4">
              {finishedMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Teams & Score */}
                    <div className="flex items-center justify-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: match.homeTeam.color }}
                        >
                          {match.homeTeam.shortName}
                        </div>
                        <span className="font-semibold text-primary">{match.homeTeam.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-3xl font-bold ${
                          match.homeScore! > match.awayScore! ? "text-green-600" : "text-primary"
                        }`}>
                          {match.homeScore}
                        </span>
                        <span className="text-2xl text-secondary">:</span>
                        <span className={`text-3xl font-bold ${
                          match.awayScore! > match.homeScore! ? "text-green-600" : "text-primary"
                        }`}>
                          {match.awayScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-primary">{match.awayTeam.name}</span>
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: match.awayTeam.color }}
                        >
                          {match.awayTeam.shortName}
                        </div>
                      </div>
                    </div>

                    {/* Date & Venue */}
                    <div className="text-center md:text-right">
                      <div className="text-sm text-secondary">{formatDate(match.date)}</div>
                      <div className="text-sm text-secondary">{match.venue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
