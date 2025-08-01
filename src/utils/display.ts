import Table from 'cli-table3';
import chalk from 'chalk';
import { Document, DocumentChunk } from '../core/types';
import { SummaryResult, KeywordExtractionResult, InsightAnalysisResult } from '../analyzers/index';

export class DisplayUtils {
  public static showDocumentInfo(document: Document): void {
    const table = new Table({
      head: [chalk.cyan('Property'), chalk.cyan('Value')],
      style: { head: [], border: [] }
    });

    table.push(
      ['ID', document.id],
      ['Filename', document.metadata.filename],
      ['File Type', document.metadata.fileType],
      ['Size', this.formatFileSize(document.metadata.size)],
      ['Created', document.metadata.createdAt.toLocaleDateString()],
      ['Processed', document.metadata.processedAt?.toLocaleDateString() || 'Not processed'],
      ['Chunks', document.metadata.chunkCount?.toString() || '0']
    );

    console.log(chalk.bold('\n📄 Document Information'));
    console.log(table.toString());
    console.log(`\n📝 Content Preview (first 200 chars):`);
    console.log(chalk.gray(document.content.substring(0, 200) + '...'));
  }

  public static showSummary(summary: SummaryResult): void {
    console.log(chalk.bold('\n📋 Summary'));
    console.log(chalk.blue('─'.repeat(50)));
    console.log(summary.summary);
    
    if (summary.keyPoints.length > 0) {
      console.log(chalk.bold('\n🔑 Key Points:'));
      summary.keyPoints.forEach((point, index) => {
        console.log(chalk.green(`${index + 1}. ${point}`));
      });
    }

    console.log(chalk.gray(`\n📊 Word Count: ${summary.wordCount} | Confidence: ${summary.confidence}/10`));
  }

  public static showKeywords(keywords: KeywordExtractionResult): void {
    console.log(chalk.bold('\n🏷️  Keywords & Analysis'));
    console.log(chalk.blue('─'.repeat(50)));

    if (keywords.keywords.length > 0) {
      console.log(chalk.bold('\n🔤 Keywords:'));
      console.log(chalk.cyan(keywords.keywords.join(', ')));
    }

    if (keywords.entities.length > 0) {
      console.log(chalk.bold('\n👥 Entities:'));
      console.log(chalk.yellow(keywords.entities.join(', ')));
    }

    if (keywords.topics.length > 0) {
      console.log(chalk.bold('\n📚 Topics:'));
      console.log(chalk.magenta(keywords.topics.join(', ')));
    }

    if (keywords.concepts.length > 0) {
      console.log(chalk.bold('\n💡 Concepts:'));
      console.log(chalk.green(keywords.concepts.join(', ')));
    }
  }

  public static showInsights(insights: InsightAnalysisResult): void {
    console.log(chalk.bold('\n🔍 Document Insights'));
    console.log(chalk.blue('─'.repeat(50)));

    const sentimentColors = {
      positive: chalk.green,
      negative: chalk.red,
      neutral: chalk.yellow
    };

    const complexityColors = {
      low: chalk.green,
      medium: chalk.yellow,
      high: chalk.red
    };

    const table = new Table({
      head: [chalk.cyan('Metric'), chalk.cyan('Value')],
      style: { head: [], border: [] }
    });

    table.push(
      ['Sentiment', sentimentColors[insights.sentiment](insights.sentiment.toUpperCase())],
      ['Complexity', complexityColors[insights.complexity](insights.complexity.toUpperCase())],
      ['Readability Score', this.getReadabilityColor(insights.readabilityScore)(`${insights.readabilityScore}/100`)]
    );

    console.log(table.toString());

    if (insights.topics.length > 0) {
      console.log(chalk.bold('\n📑 Main Topics:'));
      insights.topics.forEach((topic, index) => {
        console.log(chalk.blue(`${index + 1}. ${topic}`));
      });
    }

    if (insights.keyInsights.length > 0) {
      console.log(chalk.bold('\n💡 Key Insights:'));
      insights.keyInsights.forEach((insight, index) => {
        console.log(chalk.green(`${index + 1}. ${insight}`));
      });
    }

    if (insights.recommendations.length > 0) {
      console.log(chalk.bold('\n🎯 Recommendations:'));
      insights.recommendations.forEach((rec, index) => {
        console.log(chalk.cyan(`${index + 1}. ${rec}`));
      });
    }
  }

  public static showChunks(chunks: DocumentChunk[], maxDisplay = 5): void {
    console.log(chalk.bold(`\n📄 Document Chunks (showing ${Math.min(chunks.length, maxDisplay)} of ${chunks.length})`));
    console.log(chalk.blue('─'.repeat(50)));

    const chunksToShow = chunks.slice(0, maxDisplay);
    
    chunksToShow.forEach((chunk, index) => {
      console.log(chalk.bold(`\n📝 Chunk ${chunk.index + 1}:`));
      console.log(chalk.gray(`Range: ${chunk.metadata.startChar}-${chunk.metadata.endChar}`));
      console.log(chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : ''));
    });

    if (chunks.length > maxDisplay) {
      console.log(chalk.gray(`\n... and ${chunks.length - maxDisplay} more chunks`));
    }
  }

  public static showStats(stats: any): void {
    const table = new Table({
      head: [chalk.cyan('Statistic'), chalk.cyan('Value')],
      style: { head: [], border: [] }
    });

    Object.entries(stats).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      table.push([formattedKey, String(value)]);
    });

    console.log(chalk.bold('\n📊 Statistics'));
    console.log(table.toString());
  }

  public static showProgress(current: number, total: number, operation: string): void {
    const percentage = Math.round((current / total) * 100);
    const progressBar = '█'.repeat(Math.round(percentage / 5)) + '░'.repeat(20 - Math.round(percentage / 5));
    
    process.stdout.write(`\r${chalk.blue('Progress:')} [${chalk.green(progressBar)}] ${percentage}% - ${operation}`);
    
    if (current === total) {
      console.log(); // New line when complete
    }
  }

  public static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  private static getReadabilityColor(score: number) {
    if (score >= 80) return chalk.green;
    if (score >= 60) return chalk.yellow;
    return chalk.red;
  }

  public static showQuestions(questions: string[]): void {
    if (questions.length === 0) return;

    console.log(chalk.bold('\n❓ Generated Questions'));
    console.log(chalk.blue('─'.repeat(50)));

    questions.forEach((question, index) => {
      console.log(chalk.yellow(`${index + 1}. ${question}`));
    });
  }
}
