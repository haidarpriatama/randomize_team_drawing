"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import TeamInputPanel from "@/components/TeamInputPanel";
import PairingResults from "@/components/PairingResults";
import { PairingState, MatchPair } from "@/types";

export default function Home() {
  const [pairingData, setPairingData] = useState<PairingState>({
    pairs: [],
    oddTeam: null,
    totalTeamsCount: 0,
  });
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const shuffleArray = (array: string[]): string[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleRandomize = (teams: string[]) => {
    if (teams.length < 2) return;

    setIsSpinning(true);

    setTimeout(() => {
      const shuffled = shuffleArray(teams);
      const isOdd = shuffled.length % 2 !== 0;
      const totalPairsCount = Math.floor(shuffled.length / 2);

      const pairs: MatchPair[] = [];
      for (let i = 0; i < totalPairsCount; i++) {
        pairs.push({
          matchNumber: i + 1,
          matchCode: `Match ${i + 1}`,
          redCorner: shuffled[i * 2],
          blueCorner: shuffled[i * 2 + 1],
          status: "",
        });
      }

      if (isOdd) {
        const lastTeam = shuffled[shuffled.length - 1];
        pairs.push({
          matchNumber: totalPairsCount + 1,
          matchCode: `Match ${totalPairsCount + 1}`,
          redCorner: lastTeam,
          blueCorner: "", // Single team match (tanding sendiri)
          status: "",
        });
      }

      setPairingData({
        pairs,
        oddTeam: null,
        totalTeamsCount: teams.length,
      });

      setIsSpinning(false);
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <TeamInputPanel onRandomize={handleRandomize} isLoading={isSpinning} />
          </div>
          <div className="md:col-span-7">
            <PairingResults data={pairingData} />
          </div>
        </div>
      </main>
    </div>
  );
}
