import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const HISTORY_PATH = path.join(process.cwd(), 'chat_history.json');

function loadHistory(): Record<string, ChatMessage[]> {
  if (fs.existsSync(HISTORY_PATH)) {
    try {
      const data = fs.readFileSync(HISTORY_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading chat history:", e);
      return {};
    }
  }
  return {};
}

function saveHistory(data: Record<string, ChatMessage[]>) {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(data, null, 2));
}

export async function getChatHistory(phoneNumber: string): Promise<ChatMessage[]> {
  const history = loadHistory();
  return history[phoneNumber] || [];
}

export async function addChatMessage(phoneNumber: string, message: ChatMessage) {
  const history = loadHistory();
  if (!history[phoneNumber]) {
    history[phoneNumber] = [];
  }
  
  history[phoneNumber].push(message);
  
  // Keep only the last 20 messages to avoid token limits
  if (history[phoneNumber].length > 20) {
    history[phoneNumber] = history[phoneNumber].slice(history[phoneNumber].length - 20);
  }
  
  saveHistory(history);
}

export async function clearChatHistory(phoneNumber: string) {
  const history = loadHistory();
  delete history[phoneNumber];
  saveHistory(history);
}
