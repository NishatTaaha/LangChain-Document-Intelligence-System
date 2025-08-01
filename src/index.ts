import { ProcessorFactory } from './processors/index';
import { SummaryAnalyzer, InsightAnalyzer } from './analyzers/index';
import { documentStore } from './core/types';
import { validateConfig } from './core/config';
import { ModelManager } from './core/models';
import { logger, DisplayUtils } from './utils/index';
import { Document, DocumentChunk } from './core/types';
import path from 'path';
import fs from 'fs-extra';

export class DocumentIntelligenceSystem {
  private summaryAnalyzer: SummaryAnalyzer;
  private insightAnalyzer: InsightAnalyzer;
  private modelManager: ModelManager;

  constructor() {
    this.summaryAnalyzer = new SummaryAnalyzer();
    this.insightAnalyzer = new InsightAnalyzer();
    this.modelManager = ModelManager.getInstance();
  }

  public async initialize(): Promise<boolean> {
    logger.info('🚀 Initializing Document Intelligence System...');
    
    if (!validateConfig()) {
      logger.error('Configuration validation failed');
      return false;
    }

    try {
      const connectionTest = await this.modelManager.testConnection();
      if (!connectionTest) {
        logger.warn('Model connection test failed, but continuing...');
      } else {
        logger.success('Model connection test passed');
      }
      
      logger.success('Document Intelligence System initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize system', error);
      return false;
    }
  }

  public async processFile(filePath: string): Promise<boolean> {
    try {
      if (!await fs.pathExists(filePath)) {
        logger.error(`File not found: ${filePath}`);
        return false;
      }

      logger.info(`📄 Processing file: ${path.basename(filePath)}`);
      
      const result = await ProcessorFactory.processFile(filePath);
      
      // Store the document and chunks
      documentStore.addDocument(result.document);
      documentStore.addChunks(result.document.id, result.chunks);
      
      logger.success(`✅ File processed successfully: ${result.chunks.length} chunks created`);
      
      return true;
    } catch (error) {
      logger.error(`Failed to process file: ${filePath}`, error);
      return false;
    }
  }

  public async processDirectory(dirPath: string): Promise<number> {
    try {
      if (!await fs.pathExists(dirPath)) {
        logger.error(`Directory not found: ${dirPath}`);
        return 0;
      }

      const supportedExtensions = ProcessorFactory.getSupportedExtensions();
      const files = await this.findSupportedFiles(dirPath, supportedExtensions);
      
      if (files.length === 0) {
        logger.warn(`No supported files found in: ${dirPath}`);
        logger.info(`Supported extensions: ${supportedExtensions.join(', ')}`);
        return 0;
      }

      logger.info(`📁 Processing directory: ${dirPath}`);
      logger.info(`Found ${files.length} supported files`);

      let processed = 0;
      for (const file of files) {
        DisplayUtils.showProgress(processed, files.length, `Processing ${path.basename(file)}`);
        
        if (await this.processFile(file)) {
          processed++;
        }
      }

      DisplayUtils.showProgress(processed, files.length, 'Complete');
      logger.success(`✅ Processed ${processed}/${files.length} files`);
      
      return processed;
    } catch (error) {
      logger.error(`Failed to process directory: ${dirPath}`, error);
      return 0;
    }
  }

  public async analyzeDocument(documentId: string): Promise<void> {
    const document = documentStore.getDocument(documentId);
    if (!document) {
      logger.error(`Document not found: ${documentId}`);
      return;
    }

    logger.info(`🔍 Analyzing document: ${document.metadata.filename}`);

    try {
      // Show document info
      DisplayUtils.showDocumentInfo(document);

      // Generate summary
      logger.info('📋 Generating summary...');
      const summary = await this.summaryAnalyzer.summarizeDocument(document);
      DisplayUtils.showSummary(summary);

      // Extract keywords
      logger.info('🏷️  Extracting keywords...');
      const keywords = await this.insightAnalyzer.extractKeywords(document);
      DisplayUtils.showKeywords(keywords);

      // Analyze insights
      logger.info('💡 Analyzing insights...');
      const insights = await this.insightAnalyzer.analyzeInsights(document);
      DisplayUtils.showInsights(insights);

      // Generate questions
      logger.info('❓ Generating questions...');
      const questions = await this.insightAnalyzer.generateQuestions(document);
      DisplayUtils.showQuestions(questions);

      logger.success('✅ Document analysis complete');
    } catch (error) {
      logger.error('Failed to analyze document', error);
    }
  }

  public async searchDocuments(query: string): Promise<Document[]> {
    logger.info(`🔍 Searching documents for: "${query}"`);
    
    const results = documentStore.searchDocuments(query);
    
    if (results.length === 0) {
      logger.info('No documents found matching the query');
    } else {
      logger.success(`Found ${results.length} matching documents`);
      results.forEach((doc, index) => {
        console.log(`${index + 1}. ${doc.metadata.filename} (${doc.id})`);
      });
    }
    
    return results;
  }

  public async compareDocuments(id1: string, id2: string): Promise<void> {
    const doc1 = documentStore.getDocument(id1);
    const doc2 = documentStore.getDocument(id2);
    
    if (!doc1 || !doc2) {
      logger.error('One or both documents not found');
      return;
    }

    logger.info(`📊 Comparing documents: ${doc1.metadata.filename} vs ${doc2.metadata.filename}`);

    try {
      const [summary1, summary2] = await Promise.all([
        this.summaryAnalyzer.summarizeDocument(doc1),
        this.summaryAnalyzer.summarizeDocument(doc2)
      ]);

      const [insights1, insights2] = await Promise.all([
        this.insightAnalyzer.analyzeInsights(doc1),
        this.insightAnalyzer.analyzeInsights(doc2)
      ]);

      console.log('\n📈 Document Comparison');
      console.log('═'.repeat(60));
      
      console.log(`\n📄 Document 1: ${doc1.metadata.filename}`);
      console.log(`   Word Count: ${summary1.wordCount}`);
      console.log(`   Sentiment: ${insights1.sentiment}`);
      console.log(`   Complexity: ${insights1.complexity}`);
      console.log(`   Readability: ${insights1.readabilityScore}/100`);
      
      console.log(`\n📄 Document 2: ${doc2.metadata.filename}`);
      console.log(`   Word Count: ${summary2.wordCount}`);
      console.log(`   Sentiment: ${insights2.sentiment}`);
      console.log(`   Complexity: ${insights2.complexity}`);
      console.log(`   Readability: ${insights2.readabilityScore}/100`);

      // Find common topics
      const commonTopics = insights1.topics.filter(topic => 
        insights2.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(t.toLowerCase()))
      );

      if (commonTopics.length > 0) {
        console.log(`\n🔗 Common Topics: ${commonTopics.join(', ')}`);
      }

      logger.success('✅ Document comparison complete');
    } catch (error) {
      logger.error('Failed to compare documents', error);
    }
  }

  public showStats(): void {
    const stats = documentStore.getStats();
    DisplayUtils.showStats(stats);
  }

  public listDocuments(): void {
    const documents = documentStore.getAllDocuments();
    
    if (documents.length === 0) {
      logger.info('📁 No documents loaded');
      return;
    }

    console.log('\n📚 Loaded Documents:');
    console.log('─'.repeat(50));
    
    documents.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.metadata.filename}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Type: ${doc.metadata.fileType}`);
      console.log(`   Size: ${DisplayUtils.formatFileSize(doc.metadata.size)}`);
      console.log(`   Chunks: ${doc.metadata.chunkCount || 0}`);
      console.log('');
    });
  }

  public clearStore(): void {
    documentStore.clear();
    logger.success('✅ Document store cleared');
  }

  private async findSupportedFiles(dirPath: string, supportedExtensions: string[]): Promise<string[]> {
    const files: string[] = [];
    
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        const subFiles = await this.findSupportedFiles(fullPath, supportedExtensions);
        files.push(...subFiles);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (supportedExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }
}
