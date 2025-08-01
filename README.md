# � LangChain Document Intelligence System

A powerful, AI-driven document analysis and question-answering system built with TypeScript, LangChain.js, and modern web technologies. This system demonstrates advanced document processing, semantic analysis, and intelligent Q&A capabilities with both CLI and web interfaces.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![LangChain](https://img.shields.io/badge/LangChain-🦜⛓️-blue?style=for-the-badge)

## ✨ Features

### 🔧 Core Functionality
- **Multi-format Document Processing**: Support for PDF, TXT, and Markdown files
- **AI-Powered Analysis**: Intelligent summarization, keyword extraction, and insight generation
- **Interactive Q&A System**: Ask questions about your documents and get contextual answers
- **Semantic Search**: Find relevant content across your document library
- **Real-time Processing**: Upload and analyze documents instantly

### 🌐 Web Interface
- **Modern Responsive Design**: Beautiful, mobile-friendly interface with gradient backgrounds
- **Drag & Drop Upload**: Easy file uploading with visual feedback
- **Tabbed Navigation**: Organized interface for documents, analysis, and Q&A
- **Real-time Statistics**: Live dashboard showing system metrics
- **Interactive Chat**: Conversational Q&A interface with generated questions

### ⚡ Performance & Reliability
- **Memory-Optimized Processing**: Efficient handling of documents with configurable limits
- **Error Handling**: Robust error management and user feedback
- **Multiple AI Providers**: Support for OpenAI, Groq, and HuggingFace
- **Scalable Architecture**: Modular design for easy extension

## 🛠️ Technology Stack

### Backend Technologies
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for robust development
- **[Node.js](https://nodejs.org/)** - JavaScript runtime for server-side applications
- **[Express.js](https://expressjs.com/)** - Fast, minimalist web framework
- **[LangChain.js](https://js.langchain.com/)** - Framework for developing AI applications

### AI & Machine Learning
- **[Groq API](https://groq.com/)** - High-performance language model inference (primary)
- **[OpenAI API](https://openai.com/)** - GPT models for advanced text processing
- **[HuggingFace](https://huggingface.co/)** - Open-source machine learning models

### Document Processing
- **[PDF-Parse](https://www.npmjs.com/package/pdf-parse)** - PDF text extraction
- **[Multer](https://www.npmjs.com/package/multer)** - File upload handling
- **Custom Text Processors** - Markdown and plain text processing

### Development Tools
- **[ts-node](https://www.npmjs.com/package/ts-node)** - TypeScript execution environment
- **[Commander.js](https://github.com/tj/commander.js)** - Command-line interface framework
- **[Chalk](https://www.npmjs.com/package/chalk)** - Terminal styling
- **[CLI-Table3](https://www.npmjs.com/package/cli-table3)** - Beautiful CLI tables

### Frontend Technologies
- **Pure HTML5/CSS3/JavaScript** - No framework dependencies for maximum compatibility
- **Modern CSS Grid & Flexbox** - Responsive layout design
- **CSS Gradients & Animations** - Beautiful visual effects and transitions
- **Fetch API** - Asynchronous HTTP requests
- **Progressive Enhancement** - Works across all browsers

## 🏗️ Architecture & Method

### System Design
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │────│  Express Server │────│   LangChain.js  │
│   (HTML/CSS/JS) │    │   (TypeScript)  │    │   AI Pipeline   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         v                       v                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  File Upload    │    │  Document Store │    │  AI Providers   │
│  (Drag & Drop)  │    │  (In-Memory)    │    │ (Groq/OpenAI)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Processing Method

#### 🔄 Document Processing Pipeline
1. **File Upload** → Multer handles multipart file uploads with size limits
2. **Format Detection** → Automatic file type recognition (.txt, .md, .pdf)
3. **Content Extraction** → Text extraction using specialized processors
4. **Text Chunking** → Intelligent segmentation for AI processing
5. **AI Analysis** → LangChain.js pipeline for summarization and insights

#### 🧠 AI Analysis Method
- **Summary Analyzer**: Uses LLM to generate concise document summaries
- **Keyword Extractor**: Identifies important terms and concepts
- **Insight Analyzer**: Extracts themes, sentiment, and key findings
- **Q&A Engine**: Context-aware question answering with document retrieval

#### 💾 Data Management Method
- **In-Memory Storage**: Fast document access with Map-based storage
- **Metadata Tracking**: File information, processing stats, and timestamps
- **Session Management**: Document lifecycle and user interaction tracking

## 🚀 Installation & Usage

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **API Keys** for AI providers (Groq recommended for free tier)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/langchain-document-intelligence.git
   cd langchain-document-intelligence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (Groq API key is free)
   ```

4. **Start the web application**
   ```bash
   # Demo mode (lightweight, stable)
   npm run demo
   
   # Full-featured mode
   npm run web
   ```

5. **Access the application**
   ```
   Open http://localhost:3000 in your browser
   ```

### Usage Methods

#### 🌐 Web Interface (Recommended)
1. **Upload Documents**: Drag & drop TXT/MD files (up to 2MB)
2. **View Analysis**: Get AI-powered summaries and insights
3. **Ask Questions**: Interactive Q&A about document content
4. **Generate Questions**: Auto-generate relevant questions to ask
5. **Search Documents**: Find content across your document library

#### 💻 Command Line Interface
```bash
# Process a single document
npm run cli -- process ./sample-docs/ai-future.md

# Interactive mode
npm run cli -- interactive

# Analyze multiple documents
npm run cli -- analyze --input ./sample-docs
```

## 🔌 API Endpoints

### Document Management
- `GET /api/health` - System health check
- `GET /api/stats` - System statistics (documents, chunks, size)
- `GET /api/documents` - List all processed documents
- `POST /api/upload` - Upload and process new document

### Analysis & Q&A
- `POST /api/analyze/:id` - Analyze document (summary, keywords, insights)
- `POST /api/qa/:id` - Ask questions about specific document
- `GET /api/questions/:id` - Generate sample questions for document
- `POST /api/search` - Search across all documents

### Example API Usage
```javascript
// Upload a document
const formData = new FormData();
formData.append('document', file);
const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

// Ask a question
const qaResponse = await fetch(`/api/qa/${documentId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    question: 'What are the main topics discussed?' 
  })
});
```

## 📁 Project Structure

```
langchain-document-intelligence/
├── src/
│   ├── core/                   # Core system components
│   │   ├── config.ts          # Environment & AI provider configuration
│   │   ├── models.ts          # AI model management (Groq/OpenAI)
│   │   └── types.ts           # TypeScript interfaces & data structures
│   ├── processors/            # Document processing logic
│   │   ├── BaseProcessor.ts   # Abstract processor foundation
│   │   ├── TextProcessor.ts   # Plain text & markdown processing
│   │   └── PDFProcessor.ts    # PDF text extraction
│   ├── analyzers/             # AI analysis components
│   │   ├── SummaryAnalyzer.ts # Document summarization
│   │   └── InsightAnalyzer.ts # Keyword & insight extraction
│   ├── utils/                 # Utility functions
│   │   ├── logger.ts          # Colored logging for CLI
│   │   └── display.ts         # CLI formatting & tables
│   ├── index.ts               # Main DocumentIntelligenceSystem class
│   ├── cli.ts                 # Full command-line interface
│   ├── simple-server.ts       # Full-featured web server
│   └── lightweight-server.ts  # Demo server (memory optimized)
├── public/                    # Web frontend
│   └── index.html            # Complete web interface
├── sample-docs/              # Example documents for testing
├── uploads/                  # File upload directory
├── .env.example             # Environment variables template
└── README.md                # This documentation
```

## ⚙️ Configuration

### Environment Variables (.env)
```env
# AI Provider API Keys
GROQ_API_KEY=your_groq_api_key_here          # Free tier available
OPENAI_API_KEY=your_openai_api_key_here      # Optional
HUGGINGFACE_API_KEY=your_hf_api_key_here     # Optional

# Primary AI Provider (recommended: groq)
AI_PROVIDER=groq

# Server Configuration
PORT=3000
NODE_ENV=development

# Processing Limits
MAX_FILE_SIZE=2097152    # 2MB in bytes
MAX_CHUNK_SIZE=1000      # Characters per chunk
```

### Available Scripts
```bash
npm run demo        # Start lightweight web server (recommended)
npm run web         # Start full-featured web server
npm run cli         # Command-line interface
npm run build       # Compile TypeScript to JavaScript
npm start           # Production mode
npm run dev         # Development mode with auto-reload
```

## 🎯 Key Features Demonstration

### 1. **Intelligent Document Analysis**
- Upload any text document and get instant AI-powered insights
- Automatic summarization with key points extraction
- Keyword identification and sentiment analysis
- Reading difficulty and complexity assessment

### 2. **Context-Aware Q&A System**
- Ask natural language questions about document content
- Receives specific, relevant answers based on document text
- Smart keyword matching and sentence extraction
- Fallback responses when information isn't available

### 3. **Dynamic Question Generation**
- Auto-generates relevant questions based on document content
- Adapts to document type and length
- Suggests topic-specific queries
- Helps users explore document content effectively

### 4. **Modern Web Interface**
- Responsive design works on desktop and mobile
- Real-time upload progress and processing feedback
- Tabbed interface for organized functionality
- Beautiful gradients and smooth animations

## 🔧 Technical Highlights

### AI Integration Method
- **LangChain.js Framework**: Structured AI application development
- **Multiple Provider Support**: Seamless switching between AI services
- **Prompt Engineering**: Optimized prompts for document analysis
- **Error Handling**: Graceful fallbacks when AI services are unavailable

### Performance Optimization
- **Memory Management**: Configurable limits prevent crashes
- **Efficient Processing**: Text chunking for large documents
- **Caching Strategy**: In-memory storage for fast document access
- **File Size Limits**: Prevents system overload

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **Modular Architecture**: Separation of concerns with clear interfaces
- **Error Boundaries**: Comprehensive error handling and user feedback
- **Documentation**: Extensive inline comments and documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🚀 Built with TypeScript, LangChain.js, and modern web technologies**

*Transform your documents into intelligent, searchable knowledge bases with AI-powered analysis and question-answering capabilities.*
- **Insight Generation**: Extract key concepts, topics, and recommendations
- **Question Generation**: Automatically create questions for comprehension testing

### Technical Features
- **Multiple AI Providers**: OpenAI, Groq (free), HuggingFace support
- **TypeScript**: Full type safety and modern development experience
- **CLI Interface**: Easy-to-use command-line tools
- **Modular Architecture**: Clean, extensible codebase
- **Comprehensive Logging**: Track all operations and errors
- **Beautiful Output**: Colored terminal output with tables and progress bars

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API key from at least one provider (OpenAI, Groq, or HuggingFace)

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd langchain-document-intelligence
   npm install
   ```

2. **Configure API Keys**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Run Demo**
   ```bash
   npm run cli demo
   ```

## 🔧 Configuration

Create a `.env` file with your API credentials:

```env
# OpenAI (Recommended for best results)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4

# Groq (Free alternative)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192

# HuggingFace (Free alternative)
HUGGINGFACE_API_KEY=your_huggingface_token_here

# Processing Settings
DEFAULT_CHUNK_SIZE=1000
DEFAULT_CHUNK_OVERLAP=200
MAX_TOKENS=500
TEMPERATURE=0.7
```

### Getting API Keys

#### OpenAI (Best Quality)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing information
3. Generate an API key from the API section

#### Groq (Free, Fast)
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up for a free account
3. Generate a free API key (no billing required)

#### HuggingFace (Free)
1. Visit [HuggingFace](https://huggingface.co/settings/tokens)
2. Create a free account
3. Generate an access token

## 📖 Usage

### Command Line Interface

#### Basic Commands

```bash
# Initialize and test configuration
npm run cli init

# Process a single document
npm run cli process document.pdf

# Process all files in a directory
npm run cli process-dir ./documents

# List processed documents
npm run cli list

# Show system statistics
npm run cli stats
```

#### Analysis Commands

```bash
# Analyze a specific document
npm run cli analyze <document-id>

# Search across all documents
npm run cli search "artificial intelligence"

# Compare two documents
npm run cli compare <id1> <id2>

# Show current configuration
npm run cli config
```

#### Demo Mode

```bash
# Run a complete demonstration
npm run cli demo
```

This creates sample documents and shows all system capabilities.

### Programmatic Usage

```typescript
import { DocumentIntelligenceSystem } from './src/index.js';

const system = new DocumentIntelligenceSystem();

// Initialize the system
await system.initialize();

// Process a document
await system.processFile('./document.pdf');

// Analyze the document
const documents = documentStore.getAllDocuments();
await system.analyzeDocument(documents[0].id);

// Search documents
const results = await system.searchDocuments('machine learning');
```

## 🏗 Architecture

### Core Components

```
src/
├── core/
│   ├── config.ts          # Configuration management
│   ├── models.ts          # LLM and embedding models
│   └── types.ts           # Type definitions and data store
├── processors/
│   ├── BaseProcessor.ts   # Abstract processor base class
│   ├── TextProcessor.ts   # Text/Markdown processing
│   ├── PDFProcessor.ts    # PDF document processing
│   └── index.ts          # Processor factory
├── analyzers/
│   ├── SummaryAnalyzer.ts # Document summarization
│   ├── InsightAnalyzer.ts # Keyword extraction & insights
│   └── index.ts          # Analyzer exports
├── utils/
│   ├── logger.ts         # Logging utilities
│   ├── display.ts        # Terminal output formatting
│   └── index.ts         # Utility exports
├── index.ts              # Main system class
└── cli.ts               # Command-line interface
```

### Key Design Patterns

- **Factory Pattern**: ProcessorFactory for document type handling
- **Singleton Pattern**: ModelManager for LLM instance management
- **Strategy Pattern**: Different analysis strategies for various document types
- **Observer Pattern**: Logging and progress tracking

## 🎯 Example Workflows

### Document Analysis Pipeline

1. **Load Document** → Process file and extract text
2. **Chunk Text** → Split into manageable pieces
3. **Generate Embeddings** → Create vector representations
4. **Analyze Content** → Extract insights and keywords
5. **Summarize** → Create concise summaries
6. **Generate Questions** → Create comprehension questions

### Multi-Document Comparison

1. **Process Multiple Documents**
2. **Extract Key Metrics** (sentiment, complexity, topics)
3. **Find Common Themes**
4. **Compare Readability Scores**
5. **Generate Comparative Report**

## 🔍 LangChain Concepts Demonstrated

This project showcases key LangChain.js concepts:

- **Models**: Multiple LLM provider integration
- **Prompts**: Dynamic prompt engineering for different tasks
- **Chains**: Processing pipelines for document analysis
- **Document Loading**: Various file format support
- **Text Splitting**: Intelligent chunking strategies
- **Embeddings**: Vector representations for semantic search
- **Memory**: Document storage and retrieval

## 🛡 Error Handling & Logging

- Comprehensive error handling with graceful degradation
- Structured logging with multiple levels (info, warn, error, debug)
- Configuration validation with helpful error messages
- Progress tracking for long-running operations

## 🚧 Development

### Scripts

```bash
npm run build       # Compile TypeScript
npm run dev         # Run in development mode
npm run start       # Run compiled version
npm run cli         # Run CLI commands
npm run watch       # Watch mode for development
npm run clean       # Clean build directory
```

### Adding New Document Processors

1. Create a new processor class extending `BaseProcessor`
2. Implement the `process` method
3. Add supported file extensions
4. Register in `ProcessorFactory`

Example:
```typescript
export class WordProcessor extends BaseProcessor {
  protected supportedExtensions = ['.doc', '.docx'];
  
  public async process(filePath: string): Promise<ProcessingResult> {
    // Implementation here
  }
}
```

## 📊 Performance Considerations

- **Chunking Strategy**: Optimized for both context preservation and processing speed
- **Batch Processing**: Efficient handling of multiple documents
- **Memory Management**: Smart caching and cleanup
- **API Rate Limiting**: Built-in retry logic and error handling

## 🔮 Future Enhancements

- [ ] Vector database integration (Pinecone, Weaviate)
- [ ] Advanced RAG (Retrieval-Augmented Generation) implementation
- [ ] Web interface for document management
- [ ] Real-time document monitoring
- [ ] Custom model fine-tuning capabilities
- [ ] Integration with cloud storage providers
- [ ] Advanced visualization and reporting
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [LangChain.js](https://js.langchain.com/) for the amazing framework
- [OpenAI](https://openai.com/) for powerful language models
- [Groq](https://groq.com/) for fast, free inference
- [HuggingFace](https://huggingface.co/) for open-source models

---

**Happy Document Processing! 📚✨**

For questions or support, please open an issue on GitHub.
