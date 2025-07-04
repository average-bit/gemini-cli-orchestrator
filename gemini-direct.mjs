#!/usr/bin/env node

/**
 * Gemini Direct - Ultra-Simple Codebase Analysis
 * 
 * Features: @syntax file inclusion + inline templates + direct Gemini calls
 */

import { spawn } from 'child_process';
import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';

class GeminiDirect {
  constructor() {
    // Load configuration if available
    this.config = this.loadConfig();
    
    // Core templates - inline for simplicity
    this.templates = {
      security: `Perform a comprehensive security audit. Focus on:
- Authentication and authorization vulnerabilities
- Input validation and sanitization  
- SQL injection and XSS prevention
- Hardcoded secrets and credentials
- Error handling and information disclosure
- Dependency vulnerabilities

Provide specific findings with severity levels and remediation steps.`,

      architecture: `Analyze the overall architecture and design patterns. Focus on:
- System design and component relationships
- Design patterns and architectural decisions
- Code organization and modularity
- Data flow and dependencies
- Scalability and maintainability concerns

Identify strengths, weaknesses, and improvement opportunities.`,

      performance: `Analyze for performance bottlenecks and optimization opportunities. Focus on:
- Algorithmic complexity and efficiency
- Memory usage patterns
- Async/await usage and concurrency
- Database queries and data access
- Resource utilization

Provide specific optimization recommendations.`,

      quality: `Review code quality and best practices. Focus on:
- Code style and consistency
- Error handling patterns
- Documentation and comments
- Test coverage and quality
- Maintainability and readability

Suggest specific improvements and refactoring opportunities.`,

      debug: `Help identify and debug issues. Focus on:
- Common error patterns and anti-patterns
- Potential runtime issues
- Logic errors and edge cases
- Exception handling problems
- Integration and dependency issues

Provide debugging strategies and fix recommendations.`
    };
  }

  loadConfig() {
    try {
      const configPath = '.gemini-direct.json';
      if (existsSync(configPath)) {
        const configData = readFileSync(configPath, 'utf-8');
        return JSON.parse(configData);
      }
    } catch (error) {
      console.log(`⚠️  Config file error: ${error.message}`);
    }
    
    // Default configuration
    return {
      aliases: {},
      limits: {
        maxFiles: 30,
        maxCharsPerFile: 8000
      },
      ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**']
    };
  }

  async callGemini(prompt) {
    return new Promise((resolve) => {
      const geminiPath = process.env.GEMINI_CLI_PATH || 'gemini';
      
      const child = spawn(geminiPath, ['-m', 'gemini-2.5-flash'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
      });

      let stdout = '';
      let stderr = '';

      const timeout = setTimeout(() => {
        child.kill();
        resolve({ success: false, error: 'Timeout after 2 minutes' });
      }, 120000);

      child.stdout.on('data', (data) => stdout += data.toString());
      child.stderr.on('data', (data) => stderr += data.toString());

      child.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          resolve({ success: true, content: stdout.trim() });
        } else {
          resolve({ success: false, error: `Gemini failed (${code}): ${stderr}` });
        }
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        resolve({ success: false, error: `Failed to start Gemini: ${error.message}` });
      });

      child.stdin.write(prompt);
      child.stdin.end();
    });
  }

  async processFileInclusions(args) {
    const files = [];
    const nonFileArgs = [];

    for (const arg of args) {
      if (arg.startsWith('@')) {
        const pattern = arg.substring(1);
        let patterns = [pattern];
        
        // Check if this is a semantic keyword in config aliases
        if (this.config.aliases && this.config.aliases[pattern]) {
          patterns = this.config.aliases[pattern];
          console.log(`🔍 Using alias '${pattern}': ${patterns.join(', ')}`);
        }
        
        try {
          let allMatches = [];
          for (const p of patterns) {
            const matches = await glob(p, { 
              ignore: this.config.ignore || ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**']
            });
            allMatches.push(...matches);
          }
          
          // Remove duplicates
          const matches = [...new Set(allMatches)];
          
          if (matches.length === 0) {
            console.log(`⚠️  No files found for pattern: ${pattern}`);
            continue;
          }

          console.log(`📁 Found ${matches.length} files for ${pattern}`);
          
          // Limit files to prevent token overflow
          const maxFiles = this.config.limits?.maxFiles || 30;
          const maxChars = this.config.limits?.maxCharsPerFile || 8000;
          const filesToRead = matches.slice(0, maxFiles);
          
          for (const file of filesToRead) {
            try {
              const content = await readFile(file, 'utf-8');
              const truncated = content.length > maxChars 
                ? content.substring(0, maxChars) + '\\n... [truncated]'
                : content;
              files.push(`=== ${file} ===\\n${truncated}`);
            } catch (error) {
              files.push(`=== ${file} ===\\n[Error: ${error.message}]`);
            }
          }
          
          if (matches.length > maxFiles) {
            files.push(`... and ${matches.length - maxFiles} more files (use more specific patterns)`);
          }
        } catch (error) {
          console.log(`⚠️  Error processing ${pattern}: ${error.message}`);
        }
      } else {
        nonFileArgs.push(arg);
      }
    }

    return { fileContent: files.join('\\n\\n'), remainingArgs: nonFileArgs };
  }

  async execute(args) {
    if (args.length === 0 || args.includes('--help')) {
      this.showHelp();
      return;
    }

    try {
      // Process arguments
      let template = null;
      let question = null;
      let format = 'text';
      const fileArgs = [];

      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--template') {
          template = args[++i];
        } else if (arg === '--format') {
          format = args[++i];
        } else if (arg.startsWith('@')) {
          fileArgs.push(arg);
        } else if (!question && !arg.startsWith('--')) {
          question = arg;
        }
      }

      // Build prompt
      let prompt = '';
      if (template && this.templates[template]) {
        prompt = this.templates[template] + '\\n\\n';
      } else if (question) {
        prompt = question + '\\n\\n';
      } else {
        prompt = 'Analyze this code and provide insights:\\n\\n';
      }

      // Add file content
      if (fileArgs.length > 0) {
        console.log('🔍 Processing file inclusions...');
        const { fileContent } = await this.processFileInclusions(fileArgs);
        if (fileContent) {
          prompt += `Code to analyze:\\n\\n${fileContent}`;
        }
      }

      // Call Gemini
      console.log('🤖 Calling Gemini...');
      console.log(`📊 Prompt length: ${prompt.length} characters`);
      
      const response = await this.callGemini(prompt);
      
      if (!response.success) {
        console.error(`❌ ${response.error}`);
        process.exit(1);
      }

      // Format output
      console.log('\\n' + '='.repeat(80));
      console.log('📋 GEMINI ANALYSIS');
      console.log('='.repeat(80));
      
      if (format === 'json') {
        try {
          console.log(JSON.stringify({ analysis: response.content }, null, 2));
        } catch {
          console.log(JSON.stringify({ analysis: response.content }, null, 2));
        }
      } else {
        console.log(response.content);
      }
      
      console.log('\\n' + '='.repeat(80));

    } catch (error) {
      console.error(`💥 Error: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    console.log(`
🌟 Gemini Direct - Ultra-Simple Codebase Analysis

USAGE:
  node gemini-direct.mjs [options] [question] [@file-patterns]

FILE INCLUSION (@ syntax):
  @src/main.js                 Single file
  @src/                       Directory (finds all files)
  @**/*.js                    All JS files recursively
  @package.json @src/         Multiple patterns

TEMPLATES:
  --template security         Security audit
  --template architecture     Architecture review
  --template performance      Performance analysis
  --template quality          Code quality review
  --template debug            Debug assistance

EXAMPLES:
  node gemini-direct.mjs "What does this do?" @src/main.js
  node gemini-direct.mjs --template security @src/ @package.json
  node gemini-direct.mjs "Find React hooks" @src/components/
  node gemini-direct.mjs --template architecture @**/*.ts

OPTIONS:
  --format json              Output as JSON
  --help                     Show this help

VERIFICATION (inspired by Reddit):
  node gemini-direct.mjs "Is JWT auth implemented?" @src/auth/
  node gemini-direct.mjs "Is dark mode present?" @src/ @styles/
  node gemini-direct.mjs "Are tests comprehensive?" @tests/ @src/
    `);
  }
}

// CLI entry point
const cli = new GeminiDirect();
cli.execute(process.argv.slice(2)).catch(console.error);