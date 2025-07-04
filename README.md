# Gemini CLI Orchestrator MCP

A lightweight CLI tool and MCP server enabling AI agents to perform deep codebase analysis with Gemini's massive context window.

## Two Ways to Use

### 🚀 MCP Server (Recommended for Agents)
**Makes this tool available to any AI agent via Model Context Protocol**

```bash
# Install dependencies
npm install

# Add to Claude Code CLI
claude mcp add gemini-cli-orchestrator node /path/to/your/gemini-cli-orchestrator/mcp-server.mjs
```

**Or add to `.claude/settings.local.json`:**
```json
{
  "permissions": {
    "allow": [
      "mcp__gemini-cli-orchestrator__analyze_with_gemini"
    ]
  },
  "mcpServers": {
    "gemini-cli-orchestrator": {
      "command": "node",
      "args": ["/path/to/your/gemini-cli-orchestrator/mcp-server.mjs"]
    }
  }
}
```

**For Claude Desktop:**
Add to config file at:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gemini-cli-orchestrator": {
      "command": "node", 
      "args": ["/path/to/your/gemini-cli-orchestrator/mcp-server.mjs"]
    }
  }
}
```

**Any agent can now use:**
- `analyze_with_gemini("find security issues", "@src/auth/ @middleware/")` 
- Intelligent file selection guided by tool description
- Cross-file analysis with Gemini's massive context window

### 💻 Direct CLI (For Scripts/Power Users)  
**Ultra-simple direct usage**

## Quick Start

```bash
# Install
npm install

# Basic usage
npm run analyze "What does this code do?" @src/main.js

# Templates
npm run analyze --template security @src/ @package.json

# Verification (Reddit-style)  
npm run analyze "Is JWT auth implemented?" @src/auth/

# Semantic keywords (NEW!)
npm run analyze "Review authentication security" @authentication
```

## Features

✅ **@ syntax file inclusion** - `@src/` `@**/*.js` `@package.json`  
✅ **Semantic keywords** - `@authentication` `@database` `@config` (via .gemini-direct.json)  
✅ **5 core templates** - security, architecture, performance, quality, debug  
✅ **Direct Gemini calls** - no MCP overhead  
✅ **Zero configuration** - works immediately  
✅ **Single dependency** - just `glob`  

## Examples

```bash
# File analysis
npm run analyze "Explain this code" @src/main.js

# Directory analysis  
npm run analyze "Review architecture" @src/

# Multiple files
npm run analyze "Compare these" @src/old.js @src/new.js

# Security audit
npm run analyze --template security @src/ @package.json

# Verification questions
npm run analyze "Is error handling robust?" @src/ @api/
npm run analyze "Are WebSocket hooks present?" @src/hooks/
npm run analyze "Is dark mode implemented?" @src/ @styles/
```

## Key Benefits

✅ **Ultra-lightweight**: 272-line CLI + 150-line MCP server  
✅ **Universal compatibility**: Works with any MCP-enabled AI agent  
✅ **Zero configuration**: Works immediately after Gemini CLI setup  
✅ **Intelligent file discovery**: Smart pattern matching and context management

## Requirements

- Node.js 18+
- Google Gemini CLI installed and authenticated (see setup below)

## Setup

### 1. Install Gemini CLI

```bash
# Install the official Google Gemini CLI
npm install -g @google/gemini-cli
```

### 2. Authenticate with Google (OAuth - FREE)

```bash
# Authenticate with your Google account - NO API key needed!
gemini auth login
```

**What Gets Created:**
```
~/.gemini/
├── settings.json          # {"selectedAuthType": "oauth-personal"}
├── oauth_creds.json       # OAuth tokens (auto-refreshed)
├── user_id               # Your unique identifier
└── google_account_id     # Google account reference
```

**How It Works:**
1. **First time**: `gemini auth login` opens browser for OAuth
2. **Subsequent calls**: Gemini CLI automatically uses stored tokens
3. **Token refresh**: Happens automatically when needed
4. **Your tool**: Inherits authentication from Gemini CLI

**Cross-Platform Paths:**
| OS | Auth Directory |
|---|---|
| **Linux/macOS** | `~/.gemini/` |
| **Windows** | `%USERPROFILE%\.gemini\` |
| **Docker** | Mount host `~/.gemini/` as volume |

**Important**: This uses FREE Google OAuth, not paid API access!

### 3. Verify Authentication

```bash
# Test that authentication works
echo "Hello Gemini" | gemini
# You should see a response from Gemini
```

### 4. Install and Test This Tool

```bash
# Clone or download this project
git clone <repository-url>
cd gemini-cli-orchestrator

# Install dependencies
npm install

# Test the tool
npm run analyze "What is 2+2?"
```

## Authentication Details

**No Code Changes Needed** - Your tool automatically inherits authentication because:

```javascript
// Spawns gemini CLI with full environment
const child = spawn(geminiPath, ['-m', 'gemini-2.5-flash'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env }  // ← Passes through all environment
});
```

The Gemini CLI handles reading `~/.gemini/oauth_creds.json` automatically.

**Distribution Benefits:**
- **Users must authenticate once**: `gemini auth login`
- **No secrets in your code**: Authentication is external
- **Works across systems**: OAuth credentials are portable
- **No configuration needed**: Your tool just works after auth

## Troubleshooting

### "Command not found: gemini"
```bash
# Check if Gemini CLI is installed
npm list -g @google/gemini-cli

# If not installed, install it
npm install -g @google/gemini-cli
```

### "Authentication failed"
```bash
# Re-authenticate
gemini auth login

# Check auth status
gemini auth status
```

### "GEMINI_CLI_PATH not found"
The tool automatically finds the Gemini CLI. If you have issues:

```bash
# Find where Gemini is installed
which gemini

# Set environment variable if needed (optional)
export GEMINI_CLI_PATH=$(which gemini)
```

## Templates

- **security** - OWASP-style security audit
- **architecture** - System design and patterns analysis
- **performance** - Bottleneck identification and optimization
- **quality** - Code quality and best practices review  
- **debug** - Bug identification and troubleshooting

## Semantic Keywords

Create a `.gemini-direct.json` file in your project root to define semantic keywords that map to file patterns:

```json
{
  "aliases": {
    "authentication": ["src/auth/**/*", "middleware/auth*", "**/*auth*"],
    "database": ["src/models/**/*", "src/db/**/*", "**/*model*"],
    "api": ["src/api/**/*", "src/routes/**/*", "**/*controller*"],
    "config": ["*.config.*", ".env*", "package.json"],
    "tests": ["test/**/*", "**/*.test.*", "**/*.spec.*"]
  },
  "limits": {
    "maxFiles": 30,
    "maxCharsPerFile": 8000
  }
}
```

Usage:
```bash
# Instead of guessing project structure
npm run analyze "security audit" @authentication @config

# Works across any project type (JavaScript, Python, Go, etc.)
npm run analyze "find database issues" @database
```

## Distribution

This tool is designed to be:
- **Copied** - 3 files, copy anywhere
- **Shared** - Send to colleagues, zero setup
- **Embedded** - Drop into any project
- **Global** - `npm install -g` for system-wide use

Perfect for getting real value from Gemini's massive context window without the complexity overhead.