import { tool } from "ai";
import * as cheerio from "cheerio";
import { z } from "zod";

export const contentExtractorTool = tool({
  description: "Extract and clean content from web pages",
  parameters: z.object({
    url: z.string().describe("URL to extract content from"),
    contentType: z
      .enum(["article", "full", "headings"])
      .optional()
      .default("article"),
  }),

  execute: async ({ url, contentType }) => {
    try {
      // Sends the request to the url in the name of Researchbot appearing mozilla compliant
      console.log("Inside content extractor mate");
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ResearchBot/1.0)",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      $("script, style, nav, footer, aside, .advertisement").remove();

      let content = "";
      const title = $("title").text().trim();

      if (contentType === "article") {
        // Try to find main content
        const mainContent = $("article, .content, .post-content, main").first();
        content =
          mainContent.length > 0 ? mainContent.text() : $("body").text();
      } else if (contentType === "headings") {
        content = $("h1, h2, h3, h4")
          .map((_, el) => $(el).text().trim())
          .get()
          .join("\n");
      } else {
        content = $("body").text();
      }

      // Clean up whitespace
      content = content.replace(/\s+/g, " ").trim();

      return {
        url,
        title,
        content: content.substring(0, 5000), // Limit content length
        wordCount: content.split(" ").length,
        extractedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        url,
        error: `Failed to extract content: ${error}`,
        extractedAt: new Date().toISOString(),
      };
    }
  },
});
