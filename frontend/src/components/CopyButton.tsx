import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton = ({ text, className = '' }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
        copied
          ? 'bg-green-100 text-green-700'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      } ${className}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton;

