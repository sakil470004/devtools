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
    <div className="bg-gray-100  flex flex-col items-center container mx-auto justify-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 ">
        <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center text-blue-600">
          <FaFont className="mr-2" /> Font Picker Tool
        </h2>
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
