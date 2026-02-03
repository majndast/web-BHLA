"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Match {
  id: string;
  date: string;
  time: string;
  home_score: number;
  away_score: number;
  period_1_home: number | null;
  period_1_away: number | null;
  period_2_home: number | null;
  period_2_away: number | null;
  period_3_home: number | null;
  period_3_away: number | null;
  has_overtime: boolean;
  has_shootout: boolean;
  home_team: {
    id: string;
    name: string;
    short_name: string;
    color: string;
  };
  away_team: {
    id: string;
    name: string;
    short_name: string;
    color: string;
  };
  venue?: {
    id: string;
    name: string;
  };
}

export default function LastMatchSection() {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchLastMatch();
  }, []);

  const fetchLastMatch = async () => {
    try {
      const { data } = await supabase
        .from("matches")
        .select(`
          id,
          date,
          time,
          home_score,
          away_score,
          period_1_home,
          period_1_away,
          period_2_home,
          period_2_away,
          period_3_home,
          period_3_away,
          has_overtime,
          has_shootout,
          home_team:teams!matches_home_team_id_fkey(id, name, short_name, color),
          away_team:teams!matches_away_team_id_fkey(id, name, short_name, color),
          venue:venues(id, name)
        `)
        .eq("status", "finished")
        .order("date", { ascending: false })
        .order("time", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setMatch(data as unknown as Match);
      }
    } catch (error) {
      // No match found is OK
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary via-primary to-primary-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-16">
            <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        </div>
      </section>
    );
  }

  if (!match) {
    return null;
  }

  const periods = [
    { period: 1, homeScore: match.period_1_home, awayScore: match.period_1_away },
    { period: 2, homeScore: match.period_2_home, awayScore: match.period_2_away },
    { period: 3, homeScore: match.period_3_home, awayScore: match.period_3_away },
  ].filter(p => p.homeScore !== null && p.awayScore !== null);

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
              <Link href={`/tymy/${match.home_team?.id}`} className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: match.home_team?.color || "#333" }}
                >
                  {match.home_team?.short_name || "?"}
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">{match.home_team?.name || "Neznámý"}</div>
                  <div className="text-white/60 text-sm">Domácí</div>
                </div>
              </Link>

              {/* Score */}
              <div className="text-center px-8">
                <div className="text-5xl md:text-7xl font-black">
                  <span className={(match.home_score || 0) > (match.away_score || 0) ? "text-accent" : ""}>
                    {match.home_score}
                  </span>
                  <span className="text-white/50 mx-2">:</span>
                  <span className={(match.away_score || 0) > (match.home_score || 0) ? "text-accent" : ""}>
                    {match.away_score}
                  </span>
                </div>
                <div className="text-white/60 text-sm mt-2">
                  {match.has_overtime && "Po prodloužení"}
                  {match.has_shootout && "Po nájezdech"}
                  {!match.has_overtime && !match.has_shootout && "Konečný výsledek"}
                </div>
                {match.venue && (
                  <div className="text-white/40 text-xs mt-1">{match.venue.name}</div>
                )}
              </div>

              {/* Away Team */}
              <Link href={`/tymy/${match.away_team?.id}`} className="flex items-center gap-4 flex-1 justify-end hover:opacity-80 transition-opacity">
                <div className="text-right">
                  <div className="text-xl md:text-2xl font-bold">{match.away_team?.name || "Neznámý"}</div>
                  <div className="text-white/60 text-sm">Hosté</div>
                </div>
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: match.away_team?.color || "#333" }}
                >
                  {match.away_team?.short_name || "?"}
                </div>
              </Link>
            </div>

            {/* Period Scores */}
            {periods.length > 0 && (
              <div className="flex justify-center gap-4 mt-6">
                {periods.map((period) => (
                  <div key={period.period} className="text-center bg-white/5 rounded-lg px-4 py-2">
                    <div className="text-xs text-white/50 mb-1">{period.period}. třetina</div>
                    <div className="font-bold">{period.homeScore}:{period.awayScore}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4">
            <Link
              href={`/zapasy/${match.id}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-medium"
            >
              Zobrazit detaily zápasu
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
