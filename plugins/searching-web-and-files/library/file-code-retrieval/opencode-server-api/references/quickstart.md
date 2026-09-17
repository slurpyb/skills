## TL;DR

- Start OpenCode server with `opencode serve` or `opencode web` (default: http://localhost:4096)
- Authenticate with HTTP basic auth if `OPENCODE_SERVER_PASSWORD` is set
- Create a session, send prompts via `/session/:id/message`, and receive AI responses
- All operations are local and use your configured AI providers
- Check `/doc` endpoint for full OpenAPI 3.1 specification

## Getting Started

OpenCode Server is a local HTTP API that exposes programmatic control over the OpenCode AI coding agent. It runs on your machine and provides REST endpoints for managing sessions, sending prompts, searching files, and executing commands.

### Installation and Setup

1. Install OpenCode (choose one method):
```bash
# Install script
curl -fsSL https://opencode.ai/install | bash

# npm
npm install -g opencode-ai

# Homebrew (macOS/Linux)
brew install anomalyco/tap/opencode

# Chocolatey (Windows)
choco install opencode
```

2. Configure AI provider credentials:
```bash
opencode auth login
# Or use the /connect command in the TUI
```

3. Start the server:
```bash
# Start server on default port 4096
opencode serve

# Start web interface (includes UI)
opencode web --port 4096

# Start with authentication
OPENCODE_SERVER_PASSWORD=secret opencode serve

# Start on specific host/port
opencode serve --hostname 0.0.0.0 --port 8080
```

### Making Your First Request

1. Check server health:
```bash
curl http://localhost:4096/global/health
```

2. List available providers:
```bash
curl http://localhost:4096/provider
```

3. Create a new session:
```bash
curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Session"}'
```

4. Send a prompt to the AI:
```bash
curl -X POST http://localhost:4096/session/SESSION_ID/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"type": "text", "text": "Create a hello world function in Python"}],
    "model": {"providerID": "anthropic", "modelID": "claude-3-5-sonnet-20241022"}
  }'
```

## Common Workflows

### 1. AI Code Generation Workflow
This workflow demonstrates generating code with AI assistance:
```bash
# Step 1: Get current project info
curl http://localhost:4096/project/current

# Step 2: Create a new session
SESSION=$(curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "Code Generation"}' | jq -r '.id')

# Step 3: Send prompt with context
curl -X POST http://localhost:4096/session/$SESSION/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{
      "type": "text", 
      "text": "Create a REST API endpoint for user authentication @src/auth/"
    }],
    "model": {"providerID": "anthropic", "modelID": "claude-3-5-sonnet-20241022"}
  }'

# Step 4: Get the diff to see changes
curl "http://localhost:4096/session/$SESSION/diff"
```

### 2. Code Search and Analysis Workflow
Search for code patterns and analyze them:
```bash
# Step 1: Search for authentication-related files
FILES=$(curl "http://localhost:4096/find/file?query=auth&type=file" | jq -r '.[]')

# Step 2: Search for specific code patterns
curl "http://localhost:4096/find/text?pattern=async%20function"

# Step 3: Find symbols in workspace
curl "http://localhost:4096/find/symbol?query=UserAuth"

# Step 4: Read file contents
curl "http://localhost:4096/file/content?path=src/auth/login.ts"

# Step 5: Create session for analysis
SESSION=$(curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "Code Analysis"}' | jq -r '.id')

# Step 6: Ask AI to analyze the code
curl -X POST http://localhost:4096/session/$SESSION/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"type": "text", "text": "Analyze authentication implementation in @src/auth/ and suggest improvements"}],
    "model": {"providerID": "anthropic", "modelID": "claude-3-5-sonnet-20241022"}
  }'
```

### 3. Automated Testing Workflow
Generate and run tests with AI:
```bash
# Step 1: Create session
SESSION=$(curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Generation"}' | jq -r '.id')

# Step 2: Generate tests
curl -X POST http://localhost:4096/session/$SESSION/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"type": "text", "text": "Generate unit tests for @src/utils/parser.ts"}],
    "model": {"providerID": "anthropic", "modelID": "claude-3-5-sonnet-20241022"}
  }'

# Step 3: Run the tests
curl -X POST http://localhost:4096/session/$SESSION/shell \
  -H "Content-Type: application/json" \
  -d '{
    "command": "npm test",
    "agent": "build"
  }'

# Step 4: If tests fail, ask AI to fix
curl -X POST http://localhost:4096/session/$SESSION/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"type": "text", "text": "Fix the failing tests"}]
  }'
```

### 4. Real-Time Event Streaming Workflow
Stream AI responses in real-time:
```bash
# Subscribe to events (Server-Sent Events)
curl -N http://localhost:4096/event

# In another terminal, send a prompt
SESSION=$(curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "Streaming Test"}' | jq -r '.id')

curl -X POST http://localhost:4096/session/$SESSION/prompt_async \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"type": "text", "text": "Explain async/await in JavaScript"}],
    "model": {"providerID": "anthropic", "modelID": "claude-3-5-sonnet-20241022"}
  }'

# Events will stream in the first terminal
```

### 5. Structured Output Workflow
Request AI responses in structured JSON format:
```bash
SESSION=$(curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "Structured Output"}' | jq -r '.id')

curl -X POST http://localhost:4096/session/$SESSION/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"type": "text", "text": "Analyze the tech stack of this project"}],
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "languages": {"type": "array", "items": {"type": "string"}},
          "frameworks": {"type": "array", "items": {"type": "string"}},
          "packageManager": {"type": "string"},
          "buildTool": {"type": "string"}
        },
        "required": ["languages", "frameworks"]
      }
    }
  }'
```
