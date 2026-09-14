## TL;DR

- Get tool IDs with `GET /experimental/tool/ids`
- List tools for a model with `GET /experimental/tool?provider=X&model=Y`
- Check LSP server status with `GET /lsp`
- Check formatter status with `GET /formatter`
- Manage MCP servers with `GET /mcp` and `POST /mcp`
- Stream events with `GET /event`
- Control TUI programmatically with `/tui/*` endpoints

## Experimental Tool APIs

### List Tool IDs

`GET /experimental/tool/ids`

Returns all available tool IDs.

**Response**:
```json
{
  "toolIDs": ["bash", "read", "edit", "grep", "glob", "webfetch", "websearch", "task", "lsp"]
}
```

**Example**:
```bash
curl http://localhost:4096/experimental/tool/ids
```

### List Tools for Model

`GET /experimental/tool`

Returns tools with JSON schemas for a specific model.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider | string | Yes | Provider ID |
| model | string | Yes | Model ID |

**Example**:
```bash
curl "http://localhost:4096/experimental/tool?provider=anthropic&model=claude-3-5-sonnet-20241022"
```

## LSP (Language Server Protocol)

### Get LSP Status

`GET /lsp`

Returns status of all LSP servers.

**Response**:
```json
[
  {
    "language": "typescript",
    "status": "running",
    "capabilities": ["completion", "diagnostics", "hover"]
  },
  {
    "language": "python",
    "status": "stopped"
  }
]
```

**Example**:
```bash
curl http://localhost:4096/lsp
```

## Code Formatters

### Get Formatter Status

`GET /formatter`

Returns status of all code formatters.

**Response**:
```json
[
  {
    "name": "prettier",
    "enabled": true,
    "extensions": [".js", ".ts", ".jsx", ".tsx"],
    "available": true
  },
  {
    "name": "ruff",
    "enabled": true,
    "extensions": [".py"],
    "available": false
  }
]
```

**Example**:
```bash
curl http://localhost:4096/formatter
```

## MCP (Model Context Protocol) Servers

### Get MCP Status

`GET /mcp`

Returns status of all MCP servers.

**Response**:
```json
{
  "filesystem": {
    "status": "connected",
    "capabilities": ["read", "write"]
  },
  "github": {
    "status": "disconnected"
  }
}
```

**Example**:
```bash
curl http://localhost:4096/mcp
```

### Add MCP Server

`POST /mcp`

Dynamically adds an MCP server.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Server name |
| config | object | Yes | Server configuration |

**Example**:
```bash
curl -X POST http://localhost:4096/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "custom-server",
    "config": {
      "command": "node",
      "args": ["server.js"]
    }
  }'
```

## Event Streaming

### Subscribe to Events

`GET /event`

Server-Sent Events (SSE) stream for real-time updates.

**Event Types**:
- `session.created`: New session created
- `session.updated`: Session updated
- `session.deleted`: Session deleted
- `message.created`: New message in session
- `message.updated`: Message updated
- `file.changed`: File modified
- `tool.executed`: Tool executed
- `error`: Error occurred

**Example**:
```bash
curl -N http://localhost:4096/event
```

**Example (JavaScript)**:
```javascript
const eventSource = new EventSource('http://localhost:4096/event');

eventSource.addEventListener('message.created', (event) => {
  const data = JSON.parse(event.data);
  console.log('New message:', data);
});

eventSource.addEventListener('error', (event) => {
  console.error('Error:', event);
});
```

## TUI Control

These endpoints programmatically control the Terminal User Interface.

### Append to Prompt

`POST /tui/append-prompt`

Appends text to the TUI prompt input.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Text to append |

**Example**:
```bash
curl -X POST http://localhost:4096/tui/append-prompt \
  -H "Content-Type: application/json" \
  -d '{"text": "Explain this code: "}'
```

### Submit Prompt

`POST /tui/submit-prompt`

Submits the current TUI prompt.

**Example**:
```bash
curl -X POST http://localhost:4096/tui/submit-prompt
```

### Clear Prompt

`POST /tui/clear-prompt`

Clears the TUI prompt input.

**Example**:
```bash
curl -X POST http://localhost:4096/tui/clear-prompt
```

### Open Help

`POST /tui/open-help`

Opens the help dialog in TUI.

**Example**:
```bash
curl -X POST http://localhost:4096/tui/open-help
```

### Open Sessions

`POST /tui/open-sessions`

Opens the session selector in TUI.

**Example**:
```bash
curl -X POST http://localhost:4096/tui/open-sessions
```

### Open Themes

`POST /tui/open-themes`

Opens the theme selector in TUI.

**Example**:
```bash
curl -X POST http://localhost:4096/tui/open-themes
```

### Open Models

`POST /tui/open-models`

Opens the model selector in TUI.

**Example**:
```bash
curl -X POST http://localhost:4096/tui/open-models
```

### Execute Command

`POST /tui/execute-command`

Executes a command in the TUI.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| command | string | Yes | Command to execute |

**Example**:
```bash
curl -X POST http://localhost:4096/tui/execute-command \
  -H "Content-Type: application/json" \
  -d '{"command": "/share"}'
```

### Show Toast

`POST /tui/show-toast`

Shows a toast notification in TUI.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| message | string | Yes | Toast message |
| title | string | No | Toast title |
| variant | string | No | Toast style: "info", "success", "warning", "error" |

**Example**:
```bash
curl -X POST http://localhost:4096/tui/show-toast \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Success",
    "message": "Task completed",
    "variant": "success"
  }'
```

### TUI Control Request/Response

`GET /tui/control/next` and `POST /tui/control/response`

Advanced control flow for custom TUI integrations. Used for building custom prompts and dialogs.

**Example (Wait for next control request)**:
```bash
curl http://localhost:4096/tui/control/next
```

**Example (Respond to control request)**:
```bash
curl -X POST http://localhost:4096/tui/control/response \
  -H "Content-Type: application/json" \
  -d '{"body": {"selection": "option1"}}'
```

## Logging

### Write Log Entry

`POST /log`

Writes a log entry to the server logs.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| service | string | Yes | Service name |
| level | string | Yes | Log level: "DEBUG", "INFO", "WARN", "ERROR" |
| message | string | Yes | Log message |
| extra | object | No | Additional log data |

**Example**:
```bash
curl -X POST http://localhost:4096/log \
  -H "Content-Type: application/json" \
  -d '{
    "service": "my-integration",
    "level": "INFO",
    "message": "Integration task completed",
    "extra": {"taskId": "123"}
  }'
```

## Use Cases

- Stream real-time AI responses and file changes
- Monitor LSP and formatter status for IDE features
- Programmatically control TUI for automation
- Build custom integrations with MCP servers
- Log custom integration events for debugging
- Create custom tools and check availability for models
