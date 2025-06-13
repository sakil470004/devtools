// src/components/tools/ColorPicker/ColorPicker.tsx
import React, { useState } from 'react';
import { FaPalette, FaCopy, FaEyeDropper } from 'react-icons/fa';
import { SketchPicker } from 'react-color';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

const ColorPicker: React.FC = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState('#000000');

  const handleChange = (color: { hex: React.SetStateAction<string>; }) => {
    setColor(color.hex);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Color code copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      const eyeDropper = new window.EyeDropper();
      try {
        const result = await eyeDropper.open();
        setColor(result.sRGBHex);
      } catch (e) {
        console.error(e);
      }
    } else {
      toast.error('EyeDropper API is not supported in your browser.');
    }
  };

  const hex = color;
  const rgb = `rgb(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)})`;
  const hsl = (() => {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  })();

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
              <FaPalette className="mr-2 text-blue-700" /> Color Picker
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center mb-8">
          <SketchPicker color={color} onChangeComplete={handleChange} />
          <button
            onClick={handleEyeDropper}
            className="btn bg-green-500 text-white mt-4 px-4 py-2 rounded-full shadow-md hover:bg-green-600 flex items-center"
          >
            <FaEyeDropper className="mr-2" /> Pick Color from Screen
          </button>
          <div className="mt-8 w-full text-center">
            <div className="mb-4">
              <span className="text-lg font-medium mr-2">HEX:</span>
              <span className="text-lg">{hex}</span>
              <button
                onClick={() => handleCopy(hex)}
                className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                <FaCopy />
              </button>
            </div>
            <div className="mb-4">
              <span className="text-lg font-medium mr-2">RGB:</span>
              <span className="text-lg">{rgb}</span>
              <button
                onClick={() => handleCopy(rgb)}
                className="ml-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
              >
                <FaCopy />
              </button>
            </div>
            <div className="mb-4">
              <span className="text-lg font-medium mr-2">HSL:</span>
              <span className="text-lg">{hsl}</span>
              <button
                onClick={() => handleCopy(hsl)}
                className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                <FaCopy />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
