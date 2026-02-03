"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Team {
  id: string;
  name: string;
  short_name: string;
  color: string;
  founded: number | null;
  description: string | null;
}

export default function TeamsAdminPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [color, setColor] = useState("#0B1F3B");
  const [founded, setFounded] = useState("");
  const [description, setDescription] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase
      .from("teams")
      .select("*")
      .order("name");
    if (data) setTeams(data);
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setShortName("");
    setColor("#0B1F3B");
    setFounded("");
    setDescription("");
    setEditingTeam(null);
    setShowForm(false);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setName(team.name);
    setShortName(team.short_name);
    setColor(team.color);
    setFounded(team.founded?.toString() || "");
    setDescription(team.description || "");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name || !shortName) return;
    setSaving(true);

    const teamData = {
      name,
      short_name: shortName.toUpperCase(),
      color,
      founded: founded ? parseInt(founded) : null,
      description: description || null,
    };

    try {
      if (editingTeam) {
        const { error } = await supabase.from("teams").update(teamData).eq("id", editingTeam.id);
        if (error) {
          console.error("Update error:", error);
          alert(`Chyba při ukládání: ${error.message}`);
          setSaving(false);
          return;
        }
      } else {
        const { error } = await supabase.from("teams").insert(teamData);
        if (error) {
          console.error("Insert error:", error);
          alert(`Chyba při vytváření: ${error.message}`);
          setSaving(false);
          return;
        }
      }

      await fetchTeams();
      resetForm();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Neočekávaná chyba");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tento tým? Tato akce je nevratná.")) return;
    await supabase.from("teams").delete().eq("id", id);
    await fetchTeams();
  };

  const predefinedColors = [
    "#D61F2C", "#144A86", "#2E7D32", "#FF9800", "#9C27B0", "#0B1F3B",
    "#E91E63", "#00BCD4", "#795548", "#607D8B", "#FF5722", "#3F51B5",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Týmy</h1>
          <p className="text-secondary">Správa týmů v lize</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Přidat tým
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-primary">
                {editingTeam ? "Upravit tým" : "Nový tým"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Název týmu *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  placeholder="HC Dolní Bukovsko"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Zkratka (3 znaky) *</label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value.slice(0, 3).toUpperCase())}
                  maxLength={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none uppercase"
                  placeholder="BUK"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Barva týmu</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {predefinedColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        color === c ? "border-gray-900 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    placeholder="#D61F2C"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Rok založení</label>
                <input
                  type="number"
                  value={founded}
                  onChange={(e) => setFounded(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  placeholder="2008"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Popis</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
                  placeholder="Krátký popis týmu..."
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xs text-secondary mb-2">Náhled:</div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {shortName || "???"}
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{name || "Název týmu"}</div>
                    <div className="text-sm text-secondary">{founded ? `Založen ${founded}` : ""}</div>
                  </div>
                </div>
              </div>
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
                disabled={!name || !shortName || saving}
                className="flex-1 px-4 py-3 bg-accent hover:bg-accent-hover disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors"
              >
                {saving ? "Ukládám..." : editingTeam ? "Uložit změny" : "Přidat tým"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teams list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <svg className="animate-spin w-8 h-8 mx-auto text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : teams.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-secondary mb-4">Zatím žádné týmy</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Přidat první tým
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center p-4 hover:bg-gray-50">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold mr-4"
                  style={{ backgroundColor: team.color }}
                >
                  {team.short_name}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-primary">{team.name}</div>
                  <div className="text-sm text-secondary">
                    {team.founded && `Založen ${team.founded}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(team)}
                    className="p-2 text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
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
