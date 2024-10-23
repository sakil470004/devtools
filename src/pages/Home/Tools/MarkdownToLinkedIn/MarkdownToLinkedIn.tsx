// src/components/tools/MarkdownToLinkedIn/MarkdownToLinkedIn.jsx
import { useState, useEffect } from "react";
import { FaLinkedin, FaCopy } from "react-icons/fa";

const MarkdownToLinkedIn = () => {
  const [markdown, setMarkdown] = useState("");
  const [linkedinText, setLinkedinText] = useState("");

  // Function to convert Markdown to LinkedIn-style text
  const convertMarkdownToLinkedIn = (markdown: string) => {
    // Replace headers (e.g., ### Header) by just removing the #
    let linkedinText = markdown.replace(/^#+\s/gm, '');

    // Replace bold (**) or (__) by bold for LinkedIn style
    linkedinText = linkedinText.replace(/\*\*(.*?)\*\*/g, '$1');
    linkedinText = linkedinText.replace(/__(.*?)__/g, '<b>$1</b>');

    // Replace italic (*) or (_) by _word_ for LinkedIn style
    linkedinText = linkedinText.replace(/\*(.*?)\*/g, '_$1_');
    linkedinText = linkedinText.replace(/_(.*?)_/g, '_$1_');

    // Convert links [text](url) to just the URL
    linkedinText = linkedinText.replace(/\[.*?\]\((.*?)\)/g, '$1');

    // Convert bullet points - or * to •
    linkedinText = linkedinText.replace(/^\s*[-*]\s+/gm, '• ');

    // Remove blockquotes > for LinkedIn format
    linkedinText = linkedinText.replace(/^>\s+/gm, '');

    return linkedinText;
  };
  const convertMarkdownToHTML = (markdown: string) => {
    // Replace headers (e.g., ### Header)
    let htmlText = markdown
      .replace(/^###\s(.*$)/gim, '<h3>$1</h3>') // H3
      .replace(/^##\s(.*$)/gim, '<h2>$1</h2>')  // H2
      .replace(/^#\s(.*$)/gim, '<h1>$1</h1>');  // H1

    // Replace bold (**) or (__) with <strong>
    htmlText = htmlText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Replace italic (*) or (_) with <em>
    htmlText = htmlText
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>');

    // Convert links [text](url) to <a href="url">text</a>
    htmlText = htmlText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Convert bullet points - or * to <ul><li>
    htmlText = htmlText
      .replace(/^\s*[-*]\s+(.*$)/gm, '<li>$1</li>') // List items
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>'); // Wrap in <ul> if not already wrapped

    // Remove blockquotes > for HTML format
    htmlText = htmlText.replace(/^>\s+/gm, '');

    // Replace multiple spaces with &nbsp;
    htmlText = htmlText.replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));

    // Replace new lines with <br>
    htmlText = htmlText.replace(/\n/g, '<br>');

    return htmlText.trim();

  }
  useEffect(() => {
    if (markdown.trim()) {
      setLinkedinText(convertMarkdownToHTML(markdown));
    } else {
      setLinkedinText("");
    }
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
  
    alert("Copied to clipboard!");
  }
  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center text-blue-600">
        <FaLinkedin className="mr-2" /> Markdown to LinkedIn Post
      </h2>
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
            className="textarea textarea-bordered w-full h-[calc(100vh-30vh)] p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="textarea textarea-bordered w-full h-[calc(100vh-30vh)] p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto"
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
  );
};

export default MarkdownToLinkedIn;
