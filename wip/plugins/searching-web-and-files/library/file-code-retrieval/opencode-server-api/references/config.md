## TL;DR

- Get current configuration with `GET /config`
- Update configuration with `PATCH /config`
- List providers and models with `GET /config/providers`
- Manage provider authentication with `/provider` endpoints
- Get project info with `GET /project/current`
- Check server health with `GET /global/health`

## Configuration Management

### Get Configuration

`GET /config`

Returns current OpenCode configuration.

**Response**:
```json
{
  "model": "anthropic/claude-3-5-sonnet-20241022",
  "small_model": "anthropic/claude-haiku-4-5",
  "formatter": true,
  "sharing": "manual",
  "server": {
    "port": 4096,
    "hostname": "127.0.0.1"
  }
}
```

**Example**:
```bash
curl http://localhost:4096/config
```

### Update Configuration

`PATCH /config`

Updates configuration settings.

**Example**:
```bash
curl -X PATCH http://localhost:4096/config \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-opus-4-8",
    "formatter": true
  }'
```

### Get Providers

`GET /config/providers`

Lists all available providers and their default models.

**Response**:
```json
{
  "providers": [
    {
      "id": "anthropic",
      "name": "Anthropic",
      "connected": true,
      "models": ["claude-3-5-sonnet-20241022", "claude-haiku-4-5"]
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "connected": false,
      "models": ["gpt-4", "gpt-3.5-turbo"]
    }
  ],
  "default": {
    "anthropic": "claude-3-5-sonnet-20241022"
  }
}
```

**Example**:
```bash
curl http://localhost:4096/config/providers
```

## Provider Management

### List All Providers

`GET /provider`

Returns all providers with connection status.

**Response**:
```json
{
  "all": [
    {
      "id": "anthropic",
      "name": "Anthropic",
      "npm": "@ai-sdk/anthropic"
    }
  ],
  "default": {
    "anthropic": "claude-3-5-sonnet-20241022"
  },
  "connected": ["anthropic", "opencode"]
}
```

**Example**:
```bash
curl http://localhost:4096/provider
```

### Get Provider Auth Methods

`GET /provider/auth`

Returns authentication methods for all providers.

**Response**:
```json
{
  "anthropic": [
    {"type": "api", "label": "API Key"}
  ],
  "opencode": [
    {"type": "oauth", "label": "OAuth"},
    {"type": "api", "label": "API Key"}
  ]
}
```

**Example**:
```bash
curl http://localhost:4096/provider/auth
```

### Set Provider Authentication

`PUT /auth/:id`

Sets authentication credentials for a provider.

**Parameters**: Varies by provider (API key, OAuth token, etc.)

**Example (API Key)**:
```bash
curl -X PUT http://localhost:4096/auth/anthropic \
  -H "Content-Type: application/json" \
  -d '{
    "type": "api",
    "key": "sk-ant-..."
  }'
```

### OAuth Authorization

`POST /provider/:id/oauth/authorize`

Initiates OAuth flow for a provider.

**Response**:
```json
{
  "authURL": "https://provider.com/oauth/authorize?...",
  "callbackURL": "http://localhost:4096/provider/anthropic/oauth/callback"
}
```

**Example**:
```bash
curl -X POST http://localhost:4096/provider/opencode/oauth/authorize
```

### OAuth Callback

`POST /provider/:id/oauth/callback`

Handles OAuth callback and stores credentials.

**Example**:
```bash
curl -X POST http://localhost:4096/provider/opencode/oauth/callback \
  -H "Content-Type: application/json" \
  -d '{"code": "oauth-code-123"}'
```

## Project Information

### Get Current Project

`GET /project/current`

Returns information about the current project.

**Response**:
```json
{
  "name": "my-app",
  "path": "/home/user/projects/my-app",
  "type": "git",
  "language": "typescript",
  "packageManager": "npm"
}
```

**Example**:
```bash
curl http://localhost:4096/project/current
```

### List All Projects

`GET /project`

Returns all projects OpenCode has worked with.

**Example**:
```bash
curl http://localhost:4096/project
```

### Get Current Path

`GET /path`

Returns the current working directory.

**Response**:
```json
{
  "path": "/home/user/projects/my-app"
}
```

**Example**:
```bash
curl http://localhost:4096/path
```

### Get VCS Info

`GET /vcs`

Returns version control system information.

**Response**:
```json
{
  "type": "git",
  "branch": "main",
  "remote": "origin",
  "hasUncommittedChanges": true
}
```

**Example**:
```bash
curl http://localhost:4096/vcs
```

## System Information

### Check Health

`GET /global/health`

Returns server health and version.

**Response**:
```json
{
  "healthy": true,
  "version": "0.1.48"
}
```

**Example**:
```bash
curl http://localhost:4096/global/health
```

### Get Global Events

`GET /global/event`

Server-Sent Events stream for global events.

**Example**:
```bash
curl -N http://localhost:4096/global/event
```

### Dispose Instance

`POST /instance/dispose`

Shuts down the server instance.

**Example**:
```bash
curl -X POST http://localhost:4096/instance/dispose
```

## List Available Agents

### Get Agents

`GET /agent`

Returns all available agents.

**Response**:
```json
[
  {
    "id": "plan",
    "name": "Plan",
    "description": "Suggests implementation steps without making changes"
  },
  {
    "id": "build",
    "name": "Build",
    "description": "Makes code changes and executes tasks"
  }
]
```

**Example**:
```bash
curl http://localhost:4096/agent
```

## List Available Commands

### Get Commands

`GET /command`

Returns all custom and built-in commands.

**Response**:
```json
[
  {
    "name": "test",
    "description": "Run tests with coverage",
    "template": "Run the full test suite..."
  }
]
```

**Example**:
```bash
curl http://localhost:4096/command
```

## Use Cases

- Configure AI models and providers programmatically
- Authenticate with multiple AI providers
- Get project context before sending prompts
- Check server health for monitoring
- List available agents and commands for dynamic UIs
- Monitor VCS status for automated workflows
