'use client';
import { useState, useEffect } from 'react';
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';

interface CodeExampleProps {
  code: string;
  language?: string;
}

export default function CodeExample({ code, language = 'javascript' }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={copyToClipboard}
          className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
        >
          {copied ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <pre className="rounded-lg bg-gray-900 p-4 text-sm text-white">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
