# Copilot Instructions for LangChain Document Intelligence System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a TypeScript-based LangChain.js document intelligence and analysis system. The project demonstrates advanced LangChain concepts including document processing, semantic analysis, and AI-powered insights.

## Key Technologies
- LangChain.js for AI/ML workflows
- TypeScript for type safety
- Multiple AI providers (OpenAI, Groq, HuggingFace)
- Node.js CLI with Commander.js
- Document processing (PDF, text, markdown)

## Code Patterns and Conventions

### Architecture
- Use factory pattern for document processors
- Implement singleton pattern for model management
- Follow modular design with clear separation of concerns
- Use async/await for all AI operations

### Error Handling
- Always wrap AI operations in try-catch blocks
- Use the logger utility for consistent error reporting
- Provide fallback behavior for failed operations
- Validate inputs before processing

### TypeScript Best Practices
- Always use proper typing for function parameters and returns
- Define interfaces for complex data structures
- Use generics where appropriate
- Leverage union types for enum-like values

### LangChain.js Specific
- Use ModelManager for LLM instance management
- Implement proper prompt engineering with context
- Handle token limits and chunking appropriately
- Use embeddings for semantic search capabilities

### CLI Development
- Use Commander.js for command structure
- Provide helpful descriptions and examples
- Implement progress indicators for long operations
- Use chalk for colored output

## File Organization
- `/src/core/` - Core system components (config, models, types)
- `/src/processors/` - Document processing logic
- `/src/analyzers/` - AI analysis components
- `/src/utils/` - Utility functions (logging, display)
- `/src/index.ts` - Main system class
- `/src/cli.ts` - Command-line interface

## When suggesting code:
1. Follow existing patterns and architecture
2. Include proper error handling and logging
3. Add TypeScript types for all new code
4. Consider token limits and API costs
5. Provide user-friendly error messages
6. Include progress indicators for long operations
7. Use the existing utility functions (logger, DisplayUtils)
8. Maintain consistency with the modular design

## Common Tasks
- Adding new document processors: Extend BaseProcessor
- Creating new analyzers: Follow SummaryAnalyzer pattern
- Adding CLI commands: Use Commander.js conventions
- Implementing new AI workflows: Use ModelManager
- Adding configuration options: Update config.ts and .env.example
