import React, { useState } from 'react';
import TrainVisualizer from "./TrainVisualizer.jsx";

const particleLegend = {
    'は': { label: 'Topic', color: 'bg-yellow-200', emoji: '🚩', desc: 'Marks the topic.' },
    'も': { label: 'Topic', color: 'bg-yellow-200', emoji: '🚩', desc: 'Also a topic marker.' },
    'が': { label: 'Subject', color: 'bg-green-200', emoji: '🚃', desc: 'Marks the subject.' },
    'を': { label: 'Object', color: 'bg-blue-200', emoji: '🚃', desc: 'Marks the direct object.' },
    'に': { label: 'Goal', color: 'bg-purple-200', emoji: '🚃', desc: 'Marks direction or recipient.' },
    'で': { label: 'Location/Means', color: 'bg-red-200', emoji: '🚃', desc: 'Marks location or means.' },
    'と': { label: 'And/With', color: 'bg-indigo-200', emoji: '🚃', desc: 'Marks “and” or companionship.' }
};

const Instructions = () => (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">How This Works</h2>
        <p className="mb-2">
            Japanese sentences are incredibly logical. This tool represents Japanese sentences as trains, where each component is a train car or engine.
        </p>
        <p className="mb-2">
            <strong>Cars</strong> represent the supporting structure: things like objects, subjects, and other particles.
        </p>
        <p className="mb-2">
            <strong>Engines</strong> represent the action. Verbs and suffixes attach together like engine parts—each one propels the sentence forward.
        </p>
        <p className="mb-2">
            The very last engine is always the main action of the sentence—rendered in black. Others are rendered in white.
        </p>
        <p className="mb-2">
            This design was inspired by <a href="https://www.youtube.com/@CureDolly" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Cure Dolly</a>, who teaches Japanese with a very logical approach.
        </p>
        <p>
            As a programmer, I wanted a system that appealed to my logical brain. This tool breaks down sentences structurally and visually—like inspecting train blueprints. Hope it helps you too!
        </p>
    </div>
);

export const Engine = ({ engine, isLast, selectedId, setSelected }) => {
    // black engines will also carry a flag, engine.isBlack
    const style = engine.isBlack
        ? 'bg-black text-white'
        : 'bg-white text-black';

    const handleClick = e => {
        e.stopPropagation();
        setSelected(selectedId === engine.id ? null : engine.id);
    };

    return (
        <div
            className={`mx-2 ${selectedId === engine.id ? 'border-dashed border-2 rounded-2xl' : ''}`}
            onClick={handleClick}
        >
            <div
                className={`flex flex-col items-center p-2 rounded-2xl shadow-lg ${style} cursor-pointer`}
            >
                <span className="text-2xl">🚂</span>
                <span className="mt-1 font-semibold">{engine.text}</span>
                {/* if you have an English gloss you can wire it here */}
                {engine.eng && <span className="text-xs italic">{engine.eng}</span>}
            </div>
        </div>
    );
};

export const Car = ({ car, selectedId, setSelected, particleLegend }) => {
    const legend = particleLegend[car.type] || { color: 'bg-gray-200', emoji: '🚃' };

    const handleClick = e => {
        e.stopPropagation();
        setSelected(selectedId === car.id ? null : car.id);
    };

    // if there's a nested_train, split out its engines and cars
    const nested = car.nested_train;
    return (
        <div className="mx-2 my-1">
            <div
                className={`flex flex-row rounded-xl shadow ${legend.color} cursor-pointer`}
                onClick={handleClick}
            >
                {/* render nested train inside this car */}
                {nested && (
                    <div className="flex items-center px-2 pt-2">
                        <SentenceVisualizer
                            train={nested}
                            selectedId={selectedId}
                            setSelected={setSelected}
                            particleLegend={particleLegend}
                        />
                    </div>
                )}

                <div className="flex items-center p-2" onClick={handleClick}>
                    <span className="text-2xl mr-1">{legend.emoji}</span>
                    <div>
                        <div className="font-medium">{car.text}</div>
                        {/* optional gloss */}
                        {car.eng && (
                            <div className="text-xs italic text-gray-700">{car.eng}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SentenceVisualizer = ({
                                       train,
                                       selectedId,
                                       setSelected,
                                       particleLegend
                                   }) => {
    // main black engine
    const black = {
        id: train.black_engine.position,
        text: train.black_engine.text,
        eng: train.black_engine.eng,
        isBlack: true
    };

    // white engines (auxiliaries)
    const whites = train.white_engines.map(w => ({
        id: w.position,
        text: w.text,
        eng: w.eng,
        isBlack: false
    }));

    // cars
    const cars = train.cars.map(c => ({
        id: c.position,
        text: c.text,
        eng: c.eng,
        type: c.type,
        nested_train: c.nested_train
    }));

    return (
        <div className="flex flex-wrap items-center mt-6">
            {/* cars in order */}
            {cars.map(car => (
                <Car
                    key={car.id}
                    car={car}
                    selectedId={selectedId}
                    setSelected={setSelected}
                    particleLegend={particleLegend}
                />
            ))}

            {/* black engine */}
            <Engine
                engine={black}
                isLast={whites.length === 0}
                selectedId={selectedId}
                setSelected={setSelected}
            />

            {/* white engines */}
            {whites.map((eng, idx) => (
                <Engine
                    key={eng.id}
                    engine={eng}
                    isLast={idx === whites.length - 1}
                    selectedId={selectedId}
                    setSelected={setSelected}
                />
            ))}
        </div>
    );
};

const Legend = () => {
    // Role legend definitions matching visualizer
    const roleLegend = [
        { role: 'VERB_MAIN', label: 'Main Verb', emoji: '🚂', color: 'bg-black text-white' },
        { role: 'VERB_AUX', label: 'Auxiliary Verb', emoji: '🚂', color: 'bg-white border border-gray-400 text-black' },
        { role: 'NOUN', label: 'Noun', emoji: '🚃', color: 'bg-blue-300 text-black' },
        { role: 'PROPN', label: 'Proper Noun', emoji: '🚃', color: 'bg-purple-300 text-black' },
        { role: 'ADJ', label: 'Adjective', emoji: '✏️', color: 'bg-yellow-300 text-black' },
        { role: 'ADV', label: 'Adverb', emoji: '⚡', color: 'bg-indigo-300 text-black' },
        { role: 'PUNCT', label: 'Punctuation', emoji: '·', color: 'text-gray-600' }
    ];

    return (
        <div className="p-4 bg-white shadow rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Token Role Legend */}
                <div>
                    <h4 className="font-semibold mb-1">Token Roles</h4>
                    <ul>
                        {roleLegend.map(({ role, label, emoji, color }) => (
                            <li key={role} className="flex items-center mb-2">
                                <span className={`${color} px-2 py-1 rounded mr-2`}>{emoji}</span>
                                <span className="font-medium mr-1">{label}</span>
                                <span className="text-sm text-gray-600">({role})</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Particle Legend */}
                <div>
                    <h4 className="font-semibold mb-1">Particles</h4>
                    <ul>
                        {Object.entries(particleLegend).map(([particle, info]) => (
                            <li key={particle} className="flex items-center mb-2">
                                <span className={`${info.color} px-2 py-1 rounded mr-2`}>{info.emoji}</span>
                                <span className="font-medium mr-1">{particle}</span>
                                <span className="text-sm text-gray-600">{info.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
const Desc = ({ selectedId, descs, dict }) => {
    console.log(dict)
    if (!selectedId) return (
        <div className="bg-gray-200 p-4 rounded-2xl my-4">
            <p className="text-xl font-semibold">Click on an engine or car to see description</p>
        </div>
    );

    const rawDesc = descs[selectedId];
    const lines = rawDesc.split('\n').filter(Boolean);
    console.log(dict);
    const details = [[{reading: dict.data[0].japanese[0].reading, meaning: dict.data.senses[0].english_definitions[0]},0]];
    let extraText = "";

    lines.forEach(line => {
        const match = line.match(/^([\w\s]+):\s*(.+)$/);
        if (match) {
            details.push({ label: match[1], value: match[2] });
        } else {
            extraText += line + " ";
        }
    });

    return (
        <div className="bg-white p-6 rounded-2xl my-4 shadow">
            <div className="space-y-2">
                {details.map(({ label, value }, idx) => (
                    <div key={idx} className="flex gap-2">
                        <span className="font-bold text-gray-700">{label}:</span>
                        <span className="text-gray-900">{value}</span>
                    </div>
                ))}
            </div>
            {extraText && (
                <p className="mt-4 font-bold text-gray-600">{extraText.trim()}</p>
            )}
        </div>
    );
};


// Dummy parse for example
async function parseSentence(text) {
    const apiUrl = "https://0l7xvpr5ec.execute-api.us-east-1.amazonaws.com/";

    const headers = {
        "Content-Type": "application/json"
    };

    const body = JSON.stringify({ sentence: text });

    const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const { messageId } = await response.json();

    const s3Url = `https://d2tnulbm7epshk.cloudfront.net/${messageId}.json`;

    let data = null;
    for (let i = 0; i < 100; i++) {
        try {
            const result = await fetch(s3Url);
            if (result.ok) {
                data = await result.json();
                break;
            }
        } catch (err) {
            // ignore fetch errors temporarily
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!data) {
        throw new Error("Result not available after polling.");
    }

    return [data.descriptions, data.structure];
}


export default function App() {
    const [input, setInput] = useState('ご飯を食べた少女が寝てる');
    const [descs, setDescs] = useState({});
    const [parsed, setParsed] = useState(null);
    const [selectedId, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dict, setDict] = useState({});

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleParse = async () => {
        setLoading(true);
        setError(null);
        try {
            const [newDescs, newParsed] = await parseSentence(input);
            setDescs(newDescs);
            setParsed(newParsed);
            setSelected(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-4">Japanese Sentence Train Visualizer</h1>
            <Instructions />
            <Legend />
            <label className="font-bold">Enter your sentence here:</label>
            <div className="flex mb-4">
                <input
                    type="text"
                    className="flex-1 p-3 border rounded shadow mr-2"
                    placeholder="Enter sentence…"
                    value={input}
                    onChange={handleChange}
                />
                <button
                    onClick={handleParse}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow disabled:opacity-50"
                >
                    {loading ? 'Parsing…' : 'Parse'}
                </button>
            </div>

            {error && (
                <div className="text-red-600 mb-4">
                    Error: {error}
                </div>
            )}
            {parsed && (
                <>
                    <p className="my-4">Click on a box to view information about it</p>
                    <TrainVisualizer segments={parsed} particleLegend={particleLegend} descriptions={descs} setSelectedId={setSelected} setDict={setDict} dict={dict} />
                </>
            )}
            <Desc descs={descs} selectedId={selectedId} dict={dict} />
        </div>
    );
}