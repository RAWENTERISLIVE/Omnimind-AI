import { GoogleGenAI } from "@google/genai";
import { 
  MAX_THINKING_BUDGET,
  THINKING_SYSTEM_INSTRUCTION 
} from "../constants";
import { getSettings } from "./settingsService";

// Helper to get a configured client based on current settings
const getClient = () => {
  const settings = getSettings();

  if (settings.provider === 'vertex' && settings.vertexAccessToken && settings.vertexProjectID) {
    return new GoogleGenAI({
      vertexAI: {
        project: settings.vertexProjectID,
        location: settings.vertexLocation || 'us-central1',
      },
      apiKey: settings.vertexAccessToken // In browser context, apiKey is often used as the bearer token for Vertex requests
    });
  }

  // Prioritize User Entered Key -> Env Variable
  const apiKey = settings.googleApiKey || process.env.API_KEY;
  return new GoogleGenAI({ apiKey });
};

// Helper to get the correct model name from settings or override
const getModelName = (type: 'search' | 'chat' | 'vision' | 'fast' | 'thinking', overrideId?: string) => {
  if (overrideId && overrideId !== 'auto') {
    return overrideId;
  }
  
  const settings = getSettings();
  switch (type) {
    case 'search': return settings.modelSearch;
    case 'chat': return settings.modelChat;
    case 'vision': return settings.modelVision;
    case 'fast': return settings.modelFast;
    case 'thinking': return settings.modelThinking;
    default: return settings.modelChat;
  }
};

export const searchGroundingRequest = async (prompt: string, modelOverride?: string) => {
  try {
    const ai = getClient();
    const modelName = getModelName('search', modelOverride);
    
    // Note: Google Search Tool availability on Vertex AI depends on the specific model and region.
    // If using Vertex, ensure the model supports 'googleSearch'.
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    throw error;
  }
};

export const createChatSession = (modelOverride?: string) => {
  const ai = getClient();
  const modelName = getModelName('chat', modelOverride);
  
  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: "You are a helpful AI assistant. Be concise and friendly.",
    },
  });
};

export const analyzeFileRequest = async (base64Data: string, mimeType: string, prompt: string, modelOverride?: string) => {
  try {
    const ai = getClient();
    const modelName = getModelName('vision', modelOverride);
    
    const filePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [filePart, { text: prompt || "Analyze this content in detail." }]
      },
    });

    return response.text;
  } catch (error) {
    console.error("File Analysis Error:", error);
    throw error;
  }
};

export const fastRequest = async (prompt: string, modelOverride?: string) => {
  try {
    const ai = getClient();
    const modelName = getModelName('fast', modelOverride);
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Fast Request Error:", error);
    throw error;
  }
};

export const thinkingRequest = async (prompt: string, modelOverride?: string) => {
  try {
    const ai = getClient();
    const modelName = getModelName('thinking', modelOverride);
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: THINKING_SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingBudget: MAX_THINKING_BUDGET
        }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Thinking Request Error:", error);
    throw error;
  }
};

// Function to handle custom/universal model requests
export const customModelRequest = async (
  endpoint: string, 
  apiKey: string, 
  model: string, 
  prompt: string,
  provider: string
) => {
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let body = {};
  let finalApiKey = apiKey;
  
  // Use stored keys if apiKey is empty but provider is configured in settings
  const settings = getSettings();
  if (!finalApiKey) {
    if (provider === 'openai') finalApiKey = settings.openAIKey;
    if (provider === 'anthropic') finalApiKey = settings.anthropicKey;
    if (provider === 'vertex') finalApiKey = settings.vertexAccessToken;
  }

  if (provider === 'openai' || provider === 'other') {
    headers['Authorization'] = `Bearer ${finalApiKey}`;
    body = {
      model: model,
      messages: [{ role: 'user', content: prompt }],
    };
  } else if (provider === 'anthropic') {
    headers['x-api-key'] = finalApiKey;
    headers['anthropic-version'] = '2023-06-01';
    body = {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    };
  } else if (provider === 'vertex') {
    headers['Authorization'] = `Bearer ${finalApiKey}`; 
    // Direct Vertex REST API structure
    body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`External API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (provider === 'openai') return data.choices[0].message.content;
    if (provider === 'anthropic') return data.content[0].text;
    if (provider === 'vertex') return data.candidates[0].content.parts[0].text;
    
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Custom Model Error:", error);
    throw error;
  }
};