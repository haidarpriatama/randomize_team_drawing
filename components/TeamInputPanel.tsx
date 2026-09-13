"use client";

import React, { useState, useEffect } from "react";

interface TeamInputPanelProps {
  onRandomize: (teams: string[]) => void;
  isLoading?: boolean;
}

export default function TeamInputPanel({
  onRandomize,
  isLoading = false,
}: TeamInputPanelProps) {
  const [rawText, setRawText] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("robomatch_teams");
    if (saved) {
      setRawText(saved);
    }
  }, []);

  const parseTeams = (text: string): string[] => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const parsedTeams = parseTeams(rawText);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    localStorage.setItem("robomatch_teams", val);
  };

  const handleRandomizeClick = () => {
    onRandomize(parsedTeams);
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        rows={12}
        value={rawText}
        onChange={handleInputChange}
        placeholder="Masukkan nama tim di sini (1 tim per baris)..."
        className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-3 text-sm font-mono text-zinc-100 placeholder-zinc-600 transition focus:outline-none resize-y"
      ></textarea>

      <button
        onClick={handleRandomizeClick}
        disabled={isLoading || parsedTeams.length < 2}
        className="w-full py-3 px-4 bg-zinc-100 hover:bg-white disabled:opacity-30 text-zinc-950 font-bold text-sm font-mono rounded-lg transition active:scale-[0.99] cursor-pointer"
      >
        {isLoading ? "Mengacak..." : "ACAK PAIRING"}
      </button>
    </div>
  );
}
