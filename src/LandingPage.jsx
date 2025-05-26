import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white px-4">
            <div className="w-full max-w-2xl flex flex-col items-center gap-12 p-8 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 mt-12 animate-fade-in">
                {/* Hero Section */}
                <section className="flex flex-col items-center gap-4 w-full">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-lime-400 drop-shadow-lg text-center">
                        Stop Memorizing. Start Conjugating.
                    </h1>
                    <p className="text-zinc-300 text-lg md:text-xl text-center max-w-xl">
                        If you're serious about mastering Japanese verbs, you need more than a streak and a cartoon owl. This app is for people who want conjugation to become second nature—no hints, no hand-holding, just relentless, focused practice.
                    </p>
                    <Link to="/drill" className="w-full">
                        <button className="w-full bg-lime-500 hover:bg-lime-400 text-black py-4 rounded-lg transition-colors font-bold text-2xl shadow-md mt-2 cursor-pointer">
                            Start Drilling
                        </button>
                    </Link>
                    <span className="text-zinc-400 text-sm mt-2">No hearts. No XP. No distractions. Just results.</span>
                </section>

                {/* Duolingo Critique Section */}
                <section className="w-full flex flex-col gap-2 bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                    <h2 className="text-2xl font-bold text-lime-300 mb-2">Why Not Duolingo?</h2>
                    <p className="text-zinc-300 text-base">
                        Duolingo is great if you want to feel productive in a couple minutes a day. But if you're truly serious about learning Japanese, you need more than a green owl and a daily streak. Duolingo is designed for casual learners who want to check a box, not for those who want to master a language at a deep level.
                    </p>
                    <p className="text-zinc-400 text-sm mt-2 italic">"Not affiliated with Duolingo. In fact, we think you deserve better."</p>
                </section>

                {/* YouTube Formulaic Critique Section */}
                <section className="w-full flex flex-col gap-2 bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                    <h2 className="text-2xl font-bold text-lime-300 mb-2">Beyond YouTube Formulas</h2>
                    <p className="text-zinc-300 text-base">
                        Most YouTube videos teach you a formulaic, step-by-step way to conjugate verbs. That's helpful at first, but do you think Japanese natives are running through a mental checklist every time they speak? Of course not. They just do it—naturally, effortlessly, and instantly.
                    </p>
                </section>

                {/* The Drill Philosophy Section */}
                <section className="w-full flex flex-col gap-2 bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                    <h2 className="text-2xl font-bold text-lime-300 mb-2">Train Your Brain, Not Just Your Memory</h2>
                    <p className="text-zinc-300 text-base">
                        This drill is designed to help you build the muscle memory you need to conjugate Japanese verbs without thinking. In the beginning, it will be difficult. You might feel slow, and you might make mistakes. But if you keep going, it will become natural and easy—just like it is for native speakers.
                    </p>
                    <span className="text-zinc-400 text-sm mt-2">"The only way out is through."</span>
                </section>
            </div>
        </div>
    );
}

