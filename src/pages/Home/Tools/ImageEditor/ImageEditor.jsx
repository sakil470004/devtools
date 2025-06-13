//@ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import {
  Upload,
  Undo,
  Redo,
  CircleOff,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { ImageControls, TextControls, CropControls } from './ImageEditorComponents';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;
const MIN_WIDTH = 50;
const MIN_HEIGHT = 50;
const HANDLE_SIZE = 10;
const MIN_CROP_SIZE = 50;
const GRID_SIZE = 20;
const SNAP_THRESHOLD = 10;
const RESIZE_ANIMATION_DURATION = 100;

const ImageEditor = () => {
  // Canvas and Image States
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // History States
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Adjustment States
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
  });
  const [filter, setFilter] = useState('none');

  // Text States
  const [text, setText] = useState('');
  const [textStyle, setTextStyle] = useState({
    fontSize: 20,
    color: '#ffffff',
    font: 'Arial',
    position: { x: 0, y: 0 },
  });
  const [isAddingText, setIsAddingText] = useState(false);

  // Crop States
  const [isCropping, setIsCropping] = useState(false);
  const [cropBox, setCropBox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropStartPos, setCropStartPos] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [cropAspectRatio, setCropAspectRatio] = useState(null);
  const [isGridSnapping, setIsGridSnapping] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [lastResizeTime, setLastResizeTime] = useState(0);

  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const resizeAnimationRef = useRef(null);

  const filters = {
    none: '',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    invert: 'invert(100%)',
    blur: 'blur(5px)',
    vintage: 'sepia(50%) hue-rotate(-30deg) saturate(140%)',
    brightness: 'brightness(150%)',
    contrast: 'contrast(200%)',
    saturate: 'saturate(200%)',
    hueRotate: 'hue-rotate(90deg)',
  };

  const fonts = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Tahoma',
    'Trebuchet MS'
  ];

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.src);
      if (originalImage) URL.revokeObjectURL(originalImage.src);
      if (resizeAnimationRef.current) {
        cancelAnimationFrame(resizeAnimationRef.current);
      }
    };
  }, []);

  // Canvas scale effect
  useEffect(() => {
    const updateScale = () => {
      if (!canvasRef.current || !image) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      setScale(rect.width / canvas.width);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [image]);

  // Draw effect
  useEffect(() => {
    if (image) {
      drawImage();
    }
  }, [adjustments, filter, textStyle, cropBox, isCropping, text, image]);

  // Utility Functions
  const getCanvasCoordinates = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale
    };
  }, [scale]);

  const snapToGrid = useCallback((value) => {
    if (!isGridSnapping) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }, [isGridSnapping]);

  const safeCanvasOperation = useCallback((operation) => {
    try {
      return operation();
    } catch (error) {
      handleError(error);
      return null;
    }
  }, []);

  const resetStates = useCallback(() => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      rotation: 0,
    });
    setFilter('none');
    setText('');
    setHistory([]);
    setHistoryIndex(-1);
    setError(null);
    setIsCropping(false);
    setIsAddingText(false);
    setCropBox(null);
    setCropAspectRatio(null);
    setIsGridSnapping(false);
    setShowGrid(false);
  }, []);

  const handleError = useCallback((error) => {
    console.error('Error:', error);
    setError(error.message || 'An unexpected error occurred');
    setIsLoading(false);
    setIsSaving(false);
  }, []);

  const handleImageUpload = async (event) => {
    try {
      setIsLoading(true);
      setError(null);

      const file = event.target.files[0];
      if (!file) throw new Error('No file selected');

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File is too large. Maximum size is 5MB.');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new window.Image();

        img.onload = () => {
          if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
            throw new Error(`Image dimensions too large. Maximum dimensions are ${MAX_WIDTH}x${MAX_HEIGHT} pixels.`);
          }

          if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
            throw new Error(`Image dimensions too small. Minimum dimensions are ${MIN_WIDTH}x${MIN_HEIGHT} pixels.`);
          }

          setImageSize({ width: img.width, height: img.height });
          setImage(img);
          setOriginalImage(img);
          drawImage(img);
          resetStates();
        };

        img.onerror = () => {
          throw new Error('Failed to load image. The file might be corrupted.');
        };

        img.src = e.target.result;
      };

      reader.onerror = () => {
        throw new Error('Failed to read file.');
      };

      reader.readAsDataURL(file);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const drawCropOverlay = useCallback((ctx) => {
    if (!cropBox) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save the current context state
    ctx.save();

    // Reset any existing transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Create semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

    // Draw the overlay in four parts (around the crop box)
    ctx.beginPath();
    // Top
    ctx.fillRect(0, 0, canvas.width, cropBox.y);
    // Bottom
    ctx.fillRect(0, cropBox.y + cropBox.height, canvas.width, canvas.height - (cropBox.y + cropBox.height));
    // Left
    ctx.fillRect(0, cropBox.y, cropBox.x, cropBox.height);
    // Right
    ctx.fillRect(cropBox.x + cropBox.width, cropBox.y, canvas.width - (cropBox.x + cropBox.width), cropBox.height);

    // Draw crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);

    // Draw rule of thirds grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 1; i <= 2; i++) {
      const x = cropBox.x + (cropBox.width * i) / 3;
      ctx.beginPath();
      ctx.moveTo(x, cropBox.y);
      ctx.lineTo(x, cropBox.y + cropBox.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 1; i <= 2; i++) {
      const y = cropBox.y + (cropBox.height * i) / 3;
      ctx.beginPath();
      ctx.moveTo(cropBox.x, y);
      ctx.lineTo(cropBox.x + cropBox.width, y);
      ctx.stroke();
    }

    // Draw handles
    const handles = [
      { x: cropBox.x, y: cropBox.y }, // Top-left
      { x: cropBox.x + cropBox.width, y: cropBox.y }, // Top-right
      { x: cropBox.x, y: cropBox.y + cropBox.height }, // Bottom-left
      { x: cropBox.x + cropBox.width, y: cropBox.y + cropBox.height }, // Bottom-right
      { x: cropBox.x + cropBox.width / 2, y: cropBox.y }, // Top
      { x: cropBox.x + cropBox.width / 2, y: cropBox.y + cropBox.height }, // Bottom
      { x: cropBox.x, y: cropBox.y + cropBox.height / 2 }, // Left
      { x: cropBox.x + cropBox.width, y: cropBox.y + cropBox.height / 2 }, // Right
    ];

    // Draw resize handles
    handles.forEach(handle => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(
        handle.x - HANDLE_SIZE / 2,
        handle.y - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );
      ctx.fill();
      ctx.stroke();
    });

    // Draw dimensions
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(
      `${Math.round(cropBox.width)} × ${Math.round(cropBox.height)}`,
      cropBox.x + 5,
      cropBox.y + cropBox.height - 5
    );

    // Restore the context state
    ctx.restore();
  }, [cropBox]);
  // Drawing Functions
  const drawImage = useCallback((img = image) => {
    safeCanvasOperation(() => {
      if (!img || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save initial state
      ctx.save();

      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Apply filters
      ctx.filter = `
        brightness(${adjustments.brightness}%)
        contrast(${adjustments.contrast}%)
        saturate(${adjustments.saturation}%)
        ${filters[filter]}
      `;

      // Draw main image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Restore to clear filters
      ctx.restore();
      ctx.save();

      // Draw text if exists
      if (text) {
        ctx.font = `${textStyle.fontSize}px ${textStyle.font}`;
        ctx.fillStyle = textStyle.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(text, textStyle.position.x, textStyle.position.y);
        ctx.fillText(text, textStyle.position.x, textStyle.position.y);
      }

      // Restore again before crop overlay
      ctx.restore();

      // Draw crop overlay if in cropping mode
      if (isCropping && cropBox) {
        drawCropOverlay(ctx);
      }

      // Save to history
      const imageData = canvas.toDataURL('image/png');
      if (!history.length || imageData !== history[historyIndex]) {
        saveToHistory(imageData);
      }
    });
  }, [
    image,
    adjustments,
    filter,
    text,
    textStyle,
    isCropping,
    cropBox,
    filters,
    drawCropOverlay,
    history,
    historyIndex
  ]);



  const drawCropHandles = useCallback((ctx) => {
    if (!cropBox) return;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    const handles = [
      { x: cropBox.x, y: cropBox.y }, // Top-left
      { x: cropBox.x + cropBox.width, y: cropBox.y }, // Top-right
      { x: cropBox.x, y: cropBox.y + cropBox.height }, // Bottom-left
      { x: cropBox.x + cropBox.width, y: cropBox.y + cropBox.height }, // Bottom-right
      { x: cropBox.x + cropBox.width / 2, y: cropBox.y }, // Top
      { x: cropBox.x + cropBox.width / 2, y: cropBox.y + cropBox.height }, // Bottom
      { x: cropBox.x, y: cropBox.y + cropBox.height / 2 }, // Left
      { x: cropBox.x + cropBox.width, y: cropBox.y + cropBox.height / 2 }, // Right
    ];

    handles.forEach(handle => {
      ctx.fillRect(
        handle.x - HANDLE_SIZE / 2,
        handle.y - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );
      ctx.strokeRect(
        handle.x - HANDLE_SIZE / 2,
        handle.y - HANDLE_SIZE / 2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );
    });
  }, [cropBox]);
  // Crop Handling Functions
  const calculateNewCropBox = useCallback((x, y) => {
    if (!cropBox || !resizeHandle) return cropBox;

    const deltaX = x - cropStartPos.x;
    const deltaY = y - cropStartPos.y;
    let newBox = { ...cropBox };

    switch (resizeHandle.handle) {
      case 'top-left':
        newBox = {
          x: Math.min(cropBox.x + cropBox.width - MIN_CROP_SIZE, x),
          y: Math.min(cropBox.y + cropBox.height - MIN_CROP_SIZE, y),
          width: Math.max(MIN_CROP_SIZE, cropBox.width - deltaX),
          height: Math.max(MIN_CROP_SIZE, cropBox.height - deltaY)
        };
        break;
      case 'top-right':
        newBox = {
          x: cropBox.x,
          y: Math.min(cropBox.y + cropBox.height - MIN_CROP_SIZE, y),
          width: Math.max(MIN_CROP_SIZE, x - cropBox.x),
          height: Math.max(MIN_CROP_SIZE, cropBox.height - deltaY)
        };
        break;
      case 'bottom-left':
        newBox = {
          x: Math.min(cropBox.x + cropBox.width - MIN_CROP_SIZE, x),
          y: cropBox.y,
          width: Math.max(MIN_CROP_SIZE, cropBox.width - deltaX),
          height: Math.max(MIN_CROP_SIZE, y - cropBox.y)
        };
        break;
      case 'bottom-right':
        newBox = {
          x: cropBox.x,
          y: cropBox.y,
          width: Math.max(MIN_CROP_SIZE, x - cropBox.x),
          height: Math.max(MIN_CROP_SIZE, y - cropBox.y)
        };
        break;
      case 'top':
        newBox = {
          ...cropBox,
          y: Math.min(cropBox.y + cropBox.height - MIN_CROP_SIZE, y),
          height: Math.max(MIN_CROP_SIZE, cropBox.height - deltaY)
        };
        break;
      case 'bottom':
        newBox = {
          ...cropBox,
          height: Math.max(MIN_CROP_SIZE, y - cropBox.y)
        };
        break;
      case 'left':
        newBox = {
          ...cropBox,
          x: Math.min(cropBox.x + cropBox.width - MIN_CROP_SIZE, x),
          width: Math.max(MIN_CROP_SIZE, cropBox.width - deltaX)
        };
        break;
      case 'right':
        newBox = {
          ...cropBox,
          width: Math.max(MIN_CROP_SIZE, x - cropBox.x)
        };
        break;
      case 'move':
        newBox = {
          ...cropBox,
          x: cropBox.x + deltaX,
          y: cropBox.y + deltaY
        };
        break;
      default:
        break;
    }

    return newBox;
  }, [cropBox, cropStartPos, resizeHandle]);
  // Place this before any hooks that use it
  const maintainAspectRatio = (box, ratio, handle) => {
    if (!ratio) return box;

    let newWidth = box.width;
    let newHeight = box.height;
    let newX = box.x;
    let newY = box.y;

    if (!handle) return box;

    if (handle.includes('right') || handle.includes('left')) {
      newHeight = newWidth / ratio;
      if (handle.includes('top')) {
        newY = box.y + box.height - newHeight;
      }
    } else {
      newWidth = newHeight * ratio;
      if (handle.includes('left')) {
        newX = box.x + box.width - newWidth;
      }
    }

    return {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    };
  };
  const keepWithinBounds = useCallback((box) => {
    if (!canvasRef.current) return box;

    const canvas = canvasRef.current;
    return {
      x: Math.max(0, Math.min(box.x, canvas.width - box.width)),
      y: Math.max(0, Math.min(box.y, canvas.height - box.height)),
      width: Math.max(MIN_CROP_SIZE, Math.min(box.width, canvas.width - box.x)),
      height: Math.max(MIN_CROP_SIZE, Math.min(box.height, canvas.height - box.y))
    };
  }, []);
  // Add this function before handleCropResize
  const animate = useCallback((currentBox, targetBox) => {
    if (resizeAnimationRef.current) {
      cancelAnimationFrame(resizeAnimationRef.current);
    }

    const startTime = Date.now();
    const ease = (t) => t * (2 - t); // Ease-out function

    const animateStep = () => {
      const progress = Math.min(1, (Date.now() - startTime) / RESIZE_ANIMATION_DURATION);
      const easedProgress = ease(progress);

      const newBox = {
        x: currentBox.x + (targetBox.x - currentBox.x) * easedProgress,
        y: currentBox.y + (targetBox.y - currentBox.y) * easedProgress,
        width: currentBox.width + (targetBox.width - currentBox.width) * easedProgress,
        height: currentBox.height + (targetBox.height - currentBox.height) * easedProgress
      };

      setCropBox(newBox);
      drawImage();

      if (progress < 1) {
        resizeAnimationRef.current = requestAnimationFrame(animateStep);
      }
    };

    animateStep();
  }, [drawImage]);

  // Then modify handleCropResize to use the animate function correctly
  const handleCropResize = useCallback((x, y) => {
    if (resizeAnimationRef.current) {
      cancelAnimationFrame(resizeAnimationRef.current);
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - lastResizeTime;

    let newBox = calculateNewCropBox(x, y);

    // Snap to grid if enabled
    if (isGridSnapping) {
      newBox = {
        x: snapToGrid(newBox.x),
        y: snapToGrid(newBox.y),
        width: snapToGrid(newBox.width),
        height: snapToGrid(newBox.height)
      };
    }

    // Apply aspect ratio constraints
    if (cropAspectRatio && resizeHandle && resizeHandle.handle !== 'move') {
      newBox = maintainAspectRatio(newBox, cropAspectRatio, resizeHandle.handle);
    }

    // Keep within bounds
    newBox = keepWithinBounds(newBox);

    // Animate if enough time has passed
    if (timeDiff > RESIZE_ANIMATION_DURATION) {
      animate(cropBox, newBox); // Pass both current and target box
      setLastResizeTime(currentTime);
    } else {
      setCropBox(newBox);
      drawImage();
    }
  }, [
    cropAspectRatio,
    isGridSnapping,
    lastResizeTime,
    resizeHandle,
    snapToGrid,
    keepWithinBounds,
    calculateNewCropBox,
    drawImage,
    animate,
    cropBox
  ]);
  const handleCropDrag = useCallback((x, y) => {
    if (!cropBox) {
      let width = Math.abs(x - cropStartPos.x);
      let height = cropAspectRatio ? width / cropAspectRatio : Math.abs(y - cropStartPos.y);

      width = Math.max(width, MIN_CROP_SIZE);
      height = Math.max(height, MIN_CROP_SIZE);

      const newX = Math.min(x, cropStartPos.x);
      const newY = Math.min(y, cropStartPos.y);

      setCropBox({
        x: Math.max(0, Math.min(newX, canvasRef.current.width - width)),
        y: Math.max(0, Math.min(newY, canvasRef.current.height - height)),
        width,
        height
      });
    } else {
      // Moving existing crop box
      const deltaX = x - cropStartPos.x;
      const deltaY = y - cropStartPos.y;

      const newBox = {
        ...cropBox,
        x: Math.max(0, Math.min(cropBox.x + deltaX, canvasRef.current.width - cropBox.width)),
        y: Math.max(0, Math.min(cropBox.y + deltaY, canvasRef.current.height - cropBox.height))
      };

      if (isGridSnapping) {
        newBox.x = snapToGrid(newBox.x);
        newBox.y = snapToGrid(newBox.y);
      }

      setCropBox(newBox);
      setCropStartPos({ x, y });
    }

    drawImage();
  }, [cropBox, cropStartPos, cropAspectRatio, isGridSnapping, snapToGrid, drawImage]);



  // Event Handlers
  const handleCanvasClick = useCallback((e) => {
    if (!isAddingText) return;

    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

    setTextStyle(prev => ({
      ...prev,
      position: { x, y }
    }));
    setIsAddingText(false);
    drawImage();
  }, [isAddingText, getCanvasCoordinates, drawImage]);

  const getResizeHandle = useCallback((x, y) => {
    if (!cropBox) return null;

    const handles = {
      'top-left': {
        x: cropBox.x - HANDLE_SIZE / 2,
        y: cropBox.y - HANDLE_SIZE / 2,
        cursor: 'nw-resize'
      },
      'top-right': {
        x: cropBox.x + cropBox.width - HANDLE_SIZE / 2,
        y: cropBox.y - HANDLE_SIZE / 2,
        cursor: 'ne-resize'
      },
      'bottom-left': {
        x: cropBox.x - HANDLE_SIZE / 2,
        y: cropBox.y + cropBox.height - HANDLE_SIZE / 2,
        cursor: 'sw-resize'
      },
      'bottom-right': {
        x: cropBox.x + cropBox.width - HANDLE_SIZE / 2,
        y: cropBox.y + cropBox.height - HANDLE_SIZE / 2,
        cursor: 'se-resize'
      },
      'top': {
        x: cropBox.x + cropBox.width / 2 - HANDLE_SIZE / 2,
        y: cropBox.y - HANDLE_SIZE / 2,
        cursor: 'n-resize'
      },
      'bottom': {
        x: cropBox.x + cropBox.width / 2 - HANDLE_SIZE / 2,
        y: cropBox.y + cropBox.height - HANDLE_SIZE / 2,
        cursor: 's-resize'
      },
      'left': {
        x: cropBox.x - HANDLE_SIZE / 2,
        y: cropBox.y + cropBox.height / 2 - HANDLE_SIZE / 2,
        cursor: 'w-resize'
      },
      'right': {
        x: cropBox.x + cropBox.width - HANDLE_SIZE / 2,
        y: cropBox.y + cropBox.height / 2 - HANDLE_SIZE / 2,
        cursor: 'e-resize'
      }
    };

    for (const [handle, pos] of Object.entries(handles)) {
      if (x >= pos.x && x <= pos.x + HANDLE_SIZE &&
        y >= pos.y && y <= pos.y + HANDLE_SIZE) {
        return { handle, cursor: pos.cursor };
      }
    }

    if (x >= cropBox.x && x <= cropBox.x + cropBox.width &&
      y >= cropBox.y && y <= cropBox.y + cropBox.height) {
      return { handle: 'move', cursor: 'move' };
    }

    return null;
  }, [cropBox]);

  const handleCanvasMouseDown = useCallback((e) => {
    if (!isCropping) return;

    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    const handle = getResizeHandle(x, y);

    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      e.preventDefault();
    } else if (cropBox &&
      x >= cropBox.x &&
      x <= cropBox.x + cropBox.width &&
      y >= cropBox.y &&
      y <= cropBox.y + cropBox.height) {
      setIsResizing(true);
      setResizeHandle({ handle: 'move', cursor: 'move' });
    } else {
      setIsDragging(true);
    }

    setCropStartPos({ x, y });
  }, [isCropping, cropBox, getCanvasCoordinates, getResizeHandle]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (!canvasRef.current) return;

    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

    if (isCropping && !isDragging && !isResizing) {
      const handle = getResizeHandle(x, y);
      canvasRef.current.style.cursor = handle ? handle.cursor : 'crosshair';
    }

    if (isResizing && resizeHandle && cropBox) {
      handleCropResize(x, y);
    } else if (isDragging) {
      handleCropDrag(x, y);
    }
  }, [
    isCropping,
    isDragging,
    isResizing,
    resizeHandle,
    cropBox,
    getCanvasCoordinates,
    getResizeHandle,
    handleCropResize,
    handleCropDrag
  ]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = isCropping ? 'crosshair' : 'default';
    }
  }, [isCropping]);

  // History Functions
  const saveToHistory = useCallback((imageData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);

      const img = new window.Image();
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newIndex];
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);

      const img = new window.Image();
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newIndex];
    }
  }, [historyIndex, history]);

  const handleReset = useCallback(() => {
    if (originalImage) {
      setImage(originalImage);
      drawImage(originalImage);
      resetStates();
    }
  }, [originalImage, drawImage, resetStates]);

  const applyCrop = useCallback(() => {
    if (!cropBox || !canvasRef.current) return;

    try {
      setIsSaving(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const croppedImageData = ctx.getImageData(
        cropBox.x,
        cropBox.y,
        cropBox.width,
        cropBox.height
      );

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = cropBox.width;
      tempCanvas.height = cropBox.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Clear temp canvas with transparency
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.putImageData(croppedImageData, 0, 0);

      const croppedImage = new window.Image();
      croppedImage.onload = () => {
        setImage(croppedImage);
        setCropBox(null);
        setIsCropping(false);
        drawImage(croppedImage);
      };
      croppedImage.src = tempCanvas.toDataURL('image/png');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false);
    }
  }, [cropBox, drawImage, handleError]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;

    try {
      setIsSaving(true);

      // Create a temporary canvas for the download
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      // Copy dimensions from main canvas
      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;

      // Draw the image with transparency
      if (tempCtx) {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvasRef.current, 0, 0);
      }

      // Create download link
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      // Explicitly set PNG format with transparency
      link.href = tempCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false);
    }
  }, [handleError]);
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-12 text-center">
          <div className="inline-block px-8 py-6 rounded-2xl shadow-xl bg-gradient-to-r from-blue-100/80 to-gray-50/80 border border-blue-200/60">
            <h2 className="text-4xl font-extrabold mb-3 text-blue-700 tracking-tight font-mono drop-shadow-lg flex items-center justify-center">
              <Upload className="mr-2 text-blue-700" /> Image Editor
            </h2>
          </div>
        </div>

        <Card className="w-full max-w-6xl p-6 mx-auto">
          <div className="flex flex-col gap-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Header Controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Upload Button */}
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload Image
                </Button>

                {/* History Controls */}
                {image && (
                  <>
                    <Button
                      onClick={handleUndo}
                      disabled={historyIndex <= 0 || isLoading}
                      title="Undo"
                    >
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleRedo}
                      disabled={historyIndex >= history.length - 1 || isLoading}
                      title="Redo"
                    >
                      <Redo className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleReset}
                      disabled={!originalImage || isLoading}
                      title="Reset"
                    >
                      <CircleOff className="w-4 h-4" />
                      Reset
                    </Button>
                  </>
                )}
              </div>
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept={ALLOWED_FILE_TYPES.join(',')}
                className="hidden"
              />
            </div>

            {/* Canvas Container */}
            <div className="relative border rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-checkered" /> {/* Background pattern */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <Loader className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                className="relative z-[1] max-w-full h-auto cursor-pointer"
              />

              {/* Empty State */}
              {!image && !isLoading && (
                <div className="text-center p-8 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-4" />
                  <p>Upload an image to begin editing</p>
                  <p className="text-sm mt-2">
                    Supports JPEG, PNG, GIF, and WebP formats
                  </p>
                </div>
              )}
            </div>

            {/* Image Information */}
            {image && (
              <div className="text-sm text-gray-500 flex justify-between items-center">
                <span>
                  Dimensions: {imageSize.width} × {imageSize.height} pixels
                </span>
                {isSaving && (
                  <span className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                )}
              </div>
            )}

            {/* Editor Controls */}
            {image && (
              <div className="flex flex-col gap-4">
                {/* Image Controls */}
                <ImageControls
                  adjustments={adjustments}
                  setAdjustments={setAdjustments}
                  filter={filter}
                  setFilter={setFilter}
                  filters={filters}
                  isAddingText={isAddingText}
                  setIsAddingText={setIsAddingText}
                  isCropping={isCropping}
                  setIsCropping={setIsCropping}
                  setCropBox={setCropBox}
                  handleDownload={handleDownload}
                  applyCrop={applyCrop}
                  cropBox={cropBox}
                />

                {/* Text Controls */}
                {isAddingText && (
                  <TextControls
                    text={text}
                    setText={setText}
                    textStyle={textStyle}
                    setTextStyle={setTextStyle}
                    fonts={fonts}
                  />
                )}

                {/* Crop Controls */}
                {isCropping && (
                  <CropControls
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                    cropAspectRatio={cropAspectRatio}
                    setCropAspectRatio={setCropAspectRatio}
                    isGridSnapping={isGridSnapping}
                    setIsGridSnapping={setIsGridSnapping}
                    cropBox={cropBox}
                  />
                )}
              </div>
            )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageEditor;
