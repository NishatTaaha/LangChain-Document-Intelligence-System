import fs from 'fs-extra';
import pdf from 'pdf-parse';
import { BaseProcessor } from './BaseProcessor';
import { ProcessingResult } from '../core/types';
import { config } from '../core/config';

export class PDFProcessor extends BaseProcessor {
  protected supportedExtensions = ['.pdf'];

  public async process(filePath: string): Promise<ProcessingResult> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdf(dataBuffer);
      
      const content = pdfData.text;
      const document = this.createDocument(filePath, content);
      const chunks = this.createChunks(
        document, 
        content, 
        config.settings.chunkSize, 
        config.settings.chunkOverlap
      );
      const insights = this.generateInsights(content);

      // Add PDF-specific metadata
      document.metadata.pageCount = pdfData.numpages;
      document.metadata.chunkCount = chunks.length;
      if (pdfData.info) {
        document.metadata.pdfInfo = {
          title: pdfData.info.Title,
          author: pdfData.info.Author,
          subject: pdfData.info.Subject,
          creator: pdfData.info.Creator,
          producer: pdfData.info.Producer,
          creationDate: pdfData.info.CreationDate,
          modificationDate: pdfData.info.ModDate,
        };
      }

      return {
        document,
        chunks,
        insights,
      };
    } catch (error) {
      throw new Error(`Failed to process PDF file ${filePath}: ${error}`);
    }
  }
}
