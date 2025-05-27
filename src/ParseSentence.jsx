import React, { useState } from 'react';

const particleLegend = {
    'は': { label: 'Topic', color: 'bg-yellow-200', emoji: '🚩', desc: 'Marks the topic.' },
    'mo': { label: 'Topic', color: 'bg-yellow-200', emoji: '🚩', desc: 'Also a topic marker.' },
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

// Engine: white unless isLast===true, then black
const Engine = ({ node, isLast, selectedId, setSelected }) => {
    const style = isLast ? 'bg-black text-white' : 'bg-white text-black';
    return (
        <div className={`${selectedId===node.id ? 'border-dashed border-2 rounded-2xl' : ''} mx-2`}>
            <div
                className={`flex flex-col items-center ${selectedId===node.id ? 'p-1' : 'p-2'} rounded-2xl shadow-lg ${style} cursor-pointer`}
                onClick={() => setSelected(selectedId===node.id ? null : node.id)}
            >
                <span className="text-2xl">🚂</span>
                <span className="mt-1 font-semibold">{node.text}</span>
                <span className="text-xs italic">{node.eng}</span>
            </div>
        </div>
    );
};

// Car: wraps subtree + head; applies background to entire block
const Car = ({ node, selectedId, setSelected }) => {
    const legend = particleLegend[node.subtype] || { color:'bg-gray-200', emoji:'🚃' };
    const mod = node.modifier;
    const modEngines = mod ? [mod, ...mod.cars.filter(c=>c.type==='engine')] : [];
    return (
        <div className="mx-2 my-1">
            <div className={`flex flex-row rounded-xl shadow ${legend.color} cursor-pointer`} onClick={() => setSelected(selectedId===node.id ? null : node.id)}>
                {mod && (
                    <div className="flex items-center px-2 pt-2">
                        {mod.cars.filter(c=>c.type==='car').map(c=> <Car key={c.id} node={c} selectedId={selectedId} setSelected={setSelected}/>)}
                        {modEngines.map((eng, idx) => (
                            <Engine
                                key={eng.id}
                                node={eng}
                                isLast={idx===modEngines.length-1}
                                selectedId={selectedId}
                                setSelected={setSelected}
                            />
                        ))}
                    </div>
                )}
                <div className="flex items-center p-2">
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

const SentenceVisualizer = ({ node, selectedId, setSelected }) => {
    const suffixEngines = node.cars.filter(c=>c.type==='engine');
    const engines = [node, ...suffixEngines];
    return (
        <div className="flex flex-wrap items-center mt-6">
            {node.cars.filter(c=>c.type==='car').map(car=> <Car key={car.id} node={car} selectedId={selectedId} setSelected={setSelected}/>)}
            {engines.map((eng, idx) => (
                <Engine
                    key={eng.id}
                    node={eng}
                    isLast={idx===engines.length-1}
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
            {Object.entries(particleLegend).map(([key,{label,color,emoji}])=>(
                <div key={key} className="flex items-center">
                    <span className={`text-2xl mr-2 ${color} p-1 rounded`}>{emoji}</span>
                    <span><strong>{key}</strong>: {label}</span>
                </div>
            ))}
            <div className="flex items-center">
                <span className="text-2xl mr-2">🚂</span>
                <span><strong>Engine</strong>: only the final engine in sequence is black; earlier ones are white.</span>
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
    return (
        <div className="bg-gray-200 p-4 rounded-2xl my-4">
            <p>{descs[selectedId]}</p>
        </div>
    );
};

const parseSentence = (text) => {
    const descs = {
        1: "Stem of main verb: 寝 (to sleep)",
        6: "Suffix engine: てる (progressive)",
        2: "Particle: 少女が (subject)",
        3: "Stem of embedded verb: 食べ (to eat)",
        5: "Suffix engine: た (past)",
        4: "Particle: ご飯を (object)",
    };
    const parsed = {
        id:1, type:'engine', subtype:'stem', text:'寝', eng:'Sleep',
        cars:[
            { id:2, type:'car', subtype:'が', text:'少女が', eng:'Girl',
                modifier:{
                    id:3, type:'engine', subtype:'stem', text:'食べ', eng:'Eat',
                    cars:[ {id:4,type:'car',subtype:'を',text:'ご飯を',eng:'Rice'}, {id:5,type:'engine',subtype:'suffix',text:'た',eng:'Past'} ]
                }
            },
            { id:6,type:'engine',subtype:'suffix',text:'てる',eng:'Progressive'}
        ]
    };
    return [descs, parsed];
};

export default function App() {
    const [input,setInput] = useState('ご飯を食べた少女が寝てる');
    const [descs,setDescs] = useState(()=>parseSentence(input)[0]);
    const [parsed,setParsed] = useState(()=>parseSentence(input)[1]);
    const [selectedId,setSelected] = useState(null);
    const handleChange = (e) => {
        const val=e.target.value; setInput(val);
        const [d,p]=parseSentence(val);
        setDescs(d); setParsed(p); setSelected(null);
    };
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-4">Japanese Sentence Train Visualizer</h1>
            <Instructions />
            <Legend />
            <input type="text" className="w-full p-3 mb-4 border rounded shadow" placeholder="Enter sentence…" value={input} onChange={handleChange}/>
            <SentenceVisualizer node={parsed} selectedId={selectedId} setSelected={setSelected}/>
            <Desc selectedId={selectedId} descs={descs}/>
        </div>
    );
}
