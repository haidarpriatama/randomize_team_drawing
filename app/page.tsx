"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import TeamInputPanel from "@/components/TeamInputPanel";
import PairingResults from "@/components/PairingResults";
import { PairingState, MatchPair } from "@/types";
import { Trophy, HelpCircle, Sparkles } from "lucide-react";

export default function Home() {
  const [byeLabel, setByeLabel] = useState<string>("Auto-Advance / BYE");
  const [pairingData, setPairingData] = useState<PairingState>({
    pairs: [],
    oddTeam: null,
    totalTeamsCount: 0,
  });
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array: string[]): string[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleRandomize = ({
    teams,
    byeLabel: inputByeLabel,
    arenaPrefix,
  }: {
    teams: string[];
    byeLabel: string;
    arenaPrefix: string;
  }) => {
    if (teams.length < 2) return;

    setIsSpinning(true);
    setByeLabel(inputByeLabel || "Auto-Advance / BYE");

    setTimeout(() => {
      const shuffled = shuffleArray(teams);
      const isOdd = shuffled.length % 2 !== 0;
      const totalPairsCount = Math.floor(shuffled.length / 2);

      const pairs: MatchPair[] = [];
      for (let i = 0; i < totalPairsCount; i++) {
        pairs.push({
          matchNumber: i + 1,
          matchCode: `${arenaPrefix} ${i + 1}`,
          redCorner: shuffled[i * 2],
          blueCorner: shuffled[i * 2 + 1],
          status: "Tanding",
        });
      }

      const oddTeam = isOdd ? shuffled[shuffled.length - 1] : null;

      setPairingData({
        pairs,
        oddTeam,
        totalTeamsCount: teams.length,
      });

      setIsSpinning(false);
    }, 300);
  };

  return (
    <div class="flex-1 flex flex-col">
      {/* Background Accent */}
      <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-r from-cyan-500/10 via-indigo-500/20 to-purple-500/10 blur-3xl pointer-events-none -z-10"></div>

      <Header />

      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Top Info Banner */}
        <div class="no-print bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div class="space-y-1">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <Trophy class="w-5 h-5 text-amber-400" />
              <span>Sistem Pengacak Pasangan Tanding Robot (Next.js App)</span>
            </h2>
            <p class="text-sm text-slate-300">
              Masukkan nama tim (satu per baris). Sistem secara otomatis
              mengacak sudut merah vs biru dan memberikan status{" "}
              <span class="text-amber-400 font-semibold">
                "Auto-Advance / BYE"
              </span>{" "}
              jika jumlah tim ganjil.
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-3 py-2 rounded-xl border border-indigo-500/20 self-start md:self-auto">
            <Sparkles class="w-4 h-4 text-cyan-400" />
            <span>Ready for Vercel Deployment</span>
          </div>
        </div>

        {/* Grid Layout: Left Input Panel (5 cols) | Right Output Panel (7 cols) */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5 no-print">
            <TeamInputPanel onRandomize={handleRandomize} isLoading={isSpinning} />
          </div>
          <div class="lg:col-span-7">
            <PairingResults data={pairingData} byeLabel={byeLabel} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="border-t border-slate-800/80 py-4 mt-8 bg-slate-950 no-print text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            &copy; {new Date().getFullYear()} ROBOMATCH Next.js - Built for Vercel
          </span>
          <span class="text-slate-600">
            Didesain khusus untuk Turnamen & Kontes Robot Indonesia
          </span>
        </div>
      </footer>
    </div>
  );
}
