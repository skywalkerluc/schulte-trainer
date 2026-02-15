"use client";

import { useEffect } from "react";
import { Grid } from "@/app/components/Grid";
import { Sidebar } from "@/app/components/Sidebar";
import { useSessionStore } from "@/app/store/useSessionStore";

function Page() {
  const createGrid = useSessionStore((s) => s.createGrid);
  const grids = useSessionStore((s) => s.grids);

  useEffect(() => {
    if (Object.keys(grids).length === 0) {
      createGrid(5);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <header className="shrink-0 border-b border-white/10 bg-slate-900/50 px-4 py-3 backdrop-blur-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
            Schulte Trainer
          </h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => createGrid(5)}
              className="rounded-lg border border-blue-400/30 bg-blue-600/80 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm transition-all hover:scale-105 hover:bg-blue-500/80 hover:shadow-blue-500/40"
            >
              5×5
            </button>
            <button
              type="button"
              onClick={() => createGrid(6)}
              className="rounded-lg border border-blue-400/30 bg-blue-600/80 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm transition-all hover:scale-105 hover:bg-blue-500/80 hover:shadow-blue-500/40"
            >
              6×6
            </button>
            <button
              type="button"
              onClick={() => createGrid(7)}
              className="rounded-lg border border-blue-400/30 bg-blue-600/80 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm transition-all hover:scale-105 hover:bg-blue-500/80 hover:shadow-blue-500/40"
            >
              7×7
            </button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <section className="flex flex-1 items-start justify-center overflow-auto p-4">
          <Grid />
        </section>
        <aside className="w-full shrink-0 border-t border-white/10 md:w-80 md:border-l md:border-t-0">
          <Sidebar />
        </aside>
      </main>
    </div>
  );
}

export default Page;
