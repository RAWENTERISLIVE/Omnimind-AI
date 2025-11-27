import { ModelOption } from './types';

// Model identifiers as per @google/genai guidelines
export const MODEL_SEARCH = 'gemini-2.5-flash';
export const MODEL_CHAT = 'gemini-3-pro-preview';
export const MODEL_VISION = 'gemini-3-pro-preview';
export const MODEL_FAST = 'gemini-flash-lite-latest';
export const MODEL_THINKING = 'gemini-3-pro-preview';

// Vertex AI often uses the same names, but sometimes requires specific versions.
// These serve as defaults for the settings page.
export const DEFAULT_VERTEX_SEARCH = 'gemini-1.5-flash-002';
export const DEFAULT_VERTEX_CHAT = 'gemini-1.5-pro-002';
export const DEFAULT_VERTEX_VISION = 'gemini-1.5-pro-002';
export const DEFAULT_VERTEX_FAST = 'gemini-1.5-flash-002';
export const DEFAULT_VERTEX_THINKING = 'gemini-1.5-pro-002';

export const MAX_THINKING_BUDGET = 32768;

export const DEFAULT_SYSTEM_INSTRUCTION = "You are a helpful, knowledgeable AI assistant.";
export const THINKING_SYSTEM_INSTRUCTION = "You are a deep-thinking AI. Take your time to analyze the problem thoroughly before answering.";

export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'auto', name: 'Auto (Recommended)', description: 'Best model for the task' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast and versatile' },
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite', description: 'Lowest latency' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro', description: 'High intelligence' },
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3.0 Pro Vision', description: 'Advanced image understanding' },
];