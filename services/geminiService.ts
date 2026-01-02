
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// Fix: Initialize GoogleGenAI using the named parameter as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Summarizes text using Gemini 3 Flash to prime the reader's mind for training.
 */
export async function summarizeText(text: string): Promise<string> {
  try {
    // Fix: Using generateContent with specific model and prompt for concise summarization
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a cognitive priming assistant for a speed reading app called VELOCITY. 
      Summarize the following text into a short, intense "priming" message (max 30 words). 
      Focus on key concepts and structural logic to prepare the reader's brain for high-speed intake.
      Text: ${text}`,
    });
    
    // Fix: Access response.text directly (property, not method)
    return response.text || "Focus on the structural integrity of this protocol. Prepare for high-velocity data intake.";
  } catch (error) {
    console.error("Gemini summarize error:", error);
    return "Focus on the structural integrity of this protocol. Key concepts identified: DATA and logical recursion. Prepare for high-velocity data intake.";
  }
}

/**
 * Generates a comprehension quiz from text using Gemini 3 Flash with JSON response schema.
 */
export async function generateQuizFromText(text: string): Promise<QuizQuestion[]> {
  try {
    // Fix: Use responseSchema to ensure valid QuizQuestion[] structure
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 challenging multiple-choice questions to test deep comprehension of the following text. 
      The questions should focus on logic, intent, and structural details.
      Text: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The comprehension question text.",
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly four multiple choice options.",
              },
              correctIndex: {
                type: Type.INTEGER,
                description: "The zero-based index of the correct option.",
              },
            },
            required: ["question", "options", "correctIndex"],
          },
        },
      },
    });

    // Fix: Extract JSON and parse safely
    const jsonStr = response.text?.trim();
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error("Gemini quiz generation error:", error);
  }

  // Fallback set of questions if AI call fails
  return [
    {
      question: "What was the primary structural tone of the data stream?",
      options: ["Informative & Direct", "Abstract & Theoretical", "Persuasive & Intense", "Technical & Fragmented"],
      correctIndex: 1
    },
    {
      question: "Which cognitive layer was most stressed during this session?",
      options: ["Visual-Semantic Mapping", "Subvocal Suppression", "Peripheral Recognition", "Contextual Synthesis"],
      correctIndex: 0
    },
    {
      question: "The core argument in the middle block relied on which premise?",
      options: ["Linear expansion", "Recursive feedback", "Hierarchical deconstruction", "Empirical evidence"],
      correctIndex: 2
    },
    {
      question: "What was the estimated density of information in this protocol?",
      options: ["Low / Surface level", "Moderate / Foundational", "High / Advanced", "Critical / Elite"],
      correctIndex: 2
    },
    {
      question: "How would you categorize the logical flow of the ending?",
      options: ["Abrupt termination", "Convergent synthesis", "Divergent exploration", "Circular reinforcement"],
      correctIndex: 1
    }
  ];
}
