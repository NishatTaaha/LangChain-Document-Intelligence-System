#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { DocumentIntelligenceSystem } from './index';
import { logger } from './utils/index';
import { config } from './core/config';
import path from 'path';

const program = new Command();
const system = new DocumentIntelligenceSystem();

// Header
console.log(chalk.cyan.bold('📚 LangChain Document Intelligence System'));
console.log(chalk.gray('────────────────────────────────────────'));

program
  .name('doc-intel')
  .description('LangChain.js Document Intelligence & Analysis System')
  .version('1.0.0');

// Initialize command
program
  .command('init')
  .description('Initialize the system and test configuration')
  .action(async () => {
    const success = await system.initialize();
    if (!success) {
      process.exit(1);
    }
  });

// Process file command
program
  .command('process <file>')
  .description('Process a single document file')
  .option('-a, --analyze', 'Analyze the document after processing')
  .action(async (file: string, options) => {
    const success = await system.initialize();
    if (!success) return;

    const filePath = path.resolve(file);
    const processed = await system.processFile(filePath);
    
    if (processed && options.analyze) {
      const documents = system.listDocuments();
      // Get the last processed document (most recent)
      // This is a simple implementation - in real app you'd track the document ID
      console.log('\n🔍 Analyzing processed document...');
      // For demo, we'll need to modify this to get the actual document ID
    }
  });

// Process directory command
program
  .command('process-dir <directory>')
  .description('Process all supported files in a directory')
  .option('-r, --recursive', 'Process subdirectories recursively', true)
  .action(async (directory: string, options) => {
    const success = await system.initialize();
    if (!success) return;

    const dirPath = path.resolve(directory);
    const processed = await system.processDirectory(dirPath);
    
    if (processed > 0) {
      system.showStats();
    }
  });

// Analyze command
program
  .command('analyze <documentId>')
  .description('Analyze a processed document')
  .action(async (documentId: string) => {
    const success = await system.initialize();
    if (!success) return;

    await system.analyzeDocument(documentId);
  });

// Search command
program
  .command('search <query>')
  .description('Search through processed documents')
  .action(async (query: string) => {
    await system.searchDocuments(query);
  });

// Compare command
program
  .command('compare <doc1> <doc2>')
  .description('Compare two documents')
  .action(async (doc1: string, doc2: string) => {
    const success = await system.initialize();
    if (!success) return;

    await system.compareDocuments(doc1, doc2);
  });

// List command
program
  .command('list')
  .description('List all processed documents')
  .action(() => {
    system.listDocuments();
  });

// Stats command
program
  .command('stats')
  .description('Show system statistics')
  .action(() => {
    system.showStats();
  });

// Clear command
program
  .command('clear')
  .description('Clear all processed documents from memory')
  .action(() => {
    system.clearStore();
  });

// Demo command
program
  .command('demo')
  .description('Run a demonstration with sample documents')
  .action(async () => {
    console.log(chalk.yellow('🎯 Running Demo Mode'));
    console.log(chalk.gray('This will create sample documents and demonstrate the system capabilities\n'));

    const success = await system.initialize();
    if (!success) return;

    // Create sample documents directory
    const sampleDir = path.join(process.cwd(), 'sample-docs');
    const fs = await import('fs-extra');
    
    await fs.ensureDir(sampleDir);

    // Create sample text file
    const sampleText = `
# Artificial Intelligence and Machine Learning

Artificial Intelligence (AI) is a broad field of computer science that aims to create 
intelligent machines capable of performing tasks that typically require human intelligence. 
Machine Learning (ML) is a subset of AI that focuses on creating algorithms that can learn 
and improve from experience without being explicitly programmed.

## Key Concepts

### Machine Learning Types
1. **Supervised Learning**: Learning with labeled training data
2. **Unsupervised Learning**: Finding patterns in data without labels  
3. **Reinforcement Learning**: Learning through interaction with an environment

### Popular Applications
- Natural Language Processing (NLP)
- Computer Vision
- Autonomous Vehicles  
- Recommendation Systems
- Fraud Detection

## Future Prospects

The field of AI continues to evolve rapidly, with new breakthroughs in deep learning,
neural networks, and cognitive computing. As we advance, ethical considerations and
responsible AI development become increasingly important.

The integration of AI into various industries promises to revolutionize how we work,
communicate, and solve complex problems. However, it also raises important questions
about employment, privacy, and the role of human intelligence in an AI-driven world.
`;

    const sampleFile = path.join(sampleDir, 'ai-ml-overview.md');
    await fs.writeFile(sampleFile, sampleText);

    console.log('📄 Created sample document: ai-ml-overview.md');
    
    // Process the sample file
    await system.processFile(sampleFile);
    
    // Show what we can do
    console.log('\n🎯 Demo Operations:');
    console.log('1. Document processing ✅');
    console.log('2. Statistics overview:');
    system.showStats();
    
    console.log('\n📋 To continue the demo, try these commands:');
    console.log(chalk.cyan('  doc-intel list                    ') + '# List all documents');
    console.log(chalk.cyan('  doc-intel analyze <documentId>    ') + '# Analyze a document');
    console.log(chalk.cyan('  doc-intel search "machine learning"') + '# Search documents');
    
    // Get document list to show IDs
    system.listDocuments();
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

// Help command enhancement
program.on('--help', () => {
  console.log('');
  console.log(chalk.yellow('Examples:'));
  console.log('  $ doc-intel demo                          # Run demonstration');
  console.log('  $ doc-intel process document.pdf          # Process a PDF file');
  console.log('  $ doc-intel process-dir ./documents       # Process all files in directory');
  console.log('  $ doc-intel analyze <documentId>          # Analyze a document');
  console.log('  $ doc-intel search "artificial intelligence" # Search documents');
  console.log('  $ doc-intel compare <id1> <id2>           # Compare two documents');
  console.log('');
  console.log(chalk.cyan('Configuration:'));
  console.log('  Create a .env file with your API keys:');
  console.log('  OPENAI_API_KEY=your_key_here');
  console.log('  GROQ_API_KEY=your_key_here (free alternative)');
  console.log('  HUGGINGFACE_API_KEY=your_token_here (free alternative)');
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
  logger.error('Command failed:', err);
  process.exit(1);
}
