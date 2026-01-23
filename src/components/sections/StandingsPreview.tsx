import Link from "next/link";

// Demo data - skutečné týmy BHLA
const standings = [
  { position: 1, team: "HC Dolní Bukovsko", shortName: "BUK", color: "#D61F2C", played: 17, wins: 12, points: 36 },
  { position: 2, team: "HC Fantom", shortName: "FAN", color: "#144A86", played: 17, wins: 11, points: 33 },
  { position: 3, team: "HC Roudné", shortName: "ROU", color: "#2E7D32", played: 17, wins: 10, points: 30 },
  { position: 4, team: "HC Kostelec", shortName: "KOS", color: "#FF9800", played: 17, wins: 9, points: 27 },
  { position: 5, team: "HC Hlavatce", shortName: "HLA", color: "#9C27B0", played: 17, wins: 7, points: 21 },
  { position: 6, team: "HC Křída", shortName: "KRI", color: "#0B1F3B", played: 17, wins: 5, points: 15 },
];

export default function StandingsPreview() {
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
          <span className="text-xs text-white/70">17. kolo</span>
        </div>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-100">
        {standings.map((team, index) => (
          <Link
            key={team.shortName}
            href={`/tymy/${index + 1}`}
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
                {team.position}
              </span>
            </div>

            {/* Team */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: team.color }}
              >
                {team.shortName.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-primary text-sm truncate">{team.shortName}</div>
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
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>Kompletní statistiky</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
