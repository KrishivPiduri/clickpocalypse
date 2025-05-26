import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as wanakana from 'wanakana';

const verbs = [
    { dictionary: "たべる", romaji: "taberu", meaning: "to eat", type: "ichidan" },
    { dictionary: "のむ", romaji: "nomu", meaning: "to drink", type: "godan" },
    { dictionary: "する", romaji: "suru", meaning: "to do", type: "irregular" },
    { dictionary: "いく", romaji: "iku", meaning: "to go", type: "irregular" },
];

const conjugationTypes = [
    { label: "Plain Present", key: "plainPresent" },
    { label: "Plain Past", key: "plainPast" },
    { label: "Plain Negative", key: "plainNegative" },
    { label: "Plain Past Negative", key: "plainPastNegative" },
    { label: "Te Form", key: "teForm" },
    { label: "Polite Present", key: "politePresent" },
    { label: "Polite Past", key: "politePast" },
    { label: "Polite Negative", key: "politeNegative" },
    { label: "Polite Past Negative", key: "politePastNegative" },
    { label: "Volitional", key: "volitional" },
    { label: "Potential", key: "potential" },
    { label: "Causative", key: "causative" },
    { label: "Passive", key: "passive" },
];

const getStem = (verb) => {
    if (verb.type === "ichidan") {
        return verb.dictionary.slice(0, -1);
    }
    if (verb.type === "godan") {
        const lastChar = verb.dictionary.slice(-1);
        const base = verb.dictionary.slice(0, -1);
        const godanMap = {
            "う": { i: "い", a: "わ", te: "って", ta: "った" },
            "く": { i: "き", a: "か", te: "いて", ta: "いた" },
            "ぐ": { i: "ぎ", a: "が", te: "いで", ta: "いだ" },
            "す": { i: "し", a: "さ", te: "して", ta: "した" },
            "つ": { i: "ち", a: "た", te: "って", ta: "った" },
            "ぬ": { i: "に", a: "な", te: "んで", ta: "んだ" },
            "ぶ": { i: "び", a: "ば", te: "んで", ta: "んだ" },
            "む": { i: "み", a: "ま", te: "んで", ta: "んだ" },
            "る": { i: "り", a: "ら", te: "って", ta: "った" },
        };
        return {
            iStem: base + godanMap[lastChar]?.i,
            aStem: base + godanMap[lastChar]?.a,
            teForm: base + godanMap[lastChar]?.te,
            taForm: base + godanMap[lastChar]?.ta,
        };
    }
    return {};
};

const conjugate = (verb, type) => {
    const { dictionary, type: verbType } = verb;
    if (verbType === "ichidan") {
        const stem = getStem(verb);
        switch (type) {
            case "plainPresent": return dictionary;
            case "plainPast": return stem + "た";
            case "plainNegative": return stem + "ない";
            case "plainPastNegative": return stem + "なかった";
            case "teForm": return stem + "て";
            case "politePresent": return stem + "ます";
            case "politePast": return stem + "ました";
            case "politeNegative": return stem + "ません";
            case "politePastNegative": return stem + "ませんでした";
            case "volitional": return stem + "よう";
            case "potential": return stem + "られる";
            case "causative": return stem + "させる";
            case "passive": return stem + "られる";
        }
    }
    if (verbType === "godan") {
        const { iStem, aStem, teForm, taForm } = getStem(verb);
        switch (type) {
            case "plainPresent": return dictionary;
            case "plainPast": return taForm;
            case "plainNegative": return aStem + "ない";
            case "plainPastNegative": return aStem + "なかった";
            case "teForm": return teForm;
            case "politePresent": return iStem + "ます";
            case "politePast": return iStem + "ました";
            case "politeNegative": return iStem + "ません";
            case "politePastNegative": return iStem + "ませんでした";
            case "volitional": return iStem + "う";
            case "potential": return aStem + "れる";
            case "causative": return aStem + "せる";
            case "passive": return aStem + "れる";
        }
    }
    if (dictionary === "する") {
        switch (type) {
            case "plainPresent": return "する";
            case "plainPast": return "した";
            case "plainNegative": return "しない";
            case "plainPastNegative": return "しなかった";
            case "teForm": return "して";
            case "politePresent": return "します";
            case "politePast": return "しました";
            case "politeNegative": return "しません";
            case "politePastNegative": return "しませんでした";
            case "volitional": return "しよう";
            case "potential": return "できる";
            case "causative": return "させる";
            case "passive": return "される";
        }
    }
    if (dictionary === "いく") {
        switch (type) {
            case "plainPresent": return "いく";
            case "plainPast": return "いった";
            case "plainNegative": return "いかない";
            case "plainPastNegative": return "いかなかった";
            case "teForm": return "いって";
            case "politePresent": return "いきます";
            case "politePast": return "いきました";
            case "politeNegative": return "いきません";
            case "politePastNegative": return "いきませんでした";
            case "volitional": return "いこう";
            case "potential": return "いける";
            case "causative": return "いかせる";
            case "passive": return "いかれる";
        }
    }
    return "";
};

const kanaToRomajiSimple = (hiraganaText) => {
    return wanakana.toRomaji(hiraganaText);
};
const romajiToKanaSimple = (romajiText) => {
    return wanakana.toHiragana(romajiText);
};

export default function VerbConjugationDrill() {
    const [currentVerb, setCurrentVerb] = useState(null);
    const [currentConjugation, setCurrentConjugation] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [selectedConjugations, setSelectedConjugations] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [lastCorrect, setLastCorrect] = useState(null);
    const [waitingForNext, setWaitingForNext] = useState(false);
    const inputRef = useRef(null);

    const generateQuestion = () => {
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const conjugation = selectedConjugations[Math.floor(Math.random() * selectedConjugations.length)];
        setCurrentVerb(verb);
        setCurrentConjugation(conjugation);
        setUserInput("");
        setFeedback(null);
        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 0);
    };

    useEffect(() => {
        if (quizStarted) generateQuestion();
    }, [quizStarted]);

    useEffect(() => {
        let timer;
        if (lastCorrect === true && feedback) {
            timer = setTimeout(() => {
                generateQuestion();
                setFeedback(null);
                setLastCorrect(null);
                setWaitingForNext(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [lastCorrect, feedback]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (waitingForNext) {
            generateQuestion();
            setFeedback(null);
            setLastCorrect(null);
            setWaitingForNext(false);
            setUserInput("");
            return;
        }
        const answerKana = conjugate(currentVerb, currentConjugation.key);
        const answerRomaji = kanaToRomajiSimple(answerKana);
        const input = userInput.trim();
        const inputKana = wanakana.isRomaji(input) ? romajiToKanaSimple(input) : input;
        const isCorrect = inputKana === answerKana || input.toLowerCase() === answerRomaji;
        setLastCorrect(isCorrect);
        setFeedback(
            isCorrect ? "✅ Correct!" : `❌ Incorrect. Correct answer: ${answerKana} (${answerRomaji})`
        );
        if (!isCorrect) {
            setWaitingForNext(true);
        }
    };

    if (!quizStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="max-w-md w-full p-6 bg-zinc-900 text-white rounded-xl shadow-lg border border-zinc-700">
                    <h2 className="text-2xl font-bold mb-4 text-lime-400">Choose Conjugation Types</h2>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {conjugationTypes.map((type) => (
                            <label key={type.key} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedConjugations.includes(type)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedConjugations([...selectedConjugations, type]);
                                        } else {
                                            setSelectedConjugations(selectedConjugations.filter((t) => t !== type));
                                        }
                                    }}
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={() => setQuizStarted(true)}
                        disabled={selectedConjugations.length === 0}
                        className="w-full bg-lime-500 hover:bg-lime-400 text-black py-2 rounded-md transition-colors font-bold disabled:opacity-50"
                    >
                        Start Drill
                    </button>
                </div>
            </div>
        );
    }

    if (!currentVerb || !currentConjugation) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="max-w-md w-full p-6 bg-zinc-900 text-white rounded-xl shadow-lg border border-zinc-700">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentVerb.dictionary + currentConjugation.key + feedback}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-lime-400">Conjugation Drill</h2>
                        <p className="mb-1">
                            <span className="text-zinc-400">Verb:</span> <span className="font-semibold">{currentVerb.dictionary}</span> ({currentVerb.romaji}) – {currentVerb.meaning}
                        </p>
                        <p className="mb-6">
                            <span className="text-zinc-400">Form:</span> <span className="font-semibold">{currentConjugation.label}</span>
                        </p>
                        <form onSubmit={handleSubmit} className="mb-4">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="w-full bg-zinc-800 text-white p-3 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-400 placeholder-zinc-400"
                                placeholder="Type the conjugated form (kana or romaji)"
                                disabled={lastCorrect === true}
                            />
                            <div className="flex gap-2 mt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-lime-500 hover:bg-lime-400 text-black py-2 rounded-md transition-colors font-bold"
                                    disabled={lastCorrect === true}
                                >
                                    {waitingForNext ? "Next" : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        generateQuestion();
                                        setFeedback(null);
                                        setLastCorrect(null);
                                        setWaitingForNext(false);
                                    }}
                                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-md transition-colors"
                                    disabled={lastCorrect === true}
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                        {feedback && <motion.p className="mt-4 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{feedback}</motion.p>}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
