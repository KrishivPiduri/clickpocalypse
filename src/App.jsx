import React from "react";
import { SockProvider } from "./store.jsx";
import PlayerStatsPanel from "./PlayerStatsPanel";
import GeneratorStatsPanel from "./GeneratorStatsPanel";

function AppContent() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-950 to-purple-950 flex flex-col font-mono">
            <header className="text-center py-6 text-2xl font-bold tracking-widest text-yellow-200 neon-glow drop-shadow-lg">
                🧦 THE SOCK MULTIVERSE
            </header>
            <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-12 pb-4">
                <PlayerStatsPanel />
                <GeneratorStatsPanel />
            </main>
        </div>
    );
}

export default function App() {
    return (
        <SockProvider>
            <AppContent />
        </SockProvider>
    );
}
