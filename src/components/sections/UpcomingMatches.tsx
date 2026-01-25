"use client";

import { useState } from "react";
import Link from "next/link";
import { getUpcomingMatches, venues, formatDate, formatFullDate, generateCalendarUrl } from "@/data";

export default function UpcomingMatches() {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const upcomingMatches = getUpcomingMatches(3);

  return (
    <div className="space-y-4">
      {upcomingMatches.map((match) => {
        const venue = venues[match.venue];
        const isExpanded = expandedMatch === match.id;

        return (
          <div
            key={match.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Match Card */}
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Teams */}
                <div className="flex items-center flex-1 gap-3">
                  {/* Home Team */}
                  <Link
                    href={`/tymy/${match.homeTeam.id}`}
                    className="flex items-center gap-2 flex-1 group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: match.homeTeam.color }}
                    >
                      {match.homeTeam.shortName}
                    </div>
                    <span className="font-semibold text-primary group-hover:text-accent transition-colors hidden sm:block">
                      {match.homeTeam.name}
                    </span>
                    <span className="font-semibold text-primary group-hover:text-accent transition-colors sm:hidden">
                      {match.homeTeam.shortName}
                    </span>
                  </Link>

                  {/* VS Badge */}
                  <div className="flex flex-col items-center px-4">
                    <div className="text-xs text-secondary font-medium">VS</div>
                    <div className="text-lg font-bold text-accent">{match.time}</div>
                  </div>

                  {/* Away Team */}
                  <Link
                    href={`/tymy/${match.awayTeam.id}`}
                    className="flex items-center gap-2 flex-1 justify-end group"
                  >
                    <span className="font-semibold text-primary group-hover:text-accent transition-colors hidden sm:block">
                      {match.awayTeam.name}
                    </span>
                    <span className="font-semibold text-primary group-hover:text-accent transition-colors sm:hidden">
                      {match.awayTeam.shortName}
                    </span>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: match.awayTeam.color }}
                    >
                      {match.awayTeam.shortName}
                    </div>
                  </Link>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center gap-3 md:ml-4">
                  <div className="text-center md:text-right">
                    <div className="text-sm font-semibold text-primary">{formatDate(match.date)}</div>
                    <div className="text-xs text-secondary">{venue.name.split(" ").pop()}</div>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isExpanded
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-secondary hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Map */}
                    <div>
                      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Místo konání
                      </h4>
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                        <iframe
                          src={venue.mapUrl}
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full"
                        />
                        <div className="p-3">
                          <div className="font-medium text-primary">{venue.name}</div>
                          <div className="text-sm text-secondary">{venue.address}</div>
                          <a
                            href={venue.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:text-accent-hover text-sm font-medium mt-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Navigovat
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Info & Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Informace o zápase
                      </h4>
                      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-secondary">Datum</div>
                            <div className="font-medium text-primary">{formatFullDate(match.date)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-secondary">Začátek</div>
                            <div className="font-medium text-primary">{match.time}</div>
                          </div>
                        </div>

                        {/* Teams Preview */}
                        <div className="border-t border-gray-100 pt-4">
                          <div className="text-xs text-secondary mb-2">Týmy</div>
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/tymy/${match.homeTeam.id}`}
                              className="flex items-center gap-2 hover:text-accent"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: match.homeTeam.color }}
                              >
                                {match.homeTeam.shortName.slice(0, 2)}
                              </div>
                              <span className="text-sm font-medium">{match.homeTeam.name}</span>
                            </Link>
                            <Link
                              href={`/tymy/${match.awayTeam.id}`}
                              className="flex items-center gap-2 hover:text-accent"
                            >
                              <span className="text-sm font-medium">{match.awayTeam.name}</span>
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: match.awayTeam.color }}
                              >
                                {match.awayTeam.shortName.slice(0, 2)}
                              </div>
                            </Link>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
                          <a
                            href={generateCalendarUrl(match)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Přidat do kalendáře
                          </a>
                          <button
                            onClick={() => {
                              navigator.share?.({
                                title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                                text: `Hokejový zápas BHLA - ${formatFullDate(match.date)} v ${match.time}`,
                                url: window.location.href,
                              });
                            }}
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Sdílet
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
