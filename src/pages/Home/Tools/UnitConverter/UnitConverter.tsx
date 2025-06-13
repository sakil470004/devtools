import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { Si500Px } from "react-icons/si";

// Converts px to em based on the parent font size
function pxToEm(px: number, parentFontSize: number = 16): string {
  return `${px / parentFontSize}em`;
}

// Converts px to rem based on the root font size
function pxToRem(px: number, rootFontSize: number = 16): string {
  return `${px / rootFontSize}rem`;
}

// Converts px to percentage based on a container size
function pxToPercent(px: number, containerSize: number): string {
  return `${(px / containerSize) * 100}%`;
}

// Converts px to vw (viewport width) based on the viewport width
function pxToVw(px: number, viewportWidth: number = 1920): string {
  return `${(px / viewportWidth) * 100}vw`;
}

// Converts px to vh (viewport height) based on the viewport height
function pxToVh(px: number, viewportHeight: number = 1080): string {
  return `${(px / viewportHeight) * 100}vh`;
}

export default function UnitConverter(): JSX.Element {
  const [inputValue, setInputValue] = useState<string>("");
  const [unitType, setUnitType] = useState<string>("px");
  const [parentFontSize, setParentFontSize] = useState<number>(16);
  const [containerSize, setContainerSize] = useState<number>(200);
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState<number>(
    window.innerHeight
  );

  const handleConversion = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return {};

    switch (unitType) {
      case "px":
        return {
          em: pxToEm(value, parentFontSize),
          rem: pxToRem(value),
          percent: pxToPercent(value, containerSize),
          vw: pxToVw(value, viewportWidth),
          vh: pxToVh(value, viewportHeight),
        };
      case "em": {
        const pxFromEm = value * parentFontSize;
        return {
          px: `${pxFromEm}px`,
          rem: pxToRem(pxFromEm),
          percent: pxToPercent(pxFromEm, containerSize),
          vw: pxToVw(pxFromEm, viewportWidth),
          vh: pxToVh(pxFromEm, viewportHeight),
        };
      }
      case "rem": {
        const pxFromRem = value * 16;
        return {
          px: `${pxFromRem}px`,
          em: pxToEm(pxFromRem, parentFontSize),
          percent: pxToPercent(pxFromRem, containerSize),
          vw: pxToVw(pxFromRem, viewportWidth),
          vh: pxToVh(pxFromRem, viewportHeight),
        };
      }
      default:
        return {};
    }
  };

  const results = handleConversion();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-12 text-center">
          <div className="inline-block px-8 py-6 rounded-2xl shadow-xl bg-gradient-to-r from-blue-100/80 to-gray-50/80 border border-blue-200/60">
            <h2 className="text-4xl font-extrabold mb-3 text-blue-700 tracking-tight font-mono drop-shadow-lg flex items-center justify-center">
              <Si500Px className="mr-2 size-36 text-blue-700" /> Unit Converter
            </h2>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-start gap-12">
          <div>
            <div className="flex gap-2">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="value">Value:</Label>
                <Input
                  id="value"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div>
                <Label>Unit Type:</Label>
                <Select
                  defaultValue="px"
                  value={unitType}
                  onValueChange={(value) => setUnitType(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="px" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">PX</SelectItem>
                    <SelectItem value="em">EM</SelectItem>
                    <SelectItem value="rem">REM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {unitType === "px" && (
              <div className="w-[360px] space-y-3">
                <div>
                  <Label htmlFor="parent-font-size">
                    Parent Font Size (for em):
                  </Label>
                  <Input
                    id="parent-font-size"
                    type="number"
                    value={parentFontSize}
                    onChange={(e) =>
                      setParentFontSize(parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="container-size">Container Size (for %):</Label>
                  <Input
                    id="container-size"
                    type="number"
                    value={containerSize}
                    onChange={(e) => setContainerSize(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="viewport-width">Viewport Width (for vw):</Label>
                  <Input
                    id="viewport-width"
                    type="number"
                    value={viewportWidth}
                    onChange={(e) => setViewportWidth(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="viewport-height">
                    Viewport Height (for vh):
                  </Label>
                  <Input
                    id="viewport-height"
                    type="number"
                    value={viewportHeight}
                    onChange={(e) =>
                      setViewportHeight(parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl">Results:</h2>
            <ul className="space-y-2 mt-4">
              {Object.entries(results).map(([unit, value]) => (
                <li key={unit}>
                  <span className="uppercase">{unit} : </span>{" "}
                  <span>{value}</span>
                  <button
                    className="ms-2"
                    onClick={() =>
                      navigator.clipboard
                        .writeText(value as string)
                        .then(() => alert(`${value} copied to clipboard`))
                    }
                  >
                    <FaRegCopy />
                    <span className="sr-only">copy</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
