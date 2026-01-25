"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getLastMatch, venues } from "@/data";

// Extended match data with detailed stats (will come from database later)
const matchDetails = {
  hasOvertime: false,
  hasShootout: false,
  periodsWithShots: [
    { period: 1, homeShots: 12, awayShots: 9 },
    { period: 2, homeShots: 8, awayShots: 14 },
    { period: 3, homeShots: 11, awayShots: 8 },
  ],
  extendedGoals: [
    { time: "05:23", period: 1, team: "home" as const, scorer: "Jan Novák", assists: ["Petr Svoboda"], score: "1:0" },
    { time: "12:45", period: 1, team: "away" as const, scorer: "Martin Dvořák", assists: ["Tomáš Horák", "Jakub Marek"], score: "1:1" },
    { time: "18:30", period: 1, team: "home" as const, scorer: "Lukáš Procházka", assists: [], score: "2:1" },
    { time: "03:12", period: 2, team: "away" as const, scorer: "David Černý", assists: ["Martin Dvořák"], score: "2:2" },
    { time: "11:55", period: 2, team: "home" as const, scorer: "Jan Novák", assists: ["Karel Veselý"], score: "3:2" },
    { time: "19:02", period: 2, team: "away" as const, scorer: "Filip Král", assists: [], score: "3:3" },
    { time: "08:44", period: 3, team: "home" as const, scorer: "Petr Svoboda", assists: ["Jan Novák", "Lukáš Procházka"], score: "4:3" },
    { time: "17:33", period: 3, team: "home" as const, scorer: "Karel Veselý", assists: ["Petr Svoboda"], score: "5:3" },
  ],
  extendedPenalties: [
    { time: "07:15", period: 1, team: "away" as const, player: "Tomáš Horák", minutes: 2, reason: "Držení" },
    { time: "14:22", period: 1, team: "home" as const, player: "Michal Pokorný", minutes: 2, reason: "Vysoká hůl" },
    { time: "06:45", period: 2, team: "away" as const, player: "Jakub Marek", minutes: 2, reason: "Podražení" },
    { time: "15:30", period: 2, team: "home" as const, player: "Jan Novák", minutes: 2, reason: "Sekání" },
    { time: "04:18", period: 3, team: "away" as const, player: "David Černý", minutes: 2, reason: "Vražení na hrazení" },
  ],
  goalies: {
    home: { name: "Michal Pokorný", saves: 25, shotsAgainst: 28, savePercentage: 89.3 },
    away: { name: "Filip Král", saves: 27, shotsAgainst: 32, savePercentage: 84.4 },
  },
  topScorers: {
    home: [
      { name: "Jan Novák", goals: 2, assists: 1, points: 3 },
      { name: "Petr Svoboda", goals: 1, assists: 2, points: 3 },
      { name: "Karel Veselý", goals: 1, assists: 1, points: 2 },
    ],
    away: [
      { name: "Martin Dvořák", goals: 1, assists: 2, points: 3 },
      { name: "David Černý", goals: 1, assists: 0, points: 1 },
      { name: "Filip Král", goals: 1, assists: 0, points: 1 },
    ],
  },
};

type TabType = "overview" | "goals" | "penalties" | "stats";

export default function LastMatchSection() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [expanded, setExpanded] = useState(false);

  const lastMatch = getLastMatch();

  if (!lastMatch) {
    return null;
  }

  const venue = venues[lastMatch.venue];
  const periods = lastMatch.periods || [];

  const totalHomeShots = matchDetails.periodsWithShots.reduce((acc, p) => acc + p.homeShots, 0);
  const totalAwayShots = matchDetails.periodsWithShots.reduce((acc, p) => acc + p.awayShots, 0);

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary to-primary-light text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              POSLEDNÍ ZÁPAS
            </span>
            <h2 className="text-3xl font-bold">Výsledek posledního utkání</h2>
          </div>
          <Link
            href="/zapasy"
            className="hidden md:inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            Všechny zápasy
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Match Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          {/* Score Header */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Home Team */}
              <Link href={`/tymy/${lastMatch.homeTeam.id}`} className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: lastMatch.homeTeam.color }}
                >
                  {lastMatch.homeTeam.shortName}
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">{lastMatch.homeTeam.name}</div>
                  <div className="text-white/60 text-sm">Domácí</div>
                </div>
              </Link>

              {/* Score */}
              <div className="text-center px-8">
                <div className="text-5xl md:text-7xl font-black">
                  <span className={(lastMatch.homeScore || 0) > (lastMatch.awayScore || 0) ? "text-accent" : ""}>
                    {lastMatch.homeScore}
                  </span>
                  <span className="text-white/50 mx-2">:</span>
                  <span className={(lastMatch.awayScore || 0) > (lastMatch.homeScore || 0) ? "text-accent" : ""}>
                    {lastMatch.awayScore}
                  </span>
                </div>
                <div className="text-white/60 text-sm mt-2">
                  {matchDetails.hasOvertime && "Po prodloužení"}
                  {matchDetails.hasShootout && "Po nájezdech"}
                  {!matchDetails.hasOvertime && !matchDetails.hasShootout && "Konečný výsledek"}
                </div>
                <div className="text-white/40 text-xs mt-1">{venue.name}</div>
              </div>

              {/* Away Team */}
              <Link href={`/tymy/${lastMatch.awayTeam.id}`} className="flex items-center gap-4 flex-1 justify-end hover:opacity-80 transition-opacity">
                <div className="text-right">
                  <div className="text-xl md:text-2xl font-bold">{lastMatch.awayTeam.name}</div>
                  <div className="text-white/60 text-sm">Hosté</div>
                </div>
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: lastMatch.awayTeam.color }}
                >
                  {lastMatch.awayTeam.shortName}
                </div>
              </Link>
            </div>

            {/* Period Scores */}
            <div className="flex justify-center gap-4 mt-6">
              {periods.map((period) => (
                <div key={period.period} className="text-center bg-white/5 rounded-lg px-4 py-2">
                  <div className="text-xs text-white/50 mb-1">{period.period}. třetina</div>
                  <div className="font-bold">{period.homeScore}:{period.awayScore}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Details */}
          {expanded && (
            <>
              {/* Tabs */}
              <div className="border-t border-white/10 px-4 md:px-8">
                <div className="flex gap-1 overflow-x-auto py-2">
                  {[
                    { key: "overview", label: "Přehled" },
                    { key: "goals", label: "Góly" },
                    { key: "penalties", label: "Tresty" },
                    { key: "stats", label: "Statistiky" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as TabType)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab.key
                          ? "bg-accent text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 md:p-8 border-t border-white/10">
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shots on Goal */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/70 mb-4">STŘELY NA BRÁNU</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold w-12">{totalHomeShots}</span>
                          <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(totalHomeShots / (totalHomeShots + totalAwayShots)) * 100}%`,
                                backgroundColor: lastMatch.homeTeam.color,
                              }}
                            />
                          </div>
                          <span className="text-2xl font-bold w-12 text-right">{totalAwayShots}</span>
                        </div>
                        {matchDetails.periodsWithShots.map((period) => (
                          <div key={period.period} className="flex items-center gap-4 text-sm">
                            <span className="w-12">{period.homeShots}</span>
                            <div className="flex-1 text-center text-white/50">{period.period}. třetina</div>
                            <span className="w-12 text-right">{period.awayShots}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Goalies */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/70 mb-4">BRANKÁŘI</h4>
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{matchDetails.goalies.home.name}</span>
                            <span className="text-xs text-white/50">{lastMatch.homeTeam.shortName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div>
                              <div className="text-xl font-bold text-accent">{matchDetails.goalies.home.saves}</div>
                              <div className="text-white/50 text-xs">Zákroků</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">{matchDetails.goalies.home.shotsAgainst}</div>
                              <div className="text-white/50 text-xs">Střel na</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">{matchDetails.goalies.home.savePercentage}%</div>
                              <div className="text-white/50 text-xs">Úspěšnost</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{matchDetails.goalies.away.name}</span>
                            <span className="text-xs text-white/50">{lastMatch.awayTeam.shortName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div>
                              <div className="text-xl font-bold text-accent">{matchDetails.goalies.away.saves}</div>
                              <div className="text-white/50 text-xs">Zákroků</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">{matchDetails.goalies.away.shotsAgainst}</div>
                              <div className="text-white/50 text-xs">Střel na</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">{matchDetails.goalies.away.savePercentage}%</div>
                              <div className="text-white/50 text-xs">Úspěšnost</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Scorers */}
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-semibold text-white/70 mb-4">NEJLEPŠÍ HRÁČI ZÁPASU</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-xs text-white/50 mb-3">{lastMatch.homeTeam.name}</div>
                          {matchDetails.topScorers.home.map((player) => (
                            <div key={player.name} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                              <span>{player.name}</span>
                              <span className="font-mono text-accent">{player.goals}+{player.assists}={player.points}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-xs text-white/50 mb-3">{lastMatch.awayTeam.name}</div>
                          {matchDetails.topScorers.away.map((player) => (
                            <div key={player.name} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                              <span>{player.name}</span>
                              <span className="font-mono text-accent">{player.goals}+{player.assists}={player.points}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "goals" && (
                  <div className="space-y-6">
                    {[1, 2, 3].map((period) => {
                      const periodGoals = matchDetails.extendedGoals.filter((g) => g.period === period);
                      return (
                        <div key={period}>
                          <h4 className="text-sm font-semibold text-white/70 mb-3">{period}. TŘETINA</h4>
                          <div className="space-y-2">
                            {periodGoals.map((goal, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-4 p-3 rounded-lg ${
                                  goal.team === "home" ? "bg-white/10" : "bg-white/5"
                                }`}
                              >
                                <div className="text-sm font-mono text-white/70 w-14">{goal.time}</div>
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: goal.team === "home" ? lastMatch.homeTeam.color : lastMatch.awayTeam.color,
                                  }}
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{goal.scorer}</div>
                                  {goal.assists.length > 0 && (
                                    <div className="text-sm text-white/50">({goal.assists.join(", ")})</div>
                                  )}
                                </div>
                                <div className="font-bold text-accent">{goal.score}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "penalties" && (
                  <div className="space-y-6">
                    {[1, 2, 3].map((period) => {
                      const periodPenalties = matchDetails.extendedPenalties.filter((p) => p.period === period);
                      if (periodPenalties.length === 0) return null;
                      return (
                        <div key={period}>
                          <h4 className="text-sm font-semibold text-white/70 mb-3">{period}. TŘETINA</h4>
                          <div className="space-y-2">
                            {periodPenalties.map((penalty, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-4 p-3 rounded-lg ${
                                  penalty.team === "home" ? "bg-red-500/10" : "bg-blue-500/10"
                                }`}
                              >
                                <div className="text-sm font-mono text-white/70 w-14">{penalty.time}</div>
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: penalty.team === "home" ? lastMatch.homeTeam.color : lastMatch.awayTeam.color,
                                  }}
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{penalty.player}</div>
                                  <div className="text-sm text-white/50">{penalty.reason}</div>
                                </div>
                                <div className="font-bold text-yellow-500">{penalty.minutes} min</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "stats" && (
                  <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-white/70">STATISTIKY PO TŘETINÁCH</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-white/50">
                            <th className="text-left py-2">Statistika</th>
                            {periods.map((p) => (
                              <th key={p.period} className="text-center py-2" colSpan={2}>{p.period}. třetina</th>
                            ))}
                            <th className="text-center py-2" colSpan={2}>Celkem</th>
                          </tr>
                          <tr className="text-white/30 text-xs">
                            <th></th>
                            {periods.map((p) => (
                              <React.Fragment key={`header-${p.period}`}>
                                <th className="text-center">{lastMatch.homeTeam.shortName}</th>
                                <th className="text-center">{lastMatch.awayTeam.shortName}</th>
                              </React.Fragment>
                            ))}
                            <th className="text-center">{lastMatch.homeTeam.shortName}</th>
                            <th className="text-center">{lastMatch.awayTeam.shortName}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-white/10">
                            <td className="py-3">Góly</td>
                            {periods.map((p) => (
                              <React.Fragment key={`goals-${p.period}`}>
                                <td className="text-center font-bold">{p.homeScore}</td>
                                <td className="text-center font-bold">{p.awayScore}</td>
                              </React.Fragment>
                            ))}
                            <td className="text-center font-bold text-accent">{lastMatch.homeScore}</td>
                            <td className="text-center font-bold text-accent">{lastMatch.awayScore}</td>
                          </tr>
                          <tr className="border-t border-white/10">
                            <td className="py-3">Střely</td>
                            {matchDetails.periodsWithShots.map((p) => (
                              <React.Fragment key={`shots-${p.period}`}>
                                <td className="text-center">{p.homeShots}</td>
                                <td className="text-center">{p.awayShots}</td>
                              </React.Fragment>
                            ))}
                            <td className="text-center font-bold">{totalHomeShots}</td>
                            <td className="text-center font-bold">{totalAwayShots}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Expand/Collapse Button */}
          <div className="border-t border-white/10 p-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-medium"
            >
              {expanded ? (
                <>
                  Skrýt detaily
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Zobrazit detaily zápasu
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
