import { AppSettings } from '../types';
import { 
  MODEL_SEARCH, 
  MODEL_CHAT, 
  MODEL_VISION, 
  MODEL_FAST, 
  MODEL_THINKING 
} from '../constants';

const SETTINGS_KEY = 'omnimind_settings';

export const defaultSettings: AppSettings = {
  provider: 'studio',
  
  googleApiKey: '',
  
  vertexProjectID: '',
  vertexLocation: 'us-central1',
  vertexAccessToken: '',
  
  openAIKey: '',
  anthropicKey: '',

  modelSearch: MODEL_SEARCH,
  modelChat: MODEL_CHAT,
  modelVision: MODEL_VISION,
  modelFast: MODEL_FAST,
  modelThinking: MODEL_THINKING,
};

export const getSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch (e) {
    console.error("Failed to load settings", e);
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};