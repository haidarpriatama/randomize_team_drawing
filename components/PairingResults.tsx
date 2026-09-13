"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Table as TableIcon,
  Copy,
  FileSpreadsheet,
  Printer,
  ShieldAlert,
  Gamepad2,
  Flag,
  Crown,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import * as XLSX from "xlsx";
import confetti from "canvas-confetti";
import { MatchPair, PairingState } from "@/types";

interface PairingResultsProps {
  data: PairingState;
  byeLabel: string;
}

export default function PairingResults({
  data,
  byeLabel,
}: PairingResultsProps) {
  const [activeView, setActiveView] = useState<"cards" | "table">("cards");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  const showToast = (msg: string, type: "success" | "error" | "info" = "info") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyText = () => {
    if (data.pairs.length === 0 && !data.oddTeam) {
      showToast("Tidak ada data pairing untuk disalin!", "error");
      return;
    }

    let text = `=====================================\n`;
    text += `   JADWAL PAIRING PERLOMBAAN ROBOT   \n`;
    text += `=====================================\n\n`;

    data.pairs.forEach((pair) => {
      text += `${pair.matchCode}:\n`;
      text += `  [Sudut Merah] : ${pair.redCorner}\n`;
      text += `  [Sudut Biru ] : ${pair.blueCorner}\n\n`;
    });

    if (data.oddTeam) {
      text += `-------------------------------------\n`;
      text += `TIM LOLOS OTOMATIS (${byeLabel}):\n`;
      text += `  -> ${data.oddTeam}\n`;
      text += `-------------------------------------\n`;
    }

    text += `\nDibuat via ROBOMATCH App`;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Jadwal pairing berhasil disalin ke clipboard!", "success");
      })
      .catch(() => {
        showToast("Gagal menyalin teks", "error");
      });
  };

  const handleExportExcel = () => {
    if (data.pairs.length === 0 && !data.oddTeam) {
      showToast("Tidak ada data pairing untuk diekspor!", "error");
      return;
    }

    try {
      const excelRows = data.pairs.map((pair) => ({
        "No Match": pair.matchCode,
        "Sudut Merah (Red Corner)": pair.redCorner,
        VS: "VS",
        "Sudut Biru (Blue Corner)": pair.blueCorner,
        Status: pair.status,
      }));

      if (data.oddTeam) {
        excelRows.push({
          "No Match": "BYE",
          "Sudut Merah (Red Corner)": data.oddTeam,
          VS: "-",
          "Sudut Biru (Blue Corner)": "-",
          Status: byeLabel,
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      worksheet["!cols"] = [
        { wch: 12 },
        { wch: 28 },
        { wch: 6 },
        { wch: 28 },
        { wch: 22 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Pairing");

      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Jadwal_Pairing_Robot_${dateStr}.xlsx`);
      
      // Trigger confetti on successful export
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });

      showToast("File Excel (.xlsx) berhasil diunduh!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal mengekspor file Excel", "error");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const hasData = data.pairs.length > 0 || !!data.oddTeam;

  return (
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5 min-h-[500px] relative">
      {/* Header Toolbar */}
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 class="font-bold text-white text-base flex items-center gap-2">
            <Gamepad2 class="w-5 h-5 text-cyan-400" />
            <span>Jadwal & Hasil Pairing</span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            {hasData ? (
              <>
                Total:{" "}
                <strong class="text-indigo-400 font-mono">
                  {data.totalTeamsCount} Tim
                </strong>{" "}
                |{" "}
                <strong class="text-cyan-400 font-mono">
                  {data.pairs.length} Match
                </strong>{" "}
                {data.oddTeam && (
                  <>
                    |{" "}
                    <span class="text-amber-400 font-semibold">1 BYE Slot</span>
                  </>
                )}
              </>
            ) : (
              "Belum ada pairing yang dibuat"
            )}
          </p>
        </div>

        {/* View Toggle & Actions */}
        <div class="flex items-center flex-wrap gap-2 no-print">
          <div class="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveView("cards")}
              class={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition ${
                activeView === "cards"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid class="w-3.5 h-3.5" /> Kartu
            </button>
            <button
              onClick={() => setActiveView("table")}
              class={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition ${
                activeView === "table"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <TableIcon class="w-3.5 h-3.5" /> Tabel
            </button>
          </div>

          <button
            onClick={handleCopyText}
            class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition active:scale-95 flex items-center gap-1.5"
          >
            <Copy class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Salin</span>
          </button>

          <button
            onClick={handleExportExcel}
            class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 transition active:scale-95 flex items-center gap-1.5"
          >
            <FileSpreadsheet class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={handlePrint}
            class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95 flex items-center gap-1.5"
          >
            <Printer class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Odd Team Banner */}
      {data.oddTeam && (
        <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-center justify-between gap-3 animate-fade-in">
          <div class="flex items-center gap-2">
            <ShieldAlert class="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Jumlah peserta ganjil! Tim <strong>{data.oddTeam}</strong>{" "}
              mendapatkan status{" "}
              <strong class="underline">{byeLabel}</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Main Results View */}
      <div class="flex-1 flex flex-col">
        {!hasData ? (
          <div class="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-800 rounded-xl my-auto">
            <div class="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-600 text-2xl mb-3">
              <Gamepad2 class="w-8 h-8 text-slate-600" />
            </div>
            <h4 class="font-bold text-slate-300 text-sm">
              Belum Ada Data Pairing
            </h4>
            <p class="text-xs text-slate-500 max-w-sm mt-1">
              Masukkan nama tim pada panel di sebelah kiri dan klik tombol{" "}
              <strong>"ACAK PAIRING"</strong> untuk membuat skema pertandingan.
            </p>
          </div>
        ) : activeView === "cards" ? (
          /* Cards View */
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.pairs.map((pair) => (
              <div
                key={pair.matchNumber}
                class="card-match bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.01]"
              >
                <div class="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span class="font-mono text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Gamepad2 class="w-3.5 h-3.5 text-indigo-500" />
                    {pair.matchCode}
                  </span>
                  <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {pair.status}
                  </span>
                </div>
                <div class="p-3.5 space-y-2.5">
                  {/* Red Corner */}
                  <div class="flex items-center justify-between p-2.5 rounded-lg bg-red-950/20 border border-red-900/30">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500"></span>
                      <span class="font-bold text-xs text-red-200">
                        Red Corner
                      </span>
                    </div>
                    <span
                      class="font-semibold text-xs text-white truncate max-w-[160px] text-right"
                      title={pair.redCorner}
                    >
                      {pair.redCorner}
                    </span>
                  </div>

                  <div class="text-center text-[10px] font-extrabold text-slate-500 tracking-wider">
                    — VS —
                  </div>

                  {/* Blue Corner */}
                  <div class="flex items-center justify-between p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/30">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500"></span>
                      <span class="font-bold text-xs text-blue-200">
                        Blue Corner
                      </span>
                    </div>
                    <span
                      class="font-semibold text-xs text-white truncate max-w-[160px] text-right"
                      title={pair.blueCorner}
                    >
                      {pair.blueCorner}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Odd BYE Card */}
            {data.oddTeam && (
              <div class="card-match bg-slate-950 border border-amber-500/40 rounded-xl overflow-hidden shadow-lg">
                <div class="bg-amber-500/10 px-3.5 py-2 border-b border-amber-500/20 flex items-center justify-between">
                  <span class="font-mono text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Crown class="w-3.5 h-3.5 text-amber-400" /> Auto-Advance
                    Slot
                  </span>
                  <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {byeLabel}
                  </span>
                </div>
                <div class="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <div class="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Crown class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-400">Tim Lolos Otomatis:</div>
                    <div class="text-sm font-extrabold text-white mt-0.5">
                      {data.oddTeam}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Table View */
          <div class="overflow-x-auto rounded-xl border border-slate-800">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th class="py-3 px-3 font-semibold text-center w-16">No</th>
                  <th class="py-3 px-3 font-semibold text-red-400 border-l border-slate-800">
                    Sudut Merah (Red)
                  </th>
                  <th class="py-3 px-3 font-semibold text-center w-12">VS</th>
                  <th class="py-3 px-3 font-semibold text-blue-400 border-r border-slate-800">
                    Sudut Biru (Blue)
                  </th>
                  <th class="py-3 px-3 font-semibold text-center w-28">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/80">
                {data.pairs.map((pair) => (
                  <tr key={pair.matchNumber} class="hover:bg-slate-900/60 transition">
                    <td class="py-3 px-3 font-mono font-bold text-slate-300 text-center">
                      {pair.matchCode}
                    </td>
                    <td class="py-3 px-3 font-semibold text-slate-100 border-l border-slate-800">
                      <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                      {pair.redCorner}
                    </td>
                    <td class="py-3 px-3 font-mono text-slate-500 text-center font-extrabold text-[10px]">
                      VS
                    </td>
                    <td class="py-3 px-3 font-semibold text-slate-100 border-r border-slate-800">
                      <span class="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      {pair.blueCorner}
                    </td>
                    <td class="py-3 px-3 text-center">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                        {pair.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {data.oddTeam && (
                  <tr class="bg-amber-500/5 hover:bg-amber-500/10 transition">
                    <td class="py-3 px-3 font-mono font-bold text-amber-400 text-center">
                      BYE
                    </td>
                    <td
                      colSpan={3}
                      class="py-3 px-3 font-semibold text-amber-200 border-l border-slate-800"
                    >
                      <span class="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                      {data.oddTeam}
                    </td>
                    <td class="py-3 px-3 text-center">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {byeLabel}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div class="fixed bottom-5 right-5 z-50 animate-bounce">
          <div class="bg-slate-800 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold">
            {toastType === "success" ? (
              <CheckCircle2 class="w-4 h-4 text-emerald-400" />
            ) : toastType === "error" ? (
              <AlertCircle class="w-4 h-4 text-red-400" />
            ) : (
              <Info class="w-4 h-4 text-indigo-400" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
