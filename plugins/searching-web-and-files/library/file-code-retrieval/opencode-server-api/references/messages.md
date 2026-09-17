## TL;DR

- Send prompts to AI with `POST /session/:id/message` (synchronous, waits for response)
- Send async prompts with `POST /session/:id/prompt_async` (returns immediately)
- List messages with `GET /session/:id/message`
- Execute commands with `POST /session/:id/command`
- Run shell commands with `POST /session/:id/shell`
- Support for structured JSON output with schema validation

## Sending Messages and Prompts

### List Messages

`GET /session/:id/message`

Returns all messages in a session.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Maximum number of messages to return |

**Response**:
```json
[
  {
    "info": {
      "id": "msg-123",
      "sessionID": "session-456",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "parts": [
      {"type": "text", "text": "Create a function to parse JSON"}
    ]
  },
  {
    "info": {
      "id": "msg-124",
      "role": "assistant",
      "createdAt": "2024-01-15T10:30:15Z"
    },
    "parts": [
      {"type": "text", "text": "Here's a JSON parser function..."}
    ]
  }
]
```

**Example**:
```bash
curl "http://localhost:4096/session/session-123/message?limit=10"
```

### Get Message

`GET /session/:id/message/:messageID`

Returns a specific message with all its parts.

**Example**:
```bash
curl http://localhost:4096/session/session-123/message/msg-456
```

### Send Message (Synchronous)

`POST /session/:id/message`

Sends a message and waits for the AI response.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| parts | array | Yes | Array of message parts (text, image, etc.) |
| model | object | No | Override model: {providerID, modelID} |
| agent | string | No | Agent to use (plan, build, etc.) |
| messageID | string | No | Parent message ID for threading |
| noReply | boolean | No | Don't generate AI response |
| system | string | No | System prompt override |
| tools | object | No | Tool configuration |
| format | object | No | Structured output format with JSON schema |

**Example (Basic)**:
```bash
curl -X POST http://localhost:4096/session/session-123/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {"type": "text", "text": "Explain how closures work in JavaScript"}
    ]
  }'
```

**Example (With Model)**:
```bash
curl -X POST http://localhost:4096/session/session-123/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {"type": "text", "text": "Refactor @src/auth.ts to use async/await"}
    ],
    "model": {
      "providerID": "anthropic",
      "modelID": "claude-3-5-sonnet-20241022"
    },
    "agent": "build"
  }'
```

**Example (Structured Output)**:
```bash
curl -X POST http://localhost:4096/session/session-123/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {"type": "text", "text": "Analyze the tech stack of this project"}
    ],
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "languages": {"type": "array", "items": {"type": "string"}},
          "frameworks": {"type": "array", "items": {"type": "string"}},
          "packageManager": {"type": "string"}
        },
        "required": ["languages"]
      }
    }
  }'
```

### Send Message (Asynchronous)

`POST /session/:id/prompt_async`

Sends a message without waiting for response. Returns 204 immediately.

**Parameters**: Same as `/session/:id/message`

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/prompt_async \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {"type": "text", "text": "Generate tests for all utility functions"}
    ]
  }'
```

**Note**: Use `/event` endpoint to stream responses in real-time.

### Execute Command

`POST /session/:id/command`

Executes a slash command (like `/init`, `/share`, custom commands).

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| command | string | Yes | Command name (without /) |
| arguments | string | No | Command arguments |
| messageID | string | No | Parent message ID |
| agent | string | No | Agent to use |
| model | object | No | Model override |

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "test",
    "arguments": "auth",
    "agent": "build"
  }'
```

### Execute Shell Command

`POST /session/:id/shell`

Runs a shell command in the project directory.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| command | string | Yes | Shell command to execute |
| agent | string | Yes | Agent to use |
| model | object | No | Model override |

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/shell \
  -H "Content-Type: application/json" \
  -d '{
    "command": "npm test",
    "agent": "build"
  }'
```

**Response**:
```json
{
  "info": {
    "id": "msg-789",
    "role": "assistant"
  },
  "parts": [
    {
      "type": "tool_result",
      "name": "bash",
      "output": "✓ All tests passed\n  15 passing (234ms)"
    }
  ]
}
```

## Message Parts Types

### Text Part
```json
{"type": "text", "text": "Your prompt here"}
```

### Image Part
```json
{"type": "image", "url": "data:image/png;base64,..."}
```

### File Reference
Use `@` syntax in text to reference files:
```json
{"type": "text", "text": "Explain @src/auth.ts"}
```

### Tool Result Part
Generated by AI when using tools:
```json
{
  "type": "tool_result",
  "name": "bash",
  "output": "command output"
}
```

## Structured Output

Request AI responses in validated JSON format:

**Schema Definition**:
```json
{
  "format": {
    "type": "json_schema",
    "schema": {
      "type": "object",
      "properties": {
        "field1": {"type": "string", "description": "Field description"},
        "field2": {"type": "number"},
        "field3": {
          "type": "array",
          "items": {"type": "string"}
        }
      },
      "required": ["field1"]
    }
  }
}
```

The AI will return a response that conforms to the schema, validated and parsed as JSON.

## Use Cases

- Send coding prompts to AI for generation, refactoring, or analysis
- Execute shell commands (tests, builds, deployments) and get results
- Run custom slash commands for specialized workflows
- Request structured data extraction from code or documentation
- Build interactive coding workflows with sequential prompts
