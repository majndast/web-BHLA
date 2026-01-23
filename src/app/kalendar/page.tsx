"use client";

import { useState } from "react";

// Demo data
const events = [
  { id: "1", title: "HC Blatná vs SK Lední Medvědi", date: "2025-02-15", time: "18:00", type: "match" as const, location: "Zimní stadion Blatná" },
  { id: "2", title: "TJ Hokej Strakonice vs HC Blatná", date: "2025-02-18", time: "19:30", type: "match" as const, location: "Zimní stadion Strakonice" },
  { id: "3", title: "SK Lední Medvědi vs HC Vlci Písek", date: "2025-02-20", time: "18:30", type: "match" as const, location: "Zimní stadion Blatná" },
  { id: "4", title: "Schůze vedení ligy", date: "2025-02-22", time: "17:00", type: "meeting" as const, location: "Radnice Blatná" },
  { id: "5", title: "HC Vodňany vs TJ Sokol Protivín", date: "2025-02-25", time: "18:00", type: "match" as const, location: "Zimní stadion Vodňany" },
  { id: "6", title: "Turnaj přípravek", date: "2025-03-01", time: "09:00", type: "other" as const, location: "Zimní stadion Blatná" },
  { id: "7", title: "HC Blatná vs HC Vlci Písek", date: "2025-03-05", time: "18:00", type: "match" as const, location: "Zimní stadion Blatná" },
];

const months = [
  "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
  "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
];

const eventTypeColors = {
  match: "bg-accent",
  training: "bg-blue-500",
  meeting: "bg-yellow-500",
  other: "bg-gray-500",
};

const eventTypeLabels = {
  match: "Zápas",
  training: "Trénink",
  meeting: "Schůze",
  other: "Ostatní",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Get upcoming events
  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Kalendář</h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Přehled všech akcí a zápasů Blatské Hokejové Ligy Amatérů
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-primary-light rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold">
                  {months[month]} {year}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-primary-light rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((day) => (
                  <div key={day} className="px-2 py-3 text-center text-sm font-semibold text-secondary">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7">
                {days.map((day, index) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isToday = day && new Date().toDateString() === new Date(year, month, day).toDateString();

                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-2 border-b border-r border-gray-100 ${
                        day ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm mb-1 ${
                            isToday
                              ? "w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center font-bold"
                              : "text-primary"
                          }`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs px-1 py-0.5 rounded text-white truncate ${eventTypeColors[event.type]}`}
                                title={event.title}
                              >
                                {event.time} {event.title.slice(0, 15)}...
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-secondary">
                                +{dayEvents.length - 2} další
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              {Object.entries(eventTypeLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${eventTypeColors[key as keyof typeof eventTypeColors]}`} />
                  <span className="text-sm text-secondary">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-primary text-white px-6 py-4">
                <h2 className="text-lg font-semibold">Nadcházející akce</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${eventTypeColors[event.type]}`} />
                      <div className="flex-1">
                        <div className="font-medium text-primary">{event.title}</div>
                        <div className="text-sm text-secondary mt-1">
                          {formatDate(event.date)} • {event.time}
                        </div>
                        <div className="text-sm text-secondary flex items-center gap-1 mt-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
