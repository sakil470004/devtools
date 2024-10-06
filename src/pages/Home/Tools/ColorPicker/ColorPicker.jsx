// src/components/tools/ColorPicker.jsx
import { useState } from "react";
import { SketchPicker } from "react-color"; // Using SketchPicker from react-color
import { FaCopy } from "react-icons/fa";

const ColorPicker = () => {
  const [color, setColor] = useState("#ffffff");
  const [copied, setCopied] = useState({
    hex: false,
    rgb: false,
    hsl: false,
  });

  // @ts-ignore
  const handleChangeComplete = (selectedColor) => {
    setColor(selectedColor.hex);
    // Reset copied states when color changes
    setCopied({ hex: false, rgb: false, hsl: false });
  };

  // @ts-ignore
  const copyToClipboard = (value, type) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [type]: false }));
    }, 2000);
  };

  // Convert HEX to RGB
  // @ts-ignore
  const hexToRgb = (hex) => {
    // Remove the hash if present
    hex = hex.replace(/^#/, "");

    // Parse r, g, b values
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Convert HEX to HSL
  // @ts-ignore
  const hexToHsl = (hex) => {
    // Convert hex to RGB first
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      // @ts-ignore
      h /= 6;
    }

    // @ts-ignore
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        Color Picker
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Color Picker */}
        <div>
          <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
        </div>

        {/* Color Display and Codes */}
        <div className="w-full max-w-md">
          <div
            className="w-full h-32 mb-6 rounded shadow"
            style={{ backgroundColor: color }}
          ></div>

          <div className="space-y-4">
            {/* HEX */}
            <div className="flex items-center justify-between bg-base-100 p-4 rounded shadow">
              <div>
                <p className="text-sm font-medium">HEX:</p>
                <p className="text-lg font-semibold">{color}</p>
              </div>
              <button
                onClick={() => copyToClipboard(color, "hex")}
                className="btn btn-ghost btn-square"
              >
                <FaCopy />
              </button>
              {copied.hex && (
                <span className="text-green-500 text-sm ml-2">Copied!</span>
              )}
            </div>

            {/* RGB */}
            <div className="flex items-center justify-between bg-base-100 p-4 rounded shadow">
              <div>
                <p className="text-sm font-medium">RGB:</p>
                <p className="text-lg font-semibold">{hexToRgb(color)}</p>
              </div>
              <button
                onClick={() => copyToClipboard(hexToRgb(color), "rgb")}
                className="btn btn-ghost btn-square"
              >
                <FaCopy />
              </button>
              {copied.rgb && (
                <span className="text-green-500 text-sm ml-2">Copied!</span>
              )}
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between bg-base-100 p-4 rounded shadow">
              <div>
                <p className="text-sm font-medium">HSL:</p>
                <p className="text-lg font-semibold">{hexToHsl(color)}</p>
              </div>
              <button
                onClick={() => copyToClipboard(hexToHsl(color), "hsl")}
                className="btn btn-ghost btn-square"
              >
                <FaCopy />
              </button>
              {copied.hsl && (
                <span className="text-green-500 text-sm ml-2">Copied!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
