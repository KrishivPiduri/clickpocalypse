import React, { useState } from 'react';

const particleLegend = {
    'は': { label: 'Topic', color: 'bg-yellow-200', emoji: '🚩', desc: 'Marks the topic of the sentence, often used for contrast or framing.' },
    'mo': { label: 'Topic', color: 'bg-yellow-200', emoji: '🚩', desc: 'Marks the topic of the sentence, often used to show similarity. Opposite of the は particle.' },
    'が': { label: 'Subject', color: 'bg-green-200', emoji: '🚃', desc: 'Marks the subject that performs or experiences the action.' },
    'を': { label: 'Object', color: 'bg-blue-200', emoji: '🚃', desc: 'Marks the direct object that receives the action.' },
    'に': { label: 'Goal', color: 'bg-purple-200', emoji: '🚃', desc: 'Marks direction, goal, or recipient.' },
    'で': { label: 'Location/Means', color: 'bg-red-200', emoji: '🚃', desc: 'Marks location of action or means by which it is performed.' },
    'と': { label: 'And/With', color: 'bg-indigo-200', emoji: '🚃', desc: 'Marks a companion or is used as “and” in listing.' }
};

const Engine = ({ node, selectedId, setSelected }) => {
     const style = node.subtype === 'main'
        ? 'bg-black text-white'
        : 'bg-white text-black';
    return (
        <div className={`${selectedId===node.id ? "border-dashed border-spacing-3 border-2 rounded-2xl" : ""} mx-2`}>
            <div className={`flex flex-col items-center ${selectedId===node.id ? "my-1 mx-1": ""} p-2 rounded-2xl shadow-lg ${style} cursor-pointer`} onClick={() => {
                if (selectedId===node.id) {
                    setSelected(null);
                } else {
                    setSelected(node.id);
                }
            }}>
                <span className="text-2xl">🚂</span>
                <span className="mt-1 font-semibold">{node.text}</span>
                <span className="text-xs italic">{node.eng}</span>
            </div>
        </div>
    );
};

const Car = ({ node, selectedId, setSelected}) => {
    const legend = particleLegend[node.subtype] || { color: 'bg-gray-200', emoji: '🚃', label: 'Unknown', desc: 'No description available.' };
    return (
        <div className={`${selectedId===node.id ? "border-dashed border-spacing-3 border-2 rounded-2xl" : ""} mx-2`}>
            <div className={`flex flex-row items-center m-1 p-2 rounded-xl shadow ${legend.color} cursor-pointer`}>
                {node.modifier && (
                    <div className="flex mt-2">
                        {node.modifier.cars.map((c, i) => <Car key={i} node={c} id={c.id} setSelected={setSelected} selectedId={selectedId} />)}
                        <Engine node={node.modifier} id={node.modifier.id} setSelected={setSelected} selectedId={selectedId} />
                    </div>
                )}
                <div className={"flex flex-col items-center"} onClick={() => {
                    if (selectedId===node.id) {
                        setSelected(null);
                    } else {
                        setSelected(node.id);
                    }
                }}>
                    <div className="flex items-center">
                        <span className="text-2xl mr-1">{legend.emoji}</span>
                        <span className="font-medium">{node.text}</span>
                    </div>
                    <span className="text-xs text-gray-700 italic">{node.eng}</span>
                </div>
            </div>
        </div>
    );
};

const SentenceVisualizer = ({ node, selectedId, setSelected }) => {
    return (
        <div className="flex items-center flex-wrap mt-6">
            {node.cars.map((car, idx) => <Car key={idx} node={car} selectedId={selectedId} setSelected={setSelected} />)}
            <Engine node={node} selectedId={selectedId} setSelected={setSelected}/>
        </div>
    )
};

const Legend = () => (
    <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Legend</h2>
        <div className="grid grid-cols-2 gap-4">
            {Object.entries(particleLegend).map(([key, { label, color, emoji }]) => (
                <div key={key} className="flex items-center">
                    <span className={`text-2xl mr-2 ${color} p-1 rounded`}>{emoji}</span>
                    <span><strong>{key}</strong>: {label} car</span>
                </div>
            ))}
            <div className="flex items-center">
                <span className="text-2xl mr-2">🚂</span>
                <span><strong>Engine</strong>: verb that drives clause (black main, white sub)</span>
            </div>
        </div>
    </div>
);

const Desc = ({selectedId, descs}) => {
    if (!selectedId) {
        return (
            <div className="bg-gray-200 my-4 p-4 rounded-2xl">
                <p className="text-xl font-semibold mb-2">Click on an engine or a car to see a description</p>
            </div>
        )
    }
    return (
        <div className="bg-gray-200 my-4 p-4 rounded-2xl">
            <p>{descs[selectedId]}</p>
        </div>
    )
}

const parseSentence = (text) => {
    // Desc contents:
    //  Is it part of a subclause?
    //      Meaning of the entire clause + the role this specific word plays in it (subject, direct object, etc.)
    //  Is it an engine?
    //      What conjugation is it in? (polite, impolite, past, negative, potential, etc.)
    //      What is the subject and direct object of the sentence/clause?
    //  Is it a car?
    //      What particle is used and why?
    //          Ni: Indicates target/goal
    //          Ga: Indicates subject
    //          Wo: Indicates direct object
    //          Wa: Indicates topic
    //          No: Indicates possession
    //          De: Indicates means
    //          Mo: Also indicates topic
    //      What verb is this linked to?
    const descs={
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
    }
    return [descs, {
        id: 1, type: 'engine', subtype: 'main', text: '寝てる', eng: 'is sleeping',
        cars: [
            {
                id: 2, type: 'car', subtype: 'は', text: '少女は', eng: 'girl',
            },
            {
                id: 3, type: 'car', subtype: 'が', text: '少女が', eng: 'girl',
                modifier: {
                    id: 4, type: 'engine', subtype: 'sub', text: '食べた', eng: 'ate',
                    cars: [
                        { id: 5, type: 'car', subtype: 'を', text: 'ご飯を', eng: 'rice' }
                    ]
                }
            }
        ]
    }];
};

export default function App() {
    const [input, setInput] = useState('ご飯を食べた少女が寝てる');
    const out=parseSentence(input);
    const [parsed, setParsed]=useState(out[1]);
    const [descs, setDescs]=useState(out[0]);
    const [selectedId, setSelected] = useState(null);

    const handleChange = (e) => {
        const val = e.target.value;
        setInput(val);
        const out=parseSentence(input);
        setParsed(out[0])
        setDescs(out[1])
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-4">Japanese Sentence Train Visualizer</h1>
            <Legend />
            <input
                type="text"
                className="w-full p-3 mb-4 border rounded shadow"
                value={input}
                onChange={handleChange}
                placeholder="Enter Japanese sentence here"
            />
            <p className="text-sm italic text-gray-700 mb-2">Translation: The girl who ate rice is sleeping. (dummy)</p>
            <SentenceVisualizer node={parsed} setSelected={setSelected} selectedId={selectedId} />
            <Desc selectedId={selectedId} descs={descs} />
        </div>
    );
}
