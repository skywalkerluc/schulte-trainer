import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SchulteGrid = {
  id: string;
  size: 5 | 6 | 7;
  numbers: number[];
  createdAt: number;
};

export type Attempt = {
  id: string;
  gridId: string;
  durationMs: number;
  finishedAt: number;
};

type SessionStore = {
  grids: Record<string, SchulteGrid>;
  attemptsByGrid: Record<string, Attempt[]>;
  activeGridId: string | null;
  createGrid: (size: 5 | 6 | 7) => void;
  setActiveGrid: (id: string | null) => void;
  deleteGrid: (id: string) => void;
  saveAttempt: (gridId: string, durationMs: number) => void;
};

function shuffleNumbers(size: number): number[] {
  const shuffled = [...Array(size * size)].map((_, i) => i + 1);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      grids: {},
      attemptsByGrid: {},
      activeGridId: null,
      createGrid: (size: 5 | 6 | 7) => {
        const id = crypto.randomUUID();
        const numbers = shuffleNumbers(size);
        set((state) => ({
          grids: {
            ...state.grids,
            [id]: { id, size, numbers, createdAt: Date.now() },
          },
          attemptsByGrid: {
            ...state.attemptsByGrid,
            [id]: state.attemptsByGrid[id] ?? [],
          },
          activeGridId: id,
        }));
      },
      setActiveGrid: (id: string | null) => set({ activeGridId: id }),
      deleteGrid: (id: string) =>
        set((state) => {
          const { [id]: _, ...grids } = state.grids;
          const { [id]: __, ...attemptsByGrid } = state.attemptsByGrid;
          return {
            grids,
            attemptsByGrid,
            activeGridId: state.activeGridId === id ? null : state.activeGridId,
          };
        }),
      saveAttempt: (gridId: string, durationMs: number) => {
        const attempt: Attempt = {
          id: crypto.randomUUID(),
          gridId,
          durationMs,
          finishedAt: Date.now(),
        };
        set((state) => ({
          attemptsByGrid: {
            ...state.attemptsByGrid,
            [gridId]: [...(state.attemptsByGrid[gridId] ?? []), attempt],
          },
        }));
      },
    }),
    {
      name: "schulte-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
