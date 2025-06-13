import React, { useState } from 'react';
import { FaExchangeAlt, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StringConverters: React.FC = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const converters = [
        { name: 'Uppercase', convert: (str: string) => str.toUpperCase(), color: 'bg-blue-500' },
        { name: 'Lowercase', convert: (str: string) => str.toLowerCase(), color: 'bg-green-500' },
        { name: 'Capitalize', convert: (str: string) => str.replace(/\b\w/g, char => char.toUpperCase()), color: 'bg-yellow-500' },
        { name: 'Reverse', convert: (str: string) => str.split('').reverse().join(''), color: 'bg-purple-500' },
        { name: 'String Shuffle', convert: (str: string) => str.split('').sort(() => 0.5 - Math.random()).join(''), color: 'bg-blue-700' },
        { name: 'String Sort', convert: (str: string) => str.split(' ').sort().join(''), color: 'bg-green-700' },
        { name: 'Camel Case', convert: (str: string) => str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => index === 0 ? match.toLowerCase() : match.toUpperCase().replace(/\s+/g, '')), color: 'bg-pink-500' },
        { name: 'Snake Case', convert: (str: string) => str.toLowerCase().replace(/\s+/g, '_'), color: 'bg-red-500' },
        { name: 'Kebab Case', convert: (str: string) => str.toLowerCase().replace(/\s+/g, '-'), color: 'bg-indigo-500' },
        { name: 'Title Case', convert: (str: string) => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()), color: 'bg-teal-500' },
        { name: 'Sentence Case', convert: (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(), color: 'bg-orange-500' },
        { name: 'Trim', convert: (str: string) => str.trim(), color: 'bg-gray-500' },
        { name: 'Remove Spaces', convert: (str: string) => str.replace(/\s+/g, ''), color: 'bg-lime-500' },
        { name: 'Add Dashes', convert: (str: string) => str.split('').join('-'), color: 'bg-amber-500' },
        { name: 'Add Spaces', convert: (str: string) => str.split('').join(' '), color: 'bg-rose-500' },
        { name: 'Base64 Encode', convert: (str: string) => btoa(unescape(encodeURIComponent(str))), color: 'bg-cyan-500' },
        { name: 'Base64 Decode', convert: (str: string) => decodeURIComponent(escape(atob(str))), color: 'bg-fuchsia-500' },
        { name: 'Hex Encode', convert: (str: string) => str.split('').map(char => char.charCodeAt(0).toString(16)).join(' '), color: 'bg-violet-500' },
        { name: 'Hex Decode', convert: (str: string) => str.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join(''), color: 'bg-blue-600' },
        { name: 'Remove Digits', convert: (str: string) => str.replace(/\d+/g, ''), color: 'bg-green-600' },
        { name: 'Remove Non-Digits', convert: (str: string) => str.replace(/\D+/g, ''), color: 'bg-yellow-600' },
        { name: 'Remove Letters', convert: (str: string) => str.replace(/[a-zA-Z]+/g, ''), color: 'bg-purple-600' },
        { name: 'Remove Non-Letters', convert: (str: string) => str.replace(/[^a-zA-Z]+/g, ''), color: 'bg-pink-600' },
        { name: 'Leet Speak', convert: (str: string) => str.replace(/[aA]/g, '4').replace(/[eE]/g, '3').replace(/[iI]/g, '1').replace(/[oO]/g, '0').replace(/[sS]/g, '5').replace(/[tT]/g, '7'), color: 'bg-red-600' },
        { name: 'ROT13', convert: (str: string) => str.replace(/[a-zA-Z]/g, (char) => String.fromCharCode(char <= 'Z' ? (char.charCodeAt(0) - 65 + 13) % 26 + 65 : (char.charCodeAt(0) - 97 + 13) % 26 + 97)), color: 'bg-indigo-600' },
        { name: 'URL Encode', convert: (str: string) => encodeURIComponent(str), color: 'bg-teal-600' },
        { name: 'URL Decode', convert: (str: string) => decodeURIComponent(str), color: 'bg-orange-600' },
        { name: 'Double Space', convert: (str: string) => str.replace(/\s+/g, '  '), color: 'bg-gray-600' },
        { name: 'Slugify', convert: (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''), color: 'bg-lime-600' },
        { name: 'Remove Special Characters', convert: (str: string) => str.replace(/[^\w\s]/gi, ''), color: 'bg-amber-600' },
        { name: 'Invert Case', convert: (str: string) => str.split('').map(char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()).join(''), color: 'bg-rose-600' },
        { name: 'Shuffle', convert: (str: string) => str.split('').sort(() => Math.random() - 0.5).join(''), color: 'bg-cyan-600' },
        { name: 'Repeat Twice', convert: (str: string) => str + str, color: 'bg-fuchsia-600' },
        { name: 'Remove Vowels', convert: (str: string) => str.replace(/[aeiouAEIOU]/g, ''), color: 'bg-violet-600' },
        { name: 'Remove Consonants', convert: (str: string) => str.replace(/[^aeiouAEIOU\s]/g, ''), color: 'bg-blue-700' },
        { name: 'Remove Punctuation', convert: (str: string) => str.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''), color: 'bg-green-700' },
        { name: 'Count Characters', convert: (str: string) => `Length: ${str.length}`, color: 'bg-yellow-700' },
        { name: 'Count Words', convert: (str: string) => `Word Count: ${str.trim().split(/\s+/).length}`, color: 'bg-purple-700' },
        { name: 'Obfuscate Email', convert: (str: string) => str.replace(/(\w)(\w+)(@.+)/, '$1****$3'), color: 'bg-pink-700' }
    ];


    const handleConvert = (convert: (str: string) => string) => {
        setOutput(convert(input));
    };

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output)
                .then(() => {
                    toast.success("Output copied to clipboard!");
                })
                .catch(err => {
                    console.error('Failed to copy text:', err);
                });
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <div className="container mx-auto px-4 py-10 flex-1 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 top-0 mt-4 ml-4 flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-mono font-bold px-4 py-2 rounded-lg shadow transition"
                >
                    <span className="text-lg">←</span> Back
                </button>
                <div className="mb-12 text-center">
                    <div className="inline-block px-8 py-6 rounded-2xl shadow-xl bg-gradient-to-r from-blue-100/80 to-gray-50/80 border border-blue-200/60">
                        <h2 className="text-4xl font-extrabold mb-3 text-blue-700 tracking-tight font-mono drop-shadow-lg flex items-center justify-center">
                            <FaExchangeAlt className="mr-2 text-blue-700" /> String Converters
                        </h2>
                    </div>
                </div>
                <div className="flex flex-col items-center mb-4 w-full">
                    <textarea
                        className="textarea textarea-bordered w-full h-32 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your text here..."
                    />
                    <p className='font-bold text-red-500'>Converter</p>
                    <div className="flex flex-wrap justify-center gap-4 mb-4 max-h-24 p-8 overflow-auto">
                        {converters.map(converter => (
                            <button
                                key={converter.name}
                                onClick={() => handleConvert(converter.convert)}
                                className={`btn text-white rounded-full px-4 py-2 shadow-md hover:opacity-90 ${converter.color}`}
                            >
                                {converter.name}
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="textarea textarea-bordered w-full h-32 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        value={output}
                        readOnly
                        placeholder="Your output will appear here..."
                    />
                    <button
                        onClick={handleCopy}
                        className="btn bg-purple-500 text-white rounded-full px-4 py-2 shadow-md hover:bg-purple-600 flex items-center"
                    >
                        <FaCopy className="mr-2" /> Copy Output
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StringConverters;
