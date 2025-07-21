# Security Policy

## Security Philosophy

The Gemini CLI Orchestrator follows a **pure metaprompting** philosophy that provides significant security advantages:

- **No Execution Logic**: The server contains zero command execution capabilities
- **No File Access**: The server never reads, writes, or processes files from the filesystem
- **No Network Requests**: The server makes no external API calls or network connections
- **No State Storage**: The server maintains no persistent state or user data
- **No Authentication**: The server requires no credentials, API keys, or authentication

## Architecture Security

### Server-Side Security
- **Minimal Attack Surface**: The server only returns text-based guidance
- **No Shell Execution**: All command execution is performed by the client agent
- **No File Processing**: File operations are handled entirely by the client
- **Stateless Design**: No persistent data storage or session management

### Client-Side Responsibility
- **Agent Authentication**: Agents handle their own Gemini CLI authentication
- **Command Execution**: Agents execute all bash commands using their own tools
- **File Access**: Agents manage all file system operations independently
- **API Usage**: Agents directly interface with Google's Gemini API

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by:

1. **Email**: Send details to dannygn@uci.edu
2. **GitHub**: Create a private security advisory on GitHub
3. **Response Time**: We aim to respond within 48 hours

### What to Include

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if available)

### What to Expect

- Initial response within 48 hours
- Regular updates on investigation progress
- Credit in security advisories (if desired)
- Responsible disclosure timeline coordination

## Security Best Practices for Users

### Agent Setup
- Keep your Gemini CLI updated to the latest version
- Use secure authentication methods for Gemini CLI
- Regularly rotate API keys and credentials
- Monitor your Gemini API usage and quotas

### File Handling
- Review file patterns before aggregating large contexts
- Be cautious when including sensitive files in analysis
- Use `.gitignore` patterns to exclude sensitive data
- Validate file contents before sending to Gemini

### Network Security
- Ensure HTTPS-only connections to Gemini API
- Use secure networks for sensitive analysis work
- Monitor network traffic for unusual patterns

## Threat Model

### Threats We Mitigate
- **Server-Side Code Execution**: Eliminated through pure metaprompting design
- **Credential Exposure**: No server-side credentials required
- **Data Persistence**: No data storage on server
- **Network Attacks**: No server-side network connections

### Threats Outside Our Scope
- **Prompt Injection**: Users should be aware of prompt injection risks
- **Client-Side Security**: Agent security is user's responsibility
- **Gemini API Security**: Managed by Google
- **Network Security**: User's network infrastructure
- **File System Security**: Agent's file access permissions

## Prompt Injection Risk

This server generates prompts that are executed by the Gemini CLI. Maliciously crafted inputs to this server's tools could generate prompts that cause unintended and harmful behavior.

### Mitigation Strategies
- **Input Sanitization**: Sanitize and validate all inputs to this server's tools
- **Least Privilege**: Run the Gemini CLI with the minimum required permissions
- **Monitoring**: Monitor Gemini API usage for unexpected activity
- **Review Generated Prompts**: Carefully review all prompts before execution

## Compliance

This project follows security best practices including:
- **Principle of Least Privilege**: Minimal server capabilities
- **Defense in Depth**: Multiple security layers
- **Secure by Design**: Security built into architecture
- **Zero Trust**: No implicit trust relationships

## Updates

This security policy is reviewed and updated regularly. Check the git history for the latest changes.

Last updated: [Current Date]