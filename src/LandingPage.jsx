import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Hero Section */}
            <section className="text-center py-20 px-6 bg-gradient-to-b from-blue-100 to-white">
                <h1 className="text-5xl font-bold mb-4">Understand Japanese Sentences, One Word at a Time</h1>
                <p className="text-xl max-w-2xl mx-auto text-gray-700">
                    Paste any Japanese sentence—even one you can't read—and get a visual, logical breakdown of how it works.
                </p>
                <p className="text-md text-gray-600 mt-4">
                    (Need a sentence? Try copying something from a website or textbook.)
                </p>
                <Link to="/parse">
                    <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                        Analyze a Japanese Sentence
                    </button>
                </Link>
            </section>

            {/* How it Works Section */}
            <section className="max-w-4xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold mb-6 text-center">How This Works</h2>
                <p className="text-lg mb-4">
                    Japanese sentences are incredibly logical. This tool represents Japanese sentences as <strong>trains</strong>, where each component is a train car or engine.
                </p>
                <p className="text-lg mb-4">
                    <strong>Cars</strong> represent the supporting structure: things like objects, subjects, and other particles.
                </p>
                <p className="text-lg mb-4">
                    <strong>Engines</strong> represent the action. Verbs and suffixes attach together like engine parts—each one propels the sentence forward.
                </p>
                <p className="text-lg mb-4">
                    The very last engine is always the main action of the sentence—rendered in <strong>black</strong>. Others are rendered in <strong>white</strong>.
                </p>
                <p className="text-lg">
                    This design was inspired by Cure Dolly, who teaches Japanese with a very logical approach.
                </p>
            </section>

            {/* About Section */}
            <section className="bg-gray-100 py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-center">Why This Exists</h2>
                    <p className="text-lg mb-4">
                        As a programmer, I wanted a system that appealed to my logical brain. This tool breaks down Japanese sentences structurally and visually—like inspecting train blueprints.
                    </p>
                    <p className="text-lg">
                        I built this for learners like me. Hope it helps you too!
                    </p>
                </div>
            </section>

            {/* Call to Action Again */}
            <section className="text-center py-12 px-6">
                <h2 className="text-2xl font-semibold mb-4">Ready to see how it works?</h2>
                <Link to="/parse">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                        Try the Analyzer
                    </button>
                </Link>
                <p className="text-sm text-gray-500 mt-2 italic">(Don't worry, you can use a sample sentence right away!)</p>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-6 text-sm">
                <p>
                    Also check out the <Link to="/drill" className="underline hover:text-blue-300">Japanese verb conjugation drill</Link>—a small side tool that helps you master verb forms.
                </p>
            </footer>
        </div>
    );
}
