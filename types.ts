export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  SEARCH = 'SEARCH',
  CHAT = 'CHAT',
  VISION = 'VISION',
  FAST = 'FAST',
  THINKING = 'THINKING',
  CUSTOM = 'CUSTOM',
  SETTINGS = 'SETTINGS',
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingChunks?: GroundingChunk[];
  timestamp: number;
}

export interface UniversalModelConfig {
  endpoint: string;
  apiKey: string;
  modelName: string;
  provider: 'openai' | 'anthropic' | 'vertex' | 'other';
}

export interface AppSettings {
  provider: 'studio' | 'vertex';
  
  // Google AI Studio
  googleApiKey: string;

  // Vertex AI
  vertexProjectID: string;
  vertexLocation: string;
  vertexAccessToken: string;

  // Universal / 3rd Party
  openAIKey: string;
  anthropicKey: string;
  
  // Default Models (Hidden from simple UI, used for 'Auto')
  modelSearch: string;
  modelChat: string;
  modelVision: string;
  modelFast: string;
  modelThinking: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
}