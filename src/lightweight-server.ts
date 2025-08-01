import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory document store
const documents = new Map();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max file size
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Get system stats
app.get('/api/stats', (req, res) => {
  try {
    const docs = Array.from(documents.values());
    const totalSize = docs.reduce((acc, doc) => acc + doc.size, 0);

    res.json({
      success: true,
      data: {
        totalDocuments: docs.length,
        totalChunks: docs.length * 5, // Simulated
        totalSize
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get all documents
app.get('/api/documents', (req, res) => {
  try {
    const docs = Array.from(documents.values());
    res.json({
      success: true,
      data: docs.map(doc => ({
        id: doc.id,
        filename: doc.filename,
        fileType: doc.fileType,
        size: doc.size,
        processedAt: doc.processedAt,
        chunkCount: 5 // Simulated
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Upload and process document
app.post('/api/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Only allow text files for now
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (!['.txt', '.md', '.markdown'].includes(fileExtension)) {
      await fs.remove(req.file.path);
      return res.status(400).json({ 
        success: false, 
        error: 'Only TXT and MD files are supported.' 
      });
    }

    // Read file content
    const content = await fs.readFile(req.file.path, 'utf-8');
    
    // Create document object
    const document = {
      id: uuidv4(),
      filename: req.file.originalname,
      fileType: fileExtension.slice(1),
      size: req.file.size,
      content: content,
      processedAt: new Date().toISOString(),
      chunkCount: Math.ceil(content.length / 1000) // Simulate chunks
    };

    // Store document
    documents.set(document.id, document);

    res.json({
      success: true,
      document: {
        id: document.id,
        filename: document.filename,
        chunkCount: document.chunkCount
      }
    });

    // Clean up uploaded file
    await fs.remove(req.file.path);
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Analyze document
app.post('/api/analyze/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = documents.get(documentId);

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Simple analysis without AI to prevent memory issues
    const words = document.content.split(/\s+/).filter((word: string) => word.length > 0);
    const sentences = document.content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    
    const analysis = {
      summary: {
        summary: `This document "${document.filename}" contains ${words.length} words and ${sentences.length} sentences. It appears to be a ${document.fileType.toUpperCase()} file with structured content.`,
        keyPoints: [
          `Document contains ${words.length} words`,
          `Text is divided into ${sentences.length} sentences`,
          `File type: ${document.fileType.toUpperCase()}`,
          "Content is ready for question answering"
        ]
      },
      keywords: {
        keywords: words.slice(0, 10).filter((word: string) => word.length > 3)
      },
      insights: {
        sentiment: 'neutral' as const,
        complexity: words.length > 1000 ? 'high' : words.length > 500 ? 'medium' : 'low',
        readabilityScore: Math.min(95, Math.max(30, 100 - Math.floor(words.length / 50))),
        keyInsights: [
          `Document length: ${words.length} words`,
          `Average sentence length: ${Math.round(words.length / sentences.length)} words`,
          "Content appears to be well-structured",
          "Suitable for Q&A operations"
        ]
      }
    };

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Question answering
app.post('/api/qa/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    const document = documents.get(documentId);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Improved question answering with content analysis
    const questionLower = question.toLowerCase();
    const contentLower = document.content.toLowerCase();
    
    // Split content into sentences for better analysis
    const sentences = document.content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    
    // Extract question keywords
    const questionWords = questionLower.split(/\s+/).filter((word: string) => 
      word.length > 2 && !['what', 'how', 'when', 'where', 'why', 'who', 'the', 'and', 'or', 'but', 'for', 'with', 'about'].includes(word)
    );
    
    // Find relevant sentences based on keyword matching
    const relevantSentences = sentences.filter((sentence: string) => {
      const sentenceLower = sentence.toLowerCase();
      return questionWords.some((word: string) => sentenceLower.includes(word));
    });
    
    let answer = '';
    
    if (relevantSentences.length > 0) {
      // Provide specific content-based answer
      if (questionLower.includes('summary') || questionLower.includes('summarize')) {
        answer = `Here's a summary based on the document: ${relevantSentences.slice(0, 3).join('. ')}.`;
      } else if (questionLower.includes('main') || questionLower.includes('topic')) {
        const firstParagraph = document.content.split('\n\n')[0];
        answer = `The main topic appears to be: ${firstParagraph.substring(0, 200)}...`;
      } else if (questionLower.includes('how many') || questionLower.includes('count')) {
        const words = document.content.split(/\s+/).length;
        const lines = document.content.split('\n').length;
        answer = `The document contains ${words} words across ${lines} lines. ${relevantSentences.slice(0, 2).join('. ')}.`;
      } else if (questionLower.includes('what is') || questionLower.includes('define')) {
        answer = `Based on the document content: ${relevantSentences.slice(0, 2).join('. ')}.`;
      } else {
        // General question - provide most relevant sentences
        answer = `Here's what I found in the document related to your question: ${relevantSentences.slice(0, 2).join('. ')}.`;
        
        if (relevantSentences.length > 2) {
          answer += ` There are ${relevantSentences.length - 2} more relevant sections in the document.`;
        }
      }
    } else {
      // No direct matches - provide general document info
      const firstSentences = sentences.slice(0, 2).join('. ');
      answer = `I couldn't find specific information about "${question}" in this document. However, the document discusses: ${firstSentences}. You might want to rephrase your question or ask about the main topics covered.`;
    }

    res.json({
      success: true,
      data: {
        question,
        answer,
        relevantSections: relevantSentences.length,
        documentLength: sentences.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Generate questions for document
app.get('/api/questions/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = documents.get(documentId);

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Generate questions based on actual document content
    const content = document.content;
    const words = content.split(/\s+/).filter((word: string) => word.length > 3);
    const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
    
    // Extract key topics from the first few sentences
    const firstParagraph = content.split('\n\n')[0] || content.substring(0, 300);
    const keyWords = words.slice(0, 20).filter((word: string) => 
      word.length > 4 && 
      !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will', 'were', 'more', 'some', 'what', 'than', 'only'].includes(word.toLowerCase())
    );

    // Generate contextual questions
    const questions = [
      `What is the main topic discussed in ${document.filename}?`,
      "Can you summarize the key points from this document?",
      `How many words are in this ${document.fileType} file?`,
      "What are the most important insights mentioned?",
    ];

    // Add content-specific questions if we have key words
    if (keyWords.length > 0) {
      questions.push(`What does this document say about ${keyWords[0]}?`);
      if (keyWords.length > 1) {
        questions.push(`How does the document explain ${keyWords[1]}?`);
      }
      if (keyWords.length > 2) {
        questions.push(`Can you find information about ${keyWords[2]} in this document?`);
      }
    }

    // Add structure-based questions
    if (sentences.length > 10) {
      questions.push("What conclusions can be drawn from this content?");
      questions.push("Are there any specific recommendations mentioned?");
    }

    res.json({
      success: true,
      data: {
        questions: questions.slice(0, 8), // Limit to 8 questions
        documentInfo: {
          filename: document.filename,
          wordCount: words.length,
          sentenceCount: sentences.length,
          keyTopics: keyWords.slice(0, 5)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Search documents
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const docs = Array.from(documents.values());
    const results = docs.filter(doc => 
      doc.content?.toLowerCase().includes(query.toLowerCase()) ||
      doc.filename.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: {
        query,
        results: results.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          relevance: 'high'
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Lightweight Server running at http://localhost:${PORT}`);
  console.log(`📋 API available at http://localhost:${PORT}/api`);
  console.log(`🎯 Open http://localhost:${PORT} to access the web interface`);
  console.log(`⚡ Using simplified processing to avoid memory issues`);
});

export default app;
