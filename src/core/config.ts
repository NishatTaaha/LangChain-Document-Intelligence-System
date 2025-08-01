import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface AppConfig {
  openai: {
    apiKey: string;
    model: string;
    embeddingModel: string;
  };
  groq: {
    apiKey: string;
    model: string;
  };
  huggingface: {
    apiKey: string;
  };
  settings: {
    chunkSize: number;
    chunkOverlap: number;
    maxTokens: number;
    temperature: number;
    vectorDimension: number;
    similarityThreshold: number;
    maxResults: number;
  };
}

export const config: AppConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-ada-002',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'llama3-8b-8192',
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
  },
  settings: {
    chunkSize: parseInt(process.env.DEFAULT_CHUNK_SIZE || '1000'),
    chunkOverlap: parseInt(process.env.DEFAULT_CHUNK_OVERLAP || '200'),
    maxTokens: parseInt(process.env.MAX_TOKENS || '500'),
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    vectorDimension: parseInt(process.env.VECTOR_DIMENSION || '1536'),
    similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD || '0.8'),
    maxResults: parseInt(process.env.MAX_RESULTS || '5'),
  },
};

export const validateConfig = (): boolean => {
  const hasOpenAI = !!config.openai.apiKey;
  const hasGroq = !!config.groq.apiKey;
  const hasHuggingFace = !!config.huggingface.apiKey;

  if (!hasOpenAI && !hasGroq && !hasHuggingFace) {
    console.error('❌ No API keys configured. Please set at least one of: OPENAI_API_KEY, GROQ_API_KEY, or HUGGINGFACE_API_KEY');
    return false;
  }

  console.log('✅ Configuration validated successfully');
  console.log(`   - OpenAI: ${hasOpenAI ? '✓' : '✗'}`);
  console.log(`   - Groq: ${hasGroq ? '✓' : '✗'}`);
  console.log(`   - HuggingFace: ${hasHuggingFace ? '✓' : '✗'}`);
  
  if (hasGroq) {
    console.log('🚀 Using Groq API (Free) for language model operations');
  } else if (hasOpenAI) {
    console.log('🚀 Using OpenAI API for language model operations');
  }
  
  return true;
};
