import React, {useEffect, useState} from 'react';

const DEFAULT_STYLES = {
    NOUN: 'bg-blue-300 text-black',
    PROPN: 'bg-purple-300 text-black',
    ADJ: 'bg-yellow-300 text-black',
    ADP: 'bg-green-300 text-black',
    ADV: 'bg-indigo-300 text-black',
    AUX: 'bg-gray-400 text-black',
    CONJ: 'bg-pink-300 text-black',
    CCONJ: 'bg-pink-400 text-black',
    DET: 'bg-teal-300 text-black',
    INTJ: 'bg-red-300 text-black',
    NUM: 'bg-orange-300 text-black',
    PART: 'bg-green-200 text-black',
    PRON: 'bg-red-200 text-black',
    PUNCT: 'text-gray-600',
    SCONJ: 'bg-pink-500 text-white',
    SYM: 'bg-gray-300 text-black',
    X: 'bg-gray-200 text-black'
};

const Token = ({ token, particleLegend, setSelectedId, setDict, dict }) => {
    let style = '';
    let emoji = '';

    // Fetch data only if the token role is NOUN or PROPN
    useEffect(() => {
        if (token.role === 'NOUN' || token.role === 'PROPN') {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `https://beta.jisho.org/api/v1/search/words?keyword=${token.surface}`
                    );
                    const result = await response.json();
                    setDict(result); // Store result in state
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [token.role, dict]);

    // Use particleLegend if available
    if (token.particle && particleLegend && particleLegend[token.particle]) {
        const entry = particleLegend[token.particle];
        style = `${entry.color} text-black`;
        emoji = entry.emoji;
    } else {
        if (token.role === 'VERB_MAIN') {
            style = 'bg-black text-white';
            emoji = '🚂';
        } else if (token.role === 'VERB_AUX') {
            style = 'bg-white border border-gray-400 text-black';
            emoji = '🚂';
        } else if (token.role === 'NOUN' || token.role === 'PROPN') {
            style = 'bg-gray-100 text-black';
            emoji = '🚃';
            // Optionally, you can use `apiData` here if needed
        } else {
            style = 'bg-gray-100 text-black';
        }
    }

    function handleClicked() {
        setSelectedId(token.id);
    }

    return (
        <span className={`inline-block px-2 py-1 m-1 rounded ${style} cursor-pointer`} onClick={handleClicked}>
            <span className="mr-1">{emoji}</span>
            {token.surface}
        </span>
    );
};

// Clause component: visually distinguishes modifiers and shows apply_to link
const Clause = ({ clause, particleLegend, setSelectedId, setDict, dict }) => {
    return (
        <div className="inline-block border-dashed border-2 border-blue-500 p-2 m-1 rounded relative">
            {/* Link label to show which noun this modifies */}
            <div className="absolute -top-4 left-2 text-sm font-semibold my-2">
                ↪️ modifies <span className="font-bold">{clause.apply_to}</span>
            </div>
            <div className="flex flex-wrap">
                {clause.tokens.map((t, idx) => (
                    <Token key={idx} token={t} particleLegend={particleLegend} setSelectedId={setSelectedId} setDict={setDict} dict={dict} />
                ))}
            </div>
        </div>
    );
};

// Main Visualizer component
const SentenceVisualizer = ({ segments, particleLegend, setSelectedId, setDict, dict }) => {
    return (
        <div className="flex flex-wrap items-center">
            {segments.map((seg, idx) => {
                if (seg.type === 'clause') {
                    return <Clause key={idx} clause={seg} particleLegend={particleLegend} setSelectedId={setSelectedId} setDict={setDict} dict={dict} />;
                }
                // single token segment
                return <Token key={idx} token={seg} particleLegend={particleLegend} setSelectedId={setSelectedId} setDict={setDict} dict={dict} />;
            })}
        </div>
    );
};

export default SentenceVisualizer;
