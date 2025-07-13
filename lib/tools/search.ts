import { tool } from "ai";
import { z } from "zod";

export const searchTool = tool({
  // This is the basic description of the tool to the llm
  description: "Search the web for information on a topic",

  // Paramters that are going to be passed to the tool
  parameters: z.object({
    query: z.string().describe("Search Query"),
    maxResults: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of results"),
  }),

  // Execution script of the tool
  execute: async ({ query, maxResults }) => {
    // Send a request to google search engine and fetch the results
    console.log("Inside the searching stuff");
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${
        process.env.SEARCH_API_KEY
      }&cx=${process.env.CX}&q=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    // Sending necessary information to the llm
    return {
      query,
      results:
        data.items?.slice(0, maxResults).map((item: any) => ({
          title: item.title || "No Title",
          snippet: item.snippet || "No Snippet",
          url: item.link || null,
          displayLink: item.displayLink || null,
          formattedUrl: item.formattedUrl || null,
        })) || [],
      timestamp: new Date().toISOString(),
    };
  },
});
