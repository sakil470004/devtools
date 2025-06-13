// src/components/tools/MarkdownToLinkedIn/MarkdownToLinkedIn.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaLinkedin, FaCopy } from "react-icons/fa";
import { marked } from 'marked';

const MarkdownToLinkedIn = () => {
  const [markdown, setMarkdown] = useState("");
  const [linkedinText, setLinkedinText] = useState("");



  const convertMarkdownToHTML = async (markdown: string): Promise<string> => {

    markdown = markdown.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return marked.parse(markdown);
  };


  useEffect(() => {
    const convertAndSetText = async () => {
      if (markdown.trim()) {
        const html = await convertMarkdownToHTML(markdown);
        setLinkedinText(html);
      } else {
        setLinkedinText("");
      }
    };
    convertAndSetText();
  }, [markdown]);

  const handleCopy = () => {
    // Create a temporary element to hold the formatted text
    const tempElement = document.createElement('div');
    tempElement.innerHTML = linkedinText;

    // Apply necessary styles to preserve formatting
    tempElement.style.position = 'fixed';
    tempElement.style.opacity = '0';
    tempElement.style.pointerEvents = 'none';
    document.body.appendChild(tempElement);

    // Create a range and select the content
    const range = document.createRange();
    range.selectNodeContents(tempElement);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Copy the selected content to the clipboard
    document.execCommand('copy');

    // Clean up
    selection?.removeAllRanges();
    document.body.removeChild(tempElement);

    toast.success("Copied to clipboard!");
  }
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-12 text-center">
          <div className="inline-block px-8 py-6 rounded-2xl shadow-xl bg-gradient-to-r from-blue-100/80 to-gray-50/80 border border-blue-200/60">
            <h2 className="text-4xl font-extrabold mb-3 text-blue-700 tracking-tight font-mono drop-shadow-lg flex items-center justify-center">
              <FaLinkedin className="mr-2" /> Markdown to LinkedIn
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input TextBox */}
          <div>
            <label
              htmlFor="markdownInput"
              className="block text-lg font-medium mb-2 text-gray-700"
            >
              Markdown Input
            </label>
            <textarea
              id="markdownInput"
              className="textarea textarea-bordered w-full h-[calc(100vh-30vh)] p-4 rounded-lg border-2 border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your Markdown text here..."
            ></textarea>
          </div>
          {/* Output TextBox */}
          <div className="relative">
            <label
              htmlFor="linkedinOutput"
              className="block text-lg font-medium mb-2 text-gray-700"
            >
              LinkedIn Output
            </label>
            <div
              id="linkedinOutput"
              className="textarea textarea-bordered w-full h-[calc(100vh-30vh)] p-4 rounded-lg border-2 border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-500 overflow-auto"
              dangerouslySetInnerHTML={{ __html: linkedinText }}

            ></div>

            <button
              onClick={handleCopy}
              className="absolute top-10 right-4 m-2 p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none"
            >
              <FaCopy />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownToLinkedIn;
