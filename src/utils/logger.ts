import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export class Logger {
  private static instance: Logger;
  private logFile: string;

  private constructor() {
    this.logFile = path.join(process.cwd(), 'logs', 'app.log');
    this.ensureLogDirectory();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private ensureLogDirectory(): void {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  public info(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}`;
    
    console.log(chalk.blue('ℹ'), message);
    
    if (data) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
      this.writeToFile(`${logMessage}\nData: ${JSON.stringify(data)}`);
    } else {
      this.writeToFile(logMessage);
    }
  }

  public success(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] SUCCESS: ${message}`;
    
    console.log(chalk.green('✅'), message);
    
    if (data) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
      this.writeToFile(`${logMessage}\nData: ${JSON.stringify(data)}`);
    } else {
      this.writeToFile(logMessage);
    }
  }

  public warn(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}`;
    
    console.log(chalk.yellow('⚠️'), chalk.yellow(message));
    
    if (data) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
      this.writeToFile(`${logMessage}\nData: ${JSON.stringify(data)}`);
    } else {
      this.writeToFile(logMessage);
    }
  }

  public error(message: string, error?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}`;
    
    console.log(chalk.red('❌'), chalk.red(message));
    
    if (error) {
      console.log(chalk.red(error.stack || error.message || error));
      this.writeToFile(`${logMessage}\nError: ${error.stack || error.message || error}`);
    } else {
      this.writeToFile(logMessage);
    }
  }

  public debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] DEBUG: ${message}`;
      
      console.log(chalk.gray('🔍'), chalk.gray(message));
      
      if (data) {
        console.log(chalk.gray(JSON.stringify(data, null, 2)));
        this.writeToFile(`${logMessage}\nData: ${JSON.stringify(data)}`);
      } else {
        this.writeToFile(logMessage);
      }
    }
  }

  private writeToFile(message: string): void {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  public clearLogs(): void {
    try {
      fs.writeFileSync(this.logFile, '');
      console.log(chalk.green('✅ Log file cleared'));
    } catch (error) {
      console.error('Failed to clear log file:', error);
    }
  }
}

export const logger = Logger.getInstance();
