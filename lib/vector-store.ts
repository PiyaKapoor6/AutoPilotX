import fs from 'fs';
import path from 'path';

export interface Document {
  id: string;
  text: string;
  embedding: number[];
  metadata?: any;
}

const DB_PATH = path.join(process.cwd(), 'company_data.json');

function loadDB(): Document[] {
  if (fs.existsSync(DB_PATH)) {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading DB:", e);
      return [];
    }
  }
  return [];
}

function saveDB(data: Document[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function cosineSimilarity(a: number[], b: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function addDocument(text: string, embedding: number[], metadata?: any) {
  const db = loadDB();
  db.push({
    id: Date.now().toString() + Math.random().toString(36).substring(7),
    text,
    embedding,
    metadata
  });
  saveDB(db);
}

export async function searchDocuments(queryEmbedding: number[], k: number = 3) {
  const db = loadDB();
  if (db.length === 0) return [];

  const scored = db.map(doc => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
