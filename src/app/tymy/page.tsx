import Link from "next/link";
import { teams, standings } from "@/data";

export default function TeamsPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Týmy</h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Přehled všech týmů účastnících se Blatské Hokejové Ligy Amatérů
          </p>
        </div>

        {/* Standings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="bg-primary text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Tabulka sezóny 2025/2026</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Tým</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">Z</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">V</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">P</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">VG</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">OG</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {standings.map((team) => (
                  <tr key={team.id} className={team.position <= 3 ? "bg-green-50" : ""}>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${team.position <= 3 ? "text-green-600" : "text-secondary"}`}>
                        {team.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/tymy/${team.id}`} className="flex items-center space-x-3 hover:opacity-80">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.shortName.slice(0, 2)}
                        </div>
                        <span className="font-medium text-primary">{team.name}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center text-secondary">{team.stats.played}</td>
                    <td className="px-6 py-4 text-center text-green-600 font-medium">{team.stats.wins}</td>
                    <td className="px-6 py-4 text-center text-red-600 font-medium">{team.stats.losses}</td>
                    <td className="px-6 py-4 text-center text-secondary">{team.stats.goalsFor}</td>
                    <td className="px-6 py-4 text-center text-secondary">{team.stats.goalsAgainst}</td>
                    <td className="px-6 py-4 text-center font-bold text-primary">{team.stats.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teams Grid */}
        <h2 className="text-2xl font-bold text-primary mb-6">Profily týmů</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/tymy/${team.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="h-24 flex items-center justify-center"
                style={{ backgroundColor: team.color }}
              >
                <span className="text-4xl font-bold text-white">{team.shortName}</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-primary mb-1">{team.name}</h3>
                <p className="text-sm text-secondary mb-3">Založeno: {team.founded}</p>
                <p className="text-sm text-secondary line-clamp-2">{team.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
