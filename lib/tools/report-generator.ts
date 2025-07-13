import { tool } from "ai";
import { z } from "zod";

export const reportGeneratorTool = tool({
  description: "Generate a report using analyzed data",
  parameters: z.object({
    topic: z.string().describe("Research topic"),
    analyses: z.array(z.any()).describe("Array of content analyses"),
    reportType: z
      .enum(["summary", "detailed", "citations"])
      .optional()
      .default("summary"),
  }),
  execute: async ({ topic, analyses, reportType }) => {
    console.log("Generating report mate");
    const validAnalyses = analyses.filter((a) => !a.error && a.analysis);

    if (validAnalyses.length === 0) {
      return {
        error: "No valid analyses to generate report from",
        topic,
      };
    }

    // Sort by relevance
    validAnalyses.sort(
      (a, b) => (b.analysis.relevance || 0) - (a.analysis.relevance || 0)
    );

    const report = {
      topic,
      generatedAt: new Date().toISOString(),
      sourceCount: validAnalyses.length,
      summary: `Research on "${topic}" based on ${validAnalyses.length} sources`,
      keyFindings: [],
      sources: [],
      overallInsights: [],
    };

    // Extract key findings
    validAnalyses.forEach((analysis, index) => {
      if (analysis.analysis.keyInsights) {
        report.keyFindings.push({
          source: index + 1,
          url: analysis.url,
          insights: analysis.analysis.keyInsights,
          relevance: analysis.analysis.relevance,
        });
      }

      report.sources.push({
        url: analysis.url,
        relevance: analysis.analysis.relevance,
        summary: analysis.analysis.summary,
      });
    });

    // Generate overall insights
    const topInsights = validAnalyses
      .filter((a) => a.analysis.relevance > 6)
      .slice(0, 3)
      .map((a) => a.analysis.summary);

    report.overallInsights = topInsights;

    return report;
  },
});
