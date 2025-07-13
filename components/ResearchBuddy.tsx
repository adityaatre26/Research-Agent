"use client";

import { useChat } from "ai/react";

export default function ResearchAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      maxSteps: 10,
    });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Research Assistant
        </h1>
        <p className="text-gray-600">
          Ask me to research any topic and I'll search, extract content, analyze
          it, and generate a comprehensive report.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-50 border border-blue-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {message.role === "user" ? "U" : "AI"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {message.role === "user" ? "You" : "Research Assistant"}
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {message.content}
                </div>

                {/* Display tool invocations */}
                {message.toolInvocations &&
                  message.toolInvocations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.toolInvocations.map((tool, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {tool.toolName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {tool.state}
                            </span>
                          </div>

                          {tool.state === "call" && (
                            <div className="text-xs text-gray-600">
                              <strong>Input:</strong>{" "}
                              {JSON.stringify(tool.args, null, 2)}
                            </div>
                          )}

                          {tool.state === "result" && tool.result && (
                            <div className="text-xs text-gray-600">
                              {tool.toolName === "search" && (
                                <div>
                                  <strong>
                                    Found {tool.result.results?.length || 0}{" "}
                                    results for:
                                  </strong>{" "}
                                  {tool.result.query}
                                  <div className="mt-1 space-y-1">
                                    {tool.result.results
                                      ?.slice(0, 3)
                                      .map((result: any, i: number) => (
                                        <div
                                          key={i}
                                          className="text-blue-600 hover:underline"
                                        >
                                          • {result.title}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {tool.toolName === "extractContent" && (
                                <div>
                                  <strong>Extracted content from:</strong>{" "}
                                  {tool.result.url}
                                  <div className="mt-1">
                                    <strong>Title:</strong> {tool.result.title}
                                    <br />
                                    <strong>Word Count:</strong>{" "}
                                    {tool.result.wordCount}
                                  </div>
                                </div>
                              )}

                              {tool.toolName === "analyzeContent" && (
                                <div>
                                  <strong>Analysis complete for:</strong>{" "}
                                  {tool.result.url}
                                  <div className="mt-1">
                                    <strong>Relevance:</strong>{" "}
                                    {tool.result.analysis?.relevance}/10
                                    <br />
                                    <strong>Summary:</strong>{" "}
                                    {tool.result.analysis?.summary}
                                  </div>
                                </div>
                              )}

                              {tool.toolName === "generateReport" && (
                                <div>
                                  <strong>Report generated for:</strong>{" "}
                                  {tool.result.topic}
                                  <div className="mt-1">
                                    <strong>Sources analyzed:</strong>{" "}
                                    {tool.result.sourceCount}
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
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-white p-4 border-t"
      >
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me to research any topic (e.g., 'Research the latest developments in AI safety')"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Researching..." : "Research"}
          </button>
        </div>
      </form>
    </div>
  );
}
