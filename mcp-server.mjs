#!/usr/bin/env node

/**
 * Gemini MCP Server - Lightweight wrapper around gemini-direct.mjs
 * 
 * Makes the ultra-simple gemini-direct.mjs tool discoverable and usable by any AI agent
 * via the Model Context Protocol while maintaining the 272-line core tool as backbone.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * Process file patterns from user input
 */
function processFilePatterns(files = '') {
  const patterns = [];
  
  // Add explicit file patterns
  if (files) {
    patterns.push(...files.split(' ').filter(f => f.trim()));
  }
  
  // Default fallback for broad analysis
  if (patterns.length === 0) {
    patterns.push('@src/', '@package.json');
  }
  
  return [...new Set(patterns)]; // Remove duplicates
}

/**
 * Assess task complexity based on question and pattern count
 */
function assessComplexity(question, patternCount) {
  const queryLower = question.toLowerCase();
  
  if (patternCount > 10) return "High - Multiple files/systems";
  if (queryLower.includes("architecture") || queryLower.includes("entire") || queryLower.includes("whole")) return "High - System-wide analysis";
  if (queryLower.includes("cross-file") || queryLower.includes("across")) return "High - Cross-file analysis";
  if (patternCount > 3) return "Medium - Cross-file analysis";
  return "Low - Focused analysis";
}

/**
 * Enhance prompt with context-aware guidance
 */
function enhancePrompt(question, patterns, template) {
  let prompt = question;
  
  // Add context about scope
  if (patterns.length > 5) {
    prompt += `\n\nContext: This is a large-scale analysis across ${patterns.length} file patterns. Focus on high-level patterns and architectural insights that would be difficult to see with limited context.`;
  }
  
  // Add reflection guidance
  prompt += `\n\nAfter your analysis, please reflect on:
1. What patterns or issues require immediate attention?
2. What insights emerge from having access to the full codebase context?
3. What specific next steps should the requesting agent take?`;
  
  return prompt;
}

/**
 * Execute the core gemini-direct.mjs tool
 */
async function executeGeminiDirect(question, patterns = [], template = null) {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, 'gemini-direct.mjs');
    const args = [];
    
    // Add template if specified
    if (template) {
      args.push('--template', template);
    }
    
    // Add JSON format for structured parsing
    args.push('--format', 'json');
    
    // Add question
    args.push(question);
    
    // Add file patterns
    args.push(...patterns);
    
    const child = spawn('node', [scriptPath, ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });
    
    // Set timeout for the spawn process
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('gemini-direct.mjs process timed out after 5 minutes'));
    }, 300000); // 5 minutes
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({
          success: true,
          output: stdout,
          stderr: stderr
        });
      } else {
        reject(new Error(`gemini-direct.mjs failed with code ${code}: ${stderr}`));
      }
    });
    
    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to execute gemini-direct.mjs: ${error.message}`));
    });
  });
}

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: 'gemini-cli-orchestrator',
    version: '1.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_with_gemini',
        description: `Use Gemini's massive context window for comprehensive codebase analysis.

APPROACH:
If you're unfamiliar with the codebase, explore its structure first using tools like Glob, LS, or Read to understand the project organization. Then select relevant files for focused analysis.

INTELLIGENT FILE SELECTION:
- Understand the codebase structure before analyzing
- Select files that are relevant to your analysis goal
- Include related files that provide necessary context
- Consider configuration, tests, and documentation
- Use broad patterns (@src/) for discovery, specific files for focused analysis

METACOGNITIVE FEATURES:
- Automatically assesses task complexity and scope
- Enhances prompts with context-aware guidance  
- Provides reflection on analysis insights and next steps
- Leverages Gemini's large context for cross-file pattern recognition

Let your understanding of the codebase guide your file selection.`,
        
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'Natural language question or analysis request'
            },
            files: {
              type: 'string',
              description: 'File patterns like "@src/ @package.json" or specific paths. Leave empty for broad analysis using @src/ @package.json defaults.'
            },
            template: {
              type: 'string',
              enum: ['security', 'architecture', 'performance', 'quality', 'debug'],
              description: 'Optional: Use predefined analysis template'
            }
          },
          required: ['question']
        }
      }
    ]
  };
});

/**
 * Handle tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    if (name === 'analyze_with_gemini') {
      const { question, files = '', template } = args;
      
      // Process file patterns from user input
      const patterns = processFilePatterns(files);
      
      // Assess complexity and enhance prompt
      const complexity = assessComplexity(question, patterns.length);
      const enhancedQuestion = enhancePrompt(question, patterns, template);
      
      console.error(`Analyzing with patterns: ${patterns.join(' ')}`);
      console.error(`Task complexity: ${complexity}`);
      
      // Execute the core tool with enhanced prompt
      const result = await executeGeminiDirect(enhancedQuestion, patterns, template);
      
      return {
        content: [
          {
            type: 'text',
            text: `# Gemini Analysis Results

## Query: ${question}
## Files Analyzed: ${patterns.join(', ')}

${result.output}

## Metacognitive Insights
- **Analysis Scope**: ${patterns.length} file patterns across codebase
- **Task Complexity**: ${complexity}
- **Gemini Advantage**: Large context window enabled comprehensive cross-file analysis
- **Agent Guidance**: Review findings above and consider focused follow-up questions on specific areas

---
*Analysis powered by Gemini CLI via gemini-cli-orchestrator*`
          }
        ]
      };
    
    throw new Error(`Unknown tool: ${name}`);
    
  } catch (error) {
    console.error(`Tool execution error for ${name}:`, error);
    
    return {
      content: [
        {
          type: 'text',
          text: `ERROR: ${error.message}

Make sure:
1. Gemini CLI is installed: npm install -g @google/gemini-cli
2. Authenticated: gemini auth login
3. In a valid project directory`
        }
      ],
      isError: true
    };
  }
});

/**
 * Start the MCP server
 */
if (process.env.NODE_ENV !== 'test') {
  const transport = new StdioServerTransport();
  server.connect(transport);
  console.error('🚀 Gemini CLI Orchestrator MCP Server started');
}

export { server };