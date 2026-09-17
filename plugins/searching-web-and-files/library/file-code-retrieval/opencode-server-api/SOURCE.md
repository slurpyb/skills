---
name: opencode-server-api
description: Local HTTP API for programmatic control of OpenCode AI coding agent. Manage AI coding sessions, send prompts to models, search/manipulate files, execute shell commands, and stream real-time events. Use for IDE extensions, automation workflows, code review tools, and custom development integrations. Authentication via HTTP basic auth, supports structured JSON output, SSE streaming.
---

## How to Use This Skill

This skill enables Claude to interact with a local OpenCode Server API, which provides programmatic control over an AI coding agent. Use it to create and manage coding sessions, send prompts to AI models for code generation or analysis, search and manipulate project files, execute shell commands, and configure AI providers. The server runs locally (default: http://localhost:4096) and is ideal for building IDE integrations, automation workflows, or custom development tools.

## Decision Tree

1. **User wants to start/manage AI coding sessions** → Use `/session/create` or `/session/list`
2. **User wants to send a prompt to AI for code generation/analysis** → Use `/session/prompt`
3. **User wants to search for files or code** → Use `/find/files` or `/find/text` or `/find/symbols`
4. **User wants to read file contents** → Use `/file/content`
5. **User wants to execute shell commands** → Use `/session/shell`
6. **User wants to configure AI models/providers** → Use `/config/providers` or `/provider/list`
7. **User wants to check server health** → Use `/global/health`
8. **User wants to stream real-time events** → Use `/event/subscribe`
9. **User wants to get project information** → Use `/project/current`
10. **User wants to manage authentication** → Use `/auth/set`
11. **User wants to execute slash commands** → Use `/session/command`
12. **User wants to share/unshare sessions** → Use `/session/share` or `/session/unshare`

## When to Use

- Building IDE extensions that integrate AI coding assistance
- Creating automation workflows for code generation or refactoring
- Developing custom development tools that need AI capabilities
- Implementing code review automation with AI analysis
- Building CI/CD integrations that leverage AI coding agents
- Creating custom frontends or interfaces for OpenCode
- Automating repetitive coding tasks with AI assistance
- Integrating OpenCode into existing development workflows
- Building multi-agent systems that include code generation
- Creating specialized coding assistants for specific frameworks or domains

## Quick Examples

### Create a New Coding Session
```bash
curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "My Coding Session"}'
```

### Send a Prompt to AI
```bash
curl -X POST http://localhost:4096/session/SESSION_ID/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"type": "text", "text": "Explain how this authentication works @auth.ts"}],
    "model": {"providerID": "anthropic", "modelID": "claude-3-5-sonnet-20241022"}
  }'
```

### Search for Files
```bash
curl "http://localhost:4096/find/file?query=auth&type=file&limit=10"
```

## Common Workflows

### AI-Assisted Code Review Workflow
1. Use `/find/files` to locate files that changed in a PR
2. Use `/file/content` to read each file's contents
3. Use `/session/create` to create a new review session
4. Use `/session/prompt` to send files to AI for review with specific instructions
5. Parse AI response for suggestions and issues
6. Optionally use `/session/shell` to run tests or linters

### Automated Code Generation Workflow
1. Use `/project/current` to get project context
2. Use `/find/symbols` to locate relevant code structures
3. Use `/session/create` to create a generation session
4. Use `/session/prompt` with structured output format to generate code
5. Use `/file/content` to verify generated code
6. Use `/session/shell` to test the generated code
7. Use `/session/share` to share the session for team review

### Multi-File Code Analysis Workflow
1. Use `/find/text` to search for specific patterns across codebase
2. Use `/session/create` with appropriate agent configuration
3. Send multiple prompts via `/session/prompt` to analyze different aspects
4. Use `/event/subscribe` to stream real-time AI responses
5. Use `/session/summarize` to get an overall summary
6. Use `/session/export` to save analysis results

## Available References

- **references/quickstart.md**: Getting started guide with server setup, authentication, and common workflows
- **references/common.md**: Authentication, base URL, errors, rate limits, error recovery guidance
- **references/sessions.md**: Session management endpoints for creating, listing, managing AI coding sessions
- **references/messages.md**: Message and prompt endpoints for sending requests to AI and handling responses
- **references/files.md**: File operation endpoints for searching, reading, and manipulating files
- **references/config.md**: Configuration endpoints for managing settings, providers, and models
- **references/tools.md**: Tool and utility endpoints including shell execution, LSP, formatters, and MCP

## Authentication

Set the `OPENCODE_SERVER_PASSWORD` environment variable to enable HTTP basic authentication. The default username is `opencode` (customizable via `OPENCODE_SERVER_USERNAME`). Use HTTP basic auth in all requests when authentication is enabled. The server runs locally and should not be exposed to the internet without proper security measures.
