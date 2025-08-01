import { ModelManager } from '../core/models';
import { Document, DocumentChunk } from '../core/types';

export interface SummaryOptions {
  maxLength?: number;
  style?: 'bullet-points' | 'paragraph' | 'executive';
  focus?: string;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  wordCount: number;
  confidence: number;
}

export class SummaryAnalyzer {
  private modelManager: ModelManager;

  constructor() {
    this.modelManager = ModelManager.getInstance();
  }

  public async summarizeDocument(document: Document, options: SummaryOptions = {}): Promise<SummaryResult> {
    const {
      maxLength = 500,
      style = 'paragraph',
      focus = 'main concepts and important details'
    } = options;

    const prompt = this.buildSummaryPrompt(document.content, maxLength, style, focus);
    
    try {
      const llm = this.modelManager.getLLM();
      const response = await llm.invoke(prompt);
      
      return this.parseSummaryResponse(response.content.toString());
    } catch (error) {
      throw new Error(`Failed to generate summary: ${error}`);
    }
  }

  public async summarizeChunks(chunks: DocumentChunk[], options: SummaryOptions = {}): Promise<SummaryResult> {
    const combinedContent = chunks.map(chunk => chunk.content).join('\n\n');
    const document: Document = {
      id: 'temp',
      content: combinedContent,
      metadata: {
        filename: 'chunks',
        fileType: '.txt',
        size: combinedContent.length,
        createdAt: new Date()
      }
    };

    return this.summarizeDocument(document, options);
  }

  public async generateAbstract(document: Document): Promise<string> {
    const prompt = `
Generate a concise academic abstract for the following document. The abstract should be 100-200 words and include:
1. Purpose/objective
2. Main findings or key points
3. Conclusions or implications

Document content:
${document.content.substring(0, 2000)}...

Abstract:`;

    try {
      const llm = this.modelManager.getLLM();
      const response = await llm.invoke(prompt);
      return response.content.toString().trim();
    } catch (error) {
      throw new Error(`Failed to generate abstract: ${error}`);
    }
  }

  private buildSummaryPrompt(content: string, maxLength: number, style: string, focus: string): string {
    const styleInstructions = {
      'bullet-points': 'Format the summary as clear bullet points',
      'paragraph': 'Write the summary in well-structured paragraphs',
      'executive': 'Write in executive summary style with clear headings'
    };

    return `
Please provide a comprehensive summary of the following document with these specifications:
- Maximum length: ${maxLength} words
- Style: ${styleInstructions[style as keyof typeof styleInstructions]}
- Focus on: ${focus}

After the summary, provide:
1. Key points (as a numbered list)
2. Overall confidence level (1-10)

Document content:
${content.substring(0, 3000)}

Summary:`;
  }

  private parseSummaryResponse(response: string): SummaryResult {
    const lines = response.split('\n').filter(line => line.trim());
    
    let summary = '';
    let keyPoints: string[] = [];
    let confidence = 8; // Default confidence
    
    let currentSection = 'summary';
    
    for (const line of lines) {
      if (line.toLowerCase().includes('key points') || line.toLowerCase().includes('main points')) {
        currentSection = 'keypoints';
        continue;
      }
      
      if (line.toLowerCase().includes('confidence')) {
        const match = line.match(/(\d+)/);
        if (match) {
          confidence = parseInt(match[1]);
        }
        continue;
      }
      
      if (currentSection === 'summary') {
        summary += line + ' ';
      } else if (currentSection === 'keypoints') {
        if (line.match(/^\d+\./) || line.startsWith('•') || line.startsWith('-')) {
          keyPoints.push(line.replace(/^\d+\.\s*/, '').replace(/^[•-]\s*/, ''));
        }
      }
    }
    
    return {
      summary: summary.trim(),
      keyPoints,
      wordCount: summary.split(' ').length,
      confidence: Math.min(10, Math.max(1, confidence))
    };
  }
}
