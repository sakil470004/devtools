// src/components/tools/ImageToBase64/ImageToBase64.tsx
import React, { useState } from 'react';
import { FaUpload, FaCopy, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ImageToBase64: React.FC = () => {
  const [base64, setBase64] = useState<string | null>(null);
  const [decodedImage, setDecodedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBase64Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBase64(event.target.value);
  };

  const handleCopy = () => {
    if (base64) {
      navigator.clipboard.writeText(base64)
        .then(() => {
          toast.success("Base64 string copied to clipboard!");
        })
        .catch(err => {
          console.error('Failed to copy text:', err);
        });
    }
  };

  const handleDecode = () => {
    if (base64) {
      setDecodedImage(base64);
      toast.success("Image decoded!");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-12 text-center">
          <div className="inline-block px-8 py-6 rounded-2xl shadow-xl bg-gradient-to-r from-blue-100/80 to-gray-50/80 border border-blue-200/60">
            <h2 className="text-4xl font-extrabold mb-3 text-blue-700 tracking-tight font-mono drop-shadow-lg flex items-center justify-center">
              <FaImage className="mr-2 text-blue-700" /> Image to Base64 Tool
            </h2>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8 ">
          <div className="flex flex-col items-center mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4 p-2 border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              className="textarea textarea-bordered w-full h-64 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={base64 || ''}
              onChange={handleBase64Change}
              placeholder="Your Base64 string will appear here..."
            />
            {base64 && (
              <div className="w-full">
                <button
                  onClick={handleCopy}
                  className="btn bg-blue-500 text-white rounded-full px-4 py-2 shadow-md hover:bg-blue-600 flex items-center mb-4"
                >
                  <FaCopy className="mr-2" /> Copy Base64 String
                </button>
                <button
                  onClick={handleDecode}
                  className="btn bg-green-500 text-white rounded-full px-4 py-2 shadow-md hover:bg-green-600 flex items-center"
                >
                  <FaImage className="mr-2" /> Decode Base64 to Image
                </button>
              </div>
            )}
          </div>
          {decodedImage && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-center mb-4">Decoded Image Preview</h3>
              <img src={decodedImage} alt="Decoded" className="rounded-lg shadow-md" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageToBase64;
