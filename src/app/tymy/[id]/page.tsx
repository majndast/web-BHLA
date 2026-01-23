import Link from "next/link";

// Demo data - later will be fetched from Supabase
const teamData = {
  id: "1",
  name: "HC Dolní Bukovsko",
  shortName: "BUK",
  color: "#D61F2C",
  founded: 2010,
  description: "HC Dolní Bukovsko je jedním ze zakládajících členů Blatské Hokejové Ligy Amatérů. Tým je známý svou bojovností a skvělou atmosférou v kabině.",
  history: "Tým byl založen v roce 2010 partou kamarádů z Dolního Bukovska a okolí, kteří se rozhodli spojit svou vášeň pro hokej. Od té doby se pravidelně účastní BHLA a patří mezi nejstabilnější týmy ligy.",
  homeVenue: "Zimní stadion Soběslav",
  stats: {
    played: 12,
    wins: 9,
    losses: 3,
    goalsFor: 45,
    goalsAgainst: 22,
    points: 28,
  },
  roster: [
    { id: "1", number: 1, firstName: "Jakub", lastName: "Krtek", position: "brankář", goals: 0, assists: 1, points: 1 },
    { id: "2", number: 4, firstName: "Martin", lastName: "Horák", position: "obránce", goals: 2, assists: 8, points: 10 },
    { id: "3", number: 7, firstName: "Petr", lastName: "Svoboda", position: "obránce", goals: 3, assists: 7, points: 10 },
    { id: "4", number: 10, firstName: "Jan", lastName: "Novák", position: "útočník", goals: 15, assists: 10, points: 25 },
    { id: "5", number: 14, firstName: "Pavel", lastName: "Houdek", position: "útočník", goals: 12, assists: 11, points: 23 },
    { id: "6", number: 21, firstName: "Lukáš", lastName: "Veselý", position: "útočník", goals: 8, assists: 5, points: 13 },
    { id: "7", number: 8, firstName: "David", lastName: "Procházka", position: "obránce", goals: 1, assists: 6, points: 7 },
    { id: "8", number: 19, firstName: "Filip", lastName: "Novotný", position: "útočník", goals: 4, assists: 7, points: 11 },
  ],
  recentMatches: [
    { id: "1", opponent: "HC Fantom", homeGame: true, score: "5:3", result: "win", date: "2025-01-18" },
    { id: "2", opponent: "HC Roudné", homeGame: false, score: "2:4", result: "loss", date: "2025-01-12" },
    { id: "3", opponent: "HC Kostelec", homeGame: true, score: "6:2", result: "win", date: "2025-01-05" },
  ],
};

export default function TeamDetailPage() {
  const team = teamData;

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/tymy"
          className="inline-flex items-center text-secondary hover:text-primary mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na týmy
        </Link>

        {/* Team Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div
            className="h-32 flex items-center justify-center"
            style={{ backgroundColor: team.color }}
          >
            <span className="text-6xl font-bold text-white">{team.shortName}</span>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary">{team.name}</h1>
                <p className="text-secondary mt-1">Založeno: {team.founded} • {team.homeVenue}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{team.stats.points}</div>
                  <div className="text-sm text-secondary">Bodů</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{team.stats.wins}</div>
                  <div className="text-sm text-secondary">Výher</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{team.stats.losses}</div>
                  <div className="text-sm text-secondary">Proher</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">O týmu</h2>
            <p className="text-secondary leading-relaxed">{team.description}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Historie</h2>
            <p className="text-secondary leading-relaxed">{team.history}</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Statistiky sezóny</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-light rounded-lg">
              <div className="text-2xl font-bold text-primary">{team.stats.played}</div>
              <div className="text-sm text-secondary">Zápasů</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{team.stats.wins}</div>
              <div className="text-sm text-secondary">Výher</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{team.stats.losses}</div>
              <div className="text-sm text-secondary">Proher</div>
            </div>
            <div className="text-center p-4 bg-light rounded-lg">
              <div className="text-2xl font-bold text-primary">{team.stats.goalsFor}</div>
              <div className="text-sm text-secondary">Vstřelené góly</div>
            </div>
            <div className="text-center p-4 bg-light rounded-lg">
              <div className="text-2xl font-bold text-primary">{team.stats.goalsAgainst}</div>
              <div className="text-sm text-secondary">Obdržené góly</div>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">{team.stats.goalsFor - team.stats.goalsAgainst}</div>
              <div className="text-sm text-secondary">Skóre +/-</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roster */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="px-6 py-4 text-white"
              style={{ backgroundColor: team.color }}
            >
              <h2 className="font-semibold text-lg">Soupiska</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase">Hráč</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase">Pozice</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-secondary uppercase">G</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-secondary uppercase">A</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-secondary uppercase">B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {team.roster.sort((a, b) => b.points - a.points).map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                          {player.number}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/hraci/${player.id}`} className="font-medium text-primary hover:text-accent">
                          {player.firstName} {player.lastName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-secondary capitalize">{player.position}</td>
                      <td className="px-4 py-3 text-center font-medium text-green-600">{player.goals}</td>
                      <td className="px-4 py-3 text-center font-medium text-blue-600">{player.assists}</td>
                      <td className="px-4 py-3 text-center font-bold text-primary">{player.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-primary px-6 py-4 text-white">
              <h2 className="font-semibold text-lg">Poslední zápasy</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {team.recentMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/zapasy/${match.id}`}
                  className="block px-4 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-secondary">
                        {match.homeGame ? "Doma" : "Venku"} vs
                      </div>
                      <div className="font-medium text-primary">{match.opponent}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        match.result === "win" ? "text-green-600" : "text-red-600"
                      }`}>
                        {match.score}
                      </div>
                      <div className="text-sm text-secondary">
                        {new Date(match.date).toLocaleDateString("cs-CZ")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
