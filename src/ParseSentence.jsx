import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';

// Tailwind CSS required

// Sample nested sentence structure
const examples = [
    {
        id: 1,
        description: 'ご飯を食べた少女が寝てる',
        translation: 'The girl who ate rice is sleeping.',
        main: {
            type: 'engine', subtype: 'main', text: '寝てる', eng: 'is sleeping',
            cars: [
                {
                    type: 'car', subtype: 'が', text: '少女が', eng: 'girl',
                    modifier: {
                        type: 'engine', subtype: 'sub', text: '食べた', eng: 'ate',
                        cars: [
                            { type: 'car', subtype: 'を', text: 'ご飯を', eng: 'rice' }
                        ]
                    }
                }
            ]
        }
    },
    {
        id: 2,
        description: '先生が教室で学生に本を読んであげた猫を見た',
        translation: 'I saw the cat that the teacher gave a book to the student in the classroom.',
        main: {
            type: 'engine', subtype: 'main', text: '見た', eng: 'saw',
            cars: [
                {
                    type: 'car', subtype: 'を', text: '猫を', eng: 'cat',
                    modifier: {
                        type: 'engine', subtype: 'sub', text: 'あげた', eng: 'gave',
                        cars: [
                            {
                                type: 'car', subtype: 'が', text: '先生が', eng: 'teacher',
                                modifier: {
                                    type: 'engine', subtype: 'sub', text: '読んで', eng: 'read',
                                    cars: [
                                        { type: 'car', subtype: 'を', text: '本を', eng: 'book' },
                                        { type: 'car', subtype: 'に', text: '学生に', eng: 'to student' },
                                        { type: 'car', subtype: 'で', text: '教室で', eng: 'in classroom' }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
];

const particleLegend = {
    'は': { label: 'Topic', color: 'bg-yellow-200', emoji: '🚃', desc: 'Marks the topic of the sentence, often used for contrast or framing.' },
    'が': { label: 'Subject', color: 'bg-green-200', emoji: '🚃', desc: 'Marks the subject that performs or experiences the action.' },
    'を': { label: 'Object', color: 'bg-blue-200', emoji: '🚃', desc: 'Marks the direct object that receives the action.' },
    'に': { label: 'Goal', color: 'bg-purple-200', emoji: '🚃', desc: 'Marks direction, goal, or recipient.' },
    'で': { label: 'Location/Means', color: 'bg-red-200', emoji: '🚃', desc: 'Marks location of action or means by which it is performed.' },
    'と': { label: 'And/With', color: 'bg-indigo-200', emoji: '🚃', desc: 'Marks a companion or is used as “and” in listing.' }
};

const Car = ({ node }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const legend = particleLegend[node.subtype] || { color: 'bg-gray-200', emoji: '🚃', label: 'Unknown', desc: 'No description available.' };
    return (
        <div
            className={`flex flex-row mx-1 p-2 rounded-xl shadow ${legend.color}`}
            data-tooltip-id={`tooltip-${node.text}`}
            onClick={() => setShowTooltip((v) => !v)}
            style={{ cursor: 'pointer' }}
        >
            {node.modifier && (
                <div className="flex items-center ml-4">
                    {node.modifier.cars.map((c, i) => <Car key={i} node={c} />)}
                    <Engine node={node.modifier} />
                </div>
            )}
            <div className="flex items-center flex-col ml-4">
                <span className="text-2xl mr-1">{legend.emoji}</span>
                <span className="font-medium">{node.text}</span>
                <span className="ml-2 text-xs text-gray-700 italic">{node.eng}</span>
            </div>
            {showTooltip && (
                <Tooltip id={`tooltip-${node.text}`} anchorSelect={`[data-tooltip-id='tooltip-${node.text}']`} content={`${legend.label} (${node.subtype}): ${legend.desc}`} open />
            )}
        </div>
    );
};

const Engine = ({ node }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const style = node.subtype === 'main'
        ? 'bg-black text-white'
        : 'bg-white text-black border';
    return (
        <div
            className={`flex flex-col items-center mx-2 p-2 rounded-2xl shadow-lg ${style}`}
            data-tooltip-id={`tooltip-${node.text}`}
            onClick={() => setShowTooltip((v) => !v)}
            style={{ cursor: 'pointer' }}
        >
            <span className="text-2xl">🚂</span>
            <span className="mt-1 font-semibold">{node.text}</span>
            <span className="text-xs italic">{node.eng}</span>
            {showTooltip && (
                <Tooltip id={`tooltip-${node.text}`} anchorSelect={`[data-tooltip-id='tooltip-${node.text}']`} content={`Engine: ${node.eng}`} open />
            )}
        </div>
    );
};

const SentenceVisualizer = ({ node }) => (
    <div className="flex items-center flex-wrap mt-6">
        {node.cars.map((car, idx) => <Car key={idx} node={car} />)}
        <Engine node={node} />
    </div>
);

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

export default function App() {
    const [selected] = useState(examples[1]);
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-4">Japanese Sentence Train Visualizer</h1>
            <Legend />
            <div className="mb-4">
                <p className="text-lg font-medium">Sentence: {selected.description}</p>
                <p className="text-sm italic text-gray-700">Translation: {selected.translation}</p>
            </div>
            <SentenceVisualizer node={selected.main} />
        </div>
    );
}
