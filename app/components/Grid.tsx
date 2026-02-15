"use client";

import { useCallback, useEffect, useState } from "react";
import { useSessionStore } from "@/app/store/useSessionStore";
import { formatTime } from "@/app/utils/formatTime";

type Feedback = "correct" | "wrong" | null;

export function Grid() {
  const activeGridId = useSessionStore((s) => s.activeGridId);
  const grids = useSessionStore((s) => s.grids);
  const attemptsByGrid = useSessionStore((s) => s.attemptsByGrid);
  const saveAttempt = useSessionStore((s) => s.saveAttempt);

  const grid = activeGridId ? grids[activeGridId] : null;
  const attempts = activeGridId ? attemptsByGrid[activeGridId] ?? [] : [];

  const [nextExpected, setNextExpected] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [wrongCellNum, setWrongCellNum] = useState<number | null>(null);
  const [finishedTime, setFinishedTime] = useState<number | null>(null);

  const totalCells = grid ? grid.size * grid.size : 0;
  const isFinished = totalCells > 0 && nextExpected > totalCells;

  useEffect(() => {
    if (!isRunning || startTime === null) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const resetForGrid = useCallback(() => {
    setNextExpected(1);
    setStartTime(null);
    setElapsed(0);
    setIsRunning(false);
    setFeedback(null);
    setWrongCellNum(null);
    setFinishedTime(null);
  }, []);

  useEffect(() => {
    resetForGrid();
  }, [activeGridId, resetForGrid]);

  const bestTime =
    attempts.length > 0
      ? Math.min(...attempts.map((a) => a.durationMs))
      : 0;

  const handleCellClick = useCallback(
    (num: number) => {
      if (!grid || isFinished) return;
      if (num === nextExpected) {
        if (nextExpected === 1) {
          setStartTime(Date.now());
          setIsRunning(true);
        }
        setNextExpected((prev) => prev + 1);
        setFeedback("correct");
        setTimeout(() => setFeedback(null), 200);
        if (nextExpected + 1 > totalCells) {
          const endTime = Date.now();
          const start = startTime ?? endTime;
          const durationMs = endTime - start;
          saveAttempt(grid.id, durationMs);
          setFinishedTime(durationMs);
          setIsRunning(false);
          setElapsed(durationMs);
        }
      } else {
        setWrongCellNum(num);
        setFeedback("wrong");
        setTimeout(() => {
          setFeedback(null);
          setWrongCellNum(null);
        }, 200);
      }
    },
    [grid, nextExpected, totalCells, startTime, isFinished, saveAttempt]
  );

  if (!grid) {
    return (
      <p className="text-slate-400">
        Escolha um tamanho para começar
      </p>
    );
  }

  const displayElapsed = finishedTime !== null ? finishedTime : elapsed;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-lg font-mono tabular-nums text-slate-200">
          {formatTime(displayElapsed)}
        </span>
        {isFinished && (
          <>
            <span className="text-slate-400">Tempo: {formatTime(finishedTime ?? 0)}</span>
            {bestTime > 0 && (
              <span className="text-slate-400">
                Melhor: {formatTime(bestTime)}
              </span>
            )}
          </>
        )}
      </div>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${grid.size}, minmax(0, 1fr))`,
        }}
      >
        {grid.numbers.map((num) => {
          const isCorrectClick =
            feedback === "correct" && num === nextExpected - 1;
          const clicked = num < nextExpected;
          const showCorrect = clicked || isCorrectClick;
          const showWrong = feedback === "wrong" && wrongCellNum === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => handleCellClick(num)}
              disabled={isFinished}
              className={`flex h-14 w-14 items-center justify-center rounded text-2xl font-bold transition-colors duration-200 sm:h-16 sm:w-16 ${
                showCorrect
                  ? "bg-green-500/20 text-slate-100"
                  : showWrong
                    ? "bg-red-500/20 text-slate-100"
                    : "bg-slate-800 text-slate-100 hover:bg-slate-700"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
