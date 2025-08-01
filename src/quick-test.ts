import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Simple LangChain Test');
console.log('Groq API Key:', process.env.GROQ_API_KEY ? 'Found' : 'Missing');

async function test() {
  try {
    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama3-8b-8192',
      temperature: 0.7,
      maxTokens: 100,
    });

    console.log('📝 Asking AI a question...');
    const response = await llm.invoke('What is LangChain? Answer in 1 sentence.');
    
    console.log('✅ Response:', response.content);
    console.log('🎉 Success!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
