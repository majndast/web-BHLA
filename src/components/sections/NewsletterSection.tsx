"use client";

import { useState } from "react";

const teams = [
  { id: "1", name: "HC Dolní Bukovsko", shortName: "BUK", color: "#D61F2C" },
  { id: "2", name: "HC Fantom", shortName: "FAN", color: "#144A86" },
  { id: "3", name: "HC Roudné", shortName: "ROU", color: "#2E7D32" },
  { id: "4", name: "HC Kostelec", shortName: "KOS", color: "#FF9800" },
  { id: "5", name: "HC Hlavatce", shortName: "HLA", color: "#9C27B0" },
  { id: "6", name: "HC Křída", shortName: "KRI", color: "#0B1F3B" },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [notifications, setNotifications] = useState({
    matchResults: true,
    upcomingMatches: true,
    news: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleTeam = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-accent/10 via-light to-primary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Jsi v obraze!</h3>
            <p className="text-secondary mb-6">
              Díky za přihlášení k odběru. Budeme tě informovat o všem důležitém z BHLA.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
                setSelectedTeams([]);
              }}
              className="text-accent hover:text-accent-hover font-medium"
            >
              Upravit nastavení
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-accent/10 via-light to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left side - Info */}
            <div className="lg:col-span-2 bg-primary p-8 text-white">
              <div className="sticky top-8">
                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Zůstaň v obraze</h2>
                <p className="text-white/70 mb-6">
                  Přihlas se k odběru a dostávej notifikace o výsledcích tvého oblíbeného týmu, nadcházejících zápasech a novinkách z ligy.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Výsledky zápasů ihned po skončení
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Připomenutí nadcházejících zápasů
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Bez spamu, jen to důležité
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:col-span-3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="newsletter-email" className="block text-sm font-medium text-primary mb-2">
                    E-mailová adresa
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-shadow"
                    placeholder="tvuj@email.cz"
                  />
                </div>

                {/* Team Selection */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-3">
                    Které týmy chceš sledovat?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => toggleTeam(team.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          selectedTeams.includes(team.id)
                            ? "border-accent bg-accent/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: team.color }}
                        >
                          {team.shortName.slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-primary truncate">{team.shortName}</span>
                        {selectedTeams.includes(team.id) && (
                          <svg className="w-4 h-4 text-accent ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-secondary mt-2">
                    Nevyberete-li žádný tým, budete dostávat info o celé lize.
                  </p>
                </div>

                {/* Notification Preferences */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-3">
                    O čem chceš být informován?
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: "matchResults", label: "Výsledky zápasů", desc: "Ihned po skončení utkání" },
                      { key: "upcomingMatches", label: "Nadcházející zápasy", desc: "Den před zápasem" },
                      { key: "news", label: "Novinky z ligy", desc: "Důležité zprávy a oznámení" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) =>
                            setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }))
                          }
                          className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent mt-0.5"
                        />
                        <div>
                          <div className="font-medium text-primary">{item.label}</div>
                          <div className="text-sm text-secondary">{item.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent-hover disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Přihlašuji...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Přihlásit k odběru
                    </>
                  )}
                </button>

                <p className="text-xs text-secondary text-center">
                  Odesláním souhlasíte se zpracováním osobních údajů. Odběr můžete kdykoliv zrušit.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
