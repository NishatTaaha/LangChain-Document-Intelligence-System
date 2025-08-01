import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentChunk, ProcessingResult } from '../core/types';

export abstract class BaseProcessor {
  protected abstract supportedExtensions: string[];

  public supports(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return this.supportedExtensions.includes(ext);
  }

  public abstract process(filePath: string): Promise<ProcessingResult>;

  protected createDocument(filePath: string, content: string): Document {
    const stats = fs.statSync(filePath);
    const filename = path.basename(filePath);
    const fileType = path.extname(filePath).toLowerCase();

    return {
      id: uuidv4(),
      content,
      metadata: {
        filename,
        fileType,
        size: stats.size,
        createdAt: stats.birthtime,
        processedAt: new Date(),
      },
    };
  }

  protected createChunks(document: Document, content: string, chunkSize = 1000, overlap = 200): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let startIndex = 0;
    let chunkIndex = 0;

    while (startIndex < content.length) {
      const endIndex = Math.min(startIndex + chunkSize, content.length);
      const chunkContent = content.slice(startIndex, endIndex);

      const chunk: DocumentChunk = {
        id: uuidv4(),
        documentId: document.id,
        content: chunkContent,
        index: chunkIndex,
        metadata: {
          startChar: startIndex,
          endChar: endIndex,
        },
      };

      chunks.push(chunk);
      startIndex = endIndex - overlap;
      chunkIndex++;
    }

    return chunks;
  }

  protected generateInsights(content: string) {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // Average reading speed

    return {
      wordCount,
      estimatedReadingTime,
      language: this.detectLanguage(content),
    };
  }

  private detectLanguage(content: string): string {
    // Simple language detection based on common words
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = content.toLowerCase().split(/\s+/);
    const englishCount = words.filter(word => englishWords.includes(word)).length;
    
    return englishCount > words.length * 0.1 ? 'english' : 'unknown';
  }
}
