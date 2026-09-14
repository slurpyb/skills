## TL;DR

- Base URL: `http://localhost:4096` (default)
- Authentication: HTTP basic auth with `OPENCODE_SERVER_PASSWORD` environment variable (username: `opencode`)
- Server runs locally - do not expose to internet without proper security
- OpenAPI 3.1 spec available at `/doc` endpoint
- Supports Server-Sent Events (SSE) for real-time streaming
- All AI operations use your configured providers (Anthropic, OpenAI, etc.)

## Authentication

OpenCode Server supports optional HTTP basic authentication.

### Enabling Authentication

Set environment variables before starting the server:

```bash
# Enable basic auth with password
export OPENCODE_SERVER_PASSWORD=your-secret-password

# Optionally customize username (default: "opencode")
export OPENCODE_SERVER_USERNAME=myusername

# Start server
opencode serve
```

### Using Authentication

Include HTTP basic auth credentials in requests:

```bash
# Using curl
curl -u opencode:your-secret-password http://localhost:4096/global/health

# Using curl with URL
curl http://opencode:your-secret-password@localhost:4096/global/health
```

### Security Best Practices

- **Local Only**: By default, server binds to `127.0.0.1` (localhost only)
- **Network Access**: If using `--hostname 0.0.0.0`, always enable authentication
- **Do Not Expose**: Never expose the server to the internet without proper security measures
- **Use HTTPS**: If exposing beyond localhost, use a reverse proxy with HTTPS

## Base URL

Default base URL: `http://localhost:4096`

### Customizing Host and Port

```bash
# Command line
opencode serve --port 8080 --hostname 0.0.0.0

# Configuration file (opencode.json)
{
  "server": {
    "port": 8080,
    "hostname": "0.0.0.0"
  }
}
```

### mDNS Discovery

Enable mDNS to make server discoverable on local network:

```bash
opencode serve --mdns --mdns-domain myproject.local
# Server accessible at: http://myproject.local:4096
```

## Rate Limits

OpenCode Server itself does not impose rate limits. However, rate limits may apply from:

- **AI Provider APIs**: Each provider (Anthropic, OpenAI, etc.) has its own rate limits
- **OpenCode Zen**: If using OpenCode Zen gateway, pay-as-you-go billing with monthly limits
- **Local Resources**: CPU, memory, and disk I/O constraints on your machine

Monitor provider-specific rate limits and handle accordingly.

## Error Handling

### HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **204 No Content**: Successful request with no response body
- **400 Bad Request**: Invalid request parameters or body
- **401 Unauthorized**: Authentication required or invalid credentials
- **404 Not Found**: Resource not found (e.g., invalid session ID)
- **500 Internal Server Error**: Server error, check logs
- **503 Service Unavailable**: Server starting up or shutting down

### Error Response Format

Errors return JSON with details:

```json
{
  "error": "Session not found",
  "code": "SESSION_NOT_FOUND",
  "details": {
    "sessionId": "invalid-id"
  }
}
```

## Error Recovery

### 400 Bad Request
**Cause**: Invalid parameters, malformed JSON, or missing required fields

**Recovery**:
- Validate request body against OpenAPI schema
- Check that all required fields are present
- Ensure JSON is properly formatted
- Verify parameter types match expected types

### 401 Unauthorized
**Cause**: Authentication required or credentials invalid

**Recovery**:
- Verify `OPENCODE_SERVER_PASSWORD` is set correctly
- Check username matches `OPENCODE_SERVER_USERNAME` (default: "opencode")
- Ensure HTTP basic auth header is included in request
- Restart server if credentials were changed

### 404 Not Found
**Cause**: Resource doesn't exist (invalid session ID, file path, etc.)

**Recovery**:
- List available resources first (e.g., `/session` for sessions)
- Verify the resource ID is correct and not expired
- Check that the resource wasn't deleted
- For sessions, create a new one if needed

### 500 Internal Server Error
**Cause**: Server-side error, often related to AI provider issues or file system errors

**Recovery**:
- Check server logs with `--print-logs --log-level DEBUG`
- Verify AI provider credentials are configured correctly
- Ensure project directory has proper permissions
- Check disk space and system resources
- Try the operation again (may be transient)
- Restart server if error persists

### 503 Service Unavailable
**Cause**: Server is starting up or shutting down

**Recovery**:
- Wait a few seconds and retry
- Verify server is fully started with `/global/health`
- Check server logs for startup issues
- Ensure no conflicting process on the port

### AI Provider Errors
**Cause**: Issues with underlying AI provider (rate limits, API errors, invalid models)

**Recovery**:
- Check provider API status and rate limits
- Verify API keys are valid: `opencode auth login`
- Try a different model or provider
- Wait and retry if rate limited
- Check provider-specific error messages in response
- For OpenCode Zen: Verify billing and credits

### Session State Errors
**Cause**: Attempting operations on sessions in invalid states

**Recovery**:
- Check session status: `GET /session/:id`
- Abort running sessions before deleting: `POST /session/:id/abort`
- Create new session if current one is corrupted
- Use `/session/:id/revert` to undo problematic changes

## SDK Integration

### JavaScript/TypeScript SDK

Official SDK for Node.js and browser environments:

```bash
# Install
npm install @opencode-ai/sdk
```

**Create Client and Server**:
```javascript
import { createOpencode } from "@opencode-ai/sdk"

const { client, server } = await createOpencode({
  hostname: "127.0.0.1",
  port: 4096,
  config: {
    model: "anthropic/claude-3-5-sonnet-20241022"
  }
})

console.log(`Server running at ${server.url}`)

// Use client...

// Cleanup
server.close()
```

**Connect to Existing Server**:
```javascript
import { createOpencodeClient } from "@opencode-ai/sdk"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096"
})

// Make requests
const health = await client.global.health()
```

**Send Prompt**:
```javascript
const session = await client.session.create({
  body: { title: "My Session" }
})

const result = await client.session.prompt({
  path: { id: session.id },
  body: {
    parts: [{ type: "text", text: "Create a function to parse JSON" }],
    model: { 
      providerID: "anthropic", 
      modelID: "claude-3-5-sonnet-20241022" 
    }
  }
})
```

**Stream Events**:
```javascript
const events = await client.event.subscribe()

for await (const event of events.stream) {
  console.log("Event:", event.type, event.properties)
}
```

### Python Integration

No official Python SDK yet. Use `requests` library:

```python
import requests

BASE_URL = "http://localhost:4096"

# Create session
response = requests.post(f"{BASE_URL}/session", json={
    "title": "Python Session"
})
session = response.json()

# Send prompt
response = requests.post(
    f"{BASE_URL}/session/{session['id']}/message",
    json={
        "parts": [{"type": "text", "text": "Create a Python class"}],
        "model": {
            "providerID": "anthropic",
            "modelID": "claude-3-5-sonnet-20241022"
        }
    }
)
result = response.json()
```

### Other Languages

Use any HTTP client library. Reference the OpenAPI spec:

```bash
curl http://localhost:4096/doc
```

Generate client code using OpenAPI generators like:
- openapi-generator
- swagger-codegen
- openapi-typescript
