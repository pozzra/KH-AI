import React, { useState, useEffect, useRef } from "react";
import { TranslationSet } from "../types";

interface CodeSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeToSimulate: string | null;
  t: (key: keyof TranslationSet, ...args: (string | number)[]) => string;
}

const CodeSimulationModal: React.FC<CodeSimulationModalProps> = ({
  isOpen,
  onClose,
  codeToSimulate,
  t,
}) => {
  const [editableCode, setEditableCode] = useState(codeToSimulate || "");
  const [simulatedOutput, setSimulatedOutput] = useState<string>("");
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && codeToSimulate) {
      setEditableCode(codeToSimulate);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
    setShowCopiedFeedback(false); // Reset feedback when modal opens or code changes
  }, [isOpen, codeToSimulate]);

  useEffect(() => {
    // Auto-resize textarea for code
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      // Adjust maxHeight for smaller screens. Tailwind's 'sm' breakpoint is typically 640px.
      const maxHeight = window.innerWidth < 640 ? 200 : 300; 
      textareaRef.current.style.height = `${Math.min(
        scrollHeight,
        maxHeight
      )}px`;
      if (scrollHeight > maxHeight) {
        textareaRef.current.style.overflowY = "auto";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  }, [editableCode]);

  // Simulate code execution when editableCode changes
  useEffect(() => {
    if (!isOpen || !editableCode) {
      setSimulatedOutput(t("codeOutputSimulatedPlaceholder"));
      return;
    }

    // Simple simulation logic
    let outputContent = ""; // This will hold the actual simulated output lines
    let specificOutputFound = false;

    // Try to match console.log (JavaScript-like)
    // Regex to capture content within console.log(), handling optional semicolon
    const consoleLogRegex = /console\.log\s*\((.*?)\)\s*;?/g;
    let jsMatch;
    while ((jsMatch = consoleLogRegex.exec(editableCode)) !== null) {
      const arg = jsMatch[1].trim();
      try {
        // Only attempt eval if it looks like a simple string or number literal
        if (
          (arg.startsWith('"') && arg.endsWith('"')) ||
          (arg.startsWith("'") && arg.endsWith("'")) ||
          !isNaN(parseFloat(arg))
        ) {
          outputContent += `Reu Output : ${eval(arg)}\n`;
        } else {
          outputContent += `Reu Output : (from console.log): ${arg}\n`; // Show raw content for complex args
        }
      } catch (e) {
        outputContent += `Reu Output : (from console.log): ${arg}\n`; // Fallback on eval error
      }
      specificOutputFound = true;
    }

    // Try to match return (JavaScript-like)
    const returnValueMatch = editableCode.match(/return\s+([^;]+?)\s*;?/);
    if (returnValueMatch && returnValueMatch[1]) {
      outputContent += `Simulated return: ${returnValueMatch[1].trim()}\n`;
      specificOutputFound = true;
    }

    // Try to match print (Python-like)
    const printRegex = /print\s*\((.*?)\)\s*;?/g;
    while ((jsMatch = printRegex.exec(editableCode)) !== null) {
      outputContent += `Output (from print): ${jsMatch[1].trim()}\n`;
      specificOutputFound = true;
    }

    if (!specificOutputFound) {
      // Add a new translation key for this message
      outputContent += `${t(
        "noSpecificOutputSimulated",
        "No specific output could be extracted by this simple simulation."
      )}\n`;
    }

    const finalOutput = `${outputContent}`;
    setSimulatedOutput(finalOutput.replace(/\n/g, "<br />"));
  }, [editableCode, isOpen, t]);

  if (!isOpen || codeToSimulate === null) return null; // Ensure codeToSimulate is not null

  const handleCopyCode = () => {
    if (!editableCode || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(editableCode)
      .then(() => {
        setShowCopiedFeedback(true);
        setTimeout(() => setShowCopiedFeedback(false), 2000);
      })
      .catch((err) => console.error("Failed to copy code: ", err));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-simulation-title"
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl sm:max-w-2xl m-4 sm:m-0 text-gray-200 transform transition-all duration-300 scale-100 opacity-100 flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
        style={{ maxHeight: "90vh" }} // Ensure modal fits in viewport
      >
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2
            id="code-simulation-title"
            className="text-xl font-semibold text-sky-400"
          >
            {t("codeSimulationModalTitle")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-full"
            aria-label={t("closeModalButtonLabel")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-1 shrink-0">
          {t("simulatingExecutionText")}
        </p>
        <p className="text-xs text-sky-300 mb-2 shrink-0">
          {t("codeEditableInModalHint")}
        </p>

        <div className="bg-gray-900 p-0 my-2 rounded text-sm overflow-hidden flex-grow">
          <textarea
            ref={textareaRef}
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            className="w-full h-full bg-transparent text-gray-300 p-3 whitespace-pre-wrap font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-sky-500 rounded"
            spellCheck="false"
            aria-label="Editable code area"
          />
        </div>

        <div className="mt-4 shrink-0">
          <p className="text-sm text-gray-400 mb-1">Output (Simulated):</p>
          <div
            className="bg-gray-700 p-3 rounded text-sm text-gray-300 min-h-[50px] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: simulatedOutput }}
          ></div>
        </div>

        <div className="mt-6 flex justify-between items-center shrink-0">
          <div>
            {showCopiedFeedback && (
              <span className="text-sm text-sky-400 transition-opacity duration-300">
                {t("copiedFeedbackText")}
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-sky-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              {t("copyCodeButtonLabel", "Copy Code")}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors"
            >
              {t("closeModalButtonLabel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSimulationModal;
