# Contributing to Gemini CLI Orchestrator

Thank you for your interest in contributing! This project follows the principle of **keeping things simple and lean**.

## Philosophy

This tool is intentionally minimal - we prefer **intelligent guidance over complex engineering**. Before adding features, ask:

- Does this make the tool smarter, or the user think less?
- Can this be solved with better prompting instead of more code?
- Does this maintain the "ultra-simple" nature of the tool?

## Development Setup

```bash
# Clone and install
git clone <repository-url>
cd gemini-cli-orchestrator
npm install

# Install Gemini CLI for testing
npm install -g @google/gemini-cli
gemini auth login

# Test the tool
npm run analyze "test query" @package.json
```

## Code Style

- **No build step**: Pure JavaScript/Node.js
- **Minimal dependencies**: Only essential packages
- **Clear and simple**: Readable code over clever code
- **No emojis**: Clean, professional text only

## Testing

```bash
# Test CLI functionality
npm run analyze "What does this package.json contain?" @package.json

# Test MCP server
npm start
# In another terminal, test MCP integration
```

## Making Changes

### Small Changes
- Documentation improvements
- Bug fixes
- Performance optimizations

Submit a pull request directly.

### Larger Changes
- New features
- Architecture changes
- Breaking changes

Please open an issue first to discuss the approach.

## Pull Request Process

1. **Test thoroughly** - Ensure both CLI and MCP modes work
2. **Keep it simple** - Maintain the minimalist philosophy
3. **Update documentation** - README.md should reflect any changes
4. **No breaking changes** - Unless absolutely necessary

## Architecture Guidelines

- **mcp-server.mjs**: Thin MCP wrapper, handles metaprompting
- **gemini-direct.mjs**: Core tool, handles file processing and Gemini calls
- **Separation of concerns**: Keep each file focused on its purpose

## What We're Looking For

- **Bug reports** with clear reproduction steps
- **Performance improvements** that maintain simplicity
- **Better prompting** that guides intelligent usage
- **Cross-platform compatibility** improvements
- **Documentation** that helps people think better about using the tool

## What We're Not Looking For

- **Feature creep** that adds complexity
- **Over-engineering** solutions
- **Breaking changes** without strong justification
- **Dependencies** that aren't essential

## Questions?

Open an issue for discussion. We prefer conversations that help maintain the project's simplicity and effectiveness.

**Remember**: The goal is to help AI agents think better about codebase analysis, not to build a complex system that thinks for them.