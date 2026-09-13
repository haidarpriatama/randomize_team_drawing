"use client";

import React from "react";

export default function Header() {
  return (
    <header className="border-b border-zinc-900 bg-zinc-950 py-4 no-print">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-base font-bold font-mono tracking-wider text-zinc-100 uppercase">
          ROBOMATCH — Team Drawer
        </h1>
      </div>
    </header>
  );
}
