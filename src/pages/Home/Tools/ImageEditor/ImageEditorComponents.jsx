//@ts-nocheck
import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Slider } from '../../../../components/ui/slider';
import { Input } from '../../../../components/ui/input';
import { 
  RotateCw, 
  Type, 
  Crop, 
  Download,
  Save,
  Palette,
  SlidersHorizontal,
  Layers,
  Grid,
  Move,
} from 'lucide-react';

export const ImageControls = ({ 
  adjustments, 
  setAdjustments,
  filter,
  setFilter,
  filters,
  isAddingText,
  setIsAddingText,
  isCropping,
  setIsCropping,
  setCropBox,
  handleDownload,
  applyCrop,
  cropBox 
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Image Adjustments */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4" />
          <h3 className="font-semibold">Adjustments</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <span className="w-24">Brightness:</span>
            <Slider
              value={[adjustments.brightness]}
              onValueChange={(value) => {
                setAdjustments(prev => ({ ...prev, brightness: value[0] }));
              }}
              min={0}
              max={200}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-right">{adjustments.brightness}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24">Contrast:</span>
            <Slider
              value={[adjustments.contrast]}
              onValueChange={(value) => {
                setAdjustments(prev => ({ ...prev, contrast: value[0] }));
              }}
              min={0}
              max={200}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-right">{adjustments.contrast}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24">Saturation:</span>
            <Slider
              value={[adjustments.saturation]}
              onValueChange={(value) => {
                setAdjustments(prev => ({ ...prev, saturation: value[0] }));
              }}
              min={0}
              max={200}
              step={1}
              className="flex-1"
            />
            <span className="w-12 text-right">{adjustments.saturation}%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto py-2">
          {Object.keys(filters).map((filterName) => (
            <Button
              key={filterName}
              onClick={() => setFilter(filterName)}
              variant={filter === filterName ? "default" : "outline"}
              className="whitespace-nowrap"
            >
              {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4" />
          <h3 className="font-semibold">Tools</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => {
              setAdjustments(prev => ({
                ...prev,
                rotation: (prev.rotation + 90) % 360
              }));
            }}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RotateCw className="w-4 h-4" />
            Rotate
          </Button>

          <Button
            onClick={() => {
              setIsAddingText(true);
              setIsCropping(false);
            }}
            variant={isAddingText ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Type className="w-4 h-4" />
            Add Text
          </Button>

          <Button
            onClick={() => {
              setIsCropping(prev => !prev);
              setIsAddingText(false);
              if (!isCropping) {
                setCropBox(null);
              }
            }}
            variant={isCropping ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Crop className="w-4 h-4" />
            Crop
          </Button>

          {isCropping && cropBox && (
            <Button 
              onClick={applyCrop} 
              className="flex items-center gap-2"
              variant="default"
            >
              <Save className="w-4 h-4" />
              Apply Crop
            </Button>
          )}

          <Button
            onClick={handleDownload}
            className="flex items-center gap-2"
            variant="default"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export const TextControls = ({
  text,
  setText,
  textStyle,
  setTextStyle,
  fonts
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Type className="w-4 h-4" />
        <h3 className="font-semibold">Text Controls</h3>
      </div>
      <div className="flex items-center gap-4">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="flex-1"
        />
        <Input
          type="color"
          value={textStyle.color}
          onChange={(e) => 
            setTextStyle(prev => ({ ...prev, color: e.target.value }))
          }
          className="w-20"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24">Font Size:</span>
        <Slider
          value={[textStyle.fontSize]}
          onValueChange={(value) => {
            setTextStyle(prev => ({ ...prev, fontSize: value[0] }));
          }}
          min={10}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="w-12 text-right">{textStyle.fontSize}px</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Font Family:</span>
        <select
          value={textStyle.font}
          onChange={(e) => 
            setTextStyle(prev => ({ ...prev, font: e.target.value }))
          }
          className="p-2 border rounded"
        >
          {fonts.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Click on the image to place text
      </p>
    </div>
  );
};

export const CropControls = ({
  cropAspectRatio,
  setCropAspectRatio,
  isGridSnapping,
  setIsGridSnapping,
  showGrid,
  setShowGrid,
  cropBox
}) => {
  const aspectRatios = [
    { name: 'Free', value: null },
    { name: '1:1', value: 1 },
    { name: '16:9', value: 16/9 },
    { name: '4:3', value: 4/3 },
    { name: '3:2', value: 3/2 },
    { name: '2:1', value: 2 }
  ];

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Crop className="w-4 h-4" />
        <h3 className="font-semibold">Crop Controls</h3>
      </div>

      <div className="flex gap-2 flex-wrap">
        {aspectRatios.map(({ name, value }) => (
          <Button
            key={name}
            onClick={() => setCropAspectRatio(value)}
            variant={cropAspectRatio === value ? "default" : "outline"}
            className="flex-1 min-w-[80px]"
          >
            {name}
          </Button>
        ))}
      </div>

      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Show Grid</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isGridSnapping}
            onChange={(e) => setIsGridSnapping(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Snap to Grid</span>
        </label>
      </div>

      {cropBox && (
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">
            Size: {Math.round(cropBox.width)} × {Math.round(cropBox.height)} pixels
          </div>
          <div className="text-sm text-gray-500">
            Ratio: {(cropBox.width / cropBox.height).toFixed(2)}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <p>• Drag to create crop area</p>
        <p>• Drag edges or corners to resize</p>
        <p>• Drag inside to move</p>
        <p>• Hold Shift for proportional resize</p>
      </div>
    </div>
  );
};

export default {
  ImageControls,
  TextControls,
  CropControls
};