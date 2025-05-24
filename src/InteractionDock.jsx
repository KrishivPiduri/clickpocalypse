import React, { useState } from "react";

const tabs = ["Sabotage", "Collaborate", "Upgrades", "Messages"];

const InteractionDock = () => {
  const [activeTab, setActiveTab] = useState("Sabotage");

  return (
    <div className="bg-gradient-to-t from-indigo-950 via-blue-950 to-purple-950 rounded-t-2xl p-4 shadow-2xl border-t border-blue-500/30 text-cyan-100">
      <div className="flex justify-between mb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-mono rounded-t-lg transition text-sm cursor-pointer ${
              activeTab === tab
                ? "bg-cyan-800 text-cyan-100 shadow-lg"
                : "bg-transparent text-cyan-400 hover:text-cyan-100 hover:bg-cyan-700/30 hover:shadow-md"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-black/30 rounded-xl p-4 min-h-[120px]">
        {/* Tab content placeholder */}
        <div className="font-mono text-cyan-200 cursor-pointer">{activeTab} content goes here.</div>
      </div>
    </div>
  );
};

export default InteractionDock;

