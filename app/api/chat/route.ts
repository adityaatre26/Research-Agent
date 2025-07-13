import { contentAnalyzerTool } from "@/lib/tools/content-analyzer";
import { contentExtractorTool } from "@/lib/tools/content-extractor";
import { reportGeneratorTool } from "@/lib/tools/report-generator";
import { searchTool } from "@/lib/tools/search";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Processing messages:", messages);

    const result = await streamText({
      model: google("gemini-2.5-flash"), // Updated to latest model
      messages,
      tools: {
        search: searchTool,
        extractContent: contentExtractorTool,
        analyzeContent: contentAnalyzerTool,
        generateReport: reportGeneratorTool,
      },
      maxSteps: 100,
      system: `You are a research assistant that helps users research topics thoroughly.

        RESEARCH PROCESS:
        1. First use 'search' with query based on user request
        2. Extract content from 2-3 top URLs using 'extractContent' - pass the URL string directly
        3. Analyze each extracted content using 'analyzeContent' - pass the content, research topic, and URL
        4. Generate final report with 'generateReport' - pass the topic and array of all analyses

        IMPORTANT RULES:
        - ALWAYS pass the original research topic to analyzeContent
        - When using extractContent, pass the URL string (not the entire search result object)
        - Wait for each tool to complete before moving to the next step
        - Include source URLs in your final summary
        - If a tool fails, continue with remaining sources
        - Provide a comprehensive final summary with key findings and sources

        Be conversational and explain what you're doing at each step.`,
    });

    return result.toDataStreamResponse({
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
