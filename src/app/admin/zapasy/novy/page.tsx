"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
  short_name: string;
  color: string;
}

interface Venue {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
  number: number | null;
  team_id: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function NewMatchWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isScheduledOnly = searchParams.get("type") === "scheduled";

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Data from DB
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);

  // Form data
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [venueId, setVenueId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [endType, setEndType] = useState<"regular" | "overtime" | "shootout">("regular");

  const [period1Home, setPeriod1Home] = useState(0);
  const [period1Away, setPeriod1Away] = useState(0);
  const [period2Home, setPeriod2Home] = useState(0);
  const [period2Away, setPeriod2Away] = useState(0);
  const [period3Home, setPeriod3Home] = useState(0);
  const [period3Away, setPeriod3Away] = useState(0);

  const [homeGoalScorers, setHomeGoalScorers] = useState<Record<string, number>>({});
  const [awayGoalScorers, setAwayGoalScorers] = useState<Record<string, number>>({});

  const [publishImmediately, setPublishImmediately] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (homeTeamId) fetchPlayers(homeTeamId, "home");
    if (awayTeamId) fetchPlayers(awayTeamId, "away");
  }, [homeTeamId, awayTeamId]);

  const fetchData = async () => {
    setLoading(true);
    const [teamsRes, venuesRes] = await Promise.all([
      supabase.from("teams").select("*").order("name"),
      supabase.from("venues").select("*").order("name"),
    ]);

    if (teamsRes.data) setTeams(teamsRes.data);
    if (venuesRes.data) setVenues(venuesRes.data);
    setLoading(false);
  };

  const fetchPlayers = async (teamId: string, side: "home" | "away") => {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", teamId)
      .eq("is_active", true)
      .order("number");

    if (data) {
      if (side === "home") setHomePlayers(data);
      else setAwayPlayers(data);
    }
  };

  const homeTeam = teams.find((t) => t.id === homeTeamId);
  const awayTeam = teams.find((t) => t.id === awayTeamId);

  const periodSum = period1Home + period2Home + period3Home;
  const periodSumAway = period1Away + period2Away + period3Away;
  const periodsValid = periodSum === homeScore && periodSumAway === awayScore;

  const homeGoalsAssigned = Object.values(homeGoalScorers).reduce((a, b) => a + b, 0);
  const awayGoalsAssigned = Object.values(awayGoalScorers).reduce((a, b) => a + b, 0);

  const canProceed = () => {
    switch (step) {
      case 1:
        return homeTeamId && awayTeamId && homeTeamId !== awayTeamId && date && time;
      case 2:
        return true; // Score is always valid (can be 0)
      case 3:
        return periodsValid;
      case 4:
        return true; // Goal scorers are optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      // Insert match
      const { data: match, error: matchError } = await supabase
        .from("matches")
        .insert({
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
          venue_id: venueId || null,
          date,
          time,
          status: isScheduledOnly ? "scheduled" : "finished",
          home_score: isScheduledOnly ? null : homeScore,
          away_score: isScheduledOnly ? null : awayScore,
          period_1_home: isScheduledOnly ? null : period1Home,
          period_1_away: isScheduledOnly ? null : period1Away,
          period_2_home: isScheduledOnly ? null : period2Home,
          period_2_away: isScheduledOnly ? null : period2Away,
          period_3_home: isScheduledOnly ? null : period3Home,
          period_3_away: isScheduledOnly ? null : period3Away,
          has_overtime: endType === "overtime",
          has_shootout: endType === "shootout",
          is_published: publishImmediately,
        })
        .select()
        .single();

      if (matchError) throw matchError;

      // Insert goals if not scheduled only
      if (!isScheduledOnly && match) {
        const goals = [];

        // Home team goals
        for (const [playerId, count] of Object.entries(homeGoalScorers)) {
          for (let i = 0; i < count; i++) {
            goals.push({
              match_id: match.id,
              team_id: homeTeamId,
              scorer_id: playerId,
            });
          }
        }

        // Away team goals
        for (const [playerId, count] of Object.entries(awayGoalScorers)) {
          for (let i = 0; i < count; i++) {
            goals.push({
              match_id: match.id,
              team_id: awayTeamId,
              scorer_id: playerId,
            });
          }
        }

        if (goals.length > 0) {
          await supabase.from("goals").insert(goals);
        }
      }

      router.push("/admin/zapasy");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Něco se pokazilo";
      setError(message);
    }

    setSaving(false);
  };

  const totalSteps = isScheduledOnly ? 2 : 5;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-lg font-semibold text-primary mb-2">Nejdříve přidejte týmy</h2>
        <p className="text-secondary mb-4">Pro vytvoření zápasu potřebujete mít v systému alespoň 2 týmy.</p>
        <Link
          href="/admin/tymy"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg"
        >
          Přejít na správu týmů
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/zapasy" className="text-secondary hover:text-primary text-sm flex items-center gap-1 mb-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na zápasy
        </Link>
        <h1 className="text-2xl font-bold text-primary">
          {isScheduledOnly ? "Naplánovat zápas" : "Zapsat výsledek zápasu"}
        </h1>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">Krok {step} z {totalSteps}</span>
          <span className="text-sm text-secondary">
            {step === 1 && "Výběr týmů"}
            {step === 2 && (isScheduledOnly ? "Shrnutí" : "Výsledek")}
            {step === 3 && "Třetiny"}
            {step === 4 && "Střelci"}
            {step === 5 && "Shrnutí"}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Step 1: Select teams */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-primary">Vyber týmy a termín</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home team */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Domácí tým</label>
                <div className="grid grid-cols-2 gap-2">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => setHomeTeamId(team.id)}
                      disabled={team.id === awayTeamId}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        homeTeamId === team.id
                          ? "border-accent bg-accent/5"
                          : team.id === awayTeamId
                          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-1"
                        style={{ backgroundColor: team.color }}
                      >
                        {team.short_name.slice(0, 2)}
                      </div>
                      <div className="text-sm font-medium text-primary truncate">{team.short_name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Away team */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Hosté</label>
                <div className="grid grid-cols-2 gap-2">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => setAwayTeamId(team.id)}
                      disabled={team.id === homeTeamId}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        awayTeamId === team.id
                          ? "border-accent bg-accent/5"
                          : team.id === homeTeamId
                          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-1"
                        style={{ backgroundColor: team.color }}
                      >
                        {team.short_name.slice(0, 2)}
                      </div>
                      <div className="text-sm font-medium text-primary truncate">{team.short_name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date, time, venue */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Datum</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Čas</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Místo</label>
                <select
                  value={venueId}
                  onChange={(e) => setVenueId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                >
                  <option value="">Vyberte...</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>{venue.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Score */}
        {step === 2 && !isScheduledOnly && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-primary">Výsledek zápasu</h2>

            <div className="flex items-center justify-center gap-8 py-8">
              {/* Home */}
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
                  style={{ backgroundColor: homeTeam?.color }}
                >
                  {homeTeam?.short_name}
                </div>
                <div className="text-sm text-secondary mb-2">Domácí</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </button>
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-primary">
                    {homeScore}
                  </div>
                  <button
                    onClick={() => setHomeScore(homeScore + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-4xl font-bold text-secondary">:</div>

              {/* Away */}
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
                  style={{ backgroundColor: awayTeam?.color }}
                >
                  {awayTeam?.short_name}
                </div>
                <div className="text-sm text-secondary mb-2">Hosté</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </button>
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-primary">
                    {awayScore}
                  </div>
                  <button
                    onClick={() => setAwayScore(awayScore + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* End type */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-primary mb-3">Jak zápas skončil?</label>
              <div className="flex gap-3">
                {[
                  { key: "regular", label: "V základní hrací době" },
                  { key: "overtime", label: "Po prodloužení" },
                  { key: "shootout", label: "Po nájezdech" },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setEndType(option.key as typeof endType)}
                    className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      endType === option.key
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-gray-200 text-secondary hover:border-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 for scheduled only - Summary */}
        {step === 2 && isScheduledOnly && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-primary">Shrnutí</h2>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: homeTeam?.color }}
                >
                  {homeTeam?.short_name}
                </div>
                <span className="text-2xl font-bold text-secondary">vs</span>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: awayTeam?.color }}
                >
                  {awayTeam?.short_name}
                </div>
              </div>
              <div className="text-primary font-semibold">
                {new Date(date).toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div className="text-secondary">{time}</div>
              {venueId && <div className="text-secondary text-sm mt-1">{venues.find(v => v.id === venueId)?.name}</div>}
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishImmediately}
                  onChange={(e) => setPublishImmediately(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-primary">Zveřejnit na webu</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Periods */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-primary">Góly po třetinách</h2>
            <p className="text-secondary text-sm">Celkové skóre: {homeScore}:{awayScore}</p>

            <div className="space-y-4">
              {[
                { label: "1. třetina", home: period1Home, away: period1Away, setHome: setPeriod1Home, setAway: setPeriod1Away },
                { label: "2. třetina", home: period2Home, away: period2Away, setHome: setPeriod2Home, setAway: setPeriod2Away },
                { label: "3. třetina", home: period3Home, away: period3Away, setHome: setPeriod3Home, setAway: setPeriod3Away },
              ].map((period) => (
                <div key={period.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-24 text-sm font-medium text-primary">{period.label}</div>
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: homeTeam?.color }}
                    >
                      {homeTeam?.short_name.slice(0, 2)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => period.setHome(Math.max(0, period.home - 1))}
                        className="w-8 h-8 rounded bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-lg font-bold">
                        {period.home}
                      </div>
                      <button
                        onClick={() => period.setHome(period.home + 1)}
                        className="w-8 h-8 rounded bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xl font-bold text-secondary">:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => period.setAway(Math.max(0, period.away - 1))}
                        className="w-8 h-8 rounded bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-lg font-bold">
                        {period.away}
                      </div>
                      <button
                        onClick={() => period.setAway(period.away + 1)}
                        className="w-8 h-8 rounded bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: awayTeam?.color }}
                    >
                      {awayTeam?.short_name.slice(0, 2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Validation */}
            <div className={`p-4 rounded-xl ${periodsValid ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {periodsValid ? (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Součet sedí: {period1Home}+{period2Home}+{period3Home} = {periodSum} | {period1Away}+{period2Away}+{period3Away} = {periodSumAway}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Součet nesedí: {periodSum} ≠ {homeScore} nebo {periodSumAway} ≠ {awayScore}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Goal scorers */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">Střelci gólů</h2>
              <button
                onClick={() => setStep(5)}
                className="text-secondary hover:text-primary text-sm"
              >
                Přeskočit →
              </button>
            </div>

            {/* Home team */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: homeTeam?.color }}
                >
                  {homeTeam?.short_name.slice(0, 2)}
                </div>
                <span className="font-medium text-primary">{homeTeam?.name}</span>
                <span className="text-secondary text-sm">({homeGoalsAssigned}/{homeScore} gólů)</span>
              </div>
              {homePlayers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {homePlayers.map((player) => (
                    <div key={player.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-sm font-medium text-primary mb-2">
                        {player.number && `#${player.number} `}{player.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setHomeGoalScorers(prev => ({
                            ...prev,
                            [player.id]: Math.max(0, (prev[player.id] || 0) - 1)
                          }))}
                          className="w-8 h-8 rounded bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                        >
                          -
                        </button>
                        <div className="w-10 h-8 rounded bg-white border border-gray-200 flex items-center justify-center font-bold text-accent">
                          {homeGoalScorers[player.id] || 0}
                        </div>
                        <button
                          onClick={() => setHomeGoalScorers(prev => ({
                            ...prev,
                            [player.id]: (prev[player.id] || 0) + 1
                          }))}
                          className="w-8 h-8 rounded bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-sm">Žádní hráči v týmu. <Link href={`/admin/hraci?team=${homeTeamId}`} className="text-accent">Přidat hráče</Link></p>
              )}
            </div>

            {/* Away team */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: awayTeam?.color }}
                >
                  {awayTeam?.short_name.slice(0, 2)}
                </div>
                <span className="font-medium text-primary">{awayTeam?.name}</span>
                <span className="text-secondary text-sm">({awayGoalsAssigned}/{awayScore} gólů)</span>
              </div>
              {awayPlayers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {awayPlayers.map((player) => (
                    <div key={player.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-sm font-medium text-primary mb-2">
                        {player.number && `#${player.number} `}{player.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setAwayGoalScorers(prev => ({
                            ...prev,
                            [player.id]: Math.max(0, (prev[player.id] || 0) - 1)
                          }))}
                          className="w-8 h-8 rounded bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                        >
                          -
                        </button>
                        <div className="w-10 h-8 rounded bg-white border border-gray-200 flex items-center justify-center font-bold text-accent">
                          {awayGoalScorers[player.id] || 0}
                        </div>
                        <button
                          onClick={() => setAwayGoalScorers(prev => ({
                            ...prev,
                            [player.id]: (prev[player.id] || 0) + 1
                          }))}
                          className="w-8 h-8 rounded bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-sm">Žádní hráči v týmu. <Link href={`/admin/hraci?team=${awayTeamId}`} className="text-accent">Přidat hráče</Link></p>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-primary">Shrnutí zápasu</h2>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: homeTeam?.color }}
                >
                  {homeTeam?.short_name}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{homeScore} : {awayScore}</div>
                  <div className="text-sm text-secondary mt-1">
                    ({period1Home}:{period1Away}, {period2Home}:{period2Away}, {period3Home}:{period3Away})
                  </div>
                </div>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: awayTeam?.color }}
                >
                  {awayTeam?.short_name}
                </div>
              </div>
              <div className="text-center text-secondary">
                {new Date(date).toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} • {time}
                {venueId && <> • {venues.find(v => v.id === venueId)?.name}</>}
              </div>
              {endType !== "regular" && (
                <div className="text-center text-sm text-secondary mt-2">
                  {endType === "overtime" ? "Po prodloužení" : "Po nájezdech"}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishImmediately}
                  onChange={(e) => setPublishImmediately(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <div>
                  <div className="font-medium text-primary">Zveřejnit na webu</div>
                  <div className="text-sm text-secondary">Výsledek se ihned zobrazí návštěvníkům</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <div>
                  <div className="font-medium text-primary">Odeslat notifikaci</div>
                  <div className="text-sm text-secondary">Informovat odběratele o výsledku</div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => step > 1 ? setStep((step - 1) as Step) : router.push("/admin/zapasy")}
          className="px-6 py-3 border border-gray-200 rounded-xl text-primary hover:bg-gray-50 transition-colors"
        >
          ← {step === 1 ? "Zrušit" : "Zpět"}
        </button>

        {(isScheduledOnly ? step < 2 : step < 5) ? (
          <button
            onClick={() => setStep((step + 1) as Step)}
            disabled={!canProceed()}
            className="px-6 py-3 bg-accent hover:bg-accent-hover disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
          >
            Pokračovat →
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Ukládám...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Uložit {isScheduledOnly ? "zápas" : "a zveřejnit"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
