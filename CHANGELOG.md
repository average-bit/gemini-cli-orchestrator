# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-03

### Added
- **Metacognitive features**: Tool now provides intelligence guidance and reflection
- **Task complexity assessment**: Automatically categorizes analysis scope (Low/Medium/High)  
- **Enhanced prompting**: Context-aware guidance sent to Gemini for better analysis
- **Structured insights**: Response includes metacognitive insights and agent guidance
- **Intelligent file selection**: Tool description guides agents to explore codebase structure first
- **Cross-platform configuration examples**: Support for Claude Code, Claude Desktop, and other MCP agents

### Changed
- **Consolidated tools**: Merged `discover_files` into `analyze_with_gemini` for simpler workflow
- **Removed keyword restrictions**: Eliminated SMART_PATTERNS in favor of intelligent guidance
- **Documentation consolidation**: Merged AUTH.md and SETUP_MCP.md into README.md
- **Enhanced tool descriptions**: Focus on prompting intelligence rather than constraining behavior

### Removed
- **SMART_PATTERNS system**: Removed restrictive keyword-based file suggestions
- **discover_files tool**: Consolidated into main analysis tool
- **Redundant documentation**: Cleaned up overlapping setup files

### Fixed
- **Multi-keyword pattern matching**: Fixed break statement that limited pattern combinations
- **Process timeout protection**: Added 5-minute timeout for spawn processes
- **Portability issues**: Removed hardcoded paths and local-specific configurations

## [1.0.0] - 2025-01-02

### Added
- **Initial release**: Ultra-simple CLI tool for Gemini codebase analysis
- **@ syntax file inclusion**: Support for `@src/` `@**/*.js` patterns
- **MCP server integration**: Model Context Protocol support for AI agents
- **Analysis templates**: Security, architecture, performance, quality, debug templates
- **Semantic keywords**: Configurable aliases via `.gemini-direct.json`
- **OAuth authentication**: Seamless integration with Gemini CLI authentication
- **Cross-platform support**: Windows, macOS, Linux compatibility
- **Zero configuration**: Works immediately after Gemini CLI setup

### Technical Details
- **Core tool**: 272 lines (gemini-direct.mjs)
- **MCP wrapper**: 150 lines (mcp-server.mjs)  
- **Single dependency**: Only requires `glob` package
- **Performance**: 40ms startup vs 120s timeout of previous solutions