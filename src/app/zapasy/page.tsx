"use client";

import { useState } from "react";
import Link from "next/link";
import { matches, venues, formatFullDate, generateCalendarUrl } from "@/data";

type FilterType = "all" | "scheduled" | "finished";

export default function MatchesPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    return match.status === filter;
  });

  const scheduledMatches = filteredMatches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const finishedMatches = filteredMatches
    .filter((m) => m.status === "finished")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
              {scheduledMatches.map((match) => {
                const venue = venues[match.venue];
                return (
                  <div
                    key={match.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Teams */}
                      <div className="flex items-center justify-center gap-6 flex-1">
                        <Link href={`/tymy/${match.homeTeam.id}`} className="flex items-center gap-3 hover:opacity-80">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: match.homeTeam.color }}
                          >
                            {match.homeTeam.shortName}
                          </div>
                          <span className="font-semibold text-primary">{match.homeTeam.name}</span>
                        </Link>

                        <div className="text-2xl font-bold text-secondary">vs</div>

                        <Link href={`/tymy/${match.awayTeam.id}`} className="flex items-center gap-3 hover:opacity-80">
                          <span className="font-semibold text-primary">{match.awayTeam.name}</span>
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: match.awayTeam.color }}
                          >
                            {match.awayTeam.shortName}
                          </div>
                        </Link>
                      </div>

                      {/* Date & Venue */}
                      <div className="text-center md:text-right">
                        <div className="font-semibold text-primary">{formatFullDate(match.date)}</div>
                        <div className="text-accent font-bold text-lg">{match.time}</div>
                        <div className="text-sm text-secondary">{venue.name}</div>
                        <a
                          href={generateCalendarUrl(match)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:text-accent-hover text-sm font-medium mt-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Přidat do kalendáře
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Finished Matches */}
        {finishedMatches.length > 0 && (filter === "all" || filter === "finished") && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">Odehrané zápasy</h2>
            <div className="space-y-4">
              {finishedMatches.map((match) => {
                const venue = venues[match.venue];
                return (
                  <div
                    key={match.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Teams & Score */}
                      <div className="flex items-center justify-center gap-4 flex-1">
                        <Link href={`/tymy/${match.homeTeam.id}`} className="flex items-center gap-3 hover:opacity-80">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: match.homeTeam.color }}
                          >
                            {match.homeTeam.shortName}
                          </div>
                          <span className="font-semibold text-primary">{match.homeTeam.name}</span>
                        </Link>

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

                        <Link href={`/tymy/${match.awayTeam.id}`} className="flex items-center gap-3 hover:opacity-80">
                          <span className="font-semibold text-primary">{match.awayTeam.name}</span>
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: match.awayTeam.color }}
                          >
                            {match.awayTeam.shortName}
                          </div>
                        </Link>
                      </div>

                      {/* Date & Venue */}
                      <div className="text-center md:text-right">
                        <div className="text-sm text-secondary">{formatFullDate(match.date)}</div>
                        <div className="text-sm text-secondary">{venue.name}</div>
                        {match.periods && (
                          <div className="text-xs text-secondary mt-1">
                            ({match.periods.map(p => `${p.homeScore}:${p.awayScore}`).join(", ")})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
