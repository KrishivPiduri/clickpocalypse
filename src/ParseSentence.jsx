import React, { useState } from 'react';

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

// Engine component: white by default, black if isLast
const Engine = ({ node, isLast, selectedId, setSelected }) => {
    const style = isLast ? 'bg-black text-white' : 'bg-white text-black';
    const handleClick = (e) => {
        e.stopPropagation();
        setSelected(selectedId === node.id ? null : node.id);
    };
    return (
        <div className={`mx-2 ${selectedId === node.id ? 'border-dashed border-2 rounded-2xl' : ''}`}>
            <div
                className={`flex flex-col items-center p-2 rounded-2xl shadow-lg ${style} cursor-pointer`}
                onClick={handleClick}
            >
                <span className="text-2xl">🚂</span>
                <span className="mt-1 font-semibold">{node.text}</span>
                <span className="text-xs italic">{node.eng}</span>
            </div>
        </div>
    );
};

// Car component: wraps entire subtree, includes nested cars and engines
const Car = ({ node, selectedId, setSelected }) => {
    const legend = particleLegend[node.subtype] || { color: 'bg-gray-200', emoji: '🚃' };
    const handleClick = (e) => {
        e.stopPropagation();
        setSelected(selectedId === node.id ? null : node.id);
    };
    // within modifier: separate cars, engines; ensure engines ordered: stems then suffix; suffix last
    const mod = node.modifier;
    let modCars = [];
    let modEngines = [];
    if (mod) {
        modCars = mod.cars.filter(c => c.type === 'car');
        modEngines = mod.cars.filter(c => c.type === 'engine');
    }
    return (
        <div className="mx-2 my-1">
            <div className={`flex flex-row rounded-xl shadow ${legend.color} cursor-pointer`} onClick={handleClick}>
                {mod && (
                    <div className="flex items-center px-2 pt-2">
                        {modCars.map(c => (
                            <Car key={c.id} node={c} selectedId={selectedId} setSelected={setSelected} />
                        ))}
                        <Engine
                            node={mod}
                            isLast={modEngines.length === 0}
                            selectedId={selectedId}
                            setSelected={setSelected}
                        />
                        {modEngines.map((eng, idx) => (
                            <Engine
                                key={eng.id}
                                node={eng}
                                isLast={idx === modEngines.length - 1}
                                selectedId={selectedId}
                                setSelected={setSelected}
                            />
                        ))}
                    </div>
                )}
                <div className="flex items-center p-2" onClick={handleClick}>
                    <span className="text-2xl mr-1">{legend.emoji}</span>
                    <div>
                        <div className="font-medium">{node.text}</div>
                        <div className="text-xs italic text-gray-700">{node.eng}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// SentenceVisualizer: render cars first, then main stem engine, then suffix engines
const SentenceVisualizer = ({ node, selectedId, setSelected }) => {
    // separate cars and engines in main clause
    const clauseCars = node.cars.filter(c => c.type === 'car');
    const clauseEngines = node.cars.filter(c => c.type === 'engine');
    return (
        <div className="flex flex-wrap items-center mt-6">
            {clauseCars.map(car => (
                <Car key={car.id} node={car} selectedId={selectedId} setSelected={setSelected} />
            ))}
            <Engine
                node={node}
                isLast={clauseEngines.length === 0}
                selectedId={selectedId}
                setSelected={setSelected}
            />
            {clauseEngines.map((eng, idx) => (
                <Engine
                    key={eng.id}
                    node={eng}
                    isLast={idx === clauseEngines.length - 1}
                    selectedId={selectedId}
                    setSelected={setSelected}
                />
            ))}
        </div>
    );
};

const Legend = () => (
    <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Legend</h2>
        <div className="grid grid-cols-2 gap-4">
            {Object.entries(particleLegend).map(([key, { label, color, emoji }]) => (
                <div key={key} className="flex items-center">
                    <span className={`text-2xl mr-2 ${color} p-1 rounded`}>{emoji}</span>
                    <span><strong>{key}</strong>: {label}</span>
                </div>
            ))}
            <div className="flex items-center">
                <span className="text-2xl mr-2">🚂</span>
                <span><strong>Engine</strong>: only the final engine in sequence is black; all others are white.</span>
            </div>
        </div>
    </div>
);

const Desc = ({ selectedId, descs }) => {
    if (!selectedId) return (
        <div className="bg-gray-200 p-4 rounded-2xl my-4">
            <p className="text-xl font-semibold">Click on an engine or car to see description</p>
        </div>
    );

    const rawDesc = descs[selectedId];
    const lines = rawDesc.split('\n').filter(Boolean);

    const details = [];
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
                        <span className="font-semibold text-gray-700">{label}:</span>
                        <span className="text-gray-900">{value}</span>
                    </div>
                ))}
            </div>
            {extraText && (
                <p className="mt-4 text-sm text-gray-600 italic">{extraText.trim()}</p>
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
                    <SentenceVisualizer node={parsed} selectedId={selectedId} setSelected={setSelected} />
                    <Desc selectedId={selectedId} descs={descs} />
                </>
            )}
        </div>
    );
}