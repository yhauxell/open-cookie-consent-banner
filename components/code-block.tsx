"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, FileCode } from "lucide-react";
import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  // Simple syntax highlighting using regex
  const highlightLine = (line: string) => {
    // Order matters - more specific patterns first
    const patterns: Array<{
      pattern: RegExp;
      className: string;
      group?: number;
    }> = [
      // Comments
      { pattern: /(\/\/.*$)/gm, className: "text-zinc-500" },
      { pattern: /(\/\*[\s\S]*?\*\/)/gm, className: "text-zinc-500" },
      // Strings (double quotes)
      { pattern: /("(?:[^"\\]|\\.)*")/g, className: "text-amber-300" },
      // Strings (single quotes)
      { pattern: /('(?:[^'\\]|\\.)*')/g, className: "text-amber-300" },
      // Template literals
      { pattern: /(`(?:[^`\\]|\\.)*`)/g, className: "text-amber-300" },
      // Keywords
      {
        pattern:
          /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|new|this|async|await|default|try|catch|throw|typeof|instanceof)\b/g,
        className: "text-purple-400",
      },
      // React/JSX keywords
      {
        pattern:
          /\b(useState|useEffect|useCallback|useMemo|useRef|useContext)\b/g,
        className: "text-cyan-300",
      },
      // Boolean, null, undefined
      {
        pattern: /\b(true|false|null|undefined)\b/g,
        className: "text-orange-400",
      },
      // Numbers
      { pattern: /\b(\d+\.?\d*)\b/g, className: "text-orange-400" },
      // JSX tags
      { pattern: /(<\/?[\w]+)/g, className: "text-red-400" },
      // JSX closing bracket
      { pattern: /(\s*\/?>)/g, className: "text-zinc-400" },
      // JSX attributes
      { pattern: /\s([\w-]+)=/g, className: "text-sky-300", group: 1 },
      // Function calls
      { pattern: /\b([\w]+)\(/g, className: "text-yellow-200", group: 1 },
      // Arrow functions
      { pattern: /(=>)/g, className: "text-purple-400" },
      // Destructuring braces
      { pattern: /([{}[\]])/g, className: "text-zinc-400" },
    ];

    let result = line;
    const tokens: Array<{
      start: number;
      end: number;
      className: string;
      text: string;
    }> = [];

    // Find all matches
    patterns.forEach(({ pattern, className, group }) => {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match;
      while ((match = regex.exec(line)) !== null) {
        const matchedText = group !== undefined ? match[group] : match[0];
        const start =
          group !== undefined
            ? match.index + match[0].indexOf(matchedText)
            : match.index;
        const end = start + matchedText.length;

        // Check for overlapping tokens
        const hasOverlap = tokens.some(
          (t) =>
            (start >= t.start && start < t.end) ||
            (end > t.start && end <= t.end)
        );

        if (!hasOverlap && matchedText.trim()) {
          tokens.push({ start, end, className, text: matchedText });
        }
      }
    });

    // Sort tokens by start position
    tokens.sort((a, b) => a.start - b.start);

    // Build highlighted line
    if (tokens.length === 0) {
      return <span className="text-zinc-300">{line || " "}</span>;
    }

    const parts: React.ReactElement[] = [];
    let lastEnd = 0;

    tokens.forEach((token, i) => {
      // Add text before this token
      if (token.start > lastEnd) {
        parts.push(
          <span key={`text-${i}`} className="text-zinc-300">
            {line.slice(lastEnd, token.start)}
          </span>
        );
      }
      // Add the highlighted token
      parts.push(
        <span key={`token-${i}`} className={token.className}>
          {token.text}
        </span>
      );
      lastEnd = token.end;
    });

    // Add remaining text
    if (lastEnd < line.length) {
      parts.push(
        <span key="text-end" className="text-zinc-300">
          {line.slice(lastEnd)}
        </span>
      );
    }

    return <>{parts.length > 0 ? parts : <span> </span>}</>;
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover:bg-red-500/80 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover:bg-yellow-500/80 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover:bg-green-500/80 transition-colors" />
          </div>
          {filename && (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <FileCode className="h-3.5 w-3.5" />
              <span>{filename}</span>
            </div>
          )}
          {!filename && language && (
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none pr-4 text-zinc-600 text-right w-8 shrink-0">
                    {i + 1}
                  </span>
                )}
                <span className="flex-1">{highlightLine(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
