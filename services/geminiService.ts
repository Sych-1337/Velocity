
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// Always use the direct process.env.API_KEY reference in the named parameter object
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuizFromText(text: string): Promise<QuizQuestion[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 multiple choice questions to test comprehension of this text. Return as JSON. 
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctIndex: { type: Type.INTEGER }
            },
            required: ["question", "options", "correctIndex"]
          }
        }
      }
    });

    // Extract generated text directly from the response object property
    const jsonStr = response.text?.trim() || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    // Fallback static quiz if AI fails
    return [
      {
        question: "What was the main theme of the text?",
        options: ["Action", "Contemplation", "Success", "Growth"],
        correctIndex: 0
      }
    ];
  }
}
