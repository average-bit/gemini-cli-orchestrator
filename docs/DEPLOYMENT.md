# Deployment Guide

## What This Tool Does

This is a pure metaprompting MCP server that guides AI agents on how to collaborate with Google's Gemini AI model. It provides NO execution logic - only intelligent guidance that teaches agents how to use the gemini CLI effectively.

**Core Principle:** Don't build intelligence into the system. Build prompts that elicit intelligence from the agent.

## Architecture

```
Agent → MCP Server (Pure Guidance) → Agent executes bash commands → Gemini CLI → Google Gemini
```

**Key Components:**
- `gemini-collaboration-guide.mjs`: Pure metaprompting MCP server (no execution logic)
- **Universal Portability**: Works anywhere the agent has bash access and gemini CLI installed
- **No Dependencies**: No file processing, state management, or server-side authentication required

## Deployment Options

### 1. MCP Integration (Recommended)

Add to any MCP-compatible agent's configuration:

**Claude Desktop (`~/.claude/claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "gemini-collaboration-guide": {
      "command": "node",
      "args": ["/path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs"]
    }
  }
}
```

**Windsurf IDE (`~/.codeium/windsurf/mcp_config.json`):**
```json
{
  "mcpServers": {
    "gemini-collaboration-guide": {
      "command": "node",
      "args": ["/path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

**Cursor IDE:**
```json
{
  "mcpServers": {
    "gemini-collaboration-guide": {
      "command": "node",
      "args": ["/path/to/your/gemini-cli-orchestrator/gemini-collaboration-guide.mjs"]
    }
  }
}
```

### 2. Direct Usage

```bash
# Clone and run locally
git clone <repository-url>
cd gemini-cli-orchestrator
npm install
node gemini-collaboration-guide.mjs
```

## Prerequisites

### Agent Requirements
- Bash/shell access for executing commands
- Ability to use file exploration tools (ls, find, cat)
- Basic command-line competency

### System Requirements
- Node.js 18+
- Google Gemini CLI installed and configured
- Internet connection for Gemini API access

### Gemini CLI Setup
```bash
# Install Gemini CLI
npm install -g @google/gemini-cli

# Authenticate (one-time setup)
gemini auth login
```

## How It Works

### 1. Agent Requests Guidance
The agent calls one of three MCP tools:
- `gemini_guide_analysis_workflow`: Strategic analysis planning
- `gemini_guide_collaboration_step`: Command crafting guidance  
- `gemini_guide_insight_synthesis`: Results synthesis methodology

### 2. Server Returns Metaprompts
The server responds with rich text guidance that teaches:
- How to break down complex analysis goals
- How to craft effective bash commands for gemini
- How to structure prompts for better results
- How to synthesize insights across multiple steps

### 3. Agent Executes Commands
The agent uses their own bash tools to execute commands like:
```bash
cat src/auth/*.js | gemini -p "Analyze authentication flow for security vulnerabilities"
```

### 4. Agent Builds Understanding
The agent iteratively builds understanding by:
- Following strategic guidance
- Executing their own commands
- Learning from results
- Applying insights to next steps

## Available Guidance Tools

### `gemini_guide_analysis_workflow`
**Purpose:** Strategic framework for multi-step analysis
**Input:** Analysis goal
**Returns:** Strategic thinking guidance, step sequencing, discovery approaches

### `gemini_guide_collaboration_step`  
**Purpose:** Command crafting for focused analysis
**Input:** Step description, context
**Returns:** Bash command templates, prompt strategies, file selection guidance

### `gemini_guide_insight_synthesis`
**Purpose:** Combining insights from multiple analyses
**Input:** Steps summary, synthesis goal
**Returns:** Synthesis strategies, context building techniques, pattern identification methods

## Security Considerations

### No Server-Side Execution
- Server contains zero execution logic
- No file access or command execution on server
- Agent handles all file operations using their own tools

### No Credentials Required
- Server requires no authentication or API keys
- Agent handles Gemini authentication through their own gemini CLI
- No personal data stored or transmitted by server

### No Network Dependencies
- Server only returns text guidance
- No external API calls from server
- Agent makes all network requests to Gemini

## Performance Benefits

### Extreme Simplicity
- Single file with ~400 lines of pure metaprompting logic
- No state management, file processing, or execution overhead
- Near-zero resource usage on server

### Universal Compatibility
- Works with any agent that has bash access
- No complex setup or configuration required
- Platform-independent guidance

### Infinite Scalability
- Stateless design allows unlimited concurrent usage
- No rate limiting or resource constraints
- Pure text responses with minimal computational cost

## Monitoring and Maintenance

### Health Check
```bash
# Test server startup
node gemini-collaboration-guide.mjs --help

# Verify no execution logic
grep -r "spawn\|exec\|child_process" gemini-collaboration-guide.mjs
# Should return no results
```

### Updates
- Update Node.js dependencies: `npm update`
- Update Gemini CLI: `npm update -g @google/gemini-cli`
- Update MCP SDK: `npm update @modelcontextprotocol/sdk`

### No Backup Required
- Server contains no persistent state
- Configuration is minimal and version-controlled
- Agent handles all data operations independently

## Migration from Other Systems

### From Execution-Based Tools
1. Remove complex file processing logic
2. Replace execution with guidance prompts
3. Trust agent intelligence to handle operations
4. Focus on teaching rather than doing

### From API-Based Solutions
1. Remove API key management
2. Guide agents to use gemini CLI directly
3. Eliminate server-side authentication complexity
4. Leverage agent's native capabilities

## Troubleshooting

### Common Issues

**"Tool not working"**
- Verify gemini CLI is installed: `which gemini`
- Test authentication: `echo "test" | gemini`
- Check MCP configuration paths are absolute

**"No guidance appearing"**
- Verify MCP server is running
- Check agent permissions for MCP tools
- Ensure proper tool names in configuration

**"Commands failing"**
- Agent should execute commands, not server
- Verify agent has bash access
- Check file paths and permissions on agent system

### Debug Process
1. Test gemini CLI directly: `echo "test" | gemini`
2. Verify MCP server starts: `node gemini-collaboration-guide.mjs`
3. Check agent MCP tool discovery
4. Validate guidance quality and clarity

## Philosophy

This deployment guide reflects the core metaprompting principle: **Build systems that make intelligent agents more intelligent, not systems that replace their intelligence.**

The server teaches. The agent learns. The collaboration becomes more effective.