import React, { useState, useRef } from "react";
import * as wanakana from 'wanakana';

const sentenceTemplates = [
    {
        en: "I will give the book to my friend.",
        jp: "watashi wa tomodachi ni hon o agemasu.",
        vocab: [
            { en: "I", jp: "watashi" },
            { en: "friend", jp: "tomodachi" },
            { en: "book", jp: "hon" },
            { en: "ni" },
            { en: "wa" },
            { en: "o" },
            { en: "agemasu", verb: true, base: "ageru" },
        ],
        answer: "watashi wa tomodachi ni hon o agemasu"
    },
    {
        en: "She eats an apple.",
        jp: "kanojo wa ringo o tabemasu.",
        vocab: [
            { en: "she", jp: "kanojo" },
            { en: "apple", jp: "ringo" },
            { en: "wa" },
            { en: "o" },
            { en: "tabemasu", verb: true, base: "taberu" },
        ],
        answer: "kanojo wa ringo o tabemasu"
    },
    {
        en: "They will write a letter for the teacher.",
        jp: "karera wa sensei no tame ni tegami o kakimasu.",
        vocab: [
            { en: "they", jp: "karera" },
            { en: "teacher", jp: "sensei" },
            { en: "no tame ni" },
            { en: "letter", jp: "tegami" },
            { en: "wa" },
            { en: "o" },
            { en: "kakimasu", verb: true, base: "kaku" },
        ],
        answer: "karera wa sensei no tame ni tegami o kakimasu"
    },
    {
        en: "You (polite) will buy water at the store.",
        jp: "anata wa mise de mizu o kaimasu.",
        vocab: [
            { en: "you (polite)", jp: "anata" },
            { en: "store", jp: "mise" },
            { en: "de" },
            { en: "water", jp: "mizu" },
            { en: "wa" },
            { en: "o" },
            { en: "kaimasu", verb: true, base: "kau" },
        ],
        answer: "anata wa mise de mizu o kaimasu"
    },
];

const particleMeanings = {
    wa: "(topic marker)",
    o: "(object marker)",
    ni: "to (indirect object marker)",
    de: "at (location)",
    "no tame ni": "for",
};

const verbConjugations = {
    agemasu: { base: "ageru", meaning: "to give", polite: "agemasu" },
    tabemasu: { base: "taberu", meaning: "to eat", polite: "tabemasu" },
    kakimasu: { base: "kaku", meaning: "to write", polite: "kakimasu" },
    kaimasu: { base: "kau", meaning: "to buy", polite: "kaimasu" },
};

export default function SentenceBuilder() {
    const [showParticles, setShowParticles] = useState(false);
    const [showConjugations, setShowConjugations] = useState(false);
    const [current, setCurrent] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState(null);
    const inputRef = useRef(null);
    const template = sentenceTemplates[current];

    function normalizeInput(input) {
        return wanakana.toRomaji(input)
            .replace(/\s+/g, " ")
            .replace(/\bwo\b/g, "o")
            .replace(/\bga\b/g, "wa")
            .replace(/\.$/, "")
            .trim()
            .toLowerCase();
    }

    function tokenizeAndNormalize(input) {
        return normalizeInput(input).split(' ').filter(Boolean);
    }

    function isVerbMatch(userVerb, correctVerb) {
        return userVerb.startsWith(correctVerb);
    }

    function checkFlexibleAnswer(userInput, template) {
        const userWords = tokenizeAndNormalize(userInput);
        const required = template.vocab.filter(v => !["wa", "ga", "o", "wo", "ni", "de", "no tame ni"].includes(v.en));

        for (const v of required) {
            if (v.verb && verbConjugations[v.en]) {
                const found = userWords.some(w => isVerbMatch(w, verbConjugations[v.en].base));
                if (!found) return false;
            } else if (v.jp) {
                const found = userWords.includes(wanakana.toRomaji(v.jp));
                if (!found) return false;
            }
        }
        return true;
    }

    const checkAnswer = (e) => {
        e.preventDefault();
        if (checkFlexibleAnswer(userInput, template)) {
            setFeedback({ correct: true, message: "✅ Correct!" });
            setTimeout(() => {
                setFeedback(null);
                setUserInput("");
                setCurrent((c) => (c + 1) % sentenceTemplates.length);
                if (inputRef.current) inputRef.current.focus();
            }, 1500);
        } else {
            setFeedback({ correct: false, message: `❌ Incorrect. Correct answer: ${template.answer}` });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
            <div className="max-w-xl w-full p-8 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 flex flex-col gap-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-lime-400 text-center">Japanese Sentence Builder</h2>
                <div className="flex flex-col gap-2 items-center">
                    <span className="text-lg text-zinc-200 text-center">Form this sentence in Japanese:</span>
                    <span className="text-xl font-semibold text-lime-300 text-center">{template.en}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-zinc-400 text-sm">Vocabulary you can use:</span>
                    <div className="flex flex-wrap gap-2">
                        {template.vocab.map((v, i) => (
                            <span key={i} className="bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700 text-zinc-100 text-sm">
                {v.verb && verbConjugations[v.en] ? (
                    <span className="text-white">
                    {verbConjugations[v.en].base} ({verbConjugations[v.en].meaning})
                        {showConjugations && <span className="text-lime-400 ml-2">Conjugated: {verbConjugations[v.en].polite}</span>}
                  </span>
                ) : (
                    <>
                        {v.en} {v.jp && <span className="text-lime-400">({v.jp})</span>}
                        {(!v.jp && particleMeanings[v.en] && showParticles) && (
                            <span className="text-cyan-400 ml-1">{particleMeanings[v.en]}</span>
                        )}
                    </>
                )}
              </span>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-md text-xs border border-zinc-600"
                            onClick={() => setShowParticles(v => !v)}
                        >
                            {showParticles ? "Hide Particle Meanings" : "Show Particle Meanings"}
                        </button>
                        <button
                            type="button"
                            className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-md text-xs border border-zinc-600"
                            onClick={() => setShowConjugations(v => !v)}
                        >
                            {showConjugations ? "Hide Conjugated Verb" : "Show Conjugated Verb"}
                        </button>
                    </div>
                </div>
                <form onSubmit={checkAnswer} className="flex flex-col gap-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        className="w-full bg-zinc-800 text-white p-3 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-400 placeholder-zinc-400"
                        placeholder="Type your answer in romaji (e.g. watashi wa hon o yomimasu)"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-lime-500 hover:bg-lime-400 text-black py-2 rounded-md transition-colors font-bold text-lg shadow-md"
                    >
                        Check
                    </button>
                </form>
                {feedback && (
                    <div className={`text-lg font-bold text-center ${feedback.correct ? "text-lime-400" : "text-red-400"}`}>{feedback.message}</div>
                )}
            </div>
        </div>
    );
}
