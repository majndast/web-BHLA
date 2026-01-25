"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Match {
  id: string;
  date: string;
  time: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  home_team: { name: string; short_name: string; color: string };
  away_team: { name: string; short_name: string; color: string };
  venue: { name: string } | null;
}

export default function MatchesAdminPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "scheduled" | "finished">("all");
  const supabase = createClient();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        time,
        status,
        home_score,
        away_score,
        home_team:teams!matches_home_team_id_fkey(name, short_name, color),
        away_team:teams!matches_away_team_id_fkey(name, short_name, color),
        venue:venues(name)
      `)
      .order("date", { ascending: false });

    if (!error && data) {
      setMatches(data as unknown as Match[]);
    }
    setLoading(false);
  };

  const filteredMatches = matches.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Zápasy</h1>
          <p className="text-secondary">Správa zápasů a výsledků</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/zapasy/novy?type=scheduled"
            className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Naplánovat zápas
          </Link>
          <Link
            href="/admin/zapasy/novy"
            className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Zapsat výsledek
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "Všechny" },
          { key: "scheduled", label: "Naplánované" },
          { key: "finished", label: "Odehrané" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as typeof filter)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === item.key
                ? "bg-primary text-white"
                : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Matches list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <svg className="animate-spin w-8 h-8 mx-auto text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-secondary mt-2">Načítání...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-secondary">Zatím žádné zápasy</p>
            <Link
              href="/admin/zapasy/novy"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover mt-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Přidat první zápas
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMatches.map((match) => (
              <Link
                key={match.id}
                href={`/admin/zapasy/${match.id}`}
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Date */}
                  <div className="text-center w-20">
                    <div className="text-sm font-semibold text-primary">{formatDate(match.date)}</div>
                    <div className="text-xs text-secondary">{match.time}</div>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: match.home_team?.color || "#0B1F3B" }}
                    >
                      {match.home_team?.short_name?.slice(0, 2) || "?"}
                    </div>
                    <span className="font-medium text-primary">{match.home_team?.short_name || "?"}</span>

                    {match.status === "finished" ? (
                      <span className="mx-2 font-bold text-lg">
                        {match.home_score} : {match.away_score}
                      </span>
                    ) : (
                      <span className="mx-2 text-secondary">vs</span>
                    )}

                    <span className="font-medium text-primary">{match.away_team?.short_name || "?"}</span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: match.away_team?.color || "#0B1F3B" }}
                    >
                      {match.away_team?.short_name?.slice(0, 2) || "?"}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:block">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        match.status === "finished"
                          ? "bg-green-100 text-green-700"
                          : match.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {match.status === "finished" ? "Odehráno" : match.status === "cancelled" ? "Zrušeno" : "Naplánováno"}
                    </span>
                  </div>
                </div>

                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
