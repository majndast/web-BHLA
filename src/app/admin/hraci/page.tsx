"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Team {
  id: string;
  name: string;
  short_name: string;
  color: string;
}

interface Player {
  id: string;
  name: string;
  number: number | null;
  position: string | null;
  team_id: string | null;
  is_active: boolean;
  team?: Team;
}

export default function PlayersAdminPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterTeam, setFilterTeam] = useState<string>("");

  // Form state
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState<string>("");
  const [teamId, setTeamId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [playersRes, teamsRes] = await Promise.all([
      supabase
        .from("players")
        .select("*, team:teams(*)")
        .order("name"),
      supabase.from("teams").select("*").order("name"),
    ]);

    if (playersRes.data) setPlayers(playersRes.data);
    if (teamsRes.data) setTeams(teamsRes.data);
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setNumber("");
    setPosition("");
    setTeamId("");
    setIsActive(true);
    setEditingPlayer(null);
    setShowForm(false);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setName(player.name);
    setNumber(player.number?.toString() || "");
    setPosition(player.position || "");
    setTeamId(player.team_id || "");
    setIsActive(player.is_active);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name) return;
    setSaving(true);

    const playerData = {
      name,
      number: number ? parseInt(number) : null,
      position: position || null,
      team_id: teamId || null,
      is_active: isActive,
    };

    if (editingPlayer) {
      await supabase.from("players").update(playerData).eq("id", editingPlayer.id);
    } else {
      await supabase.from("players").insert(playerData);
    }

    await fetchData();
    resetForm();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tohoto hráče?")) return;
    await supabase.from("players").delete().eq("id", id);
    await fetchData();
  };

  const filteredPlayers = filterTeam
    ? players.filter((p) => p.team_id === filterTeam)
    : players;

  const positions = [
    { value: "brankář", label: "Brankář" },
    { value: "obránce", label: "Obránce" },
    { value: "útočník", label: "Útočník" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Hráči</h1>
          <p className="text-secondary">Správa hráčů a soupisek</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Přidat hráče
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterTeam("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !filterTeam
              ? "bg-primary text-white"
              : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Všechny týmy
        </button>
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setFilterTeam(team.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterTeam === team.id
                ? "bg-primary text-white"
                : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: team.color }}
            />
            {team.short_name}
          </button>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-primary">
                {editingPlayer ? "Upravit hráče" : "Nový hráč"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Jméno *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  placeholder="Jan Novák"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Číslo dresu</label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    placeholder="9"
                    min="1"
                    max="99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Pozice</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  >
                    <option value="">Vyberte...</option>
                    {positions.map((pos) => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Tým</label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                >
                  <option value="">Bez týmu</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-primary">Aktivní hráč</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-primary hover:bg-gray-50 transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={handleSave}
                disabled={!name || saving}
                className="flex-1 px-4 py-3 bg-accent hover:bg-accent-hover disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
              >
                {saving ? "Ukládám..." : editingPlayer ? "Uložit změny" : "Přidat hráče"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Players list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <svg className="animate-spin w-8 h-8 mx-auto text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-secondary mb-4">
              {filterTeam ? "V tomto týmu nejsou žádní hráči" : "Zatím žádní hráči"}
            </p>
            <button
              onClick={() => {
                if (filterTeam) setTeamId(filterTeam);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Přidat hráče
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPlayers.map((player) => (
              <div key={player.id} className={`flex items-center p-4 hover:bg-gray-50 ${!player.is_active ? "opacity-50" : ""}`}>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  {player.number ? (
                    <span className="font-bold text-primary">#{player.number}</span>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-primary flex items-center gap-2">
                    {player.name}
                    {!player.is_active && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Neaktivní</span>
                    )}
                  </div>
                  <div className="text-sm text-secondary flex items-center gap-2">
                    {player.position && <span>{positions.find(p => p.value === player.position)?.label}</span>}
                    {player.team && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: player.team.color }}
                          />
                          {player.team.short_name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(player)}
                    className="p-2 text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    className="p-2 text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
