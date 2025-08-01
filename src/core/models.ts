import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatGroq } from '@langchain/groq';
import { config } from './config';

export class ModelManager {
  private static instance: ModelManager;
  private llm: ChatOpenAI | ChatGroq | null = null;
  private embeddings: OpenAIEmbeddings | null = null;

  private constructor() {}

  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  public getLLM(): ChatOpenAI | ChatGroq {
    if (!this.llm) {
      // Prefer Groq if available (free), fallback to OpenAI
      if (config.groq.apiKey) {
        this.llm = new ChatGroq({
          apiKey: config.groq.apiKey,
          model: config.groq.model,
          temperature: config.settings.temperature,
          maxTokens: config.settings.maxTokens,
        });
      } else if (config.openai.apiKey) {
        this.llm = new ChatOpenAI({
          openAIApiKey: config.openai.apiKey,
          modelName: config.openai.model,
          temperature: config.settings.temperature,
          maxTokens: config.settings.maxTokens,
        });
      } else {
        throw new Error('Either Groq or OpenAI API key is required for LLM operations');
      }
    }
    return this.llm;
  }
  
  public getEmbeddings(): OpenAIEmbeddings {
    if (!this.embeddings) {
      if (!config.openai.apiKey) {
        console.warn('⚠️  OpenAI API key required for embeddings. Some features may be limited.');
        throw new Error('OpenAI API key is required for embedding operations. Semantic search will not be available.');
      }
      
      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: config.openai.apiKey,
        modelName: config.openai.embeddingModel,
      });
    }
    return this.embeddings;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const llm = this.getLLM();
      const response = await llm.invoke('Test connection - respond with "OK"');
      const content = response.content.toString();
      console.log('🔍 Connection test response:', content.substring(0, 50));
      return content.toLowerCase().includes('ok') || content.toLowerCase().includes('test');
    } catch (error) {
      console.error('❌ Model connection test failed:', error);
      return false;
    }
  }
}
