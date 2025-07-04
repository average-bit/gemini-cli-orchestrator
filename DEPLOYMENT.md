# Deployment Guide

## Problem Statement

This tool solves a fundamental issue: AI agents have limited context windows but often need to analyze entire codebases. Traditional solutions either:
1. Require manual file selection (inefficient)
2. Build complex server architectures (over-engineered)
3. Make assumptions about project structure (fragile)

This tool provides both direct CLI usage and MCP integration for universal agent compatibility.

## Architecture

```
User/Agent → MCP Server (optional) → Core CLI Tool → Gemini CLI → Google Gemini
```

**Core Components:**
- `gemini-direct.mjs` (272 lines): File aggregation + Gemini integration
- `mcp-server.mjs` (150 lines): MCP wrapper for agent compatibility  
- Configuration system: Project-specific semantic keywords

## Deployment Options

### 1. Direct CLI (Simplest)
```bash
npm install -g gemini-cli-orchestrator
gemini-analyze "analyze security" @src/ @package.json
```

**Use cases:**
- Scripts and automation
- Power users who prefer command line
- CI/CD integration

### 2. MCP Integration (Most Compatible)
```bash
# Add to any MCP-compatible agent
claude mcp add gemini-cli-orchestrator node /path/to/mcp-server.mjs
```

**Use cases:**
- Claude Desktop/API
- IDE integrations  
- Other MCP-compatible agents
- Teams using multiple AI tools

### 3. Project Integration
```bash
# Add as dev dependency
npm install --save-dev gemini-cli-orchestrator

# Add to package.json scripts
"scripts": {
  "audit": "gemini-analyze --template security @src/ @package.json",
  "review": "gemini-analyze --template architecture @src/"
}
```

**Use cases:**
- Project-specific analysis
- Team standardization
- Automated code reviews

## Configuration

### Global Installation
```bash
npm install -g gemini-cli-orchestrator
gemini auth login
```

### Project-Level Configuration
Create `.gemini-direct.json`:
```json
{
  "aliases": {
    "auth": ["src/auth/**/*", "middleware/auth*"],
    "api": ["src/api/**/*", "src/routes/**/*"],
    "db": ["src/models/**/*", "src/db/**/*"],
    "tests": ["test/**/*", "**/*.test.*"],
    "config": ["*.config.*", ".env*", "package.json"]
  },
  "limits": {
    "maxFiles": 30,
    "maxCharsPerFile": 8000
  },
  "ignore": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**"
  ]
}
```

### Language-Specific Patterns
```json
{
  "aliases": {
    "python-api": ["**/*.py", "requirements.txt", "pyproject.toml"],
    "go-api": ["**/*.go", "go.mod", "go.sum"],
    "rust-api": ["src/**/*.rs", "Cargo.toml", "Cargo.lock"],
    "java-api": ["src/main/java/**/*.java", "pom.xml", "build.gradle"]
  }
}
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Code Analysis
on: [push, pull_request]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @google/gemini-cli gemini-cli-orchestrator
      - run: gemini auth login --service-account-key ${{ secrets.GEMINI_KEY }}
      - run: gemini-analyze --template security @src/ @package.json --format json > security-report.json
      - uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.json
```

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit
gemini-analyze --template quality @src/ --format json | jq '.issues[] | select(.severity == "high")'
if [ $? -eq 0 ]; then
  echo "High-severity issues found. Commit blocked."
  exit 1
fi
```

## Performance Considerations

### File Limits
- Default: 30 files max, 8000 chars per file
- Configurable via `.gemini-direct.json`
- Automatic truncation prevents token overflow

### Caching
- Gemini CLI handles authentication tokens
- No persistent state in the tool itself
- Each invocation is independent

### Rate Limits
- Personal Google account: 60 requests/minute, 1,000/day
- API key: Higher limits available
- Tool respects Gemini CLI rate limiting

## Security

### Authentication
- Uses Google OAuth via Gemini CLI
- No API keys stored in tool
- Credentials managed by official Google tool

### Data Privacy
- Code sent to Google Gemini for analysis
- No persistent storage of code content
- Respects `.gitignore` patterns by default

### Network Security
- HTTPS only via Gemini CLI
- No custom network code
- Inherits Gemini CLI security posture

## Monitoring

### Success Metrics
- Analysis completion rate
- Response quality (subjective)
- Agent adoption rate (for MCP usage)

### Error Tracking
- Gemini CLI authentication failures
- File read errors
- JSON parsing errors in MCP responses

### Usage Analytics
- Template usage frequency
- File pattern effectiveness
- Average analysis time

## Scaling

### Horizontal Scaling
- Stateless design allows parallel execution
- Multiple agents can use same MCP server
- No shared state between invocations

### Vertical Scaling
- Limited by Gemini API rate limits
- File processing is I/O bound
- Memory usage scales with file count/size

## Maintenance

### Updates
- Core tool: Update via npm
- Gemini CLI: Update via `npm update -g @google/gemini-cli`
- MCP SDK: Update via `npm update @modelcontextprotocol/sdk`

### Monitoring Health
```bash
# Test core functionality
echo "test" | gemini

# Test tool
gemini-analyze "test" @package.json

# Test MCP integration
claude mcp list
```

### Backup/Recovery
- No persistent state to backup
- Configuration in `.gemini-direct.json` should be version controlled
- MCP configuration in agent settings

## Migration Path

### From Direct API Usage
1. Install Gemini CLI and authenticate
2. Replace API calls with `gemini-analyze` commands
3. Migrate patterns to `.gemini-direct.json`

### From Complex Analysis Tools
1. Map existing analysis types to templates
2. Convert file selection logic to glob patterns
3. Integrate via MCP for agent compatibility

### Adding to Existing Projects
1. `npm install --save-dev gemini-cli-orchestrator`
2. Create `.gemini-direct.json` with project patterns
3. Add npm scripts for common analysis tasks
4. Document team usage patterns

This deployment approach provides maximum flexibility while maintaining the core principle of simplicity.