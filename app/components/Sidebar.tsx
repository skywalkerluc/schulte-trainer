"use client";

import { useSessionStore } from "@/app/store/useSessionStore";
import { formatTime } from "@/app/utils/formatTime";

export function Sidebar() {
  const grids = useSessionStore((s) => s.grids);
  const attemptsByGrid = useSessionStore((s) => s.attemptsByGrid);
  const activeGridId = useSessionStore((s) => s.activeGridId);
  const setActiveGrid = useSessionStore((s) => s.setActiveGrid);
  const deleteGrid = useSessionStore((s) => s.deleteGrid);

  const gridList = Object.values(grids).sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-900 md:w-80 md:border-l md:border-slate-800">
      <div className="p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Grids
        </h2>
        <ul className="space-y-3">
          {gridList.length === 0 ? (
            <li className="text-sm text-slate-500">Nenhum grid criado</li>
          ) : (
            gridList.map((grid) => {
              const attempts = attemptsByGrid[grid.id] ?? [];
              const bestTime =
                attempts.length > 0
                  ? Math.min(...attempts.map((a) => a.durationMs))
                  : 0;
              const isActive = activeGridId === grid.id;
              return (
                <li
                  key={grid.id}
                  className={`rounded bg-slate-800 p-4 ${isActive ? "ring-2 ring-blue-500" : ""}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-200">
                      {grid.size}×{grid.size}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteGrid(grid.id)}
                      className="text-slate-400 transition-colors hover:text-red-500"
                      aria-label="Excluir grid"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mb-1 text-sm text-slate-300">
                    Melhor: {bestTime > 0 ? formatTime(bestTime) : "—"}
                  </p>
                  <p className="mb-3 text-sm text-slate-300">
                    Tentativas: {attempts.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveGrid(grid.id)}
                    className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Abrir
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
