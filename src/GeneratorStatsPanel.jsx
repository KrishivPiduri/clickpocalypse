import React from "react";
import { useSockverse } from "./store.jsx";

const GeneratorStatsPanel = () => {
  const { generators, GENERATOR_CONFIG } = useSockverse();

  return (
    <div className="max-w-md mx-auto bg-blue-950/80 rounded-xl p-4 shadow border border-cyan-700/40 text-cyan-100 mt-6">
      <h2 className="text-lg font-mono font-bold tracking-widest mb-3 text-cyan-200">Generator Stats</h2>
      <div className="space-y-2">
        {Object.keys(GENERATOR_CONFIG).map((type) => {
          const conf = GENERATOR_CONFIG[type];
          const owned = generators[type];
          const perSecond = (conf.lintPerSec * owned).toFixed(2);
          return (
            <div key={type} className="flex items-center justify-between bg-blue-900/60 rounded p-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{conf.emoji}</span>
                <b>{conf.name}</b>
              </div>
              <div className="text-sm flex flex-col items-end">
                <span>Owned: <b>{owned}</b></span>
                <span>Total: <b>{perSecond}</b> 🧵/sec</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneratorStatsPanel;

