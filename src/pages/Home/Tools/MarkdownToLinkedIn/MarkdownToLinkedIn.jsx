// src/components/tools/MarkdownToLinkedIn.jsx
import React, { useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';

const MarkdownToLinkedIn = () => {
  const [markdown, setMarkdown] = useState('');
  const [linkedinText, setLinkedinText] = useState('');

  // Function to convert Markdown to LinkedIn-style text
  const convertMarkdownToLinkedIn = (markdown) => {
    let linkedinText = markdown
      .replace(/^# (.*$)/gim, '$1\n' + '='.repeat(50)) // H1
      .replace(/^## (.*$)/gim, '$1\n' + '-'.repeat(50)) // H2
      .replace(/^### (.*$)/gim, '**$1**') // H3
      .replace(/\*\*(.*)\*\*/gim, '*$1*') // Bold to Italics
      .replace(/\*(.*)\*/gim, '_$1_') // Italics to Underline
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '') // Remove images
      .replace(/\[(.*?)\]\((.*?)\)/gim, '$1'); // Remove links

    return linkedinText.trim();
  };

  const handleConvert = () => {
    const convertedText = convertMarkdownToLinkedIn(markdown);
    setLinkedinText(convertedText);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <FaLinkedin className="mr-2 text-blue-700" /> Markdown to LinkedIn Post
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input TextBox */}
        <div>
          <label htmlFor="markdownInput" className="block text-sm font-medium mb-2">
            Markdown Input
          </label>
          <textarea
            id="markdownInput"
            className="textarea textarea-bordered w-full h-64"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Enter your Markdown text here..."
          ></textarea>
        </div>

        {/* Output TextBox */}
        <div>
          <label htmlFor="linkedinOutput" className="block text-sm font-medium mb-2">
            LinkedIn Output
          </label>
          <textarea
            id="linkedinOutput"
            className="textarea textarea-bordered w-full h-64"
            value={linkedinText}
            readOnly
            placeholder="Your LinkedIn post will appear here..."
          ></textarea>
        </div>
      </div>

      {/* Convert Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleConvert}
          className="btn btn-primary px-6 py-3"
        >
          Convert to LinkedIn Post
        </button>
      </div>
    </div>
  );
};

export default MarkdownToLinkedIn;
