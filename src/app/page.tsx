import Link from "next/link";
import HeroSection from "@/components/sections/HeroSection";
import LastMatchSection from "@/components/sections/LastMatchSection";
import UpcomingMatches from "@/components/sections/UpcomingMatches";
import StandingsPreview from "@/components/sections/StandingsPreview";
import NewsSection from "@/components/sections/NewsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Last Match */}
      <LastMatchSection />

      {/* Upcoming Matches & Standings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Matches */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-accent text-sm font-semibold">ROZPIS</span>
                  <h2 className="text-2xl font-bold text-primary">Nejbližší zápasy</h2>
                </div>
                <Link
                  href="/zapasy"
                  className="inline-flex items-center gap-1 text-accent hover:text-accent-hover font-medium text-sm"
                >
                  Všechny zápasy
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <UpcomingMatches />
            </div>

            {/* Standings */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-accent text-sm font-semibold">SEZÓNA 2025/26</span>
                  <h2 className="text-2xl font-bold text-primary">Tabulka</h2>
                </div>
                <Link
                  href="/tymy"
                  className="inline-flex items-center gap-1 text-accent hover:text-accent-hover font-medium text-sm"
                >
                  Detail
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <StandingsPreview />
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-accent text-sm font-semibold">AKTUALITY</span>
              <h2 className="text-2xl font-bold text-primary">Novinky z ligy</h2>
            </div>
          </div>
          <NewsSection />
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary-light text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Chceš si zahrát hokej?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto text-lg">
            BHLA je otevřená všem hokejovým nadšencům z Blat a okolí. Přidej se k nám a zažij vášeň pro hokej!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/o-lize"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/30 hover:shadow-xl hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Jak se přidat
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all border border-white/20 hover:border-white/40 hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Kontaktovat nás
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
