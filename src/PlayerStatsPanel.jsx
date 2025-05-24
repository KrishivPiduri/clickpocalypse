import React from "react";
import useNeurocrankStore from "./store";

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const PlayerStatsPanel = () => {
  const {
    cu,
    rawConcepts,
    maxRawConcepts,
    autoRate,
    sabotageShield,
    timeLeft,
    event
  } = useNeurocrankStore();

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-xl p-6 shadow-lg border border-purple-500/40 text-cyan-100">
      <h2 className="text-lg font-mono font-bold tracking-widest mb-4 text-magenta-300 glow">PLAYER STATS</h2>
      <div className="space-y-2 text-sm">
        <div>Player: <span className="font-bold text-cyan-200">NeuroCrank</span></div>
        <div>CUs: <span className="font-bold text-cyan-200">{Math.floor(cu)}</span></div>
        <div>Raw Concepts: <span className="font-bold text-cyan-200">{rawConcepts} / {maxRawConcepts}</span></div>
        <div>Auto-Rate: <span className="font-bold text-cyan-200">{autoRate}/sec</span></div>
        <div>Sabotage Shield: <span className={sabotageShield ? "font-bold text-green-400" : "font-bold text-red-400"}>{sabotageShield ? "Active" : "Inactive"}</span></div>
        <div>Time Left: <span className="font-bold text-yellow-300">{formatTime(timeLeft)}</span></div>
        <div>Event: <span className="font-bold text-pink-400">{event ? `${event.name} in ${formatTime(event.time)}` : "None"}</span></div>
      </div>
    </div>
  );
};

export default PlayerStatsPanel;

