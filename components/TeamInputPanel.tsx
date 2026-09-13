"use client";

import React, { useState, useEffect } from "react";
import {
  ListChecks,
  Trash2,
  Sliders,
  Dices,
  Users,
  UserPlus,
  Trophy,
} from "lucide-react";

interface TeamInputPanelProps {
  onRandomize: (config: {
    teams: string[];
    byeLabel: string;
    arenaPrefix: string;
  }) => void;
  isLoading?: boolean;
}

const SAMPLE_PRESETS: Record<number, string[]> = {
  8: [
    "RoboTech Alpha",
    "Mecha Force 01",
    "Cyber Valkyrie",
    "Iron Claws",
    "Thunderbot X",
    "Titanium Core",
    "Vortex Spinner",
    "Aero Striker",
  ],
  9: [
    "RoboTech Alpha",
    "Mecha Force 01",
    "Cyber Valkyrie",
    "Iron Claws",
    "Thunderbot X",
    "Titanium Core",
    "Vortex Spinner",
    "Aero Striker",
    "Garuda Autonomous",
  ],
  16: [
    "RoboTech Alpha",
    "Mecha Force 01",
    "Cyber Valkyrie",
    "Iron Claws",
    "Thunderbot X",
    "Titanium Core",
    "Vortex Spinner",
    "Aero Striker",
    "Garuda Autonomous",
    "Hydra Striker",
    "Nexus Prime",
    "Phantom Racer",
    "Quantum Breaker",
    "Shadow Runner",
    "Vector Pulse",
    "Zenith Rover",
  ],
};

export default function TeamInputPanel({
  onRandomize,
  isLoading = false,
}: TeamInputPanelProps) {
  const [rawText, setRawText] = useState<string>("");
  const [byeLabel, setByeLabel] = useState<string>("Auto-Advance / BYE");
  const [arenaPrefix, setArenaPrefix] = useState<string>("Match");
  const [chkTrim, setChkTrim] = useState<boolean>(true);
  const [chkFilterDupes, setChkFilterDupes] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("robomatch_teams");
    if (saved) {
      setRawText(saved);
    } else {
      // Default to 9 teams (shows odd team BYE handling)
      setRawText(SAMPLE_PRESETS[9].join("\n"));
    }
  }, []);

  const parseTeams = (text: string): string[] => {
    let lines = text.split("\n");
    if (chkTrim) {
      lines = lines.map((line) => line.trim()).filter((line) => line.length > 0);
    } else {
      lines = lines.filter((line) => line.length > 0);
    }

    if (chkFilterDupes) {
      const unique: string[] = [];
      const seen = new Set<string>();
      for (const item of lines) {
        const key = item.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      }
      lines = unique;
    }

    return lines;
  };

  const parsedTeams = parseTeams(rawText);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    localStorage.setItem("robomatch_teams", val);
  };

  const loadPreset = (count: number) => {
    if (SAMPLE_PRESETS[count]) {
      const val = SAMPLE_PRESETS[count].join("\n");
      setRawText(val);
      localStorage.setItem("robomatch_teams", val);
      onRandomize({
        teams: parseTeams(val),
        byeLabel,
        arenaPrefix,
      });
    }
  };

  const handleClear = () => {
    setRawText("");
    localStorage.removeItem("robomatch_teams");
  };

  const handleRandomizeClick = () => {
    onRandomize({
      teams: parsedTeams,
      byeLabel,
      arenaPrefix,
    });
  };

  return (
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header & Quick Preset Bar */}
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <ListChecks class="w-5 h-5 text-indigo-400" />
          <h3 class="font-bold text-white text-base">Daftar Tim Peserta</h3>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 font-mono font-semibold border border-slate-700">
            {parsedTeams.length} Tim
          </span>
          <button
            onClick={handleClear}
            title="Bersihkan input"
            class="text-slate-400 hover:text-red-400 p-1.5 transition rounded-lg hover:bg-slate-800"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div class="flex flex-wrap items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
        <span class="text-xs text-slate-400 font-medium mr-1">Contoh Tim:</span>
        <button
          onClick={() => loadPreset(8)}
          class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition active:scale-95 flex items-center gap-1"
        >
          <Users class="w-3.5 h-3.5 text-indigo-400" /> 8 Tim
        </button>
        <button
          onClick={() => loadPreset(9)}
          class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition active:scale-95 flex items-center gap-1"
        >
          <UserPlus class="w-3.5 h-3.5 text-amber-400" /> 9 Tim (Ganjil)
        </button>
        <button
          onClick={() => loadPreset(16)}
          class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition active:scale-95 flex items-center gap-1"
        >
          <Trophy class="w-3.5 h-3.5 text-cyan-400" /> 16 Tim
        </button>
      </div>

      {/* Textarea */}
      <div class="relative">
        <textarea
          rows={11}
          value={rawText}
          onChange={handleInputChange}
          placeholder="Masukkan nama tim di sini (satu nama tim per baris)...&#10;Contoh:&#10;RoboTech Alpha&#10;Mecha Force 01&#10;Cyber Valkyrie&#10;Iron Claws"
          class="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-xl p-3.5 text-sm font-mono text-slate-100 placeholder-slate-500 transition resize-y focus:outline-none"
        ></textarea>
        <div class="absolute bottom-3 right-3 text-xs text-slate-500 pointer-events-none font-mono">
          {parsedTeams.length} Baris Valid
        </div>
      </div>

      {/* Options Panel */}
      <div class="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sliders class="w-3.5 h-3.5 text-indigo-400" />
          <span>Pengaturan Match & Custom Label</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-slate-300 font-medium block mb-1">
              Label Status Ganjil / BYE:
            </label>
            <input
              type="text"
              value={byeLabel}
              onChange={(e) => setByeLabel(e.target.value)}
              class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="text-xs text-slate-300 font-medium block mb-1">
              Prefix Nama Match:
            </label>
            <input
              type="text"
              value={arenaPrefix}
              onChange={(e) => setArenaPrefix(e.target.value)}
              class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="flex items-center gap-4 text-xs text-slate-300 pt-1">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={chkFilterDupes}
              onChange={(e) => setChkFilterDupes(e.target.checked)}
              class="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
            />
            <span>Hapus Duplikat</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={chkTrim}
              onChange={(e) => setChkTrim(e.target.checked)}
              class="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
            />
            <span>Hapus Spasi Kosong</span>
          </label>
        </div>
      </div>

      {/* Randomize Button */}
      <button
        onClick={handleRandomizeClick}
        disabled={isLoading || parsedTeams.length < 2}
        class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
      >
        <Dices className={`w-5 h-5 ${isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
        <span>ACAK PAIRING</span>
      </button>
    </div>
  );
}
