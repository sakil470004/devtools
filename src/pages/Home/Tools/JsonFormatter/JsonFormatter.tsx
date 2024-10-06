import React, { useState } from "react";
import { LuFileJson } from "react-icons/lu";
import "../../../../App.css";
const JSONFormatter: React.FC = () => {
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
    <div style={{ padding: "20px" }}>
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <LuFileJson className="mr-2 text-blue-700" /> JSON Formatter
      </h2>
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
  );
};

export default JSONFormatter;
