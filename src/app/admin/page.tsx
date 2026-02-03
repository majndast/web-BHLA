"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const quickActions = [
  {
    title: "Zapsat zápas",
    description: "Zadat výsledek odehraného utkání",
    href: "/admin/zapasy/novy",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    color: "bg-accent",
  },
  {
    title: "Naplánovat zápas",
    description: "Přidat do kalendáře budoucí utkání",
    href: "/admin/zapasy/novy?type=scheduled",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "bg-primary",
  },
  {
    title: "Správa týmů",
    description: "Hráči, soupisky, statistiky",
    href: "/admin/tymy",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    color: "bg-green-600",
  },
  {
    title: "Přidat novinku",
    description: "Napsat nový článek na web",
    href: "/admin/novinky/nova",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    color: "bg-blue-600",
  },
  {
    title: "Galerie",
    description: "Nahrát fotky z utkání",
    href: "/admin/galerie",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "bg-purple-600",
  },
  {
    title: "Nastavení",
    description: "Účty, zálohy, konfigurace",
    href: "/admin/nastaveni",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    color: "bg-gray-600",
  },
];

interface Stats {
  playedMatches: number;
  scheduledMatches: number;
  teams: number;
  players: number;
}

interface RecentActivity {
  id: string;
  type: "match" | "team" | "player";
  description: string;
  date: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    playedMatches: 0,
    scheduledMatches: 0,
    teams: 0,
    players: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        { count: playedMatches },
        { count: scheduledMatches },
        { count: teams },
        { count: players },
        { data: recentMatches },
      ] = await Promise.all([
        supabase.from("matches").select("*", { count: "exact", head: true }).eq("status", "finished"),
        supabase.from("matches").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
        supabase.from("teams").select("*", { count: "exact", head: true }),
        supabase.from("players").select("*", { count: "exact", head: true }),
        supabase
          .from("matches")
          .select(`
            id,
            date,
            status,
            home_team:teams!matches_home_team_id_fkey(name, short_name),
            away_team:teams!matches_away_team_id_fkey(name, short_name)
          `)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        playedMatches: playedMatches || 0,
        scheduledMatches: scheduledMatches || 0,
        teams: teams || 0,
        players: players || 0,
      });

      // Format recent activity
      if (recentMatches) {
        const activity: RecentActivity[] = recentMatches.map((match: any) => ({
          id: match.id,
          type: "match" as const,
          description: `${match.status === "finished" ? "Odehrán" : "Naplánován"} zápas ${match.home_team?.short_name || "?"} vs ${match.away_team?.short_name || "?"}`,
          date: match.date,
        }));
        setRecentActivity(activity);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
    setLoading(false);
  };

  const statItems = [
    { label: "Odehraných zápasů", value: stats.playedMatches, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Naplánovaných", value: stats.scheduledMatches, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Týmů", value: stats.teams, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Hráčů", value: stats.players, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Vítejte v administraci BHLA</h1>
        <p className="text-white/70">Spravujte zápasy, týmy, hráče a obsah webu.</p>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">Rychlé akce</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <h3 className="font-semibold text-primary mb-1">{action.title}</h3>
              <p className="text-sm text-secondary">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats overview */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">Přehled sezóny</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {loading ? (
                      <div className="w-8 h-6 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs text-secondary">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">Poslední aktivita</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {loading ? (
            <div className="p-6 text-center">
              <svg className="animate-spin w-8 h-8 mx-auto text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="p-6 text-center text-secondary">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Zatím žádná aktivita</p>
              <p className="text-xs text-gray-400 mt-1">Po přidání prvních dat se zde zobrazí historie změn</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-primary">{activity.description}</div>
                  <div className="text-xs text-secondary">{new Date(activity.date).toLocaleDateString("cs-CZ")}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
