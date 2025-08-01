import fs from 'fs-extra';
import { BaseProcessor } from './BaseProcessor';
import { ProcessingResult } from '../core/types';
import { config } from '../core/config';

export class TextProcessor extends BaseProcessor {
  protected supportedExtensions = ['.txt', '.md', '.markdown', '.text'];

  public async process(filePath: string): Promise<ProcessingResult> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const document = this.createDocument(filePath, content);
      const chunks = this.createChunks(
        document, 
        content, 
        config.settings.chunkSize, 
        config.settings.chunkOverlap
      );
      const insights = this.generateInsights(content);

      // Update document metadata
      document.metadata.chunkCount = chunks.length;

      return {
        document,
        chunks,
        insights,
      };
    } catch (error) {
      throw new Error(`Failed to process text file ${filePath}: ${error}`);
    }
  }
}
