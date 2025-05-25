import React, { useMemo } from "react";
import { useSockverse } from "./store.jsx";

const EMERGENCY_COOLDOWN = 10000; // 10 seconds
const FLAVOR_TEXTS = [
  "A sock limps out… traumatized but usable.",
  "You hear a scream. You gain lint.",
  "It was wedged behind the drum this whole time."
];

const PlayerStatsPanel = () => {
  const {
    lint,
    sockPower,
    generators,
    lastEmergencySockTime,
    yoinkSock,
    buyGenerator,
    smackDryer,
    getGeneratorCost,
    GENERATOR_CONFIG
  } = useSockverse();

  // Check if stuck (no lint, no generators, cooldown expired)
  const isStuck =
    lint < 1 &&
    Object.values(generators).every((n) => n === 0) &&
    (!lastEmergencySockTime || Date.now() - lastEmergencySockTime > EMERGENCY_COOLDOWN);

  // Random flavor text for Smack the Dryer
  const flavor = useMemo(() => FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)], [lastEmergencySockTime]);

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-xl p-6 shadow-lg border border-purple-500/40 text-cyan-100">
      <h1 className="text-2xl font-mono font-bold tracking-widest mb-2 text-yellow-200">🧦 The Sock Multiverse</h1>
      <div className="mb-4 space-y-1">
        <div className="text-lg">🧵 <b>Lint:</b> <span className="text-yellow-300">{Math.floor(lint)}</span></div>
        {sockPower > 0 && (
          <div className="text-lg">🌀 <b>Sock Power:</b> <span className="text-pink-300">{sockPower}</span></div>
        )}
      </div>
      <button
        className="w-full py-3 mb-6 bg-pink-600 hover:bg-pink-700 rounded-lg font-bold text-xl shadow-md transition"
        onClick={yoinkSock}
      >
        🧦 YOINK Sock from the Multiverse
      </button>
      <div className="mb-4">
        <h2 className="font-mono text-magenta-200 text-lg mb-2">Generators</h2>
        <div className="space-y-2">
          {Object.keys(GENERATOR_CONFIG).map((type) => {
            const conf = GENERATOR_CONFIG[type];
            let desc = "";
            if (type === "giantLintFilter") desc = "Industrial-sized. Filters lint, dreams, and the occasional housecat.";
            if (type === "dryerLintExtractor") desc = "Extracts lint with the power of a thousand annoyed moms.";
            if (type === "sockVortexAmplifier") desc = "Amplifies sock-based anomalies. May cause minor rifts in space-time.";
            if (type === "laundryDemon") desc = "Not technically legal. Will work for pizza rolls and chaos.";
            return (
              <div key={type} className="flex flex-col bg-blue-950/60 rounded p-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{conf.emoji}</span>
                  <b>{conf.name}</b>
                </div>
                <div className="text-xs italic text-cyan-300 mb-1 pl-7">{desc}</div>
                <div className="flex flex-wrap gap-4 items-center text-sm pl-7">
                  <span>Cost: <b>{getGeneratorCost(type, generators[type])}</b> 🧵</span>
                  <button
                    className="px-3 py-1 bg-cyan-700 hover:bg-cyan-800 rounded text-sm font-bold disabled:opacity-40"
                    onClick={() => buyGenerator(type)}
                    disabled={lint < getGeneratorCost(type, generators[type])}
                  >Buy</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isStuck && (
        <div className="mt-6 p-4 bg-red-900/70 rounded-lg text-center">
          <button
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-bold text-lg mb-2"
            onClick={smackDryer}
          >
            🔔 Smack the Dryer
          </button>
          <div className="italic text-sm text-red-200">{flavor}</div>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsPanel;

