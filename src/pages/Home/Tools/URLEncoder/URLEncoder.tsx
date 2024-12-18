// src/components/tools/URLEncoder/URLEncoder.tsx
import React, { useState } from 'react';
import { FaLink, FaCopy} from 'react-icons/fa';
import toast from 'react-hot-toast';

const URLEncoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [encodedURL, setEncodedURL] = useState('');
  const [decodedURL, setDecodedURL] = useState('');

  const handleEncode = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInput(value);
    setEncodedURL(encodeURIComponent(value));
  };

  const handleDecode = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInput(value);
    try {
      setDecodedURL(decodeURIComponent(value));
    } catch {
      toast.error("Invalid URL encoding");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };

  return (
    <div className="bg-gray-100 container mx-auto flex flex-col items-center justify-center py-10">
      <div className="bg-white shadow-xl rounded-lg p-8 ">
        <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center text-blue-600">
          <FaLink className="mr-2" /> URL Encoder & Decoder Tool
        </h2>
        <div className="flex flex-col items-center mb-8 w-full">
          <textarea
            className="textarea textarea-bordered w-full h-32 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={input}
            onChange={handleEncode}
            placeholder="Enter text to be encoded..."
          />
          <textarea
            className="textarea textarea-bordered w-full h-32 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={encodedURL}
            readOnly
            placeholder="Encoded URL will appear here..."
          />
          <button
            onClick={() => handleCopy(encodedURL)}
            className="btn bg-blue-500 text-white rounded-full px-4 py-2 shadow-md hover:bg-blue-600 flex items-center mb-4"
          >
            <FaCopy className="mr-2" /> Copy Encoded URL
          </button>
        </div>
        <div className="flex flex-col items-center mb-8 w-full">
          <textarea
            className="textarea textarea-bordered w-full h-32 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            value={input}
            onChange={handleDecode}
            placeholder="Enter Base64 to decode..."
          />
          <textarea
            className="textarea textarea-bordered w-full h-32 p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            value={decodedURL}
            readOnly
            placeholder="Decoded URL will appear here..."
          />
          <button
            onClick={() => handleCopy(decodedURL)}
            className="btn bg-green-500 text-white rounded-full px-4 py-2 shadow-md hover:bg-green-600 flex items-center mb-4"
          >
            <FaCopy className="mr-2" /> Copy Decoded URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default URLEncoder;
