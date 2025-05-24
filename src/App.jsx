import React, { useEffect } from "react";
import ThoughtformGeneratorPanel from "./ThoughtformGeneratorPanel";
import PlayerStatsPanel from "./PlayerStatsPanel";
import InteractionDock from "./InteractionDock";
import useNeurocrankStore from "./store";

const chatLog = [
  "• You siphoned 120 CU from Player 2 using Neuro-Leech.",
  "• Player 3 sent you a Firewall Boost.",
  "• Sabotage Blocked! Mindburn deflected to Player 4."
];

const App = () => {
  const tick = useNeurocrankStore((s) => s.tick);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 100);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-950 to-purple-950 flex flex-col font-mono">
      {/* Header */}
      <header className="text-center py-6 text-2xl font-bold tracking-widest text-cyan-300 neon-glow drop-shadow-lg">
        🧠 NEUROCRANK INTERFACE
      </header>
      {/* Main grid */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-12 pb-4">
        <div>
          <ThoughtformGeneratorPanel />
        </div>
        <div>
          <PlayerStatsPanel />
        </div>
      </main>
      {/* Chat log */}
      <section className="mx-4 md:mx-12 mb-2 bg-black/40 rounded-lg p-4 border border-cyan-700/30 text-cyan-200 text-sm font-mono shadow-inner">
        <div className="mb-2 font-bold text-cyan-400">Chat Log:</div>
        <ul className="space-y-1">
          {chatLog.map((msg, idx) => (
            <li key={idx} className="pl-2 border-l-4 border-cyan-700/40">{msg}</li>
          ))}
        </ul>
      </section>
      {/* Interaction Dock */}
      <footer className="sticky bottom-0 z-10">
        <InteractionDock />
      </footer>
    </div>
  );
};

export default App;

