import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  content: string;
  metadata: {
    filename: string;
    fileType: string;
    size: number;
    createdAt: Date;
    processedAt?: Date;
    chunkCount?: number;
    [key: string]: any;
  };
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  index: number;
  metadata: {
    startChar: number;
    endChar: number;
    [key: string]: any;
  };
}

export interface ProcessingResult {
  document: Document;
  chunks: DocumentChunk[];
  insights?: {
    wordCount: number;
    estimatedReadingTime: number;
    language?: string;
    topics?: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
  };
}

export class DocumentStore {
  private documents: Map<string, Document> = new Map();
  private chunks: Map<string, DocumentChunk[]> = new Map();

  public addDocument(document: Document): void {
    this.documents.set(document.id, document);
  }

  public getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  public getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }

  public addChunks(documentId: string, chunks: DocumentChunk[]): void {
    this.chunks.set(documentId, chunks);
  }

  public getChunks(documentId: string): DocumentChunk[] {
    return this.chunks.get(documentId) || [];
  }

  public getAllChunks(): DocumentChunk[] {
    return Array.from(this.chunks.values()).flat();
  }

  public searchDocuments(query: string): Document[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllDocuments().filter(doc => 
      doc.content.toLowerCase().includes(lowerQuery) ||
      doc.metadata.filename.toLowerCase().includes(lowerQuery)
    );
  }

  public getStats() {
    const totalDocuments = this.documents.size;
    const totalChunks = this.getAllChunks().length;
    const totalSize = Array.from(this.documents.values())
      .reduce((sum, doc) => sum + doc.metadata.size, 0);

    return {
      totalDocuments,
      totalChunks,
      totalSize,
      averageChunksPerDocument: totalDocuments > 0 ? Math.round(totalChunks / totalDocuments) : 0
    };
  }

  public clear(): void {
    this.documents.clear();
    this.chunks.clear();
  }
}

export const documentStore = new DocumentStore();
