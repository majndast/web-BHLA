"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Match {
  id: string;
  date: string;
  time: string;
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

export default function UpcomingMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { data } = await supabase
        .from("matches")
        .select(`
          id,
          date,
          time,
          home_team:teams!matches_home_team_id_fkey(id, name, short_name, color),
          away_team:teams!matches_away_team_id_fkey(id, name, short_name, color),
          venue:venues(id, name)
        `)
        .eq("status", "scheduled")
        .gte("date", today)
        .order("date", { ascending: true })
        .order("time", { ascending: true })
        .limit(3);

      if (data) {
        setMatches(data as unknown as Match[]);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-secondary">Žádné naplánované zápasy</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Teams */}
              <div className="flex items-center flex-1 gap-3">
                {/* Home Team */}
                <Link
                  href={`/tymy/${match.home_team?.id}`}
                  className="flex items-center gap-2 flex-1 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: match.home_team?.color || "#333" }}
                  >
                    {match.home_team?.short_name || "?"}
                  </div>
                  <span className="font-semibold text-primary group-hover:text-accent transition-colors hidden sm:block">
                    {match.home_team?.name || "Neznámý"}
                  </span>
                  <span className="font-semibold text-primary group-hover:text-accent transition-colors sm:hidden">
                    {match.home_team?.short_name || "?"}
                  </span>
                </Link>

                {/* VS Badge */}
                <div className="flex flex-col items-center px-4">
                  <div className="text-xs text-secondary font-medium">VS</div>
                  <div className="text-lg font-bold text-accent">{match.time}</div>
                </div>

                {/* Away Team */}
                <Link
                  href={`/tymy/${match.away_team?.id}`}
                  className="flex items-center gap-2 flex-1 justify-end group"
                >
                  <span className="font-semibold text-primary group-hover:text-accent transition-colors hidden sm:block">
                    {match.away_team?.name || "Neznámý"}
                  </span>
                  <span className="font-semibold text-primary group-hover:text-accent transition-colors sm:hidden">
                    {match.away_team?.short_name || "?"}
                  </span>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: match.away_team?.color || "#333" }}
                  >
                    {match.away_team?.short_name || "?"}
                  </div>
                </Link>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 md:ml-4">
                <div className="text-center md:text-right">
                  <div className="text-sm font-semibold text-primary">{formatDate(match.date)}</div>
                  {match.venue && (
                    <div className="text-xs text-secondary">{match.venue.name}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
