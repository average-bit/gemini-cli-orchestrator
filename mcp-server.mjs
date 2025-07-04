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
function enhancePrompt(question, patterns, template, context = '') {
  let prompt = question;
  
  // Add user-provided context first (most important)
  if (context.trim()) {
    prompt += `\n\nContext: ${context}`;
  }
  
  // Add scope context about file patterns
  if (patterns.length > 5) {
    prompt += `\n\nAnalysis Scope: This is a large-scale analysis across ${patterns.length} file patterns. Focus on high-level patterns and architectural insights that would be difficult to see with limited context.`;
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

DISCOVERY-FIRST APPROACH:
Before using this tool, explore the codebase structure using tools like Glob, LS, or Read to understand what exists. Every project is unique - let your exploration guide your analysis strategy.

INTELLIGENT FILE SELECTION:
- Start by understanding: What type of project is this? What files exist?
- Choose patterns that match the actual structure you discovered
- Include related files that provide necessary context
- Consider configuration, tests, documentation based on what you found
- Use broad patterns for discovery, specific files for focused analysis

EXAMPLES OF EXPLORATION-GUIDED PATTERNS:
- Python project: @**/*.py @requirements.txt @pyproject.toml
- Go project: @**/*.go @go.mod @go.sum  
- Rust project: @src/**/*.rs @Cargo.toml
- Web project: @src/ @package.json @tsconfig.json
- Documentation: @README.md @docs/ @**/*.md

CRAFTING EFFECTIVE QUESTIONS FOR GEMINI:
Gemini works best with specific, contextual questions. Consider including:
- Your analysis goal: "I'm trying to understand X because Y"
- Specific focus: "Focus on security vulnerabilities in authentication"
- Output preference: "Provide specific examples with line numbers"
- Domain context: "This is a React app with TypeScript"

METACOGNITIVE FEATURES:
- Assesses task complexity based on your file selection
- Enhances prompts with context-aware guidance
- Provides reflection on analysis insights and next steps
- Leverages Gemini's large context for cross-file pattern recognition

Trust your understanding of the codebase to guide intelligent file selection and question crafting.`,
        
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'Your analysis question for Gemini. Make it specific and contextual. Good: "What security vulnerabilities exist in the authentication system?" Bad: "Analyze this code." Include your goal, specific focus, and desired output format for best results.'
            },
            files: {
              type: 'string',
              description: 'File patterns based on your exploration. Examples: "@**/*.py @requirements.txt" for Python, "@src/ @package.json" for Node.js, "@**/*.rs @Cargo.toml" for Rust. Explore the project structure first to choose meaningful patterns.'
            },
            context: {
              type: 'string',
              description: 'Optional: Provide context about your analysis goal, the project domain, your role, or what you\'re trying to achieve. This helps Gemini give more relevant, targeted responses. Example: "I\'m debugging a performance issue in a React app" or "I\'m doing a security review for a financial API".'
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
      const { question, files = '', context = '', template } = args;
      
      // Process file patterns from user input
      const patterns = processFilePatterns(files);
      
      // Guide agent to explore if no patterns provided
      if (patterns.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `# File Exploration Needed

No file patterns specified. To use Gemini's massive context effectively, first explore the codebase structure:

## Recommended exploration steps:
1. **Understand the project**: Use \`ls\` or \`Glob\` to see the top-level structure
2. **Identify the project type**: Look for language-specific files (package.json, Cargo.toml, requirements.txt, etc.)
3. **Choose meaningful patterns**: Based on what you found, select relevant file patterns

## Example patterns by project type:
- **Node.js/JavaScript**: \`@src/ @package.json @*.config.js\`
- **Python**: \`@**/*.py @requirements.txt @pyproject.toml\`
- **Rust**: \`@src/**/*.rs @Cargo.toml\`
- **Go**: \`@**/*.go @go.mod\`
- **Documentation**: \`@README.md @docs/ @**/*.md\`

## Try again with specific patterns:
\`analyze_with_gemini("${question}", "@appropriate/patterns @based/on/exploration")\`

*This approach ensures more relevant and focused analysis results.*`
            }
          ]
        };
      }
      
      // Assess complexity and enhance prompt
      const complexity = assessComplexity(question, patterns.length);
      const enhancedQuestion = enhancePrompt(question, patterns, template, context);
      
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
    }
    
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