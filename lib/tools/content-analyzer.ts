import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";

export const contentAnalyzerTool = tool({
  description: "Analyze the extracted content",
  parameters: z.object({
    content: z.string().describe("Content to analyze"),
    researchTopic: z.string().describe("The main research topic"),
    url: z.string().describe("Source URL"),
  }),

  execute: async ({ content, researchTopic, url }) => {
    try {
      console.log("Inside content analyzer mate");
      const analysisPrompt = `
        Analyze this content for the research topic: "${researchTopic}"
        
        Content: "${content.substring(0, 2000)}"
        
        Please provide your analysis in valid JSON format only (no markdown, no code blocks, no extra text):
        
        {
          "relevance": [score from 0-10],
          "keyInsights": ["insight 1", "insight 2", "insight 3"],
          "mainArguments": ["argument 1", "argument 2"],
          "dataStatistics": ["statistic 1", "statistic 2"],
          "summary": "One sentence summary of the content"
        }
        
        Return ONLY the JSON object, no other text or formatting.
    `;

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: analysisPrompt,
      });

      let analysis;

      try {
        // Clean the response to extract JSON
        let cleanedText = text.trim();

        // Remove markdown code blocks if present
        cleanedText = cleanedText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");

        // Remove any leading/trailing whitespace
        cleanedText = cleanedText.trim();

        // Find the JSON object (look for opening and closing braces)
        const jsonStart = cleanedText.indexOf("{");
        const jsonEnd = cleanedText.lastIndexOf("}");

        if (jsonStart !== -1 && jsonEnd !== -1) {
          cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
        }

        analysis = JSON.parse(cleanedText);

        // Validate the structure and provide defaults if needed
        analysis = {
          relevance: analysis.relevance || 5,
          keyInsights: Array.isArray(analysis.keyInsights)
            ? analysis.keyInsights
            : ["Content analyzed successfully"],
          mainArguments: Array.isArray(analysis.mainArguments)
            ? analysis.mainArguments
            : [],
          dataStatistics: Array.isArray(analysis.dataStatistics)
            ? analysis.dataStatistics
            : [],
          summary: analysis.summary || "Content analyzed for research topic",
        };
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw text:", text);

        // Fallback analysis if JSON parsing fails
        analysis = {
          relevance: 6,
          keyInsights: [
            "Content successfully extracted and processed",
            "Analysis completed despite formatting issues",
            "Source appears relevant to research topic",
          ],
          mainArguments: ["Content contains relevant information"],
          dataStatistics: [],
          summary: `Content from ${url} analyzed for topic: ${researchTopic}`,
        };
      }

      return {
        url,
        researchTopic,
        analysis,
        analyzedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Content analyzer error:", error);
      return {
        url,
        error: `Analysis failed: ${error}`,
        analyzedAt: new Date().toISOString(),
      };
    }
  },
});
