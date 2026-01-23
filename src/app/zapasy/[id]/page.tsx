import Link from "next/link";

// Demo data - later will be fetched from Supabase
const matchData = {
  id: "1",
  homeTeam: {
    name: "HC Dolní Bukovsko",
    shortName: "BUK",
    color: "#D61F2C",
    logo: null,
  },
  awayTeam: {
    name: "HC Fantom",
    shortName: "FAN",
    color: "#144A86",
    logo: null,
  },
  homeScore: 5,
  awayScore: 3,
  date: "2025-01-18",
  time: "18:00",
  venue: "Zimní stadion Soběslav",
  status: "finished" as const,
  periods: [
    { period: 1, homeScore: 2, awayScore: 1 },
    { period: 2, homeScore: 1, awayScore: 2 },
    { period: 3, homeScore: 2, awayScore: 0 },
  ],
  goals: [
    { time: "05:23", team: "home", scorer: "Pavel Houdek", assist1: "Jan Novák", assist2: "Petr Svoboda", period: 1 },
    { time: "12:45", team: "away", scorer: "Martin Dvořák", assist1: "Tomáš Černý", period: 1 },
    { time: "18:30", team: "home", scorer: "Jan Novák", assist1: "Pavel Houdek", period: 1 },
    { time: "25:10", team: "away", scorer: "Jakub Král", assist1: "David Procházka", assist2: "Martin Dvořák", period: 2 },
    { time: "32:00", team: "home", scorer: "Lukáš Veselý", period: 2 },
    { time: "38:55", team: "away", scorer: "Tomáš Černý", assist1: "Jakub Král", period: 2 },
    { time: "45:20", team: "home", scorer: "Pavel Houdek", assist1: "Lukáš Veselý", assist2: "Jan Novák", period: 3 },
    { time: "58:30", team: "home", scorer: "Jan Novák", assist1: "Pavel Houdek", period: 3 },
  ],
  penalties: [
    { time: "08:15", team: "home", player: "Petr Svoboda", minutes: 2, reason: "Podražení", period: 1 },
    { time: "28:40", team: "away", player: "David Procházka", minutes: 2, reason: "Hákování", period: 2 },
    { time: "52:10", team: "home", player: "Martin Horák", minutes: 2, reason: "Držení", period: 3 },
  ],
  rosters: {
    home: [
      { number: 1, name: "Jakub Krtek", position: "B" },
      { number: 4, name: "Martin Horák", position: "O" },
      { number: 7, name: "Petr Svoboda", position: "O" },
      { number: 10, name: "Jan Novák", position: "Ú" },
      { number: 14, name: "Pavel Houdek", position: "Ú" },
      { number: 21, name: "Lukáš Veselý", position: "Ú" },
    ],
    away: [
      { number: 33, name: "Ondřej Malý", position: "B" },
      { number: 3, name: "Tomáš Černý", position: "O" },
      { number: 5, name: "David Procházka", position: "O" },
      { number: 9, name: "Jakub Král", position: "Ú" },
      { number: 11, name: "Martin Dvořák", position: "Ú" },
      { number: 17, name: "Filip Novotný", position: "Ú" },
    ],
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MatchDetailPage() {
  const match = matchData;

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/zapasy"
          className="inline-flex items-center text-secondary hover:text-primary mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na zápasy
        </Link>

        {/* Match Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-primary text-white px-6 py-4 text-center">
            <div className="text-sm text-gray-300">{formatDate(match.date)} • {match.time}</div>
            <div className="text-sm mt-1">{match.venue}</div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-center gap-8">
              {/* Home Team */}
              <div className="text-center flex-1">
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
                  style={{ backgroundColor: match.homeTeam.color }}
                >
                  {match.homeTeam.shortName}
                </div>
                <h2 className="text-xl font-bold text-primary">{match.homeTeam.name}</h2>
                <div className="text-sm text-secondary">Domácí</div>
              </div>

              {/* Score */}
              <div className="text-center px-8">
                <div className="text-6xl font-bold text-primary">
                  {match.homeScore} : {match.awayScore}
                </div>
                <div className="text-sm text-secondary mt-2">Konečný výsledek</div>

                {/* Period scores */}
                <div className="flex justify-center gap-4 mt-4">
                  {match.periods.map((period) => (
                    <div key={period.period} className="text-center">
                      <div className="text-xs text-secondary mb-1">{period.period}. třetina</div>
                      <div className="font-semibold text-primary">
                        {period.homeScore}:{period.awayScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Team */}
              <div className="text-center flex-1">
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
                  style={{ backgroundColor: match.awayTeam.color }}
                >
                  {match.awayTeam.shortName}
                </div>
                <h2 className="text-xl font-bold text-primary">{match.awayTeam.name}</h2>
                <div className="text-sm text-secondary">Hosté</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-primary text-white px-6 py-4">
              <h3 className="font-semibold">Průběh utkání - Góly</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((period) => {
                const periodGoals = match.goals.filter((g) => g.period === period);
                if (periodGoals.length === 0) return null;

                return (
                  <div key={period}>
                    <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-secondary">
                      {period}. třetina
                    </div>
                    {periodGoals.map((goal, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-3 flex items-center gap-4 ${
                          goal.team === "home" ? "bg-red-50" : "bg-blue-50"
                        }`}
                      >
                        <div className="text-sm font-mono text-secondary w-12">{goal.time}</div>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              goal.team === "home" ? match.homeTeam.color : match.awayTeam.color,
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-primary">{goal.scorer}</div>
                          <div className="text-sm text-secondary">
                            {goal.assist1 && `(${goal.assist1}`}
                            {goal.assist2 && `, ${goal.assist2}`}
                            {goal.assist1 && ")"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Penalties */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-primary text-white px-6 py-4">
              <h3 className="font-semibold">Tresty</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {match.penalties.length === 0 ? (
                <div className="p-4 text-center text-secondary">Žádné tresty</div>
              ) : (
                match.penalties.map((penalty, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 flex items-center gap-4 ${
                      penalty.team === "home" ? "bg-red-50" : "bg-blue-50"
                    }`}
                  >
                    <div className="text-sm font-mono text-secondary w-12">{penalty.time}</div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          penalty.team === "home" ? match.homeTeam.color : match.awayTeam.color,
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-primary">{penalty.player}</div>
                      <div className="text-sm text-secondary">{penalty.reason}</div>
                    </div>
                    <div className="text-accent font-bold">{penalty.minutes} min</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Rosters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Home Roster */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="px-6 py-4 text-white"
              style={{ backgroundColor: match.homeTeam.color }}
            >
              <h3 className="font-semibold">{match.homeTeam.name} - Soupiska</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {match.rosters.home.map((player) => (
                <div key={player.number} className="px-4 py-3 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
                    {player.number}
                  </div>
                  <div className="flex-1 font-medium text-primary">{player.name}</div>
                  <div className="text-sm text-secondary">{player.position}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Away Roster */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="px-6 py-4 text-white"
              style={{ backgroundColor: match.awayTeam.color }}
            >
              <h3 className="font-semibold">{match.awayTeam.name} - Soupiska</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {match.rosters.away.map((player) => (
                <div key={player.number} className="px-4 py-3 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
                    {player.number}
                  </div>
                  <div className="flex-1 font-medium text-primary">{player.name}</div>
                  <div className="text-sm text-secondary">{player.position}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
