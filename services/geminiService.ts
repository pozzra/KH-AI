import { GoogleGenAI, Chat, GenerateContentResponse, Part, Content } from "@google/genai";
import { GEMINI_CHAT_MODEL, GEMINI_SYSTEM_INSTRUCTION } from '../constants';

let ai: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!process.env.API_KEY || process.env.API_KEY === "YOUR_GEMINI_API_KEY" || process.env.API_KEY.length < 10) {
    console.error("Gemini API Key is not configured or is invalid.");
    throw new Error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const startChatSession = (history?: Content[], aiResponseLanguageInstruction?: string): Chat => {
  const genAIInstance = getGenAI();
  
  let fullSystemInstruction = GEMINI_SYSTEM_INSTRUCTION;
  if (aiResponseLanguageInstruction && aiResponseLanguageInstruction.trim() !== "") {
    fullSystemInstruction = `${GEMINI_SYSTEM_INSTRUCTION} ${aiResponseLanguageInstruction}`;
  }

  return genAIInstance.chats.create({
    model: GEMINI_CHAT_MODEL,
    config: {
      systemInstruction: fullSystemInstruction,
    },
    history: history || [],
  });
};

export const sendMessageStream = async (
  chat: Chat,
  messageContent: string | Part[] 
): Promise<AsyncIterable<GenerateContentResponse>> => {
  try {
    const result = await chat.sendMessageStream({ message: messageContent }); 
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('api key not valid') || error.message.toLowerCase().includes('invalid api key')) {
            throw new Error('Invalid API Key. Please check your Gemini API Key.');
        } else if (error.message.includes('fetch') || error.message.toLowerCase().includes('network error')) {
            throw new Error('Network error. Failed to connect to Gemini service.');
        } else if (error.message.toLowerCase().includes('quota') || (error as any)?.status === 429) { // Type assertion for status
             throw new Error('API quota exceeded. Please check your Gemini API plan and usage.');
        }
    }
    throw new Error("Failed to send message to Gemini API.");
  }
};