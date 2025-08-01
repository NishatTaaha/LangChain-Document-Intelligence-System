import { ModelManager } from '../core/models';
import { Document, DocumentChunk } from '../core/types';

export interface KeywordExtractionResult {
  keywords: string[];
  entities: string[];
  topics: string[];
  concepts: string[];
}

export interface InsightAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  complexity: 'low' | 'medium' | 'high';
  readabilityScore: number;
  keyInsights: string[];
  recommendations: string[];
}

export class InsightAnalyzer {
  private modelManager: ModelManager;

  constructor() {
    this.modelManager = ModelManager.getInstance();
  }

  public async extractKeywords(document: Document): Promise<KeywordExtractionResult> {
    const prompt = `
Analyze the following document and extract:
1. Keywords (10-15 most important terms)
2. Named entities (people, places, organizations)
3. Main topics (5-7 high-level themes)
4. Key concepts (important ideas or principles)

Format your response as JSON with the following structure:
{
  "keywords": ["keyword1", "keyword2", ...],
  "entities": ["entity1", "entity2", ...],
  "topics": ["topic1", "topic2", ...],
  "concepts": ["concept1", "concept2", ...]
}

Document content:
${document.content.substring(0, 2000)}...`;

    try {
      const llm = this.modelManager.getLLM();
      const response = await llm.invoke(prompt);
      
      return this.parseKeywordResponse(response.content.toString());
    } catch (error) {
      console.error('Failed to extract keywords:', error);
      return {
        keywords: [],
        entities: [],
        topics: [],
        concepts: []
      };
    }
  }

  public async analyzeInsights(document: Document): Promise<InsightAnalysisResult> {
    const prompt = `
Perform a comprehensive analysis of the following document and provide insights on:

1. Sentiment analysis (positive/negative/neutral)
2. Main topics covered
3. Complexity level (low/medium/high)
4. Readability score (1-100, where 100 is most readable)
5. Key insights (3-5 important takeaways)
6. Recommendations (3-5 actionable suggestions based on the content)

Format your response as JSON:
{
  "sentiment": "positive|negative|neutral",
  "topics": ["topic1", "topic2", ...],
  "complexity": "low|medium|high",
  "readabilityScore": 75,
  "keyInsights": ["insight1", "insight2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}

Document content:
${document.content.substring(0, 2500)}...`;

    try {
      const llm = this.modelManager.getLLM();
      const response = await llm.invoke(prompt);
      
      return this.parseInsightResponse(response.content.toString());
    } catch (error) {
      console.error('Failed to analyze insights:', error);
      return {
        sentiment: 'neutral',
        topics: [],
        complexity: 'medium',
        readabilityScore: 50,
        keyInsights: [],
        recommendations: []
      };
    }
  }

  public async findSimilarConcepts(chunks: DocumentChunk[], query: string): Promise<DocumentChunk[]> {
    // Simple similarity search based on keyword matching
    const queryWords = query.toLowerCase().split(' ');
    
    const scored = chunks.map(chunk => {
      const content = chunk.content.toLowerCase();
      const score = queryWords.reduce((acc, word) => {
        const count = (content.match(new RegExp(word, 'g')) || []).length;
        return acc + count;
      }, 0);
      
      return { chunk, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.chunk);
  }

  public async generateQuestions(document: Document): Promise<string[]> {
    const prompt = `
Based on the following document content, generate 5-10 thoughtful questions that would help someone understand and engage with the material. Include:
- Comprehension questions
- Analysis questions  
- Application questions
- Critical thinking questions

Format as a simple list:
1. Question 1
2. Question 2
...

Document content:
${document.content.substring(0, 1500)}...`;

    try {
      const llm = this.modelManager.getLLM();
      const response = await llm.invoke(prompt);
      
      return this.parseQuestions(response.content.toString());
    } catch (error) {
      console.error('Failed to generate questions:', error);
      return [];
    }
  }

  private parseKeywordResponse(response: string): KeywordExtractionResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          keywords: parsed.keywords || [],
          entities: parsed.entities || [],
          topics: parsed.topics || [],
          concepts: parsed.concepts || []
        };
      }
    } catch (error) {
      console.error('Failed to parse keyword response as JSON:', error);
    }

    // Fallback parsing
    return {
      keywords: this.extractListFromText(response, 'keywords'),
      entities: this.extractListFromText(response, 'entities'),
      topics: this.extractListFromText(response, 'topics'),
      concepts: this.extractListFromText(response, 'concepts')
    };
  }

  private parseInsightResponse(response: string): InsightAnalysisResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          sentiment: parsed.sentiment || 'neutral',
          topics: parsed.topics || [],
          complexity: parsed.complexity || 'medium',
          readabilityScore: parsed.readabilityScore || 50,
          keyInsights: parsed.keyInsights || [],
          recommendations: parsed.recommendations || []
        };
      }
    } catch (error) {
      console.error('Failed to parse insight response as JSON:', error);
    }

    // Fallback
    return {
      sentiment: 'neutral',
      topics: [],
      complexity: 'medium',
      readabilityScore: 50,
      keyInsights: [],
      recommendations: []
    };
  }

  private extractListFromText(text: string, listName: string): string[] {
    const lines = text.split('\n');
    const items: string[] = [];
    let inSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes(listName.toLowerCase())) {
        inSection = true;
        continue;
      }
      
      if (inSection) {
        const match = line.match(/[•\-\d+\.]\s*(.+)/);
        if (match) {
          items.push(match[1].trim());
        } else if (line.trim() === '' || line.match(/^\d+\./)) {
          inSection = false;
        }
      }
    }

    return items;
  }

  private parseQuestions(response: string): string[] {
    const lines = response.split('\n');
    const questions: string[] = [];

    for (const line of lines) {
      const match = line.match(/^\d+\.\s*(.+)/);
      if (match) {
        questions.push(match[1].trim());
      }
    }

    return questions;
  }
}
