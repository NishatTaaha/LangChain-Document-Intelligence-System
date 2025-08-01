#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { config, validateConfig } from './core/config';
import { ModelManager } from './core/models';
import path from 'path';
import fs from 'fs-extra';

const program = new Command();

// Header
console.log(chalk.cyan.bold('📚 LangChain Document Intelligence System'));
console.log(chalk.gray('────────────────────────────────────────'));

program
  .name('doc-intel')
  .description('LangChain.js Document Intelligence & Analysis System')
  .version('1.0.0');

// Test command
program
  .command('test')
  .description('Test the system with a simple AI query')
  .action(async () => {
    console.log('🧪 Testing LangChain system...');
    
    console.log('🔍 Validating configuration...');
    if (!validateConfig()) {
      console.log('❌ Configuration validation failed');
      process.exit(1);
    }
    console.log('✅ Configuration validated');

    try {
      console.log('🔧 Getting model manager...');
      const modelManager = ModelManager.getInstance();
      console.log('🤖 Getting LLM instance...');
      const llm = modelManager.getLLM();
      
      console.log('📝 Asking AI a simple question...');
      const response = await llm.invoke('Explain what LangChain is in 2 sentences.');
      
      console.log(chalk.green('✅ AI Response:'));
      console.log(chalk.white(response.content));
      
      console.log(chalk.green('\n🎉 System working perfectly!'));
    } catch (error: any) {
      console.error(chalk.red('❌ Error:'), error.message);
      console.error('Stack:', error.stack);
    }
  });

// Config command
program
  .command('config')
  .description('Show current configuration')
  .action(() => {
    console.log(chalk.bold('\n⚙️  Current Configuration:'));
    console.log('─'.repeat(40));
    console.log(`OpenAI API Key: ${config.openai.apiKey ? '✅ Set' : '❌ Not set'}`);
    console.log(`Groq API Key: ${config.groq.apiKey ? '✅ Set' : '❌ Not set'}`);
    console.log(`HuggingFace Token: ${config.huggingface.apiKey ? '✅ Set' : '❌ Not set'}`);
    console.log(`\nModel Settings:`);
    console.log(`  OpenAI Model: ${config.openai.model}`);
    console.log(`  Groq Model: ${config.groq.model}`);
    console.log(`  Embedding Model: ${config.openai.embeddingModel}`);
    console.log(`\nProcessing Settings:`);
    console.log(`  Chunk Size: ${config.settings.chunkSize}`);
    console.log(`  Chunk Overlap: ${config.settings.chunkOverlap}`);
    console.log(`  Max Tokens: ${config.settings.maxTokens}`);
    console.log(`  Temperature: ${config.settings.temperature}`);
  });

// Simple analyze command
program
  .command('analyze-text <text>')
  .description('Analyze a simple text string')
  .action(async (text: string) => {
    console.log('🔍 Analyzing text...');
    
    if (!validateConfig()) {
      process.exit(1);
    }

    try {
      const modelManager = ModelManager.getInstance();
      const llm = modelManager.getLLM();
      
      const prompt = `Analyze this text and provide:
1. A brief summary
2. Key topics
3. Sentiment (positive/negative/neutral)

Text: "${text}"

Analysis:`;

      const response = await llm.invoke(prompt);
      
      console.log(chalk.green('📊 Analysis Results:'));
      console.log(chalk.white(response.content));
    } catch (error: any) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
  });

// Summarize command
program
  .command('summarize <text>')
  .description('Summarize a text')
  .action(async (text: string) => {
    console.log('📋 Creating summary...');
    
    if (!validateConfig()) {
      process.exit(1);
    }

    try {
      const modelManager = ModelManager.getInstance();
      const llm = modelManager.getLLM();
      
      const prompt = `Summarize this text in 2-3 sentences:

"${text}"

Summary:`;

      const response = await llm.invoke(prompt);
      
      console.log(chalk.green('📋 Summary:'));
      console.log(chalk.white(response.content));
    } catch (error: any) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
  });

// Help command enhancement
program.on('--help', () => {
  console.log('');
  console.log(chalk.yellow('Examples:'));
  console.log('  $ doc-intel test                                    # Test the system');
  console.log('  $ doc-intel config                                  # Show configuration');
  console.log('  $ doc-intel analyze-text "AI is transforming..."    # Analyze text');
  console.log('  $ doc-intel summarize "Long text here..."           # Summarize text');
  console.log('');
  console.log(chalk.cyan('Configuration:'));
  console.log('  Your .env file is already set up with Groq API key!');
  console.log('  System is ready to use.');
  console.log('');
});

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (err: any) {
  if (err.code === 'commander.helpDisplayed') {
    process.exit(0);
  }
  console.error('Command failed:', err);
  process.exit(1);
}
