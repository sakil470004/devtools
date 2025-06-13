// src/components/tools/FontPicker/FontPicker.tsx
import React from 'react';
import { FaFont, FaCheck, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface FontPickerProps {
  fonts: string[];
}

const FontPicker: React.FC<FontPickerProps> = ({ fonts }) => {

  const handleCopy = (font: string) => {
    navigator.clipboard.writeText(font)
      .then(() => {
        toast.success("Font name copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-12 text-center">
          <div className="inline-block px-8 py-6 rounded-2xl shadow-xl bg-gradient-to-r from-blue-100/80 to-gray-50/80 border border-blue-200/60">
            <h2 className="text-4xl font-extrabold mb-3 text-blue-700 tracking-tight font-mono drop-shadow-lg flex items-center justify-center">
              <FaFont className="mr-2 text-blue-700" /> Font Picker Tool
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {fonts.map((font) => (
            <div key={font} className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-md text-center">
              <p className="text-xl mb-4 font-bold border-b-4 border-blue-400" style={{ fontFamily: font }}>{font}</p>
              <div className="flex items-center justify-center w-full mb-4" style={{ fontFamily: font }}>
                <p className="text-2xl">The quick brown fox jumps over the lazy dog.</p>
                <FaCheck className="text-green-500 ml-2" />
              </div>
              <button
                onClick={() => handleCopy(font)}
                className="btn bg-blue-500 text-white rounded-full px-4 py-2 shadow-md hover:bg-blue-600 flex items-center"
              >
                <FaCopy className="mr-2" /> Copy Font Name
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontPicker;
