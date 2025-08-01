import { TextProcessor } from './TextProcessor';
import { PDFProcessor } from './PDFProcessor';
import { BaseProcessor } from './BaseProcessor';
import { ProcessingResult } from '../core/types';

export class ProcessorFactory {
  private static processors: BaseProcessor[] = [
    new TextProcessor(),
    new PDFProcessor(),
  ];

  public static getProcessor(filePath: string): BaseProcessor | null {
    return this.processors.find(processor => processor.supports(filePath)) || null;
  }

  public static async processFile(filePath: string): Promise<ProcessingResult> {
    const processor = this.getProcessor(filePath);
    
    if (!processor) {
      throw new Error(`No processor found for file: ${filePath}`);
    }

    console.log(`📄 Processing file: ${filePath}`);
    const result = await processor.process(filePath);
    console.log(`✅ Processed successfully: ${result.chunks.length} chunks created`);
    
    return result;
  }

  public static getSupportedExtensions(): string[] {
    const extensions = new Set<string>();
    this.processors.forEach(processor => {
      // Access protected property through any type casting
      (processor as any).supportedExtensions?.forEach((ext: string) => extensions.add(ext));
    });
    return Array.from(extensions);
  }
}
