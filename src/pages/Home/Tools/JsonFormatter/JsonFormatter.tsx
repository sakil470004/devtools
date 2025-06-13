import React, { useState } from "react";
import { LuFileJson } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "../../../../App.css";
const JSONFormatter: React.FC = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const formatJSON = (input: string) => {
    try {
      const parsedJSON = JSON.parse(input); // Parse the JSON input
      const formattedJSON = JSON.stringify(parsedJSON, null, 2); // Pretty-print JSON
      setOutput(syntaxHighlight(formattedJSON)); // Apply syntax highlighting
    } catch (error) {
      if (error instanceof Error)
        setOutput(`<span class="error">Invalid JSON: ${error.message}</span>`); // Error message if invalid JSON
    }
  };

  // Function to apply basic syntax highlighting
  const syntaxHighlight = (json: string) => {
    return json.replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      function (match) {
        let cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

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
              <LuFileJson className="mr-2 text-blue-700" /> JSON Formatter
            </h2>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col gap-2 items-center ">
          <textarea
            value={jsonInput}
            className=" w-full h-[80vh] resize-none border rounded-md p-2 border-gray-500"
            onChange={(e) => {
              setJsonInput(e.target.value);
              formatJSON(e.target.value);
            }} // Handle textarea changes
            placeholder="Paste your JSON here..."
            rows={30}
          />
          <div className="w-full h-[80vh] relative">
            <button
              className="absolute right-2 top-4"
              onClick={() => {
                const textToCopy = output.replace(/<[^>]+>/g, "");
                navigator.clipboard.writeText(textToCopy).then(() => {
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 3000);
                });
              }}
            >
              <span className="text-white bg-blue-500 px-4 py-2 rounded-md">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
            <pre
              className="whitespace-pre-wrap bg-[#2b2b2b] p-4 rounded-md text-white  overflow-auto w-full h-full"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;
