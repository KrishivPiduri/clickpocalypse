import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as wanakana from 'wanakana';
import { inflect, Inflection, Group } from '@surreptus/japanese-conjugator';

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

const getGroup = (verb) => {
    if (verb.type === "ichidan") return Group.Ichidan;
    if (verb.type === "godan") return Group.Godan;
    if (verb.dictionary === "する") return Group.Suru;
    if (verb.dictionary === "いく") return Group.Godan; // special case, but treat as godan for now
    return undefined;
};

const conjugationKeyToInflection = {
    plainPresent: Inflection.Present,
    plainPast: Inflection.Past,
    plainNegative: Inflection.Negative,
    plainPastNegative: Inflection.PastNegative,
    teForm: Inflection.Te,
    politePresent: Inflection.Polite,
    politePast: Inflection.PolitePast,
    politeNegative: Inflection.PoliteNegative,
    politePastNegative: Inflection.PolitePastNegative,
    volitional: Inflection.Volitional,
    potential: Inflection.Potential,
    causative: Inflection.Causative,
    passive: Inflection.Passive,
};

const conjugate = (verb, type) => {
    const inflection = conjugationKeyToInflection[type];
    const group = getGroup(verb);
    if (group !== undefined) {
        return inflect(verb.dictionary, inflection, group);
    }
    // fallback for irregulars not handled by the lib
    return inflect(verb.dictionary, inflection);
};

const kanaToRomajiSimple = (hiraganaText) => {
    return wanakana.toRomaji(hiraganaText);
};
const romajiToKanaSimple = (romajiText) => {
    return wanakana.toHiragana(romajiText);
};

// Feedback animation variants
const feedbackVariants = {
    correct: {
        scale: [1, 1.2, 1],
        color: ["#bef264", "#a3e635", "#bef264"],
        transition: { duration: 0.6, times: [0, 0.5, 1] }
    },
    incorrect: {
        x: [0, -10, 10, -10, 10, 0],
        color: ["#f87171", "#ef4444", "#f87171"],
        transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    },
    initial: { scale: 1, x: 0, color: "#f1f1f1" }
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

    const focusInput = () => {
        if (inputRef.current) inputRef.current.focus();
    };

    const generateQuestion = () => {
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const conjugation = selectedConjugations[Math.floor(Math.random() * selectedConjugations.length)];
        setCurrentVerb(verb);
        setCurrentConjugation(conjugation);
        setUserInput("");
        setFeedback(null);
        setTimeout(focusInput, 0);
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
                setTimeout(focusInput, 0);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [lastCorrect, feedback]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (waitingForNext) {
            setWaitingForNext(false);
            setLastCorrect(null);
            setFeedback(null);
            setUserInput("");
            setTimeout(() => {
                generateQuestion();
                focusInput();
            }, 0);
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
        setTimeout(focusInput, 0);
    };

    if (!quizStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="max-w-md w-full p-8 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-700 flex flex-col items-center gap-6 animate-fade-in">
                    <h2 className="text-3xl font-extrabold mb-2 text-lime-400 tracking-tight drop-shadow-lg">Japanese Verb Conjugation Drill</h2>
                    <p className="text-zinc-300 mb-2 text-center text-lg">Select the conjugation types you want to practice:</p>
                    <div className="grid grid-cols-2 gap-3 w-full">
                        {conjugationTypes.map((type) => (
                            <label key={type.key} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-700 transition-colors border border-transparent hover:border-lime-400">
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
                                    className="accent-lime-500 w-4 h-4"
                                />
                                <span className="text-zinc-100 text-base">{type.label}</span>
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={() => setQuizStarted(true)}
                        disabled={selectedConjugations.length === 0}
                        className="w-full bg-lime-500 hover:bg-lime-400 text-black py-3 rounded-lg transition-colors font-bold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
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
                                    className="flex-1 bg-lime-500 hover:bg-lime-400 text-black py-2 rounded-md transition-colors font-bold cursor-pointer"
                                    disabled={lastCorrect === true}
                                >
                                    {waitingForNext ? "Next" : "Submit"}
                                </button>
                            </div>
                        </form>
                        {feedback && (
                            <motion.p
                                className={`mt-4 text-lg font-bold flex items-center justify-center gap-2 select-none`}
                                initial="initial"
                                animate={lastCorrect ? "correct" : "incorrect"}
                                variants={feedbackVariants}
                            >
                                {lastCorrect && <span role="img" aria-label="confetti">🎉</span>}
                                {feedback}
                            </motion.p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
