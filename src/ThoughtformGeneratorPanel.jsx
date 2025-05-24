import React from "react";
import useNeurocrankStore from "./store";

const ThoughtformGeneratorPanel = () => {
  const {
    cu,
    rawConcepts,
    maxRawConcepts,
    autoSculptors,
    autoRate,
    crystallizeThoughtform,
    buyRawConcepts,
    buyAutoSculptor
  } = useNeurocrankStore();

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-xl p-6 shadow-lg border border-blue-500/40 text-cyan-100">
      <h2 className="text-lg font-mono font-bold tracking-widest mb-4 text-cyan-300 glow">THOUGHTFORM GENERATOR</h2>
      <button
        className="w-full py-4 mb-4 bg-cyan-700 hover:bg-cyan-500 transition rounded-lg text-xl font-mono font-bold shadow-md neon-glow cursor-pointer"
        onClick={crystallizeThoughtform}
      >
        CRYSTALLIZE THOUGHTFORM
      </button>
      <div className="space-y-2 text-sm">
        <div>Click Value: <span className="font-bold text-cyan-200">+12 CU</span></div>
        <div>CU Conversion Rate: <span className="font-bold text-cyan-200">1:1</span></div>
        <div>Auto-Sculptors: <span className="font-bold text-cyan-200">{autoSculptors}</span></div>
        <div>Efficiency: <span className="font-bold text-cyan-200">{autoRate}/sec</span></div>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <button
          className="bg-blue-800 hover:bg-blue-600 transition rounded px-3 py-2 font-mono text-cyan-100 shadow cursor-pointer"
          onClick={buyRawConcepts}
        >
          ➕ Buy Raw Concepts [400 CU]
        </button>
        <button
          className="bg-purple-800 hover:bg-purple-600 transition rounded px-3 py-2 font-mono text-cyan-100 shadow cursor-pointer"
          onClick={buyAutoSculptor}
        >
          ➕ Buy Auto-Sculptor [750 CU]
        </button>
      </div>
    </div>
  );
};

export default ThoughtformGeneratorPanel;

