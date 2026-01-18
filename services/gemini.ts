import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

/**
 * Analyzes video content (metadata) to provide insights or answers.
 * Uses gemini-3-pro-preview for standard reasoning.
 */
export const analyzeVideoContent = async (
  title: string,
  description: string,
  userQuery: string
): Promise<string> => {
  if (!apiKey) return "Gemini API Key is missing. Please check your environment variables.";

  try {
    const prompt = `
      You are an AI assistant for a video platform called Aura Tube.
      Analyze the following video metadata and answer the user's question.
      
      Video Title: ${title}
      Video Description: ${description}
      
      User Question: ${userQuery}
      
      Keep the answer concise, engaging, and relevant to the video context.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "I couldn't generate an answer at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I encountered an error while analyzing the video.";
  }
};

/**
 * Uses 'Thinking Mode' for complex deep dives into the video topic.
 * Uses thinkingBudget to allow for extended reasoning.
 */
export const deepDiveVideoTopic = async (
  title: string,
  description: string
): Promise<string> => {
  if (!apiKey) return "Gemini API Key is missing.";

  try {
    const prompt = `
      Perform a deep dive analysis on the topic of this video: "${title}".
      Description context: ${description}
      
      1. Identify the core concepts.
      2. Explain why this topic matters.
      3. Suggest 3 related advanced topics a viewer might want to learn next.
      
      Format the output with clear Markdown headings.
    `;

    // Using thinking config for deeper reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, 
        },
      },
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Deep Dive Error:", error);
    return "Deep think analysis failed due to an API error.";
  }
};
