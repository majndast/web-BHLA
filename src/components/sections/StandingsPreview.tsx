"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface TeamStanding {
  id: string;
  name: string;
  short_name: string;
  color: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
}

export default function StandingsPreview() {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      // Fetch teams
      const { data: teams } = await supabase
        .from("teams")
        .select("id, name, short_name, color");

      if (!teams || teams.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch all finished matches
      const { data: matches } = await supabase
        .from("matches")
        .select("home_team_id, away_team_id, home_score, away_score, has_overtime, has_shootout")
        .eq("status", "finished");

      // Calculate standings
      const teamStats: Record<string, { wins: number; losses: number; otWins: number; otLosses: number; played: number }> = {};

      teams.forEach((team) => {
        teamStats[team.id] = { wins: 0, losses: 0, otWins: 0, otLosses: 0, played: 0 };
      });

      if (matches) {
        matches.forEach((match) => {
          const homeId = match.home_team_id;
          const awayId = match.away_team_id;
          const homeScore = match.home_score || 0;
          const awayScore = match.away_score || 0;
          const isOT = match.has_overtime || match.has_shootout;

          if (teamStats[homeId]) teamStats[homeId].played++;
          if (teamStats[awayId]) teamStats[awayId].played++;

          if (homeScore > awayScore) {
            // Home wins
            if (isOT) {
              if (teamStats[homeId]) teamStats[homeId].otWins++;
              if (teamStats[awayId]) teamStats[awayId].otLosses++;
            } else {
              if (teamStats[homeId]) teamStats[homeId].wins++;
              if (teamStats[awayId]) teamStats[awayId].losses++;
            }
          } else {
            // Away wins
            if (isOT) {
              if (teamStats[awayId]) teamStats[awayId].otWins++;
              if (teamStats[homeId]) teamStats[homeId].otLosses++;
            } else {
              if (teamStats[awayId]) teamStats[awayId].wins++;
              if (teamStats[homeId]) teamStats[homeId].losses++;
            }
          }
        });
      }

      // Calculate points and create standings
      // 3 points for win, 2 for OT win, 1 for OT loss, 0 for loss
      const standingsData: TeamStanding[] = teams.map((team) => {
        const stats = teamStats[team.id];
        const points = stats.wins * 3 + stats.otWins * 2 + stats.otLosses * 1;
        return {
          id: team.id,
          name: team.name,
          short_name: team.short_name,
          color: team.color,
          played: stats.played,
          wins: stats.wins + stats.otWins,
          losses: stats.losses + stats.otLosses,
          points,
        };
      });

      // Sort by points (desc), then by wins (desc)
      standingsData.sort((a, b) => b.points - a.points || b.wins - a.wins);

      setStandings(standingsData);
    } catch (error) {
      console.error("Error fetching standings:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-8">
        <div className="flex justify-center">
          <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-8 text-center">
        <p className="text-secondary">Zatím žádné týmy</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-semibold">Tabulka ligy</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-100">
        {standings.map((team, index) => (
          <Link
            key={team.id}
            href={`/tymy/${team.id}`}
            className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
              index < 3 ? "bg-gradient-to-r from-green-50/50 to-transparent" : ""
            }`}
          >
            {/* Position */}
            <div className="w-8">
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  index === 0
                    ? "bg-yellow-400 text-yellow-900"
                    : index === 1
                    ? "bg-gray-300 text-gray-700"
                    : index === 2
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {index + 1}
              </span>
            </div>

            {/* Team */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: team.color }}
              >
                {team.short_name.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-primary text-sm truncate">{team.short_name}</div>
                <div className="text-xs text-secondary hidden sm:block">{team.wins}V</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-secondary">Z</div>
                <div className="text-sm text-primary">{team.played}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-secondary">B</div>
                <div className="text-lg font-bold text-accent">{team.points}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3 bg-gray-50">
        <Link href="/tymy" className="flex items-center justify-between text-xs text-secondary hover:text-primary">
          <span>Kompletní statistiky</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
