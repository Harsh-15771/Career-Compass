import main from "../configs/gemini.js";

export const generateBlogSummary = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const prompt = `
You are an assistant summarizing a student's placement experience blog.

STRICT RULES:
- The summary MUST be much shorter than the original content.
- Use at most 6 bullet points. Bullets points should be visible
- Each bullet point should be 1-2 short lines only.
- Do NOT explain in detail.
- Do NOT rewrite the full story.
- Think of this as a short summary for busy students.

CONTENT:
${content}
`;

    const summary = await main(prompt);

    res.json({ success: true, summary });
  } catch (error) {
    console.error("AI summary error:", error);
    res.status(500).json({ success: false, message: "AI failed" });
  }
};
