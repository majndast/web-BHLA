import Link from "next/link";

// Demo data
const players = [
  { id: "1", firstName: "Jan", lastName: "Novák", number: 10, position: "útočník", teamId: "1", teamName: "HC Blatná", teamColor: "#D61F2C", stats: { games: 12, goals: 15, assists: 10, points: 25 } },
  { id: "2", firstName: "Petr", lastName: "Svoboda", number: 7, position: "útočník", teamId: "2", teamName: "SK Lední Medvědi", teamColor: "#144A86", stats: { games: 12, goals: 12, assists: 11, points: 23 } },
  { id: "3", firstName: "Martin", lastName: "Dvořák", number: 19, position: "útočník", teamId: "1", teamName: "HC Blatná", teamColor: "#D61F2C", stats: { games: 12, goals: 10, assists: 12, points: 22 } },
  { id: "4", firstName: "Tomáš", lastName: "Černý", number: 4, position: "obránce", teamId: "3", teamName: "TJ Hokej Strakonice", teamColor: "#0B1F3B", stats: { games: 12, goals: 3, assists: 15, points: 18 } },
  { id: "5", firstName: "Pavel", lastName: "Horák", number: 21, position: "útočník", teamId: "4", teamName: "HC Vlci Písek", teamColor: "#2E7D32", stats: { games: 12, goals: 8, assists: 8, points: 16 } },
  { id: "6", firstName: "Jakub", lastName: "Král", number: 1, position: "brankář", teamId: "1", teamName: "HC Blatná", teamColor: "#D61F2C", stats: { games: 10, goals: 0, assists: 1, points: 1 } },
  { id: "7", firstName: "David", lastName: "Procházka", number: 33, position: "brankář", teamId: "2", teamName: "SK Lední Medvědi", teamColor: "#144A86", stats: { games: 11, goals: 0, assists: 0, points: 0 } },
  { id: "8", firstName: "Lukáš", lastName: "Veselý", number: 8, position: "obránce", teamId: "2", teamName: "SK Lední Medvědi", teamColor: "#144A86", stats: { games: 12, goals: 2, assists: 10, points: 12 } },
];

const topScorers = [...players].sort((a, b) => b.stats.points - a.stats.points).slice(0, 10);

export default function PlayersPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Hráči</h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Statistiky a profily hráčů Blatské Hokejové Ligy Amatérů
          </p>
        </div>

        {/* Top Scorers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="bg-primary text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Kanadské bodování</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Hráč</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Tým</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">Z</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">G</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">A</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-secondary uppercase tracking-wider">B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topScorers.map((player, index) => (
                  <tr key={player.id} className={index < 3 ? "bg-yellow-50" : ""}>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${index < 3 ? "text-yellow-600" : "text-secondary"}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/hraci/${player.id}`} className="hover:text-accent">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-primary">
                            {player.number}
                          </div>
                          <div>
                            <div className="font-semibold text-primary">
                              {player.firstName} {player.lastName}
                            </div>
                            <div className="text-xs text-secondary capitalize">{player.position}</div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: player.teamColor }}
                        />
                        <span className="text-sm text-secondary">{player.teamName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-secondary">{player.stats.games}</td>
                    <td className="px-6 py-4 text-center font-medium text-green-600">{player.stats.goals}</td>
                    <td className="px-6 py-4 text-center font-medium text-blue-600">{player.stats.assists}</td>
                    <td className="px-6 py-4 text-center font-bold text-primary">{player.stats.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Players Grid */}
        <h2 className="text-2xl font-bold text-primary mb-6">Všichni hráči</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/hraci/${player.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: player.teamColor }}
                >
                  {player.number}
                </div>
                <div>
                  <div className="font-semibold text-primary">
                    {player.firstName} {player.lastName}
                  </div>
                  <div className="text-sm text-secondary capitalize">{player.position}</div>
                  <div className="text-xs text-secondary">{player.teamName}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-around text-center">
                <div>
                  <div className="text-lg font-bold text-primary">{player.stats.goals}</div>
                  <div className="text-xs text-secondary">Góly</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">{player.stats.assists}</div>
                  <div className="text-xs text-secondary">Asistence</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent">{player.stats.points}</div>
                  <div className="text-xs text-secondary">Body</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
