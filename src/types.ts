export type ProviderName = 'manual' | 'github' | 'google' | 'notion';

export interface RawItem {
  provider: ProviderName;
  externalId?: string;
  mime: 'text/plain' | 'text/markdown' | 'text/html' | 'application/json';
  title?: string;
  content: string;           // normalized text
  url?: string;              // optional source url
  createdAt?: string;        // iso
}

export interface StoredDoc {
  id: string;
  userId: string;
  title: string | null;
  content: string;
  url: string | null;
  provider: ProviderName;
  createdAt: string; // iso
}

export interface EmbeddingRow {
  docId: string;
  dim: number;
  vector: Float32Array;
}

export interface QueryResult {
  doc: StoredDoc;
  score: number; // cosine
