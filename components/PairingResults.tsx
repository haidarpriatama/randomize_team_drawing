"use client";

import React from "react";
import { PairingState } from "@/types";
import * as XLSX from "xlsx";

interface PairingResultsProps {
  data: PairingState;
}

export default function PairingResults({ data }: PairingResultsProps) {
  const hasData = data.pairs.length > 0;

  const handleCopy = () => {
    if (!hasData) return;
    let text = `PAIRING HASIL DRAW:\n\n`;
    data.pairs.forEach((pair) => {
      if (pair.blueCorner) {
        text += `${pair.matchCode}: ${pair.redCorner} VS ${pair.blueCorner}\n`;
      } else {
        text += `${pair.matchCode}: ${pair.redCorner}\n`;
      }
    });
    navigator.clipboard.writeText(text);
  };

  const handleDownloadXLS = () => {
    if (!hasData) return;
    const excelData = data.pairs.map((pair) => ({
      "Match #": pair.matchCode,
      "Sudut Merah": pair.redCorner,
      "VS": pair.blueCorner ? "VS" : "-",
      "Sudut Biru": pair.blueCorner ? pair.blueCorner : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Match");
    XLSX.writeFile(workbook, "jadwal_pertandingan.xlsx");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col gap-4 min-h-[380px]">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h3 className="font-bold text-zinc-100 text-sm font-mono uppercase tracking-wide">
          Hasil Draw {hasData && `(${data.pairs.length} Match)`}
        </h3>
        {hasData && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition active:scale-95 cursor-pointer"
            >
              Salin Teks
            </button>
            <button
              onClick={handleDownloadXLS}
              className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>Download XLS</span>
            </button>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="flex-1 flex items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded">
          <p className="text-xs text-zinc-500 font-mono">
            Hasil acakan tim akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {data.pairs.map((pair) => (
            <div
              key={pair.matchNumber}
              className="bg-zinc-950 border border-zinc-800 rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs"
            >
              <span className="text-zinc-500 font-bold w-16">{pair.matchCode}</span>
              <div className="flex-1 flex items-center justify-center gap-3 w-full text-center">
                {pair.blueCorner ? (
                  <>
                    <span className="text-zinc-100 font-semibold truncate max-w-[140px] sm:max-w-[180px]">
                      {pair.redCorner}
                    </span>
                    <span className="text-zinc-600 font-bold text-[10px]">VS</span>
                    <span className="text-zinc-100 font-semibold truncate max-w-[140px] sm:max-w-[180px]">
                      {pair.blueCorner}
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-100 font-semibold truncate max-w-[280px]">
                    {pair.redCorner}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
