"use client";

import { useChat } from "ai/react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ResearchAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      maxSteps: 10,
    });

  const [animatedMessages, setAnimatedMessages] = useState(new Set());
  const messagesEndRef = useRef(null);

  // This effect handles the staggered animation for new messages and is
  // designed to be stable during streaming updates from the AI.
  useEffect(() => {
    const newMessages = messages.filter(
      (message) => !animatedMessages.has(message.id)
    );

    if (newMessages.length > 0) {
      newMessages.forEach((message, index) => {
        setTimeout(() => {
          setAnimatedMessages((prev) => new Set(prev).add(message.id));
        }, index * 200 + 100);
      });
    }
  }, [messages, animatedMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getToolIcon = (toolName) => {
    switch (toolName) {
      case "search":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        );
      case "extractContent":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "analyzeContent":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "generateReport":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
    }
  };

  const getToolColor = (toolName) => {
    switch (toolName) {
      case "search":
        return "from-amber-500 to-orange-500";
      case "extractContent":
        return "from-purple-500 to-pink-500";
      case "analyzeContent":
        return "from-green-500 to-emerald-500";
      case "generateReport":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const PulsingDot = ({ color = "bg-amber-500" }) => (
    <div className="relative inline-flex">
      <div className={`w-2 h-2 ${color} rounded-full`}></div>
      <div
        className={`absolute top-0 left-0 w-2 h-2 ${color} rounded-full animate-ping`}
      ></div>
      <div
        className={`absolute top-0 left-0 w-2 h-2 ${color} rounded-full animate-pulse`}
      ></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white">
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-2xl">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight font-primary">
            Research Assistant
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            Advanced AI-powered research with intelligent web scraping, content
            analysis, and comprehensive report generation
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
          {messages.map((message, messageIndex) => (
            <div
              key={message.id}
              className={`w-full transform transition-[opacity,transform] duration-700 ease-out ${
                animatedMessages.has(message.id)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`flex items-center px-4 py-2 rounded-t-lg border-t border-l border-r ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50"
                      : "bg-gradient-to-r from-slate-800/80 to-slate-700/70 border-slate-600"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm shadow-lg mr-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}
                  >
                    {message.role === "user" ? (
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm sm:text-base font-semibold">
                    {message.role === "user"
                      ? "Your Query"
                      : "Research Assistant"}
                  </span>
                </div>
                <div
                  className={`h-px flex-1 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-amber-500/30 to-transparent"
                      : "bg-gradient-to-r from-slate-600/30 to-transparent"
                  }`}
                ></div>
              </div>

              <div
                className={`backdrop-blur-lg rounded-b-2xl rounded-tr-2xl border p-4 sm:p-6 shadow-2xl ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30"
                    : "bg-gradient-to-r from-slate-800/80 to-slate-700/70 border-slate-700"
                }`}
              >
                <div className="text-gray-200 leading-relaxed text-sm sm:text-base">
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-xl sm:text-2xl font-bold my-3 sm:my-4"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-lg sm:text-xl font-bold my-2 sm:my-3"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-base sm:text-lg font-bold my-2"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="mb-3 sm:mb-4 last:mb-0" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside space-y-1 sm:space-y-2 my-3 sm:my-4 pl-2"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-inside space-y-1 sm:space-y-2 my-3 sm:my-4 pl-2"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="pl-2" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-bold text-white" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            className="text-amber-400 hover:underline break-words"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <div className="break-words">{message.content}</div>
                  )}
                </div>

                {message.toolInvocations &&
                  message.toolInvocations.length > 0 && (
                    <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                      {message.toolInvocations.map((tool, toolIndex) => (
                        <div
                          key={`${message.id}-tool-${toolIndex}`}
                          className="backdrop-blur-lg bg-black/20 rounded-xl border border-slate-600/30 p-3 sm:p-4 transform transition-all duration-500 ease-out shadow-lg"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r ${getToolColor(
                                tool.toolName
                              )} flex items-center justify-center shadow-lg text-white`}
                            >
                              {getToolIcon(tool.toolName)}
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-white px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600">
                              {tool.toolName}
                            </span>
                            <div className="flex items-center space-x-2">
                              {tool.state === "call" && (
                                <div className="flex items-center space-x-2">
                                  <PulsingDot color="bg-yellow-400" />
                                  <span className="text-xs text-yellow-400">
                                    Processing...
                                  </span>
                                </div>
                              )}
                              {tool.state === "result" && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="text-xs text-green-400">
                                    Complete
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {tool.state === "call" && (
                            <div className="text-xs sm:text-sm text-slate-400 bg-slate-900/50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold">Input:</span>
                                <PulsingDot color="bg-amber-400" />
                              </div>
                              <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
                                {JSON.stringify(tool.args, null, 2)}
                              </pre>
                            </div>
                          )}

                          {tool.state === "result" && tool.result && (
                            <div className="text-xs sm:text-sm text-slate-300">
                              {tool.toolName === "search" && (
                                <div className="space-y-3">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <span className="font-semibold text-amber-300">
                                      Found {tool.result.results?.length || 0}{" "}
                                      results for:
                                    </span>
                                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full break-words">
                                      {tool.result.query}
                                    </span>
                                  </div>
                                  <div className="grid gap-2">
                                    {tool.result.results
                                      ?.slice(0, 3)
                                      .map((result, i) => (
                                        <div
                                          key={i}
                                          className="flex items-start space-x-3 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                                        >
                                          <div className="w-2 h-2 bg-amber-400 rounded-full mt-1 flex-shrink-0"></div>
                                          <span className="text-amber-300 text-sm font-medium break-words">
                                            {result.title}
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {tool.toolName === "extractContent" && (
                                <div className="space-y-2">
                                  <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-purple-300">
                                      Extracted content from:
                                    </span>
                                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full break-all">
                                      {tool.result.url}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                                    <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                                      <div className="text-xs text-purple-300 mb-1">
                                        Title
                                      </div>
                                      <div className="text-sm font-semibold break-words">
                                        {tool.result.title}
                                      </div>
                                    </div>
                                    <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                                      <div className="text-xs text-purple-300 mb-1">
                                        Word Count
                                      </div>
                                      <div className="text-sm font-semibold">
                                        {tool.result.wordCount}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {tool.toolName === "analyzeContent" && (
                                <div className="space-y-3">
                                  <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-green-300">
                                      Analysis complete for:
                                    </span>
                                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full break-all">
                                      {tool.result.url}
                                    </span>
                                  </div>
                                  <div className="grid gap-3">
                                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-green-300">
                                          Relevance Score
                                        </span>
                                        <span className="text-lg font-bold text-green-300">
                                          {tool.result.analysis?.relevance}/10
                                        </span>
                                      </div>
                                      <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                          className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-1000"
                                          style={{
                                            width: `${
                                              (tool.result.analysis
                                                ?.relevance || 0) * 10
                                            }%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                                      <div className="text-xs text-green-300 mb-2">
                                        Summary
                                      </div>
                                      <div className="text-sm break-words">
                                        {tool.result.analysis?.summary}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {tool.toolName === "generateReport" && (
                                <div className="space-y-3">
                                  <div className="flex flex-col gap-2">
                                    <span className="font-semibold text-orange-300">
                                      Report generated for:
                                    </span>
                                    <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full break-words">
                                      {tool.result.topic}
                                    </span>
                                  </div>
                                  <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-orange-300">
                                        Sources Analyzed
                                      </span>
                                      <span className="text-xl font-bold text-orange-300">
                                        {tool.result.sourceCount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="w-full">
              <div className="flex items-center mb-4">
                <div className="flex items-center px-4 py-2 rounded-t-lg border-t border-l border-r bg-gradient-to-r from-slate-800/80 to-slate-700/70 border-slate-600">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm shadow-lg mr-3 bg-gradient-to-r from-purple-500 to-pink-500">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-semibold">
                    Research Assistant
                  </span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-600/30 to-transparent"></div>
              </div>

              <div className="backdrop-blur-lg rounded-b-2xl rounded-tr-2xl border bg-gradient-to-r from-slate-800/80 to-slate-700/70 border-slate-700 p-4 sm:p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <PulsingDot color="bg-purple-400" />
                  <span className="text-slate-300 text-sm sm:text-base">
                    Analyzing your request...
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-600 via-slate-500 to-transparent rounded animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-600 via-slate-500 to-transparent rounded w-3/4 animate-pulse delay-100"></div>
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-600 via-slate-500 to-transparent rounded w-1/2 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-4 sm:bottom-6 backdrop-blur-xl bg-slate-900/80 rounded-2xl border border-slate-600/30 p-3 sm:p-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me to research any topic..."
                className="w-full p-3 sm:p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white placeholder-slate-400 text-sm sm:text-base backdrop-blur-sm transition-all duration-300"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-xl hover:from-amber-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 min-w-[100px]">
                  <PulsingDot color="bg-white" />
                  <span>Researching</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Research</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
