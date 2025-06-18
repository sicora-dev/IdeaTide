"use client";
import { useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";


interface MessageBubbleProps {
  message: any;
  ideaId: number | undefined;
}

const CodeBlock = ({ language, children }: { language: string; children: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group">
      <SyntaxHighlighter
        style={materialDark}
        language={language}
        PreTag="div"
      >
        {children}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        title={copied ? "Copiado!" : "Copiar código"}
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

const MessageContent = ({ content }: { content: string }) => {
  const components: Components = {
    code(props) {
      const { node, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");
      
      return match ? (
        <CodeBlock language={match[1]} children={codeString} />
      ) : (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
};

export default function MessageBubble({ ideaId, message }: MessageBubbleProps) {
  const isUserMessage = message.type === "user";

  return (
    <div className={`flex chat ${isUserMessage ? "justify-end chat-end" : "justify-start chat-start"} mb-4`}>
      <div className="max-w-[80%]">
        <div className={`max-w-full px-4 py-2 rounded-lg long-text relative chat-bubble ${isUserMessage ? "text-primary" : ""} ${
          isUserMessage ? "bg-accent" : "bg-rainbow text-white"
        }`}>
          {/* Mostrar el mensaje original o traducido */}
          <MessageContent content={message.content} />
        </div>
      </div>
    </div>
  );
}