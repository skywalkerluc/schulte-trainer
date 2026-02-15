"use client";

import { Grid } from "@/app/components/Grid";
import { Sidebar } from "@/app/components/Sidebar";
import { useSessionStore } from "@/app/store/useSessionStore";

function Page() {
  const createGrid = useSessionStore((s) => s.createGrid);

  return (
    <div className="flex h-screen flex-col">
      <header className="shrink-0 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-100">Schulte Trainer</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => createGrid(5)}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              5×5
            </button>
            <button
              type="button"
              onClick={() => createGrid(6)}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              6×6
            </button>
            <button
              type="button"
              onClick={() => createGrid(7)}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
        <aside className="w-full shrink-0 border-t border-slate-800 md:w-80 md:border-l md:border-t-0">
          <Sidebar />
        </aside>
      </main>
    </div>
  );
}

export default Page;
