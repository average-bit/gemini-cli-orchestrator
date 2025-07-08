# Gemini CLI Orchestrator v2.0 - Sequential Thinking MCP

A metaprompting-first MCP server that guides AI agents through intelligent, multi-step codebase analysis using Google's Gemini AI.

## 🧠 Core Philosophy

**Don't build intelligence into the system. Build prompts that elicit intelligence from the agent.**

This tool doesn't wrap or replace your thinking - it guides you to think more systematically about complex codebase analysis through structured workflows.

## 🚀 Quick Start

**Step 1: Install Gemini CLI**
```bash
npm install -g @google/gemini-cli
```

**Step 2: Authenticate (one-time setup)**
```bash
gemini auth login
```

**Step 3: Install this tool**
```bash
npm install
```

**Step 4: Test it works**
```bash
node gemini-collaboration-guide.mjs
```

**Step 5: Try your first analysis** (using Claude Code CLI)
```bash
# Start with planning a simple analysis
gemini_plan_analysis goal="Understand this project's main architecture"

# Then craft a specific prompt for the first step
gemini_craft_prompt step_description="Analyze package.json and README for project overview" context="Starting fresh analysis"
```

That's it! Authentication is handled automatically by the gemini CLI.

## How It Works

Instead of trying to be "smart" about your analysis, this tool provides four simple tools that guide you through systematic analysis:

### 🎯 `gemini_plan_analysis(goal)`
Breaks down complex analysis goals into a step-by-step plan. Be specific about what you want to understand and why.

**Example:** 
```bash
gemini_plan_analysis goal="Audit authentication system for security vulnerabilities"
```

### 🔍 `gemini_craft_prompt(step_description, context)`
Helps you write better prompts for Gemini by suggesting effective commands and context for each analysis step.

**Example:** 
```bash
gemini_craft_prompt step_description="Analyze JWT token handling" context="Found 3 auth endpoints, focusing on token security"
```

### 🔄 `gemini_iterate_analysis(current_understanding, iteration_goal)`
Guide iterative analysis using observe-think-act cycles for dynamic problem-solving.

**Example:** 
```bash
gemini_iterate_analysis current_understanding="Found potential SQL injection in login" iteration_goal="Investigate if other endpoints have similar issues"
```

### 📊 `gemini_synthesize_findings(steps_summary, synthesis_goal)`
Combine insights from multiple analysis steps into comprehensive understanding.

**Example:** 
```bash
gemini_synthesize_findings steps_summary="Analyzed auth system, found 2 vulnerabilities, tested 5 endpoints" synthesis_goal="Create security audit report with prioritized fixes"
```

## Example Workflow

Here's how you'd conduct a security audit using the orchestrator:

```bash
# 1. Plan the overall analysis
gemini_plan_analysis goal="Analyze authentication system for security vulnerabilities"
# → Outputs: 5-stage analysis plan with specific steps

# 2. Execute each planned step
gemini_craft_prompt step_description="Identify authentication mechanisms" context="Security audit of auth system"
# → Outputs: Optimized gemini command to analyze auth files
# → You run: cat src/auth/**/* | gemini -m gemini-2.5-flash -p "..."

# 3. Dive deeper if needed
gemini_iterate_analysis current_understanding="Found JWT + session auth" iteration_goal="Check for common auth vulnerabilities"
# → Outputs: ReAct loop guidance for systematic vulnerability testing

# 4. Synthesize final report
gemini_synthesize_findings steps_summary="Analyzed 3 auth mechanisms, found 2 issues" synthesis_goal="Security audit report with fixes"
# → Outputs: Comprehensive synthesis strategy for final report
```

## 🎯 Key Benefits

✅ **Simplified Authentication** - Uses your existing gemini CLI setup  
✅ **True Metaprompting** - Guides your intelligence, doesn't replace it  
✅ **Multi-Step Analysis** - Break complex problems into manageable steps  
✅ **Flexible Workflows** - Adapt your approach based on what you discover  
✅ **Direct Gemini Integration** - No wrapper complexity or auth overhead

## 📚 Documentation

- **[How It Works](docs/HOW_IT_WORKS.md)** - Deep dive into the architecture and metaprompting philosophy
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute to the project
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards and expectations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) for details on how to get involved.  

## MCP Configuration

### 🚨 Important Note for Existing Users
If you've previously installed this MCP server (especially if you used `gemini-orchestrator.mjs`), you may have cached configurations. The filename was renamed to `gemini-collaboration-guide.mjs` for clarity. **See "Handling Previous Installations" below** if you encounter setup issues.

### Claude Code CLI (Recommended)
The easiest and most reliable way to configure the MCP server:

```bash
# Add the server using Claude Code's built-in command
claude mcp add gemini-collaboration-guide node /path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs

# Verify it was added
claude mcp list

# Test it's working in Claude Code
/mcp
```

**Important:** 
- Use the full absolute path to the `gemini-collaboration-guide.mjs` file
- The server name must be exactly `gemini-collaboration-guide`
- Restart Claude Code after adding the server

### Handling Previous Installations / Filename Changes

If you previously configured this MCP server or encounter issues like "Status: ✘ failed", follow these steps:

```bash
# 1. Remove any old configurations
claude mcp remove gemini-cli-orchestrator    # Old name
claude mcp remove gemini-orchestrator        # Another old name  
claude mcp remove gemini-collaboration-guide # Clean slate

# 2. Verify clean state
claude mcp list

# 3. Add with correct filename (use YOUR actual path)
claude mcp add gemini-collaboration-guide node /Users/dannynguyen/gemini-cli-orchestrator/gemini-collaboration-guide.mjs

# 4. Restart Claude Code completely

# 5. Test it works
/mcp
```

### Manual Configuration (Alternative)

If you prefer manual JSON configuration:

**Claude Desktop** - Config file: `~/Library/Application Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "gemini-collaboration-guide": {
      "command": "node",
      "args": ["/absolute/path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs"]
    }
  }
}
```

**Cursor IDE** - Config file: `.cursor/mcp.json`
```json
{
  "mcpServers": {
    "gemini-collaboration-guide": {
      "command": "node",
      "args": ["/absolute/path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs"]
    }
  }
}
```

**Windsurf IDE** - Config file: `windsurf_config.json`
```json
{
  "mcpServers": {
    "gemini-collaboration-guide": {
      "command": "node",
      "args": ["/absolute/path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

### Troubleshooting

**If `/mcp` shows "No MCP servers configured" or tools aren't available:**

1. **Check for filename/configuration conflicts** (Most Common Issue)
   - Follow the "Handling Previous Installations" section above
   - The file was renamed from `gemini-orchestrator.mjs` to `gemini-collaboration-guide.mjs`

2. **Clean setup process**:
   ```bash
   # Remove all old configurations
   claude mcp remove gemini-cli-orchestrator
   claude mcp remove gemini-orchestrator  
   claude mcp remove gemini-collaboration-guide
   
   # Add with correct filename
   claude mcp add gemini-collaboration-guide node /absolute/path/to/gemini-collaboration-guide.mjs
   ```

3. **Verify the file exists**:
   ```bash
   ls -la /path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs
   ```

4. **Test the server can start**:
   ```bash
   node /path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs --help
   ```

5. **Restart Claude Code** completely after any configuration changes

6. **Verify success**:
   ```bash
   claude mcp list    # Should show: gemini-collaboration-guide
   /mcp              # Should show the four tools
   ```

**Common Errors:**
- `Status: ✘ failed` → Usually wrong filename (use `gemini-collaboration-guide.mjs`)
- `File does not exist` → Check absolute path is correct
- Tools not appearing → Restart Claude Code after configuration

## Advanced Usage Examples

### Security Audit Workflow
```
1. Start: "Comprehensive security audit of web application"
2. Step 1: "Identify all authentication mechanisms" → @src/auth/ @middleware/
3. Step 2: "Analyze API endpoint security" → @src/api/ @src/routes/
4. Step 3: "Review data validation and sanitization" → @src/validation/ @src/models/
5. Step 4: "Check for common vulnerabilities (OWASP)" → @src/
6. Conclude: "Generate prioritized security report with remediation steps"
```

### Performance Analysis Workflow
```
1. Start: "Identify performance bottlenecks in React application"
2. Step 1: "Analyze component rendering patterns" → @src/components/
3. Step 2: "Review state management efficiency" → @src/store/ @src/hooks/
4. Step 3: "Check for unnecessary re-renders" → @src/components/
5. Step 4: "Analyze bundle size and imports" → @package.json @webpack.config.js
6. Conclude: "Provide performance optimization recommendations"
```

### Architecture Review Workflow
```
1. Start: "Review microservices architecture for scalability"
2. Step 1: "Understand service boundaries" → @services/ @docker-compose.yml
3. Step 2: "Analyze inter-service communication" → @src/api/ @src/clients/
4. Step 3: "Review data flow and dependencies" → @src/models/ @src/schemas/
5. Step 4: "Evaluate error handling and resilience" → @src/middleware/ @src/utils/
6. Conclude: "Recommend architectural improvements for scalability"
```

## File Pattern Examples

Use glob patterns to focus analysis on relevant files:

```bash
# Language-specific patterns
@**/*.js @**/*.ts          # JavaScript/TypeScript
@**/*.py                   # Python
@**/*.go                   # Go
@**/*.rs                   # Rust
@**/*.java                 # Java

# Framework-specific patterns
@src/components/ @src/hooks/     # React
@src/models/ @src/views/         # MVC frameworks
@src/services/ @src/controllers/ # Service layer

# File type patterns
@package.json @*.config.js       # Configuration
@**/*.test.js @**/*.spec.js      # Tests
@README.md @docs/                # Documentation
```

## Requirements

- Node.js 18+
- Google Gemini CLI installed and authenticated
- Basic understanding of glob patterns

## Troubleshooting

**"Command not found: gemini"**
```bash
npm install -g @google/gemini-cli
```

**"Authentication failed"**
```bash
gemini auth login
```

**"No files found"**
```bash
# Check your file patterns match your project structure
# Use broader patterns like @src/ or @**/*.js
```

## What's New in v2.0

🎉 **Complete architectural redesign** - From complex wrapper to simple orchestrator  
🎉 **Eliminated authentication complexity** - Uses native gemini CLI auth  
🎉 **True metaprompting approach** - Guides intelligence instead of replacing it  
🎉 **Sequential thinking workflows** - Multi-step analysis with state management  
🎉 **Simplified setup** - No complex configuration or environment variables  

## Philosophy

This tool embodies the metaprompting principle: **trust agent intelligence over system complexity**.

Instead of trying to be smart about your analysis, it provides simple tools that guide you to think systematically about complex problems. The result is more thoughtful analysis and better insights.

Perfect for leveraging Gemini's massive context window through intelligent, structured workflows.