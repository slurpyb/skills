## TL;DR

- Sessions represent AI coding conversations with full context and history
- Create sessions with `POST /session`, list with `GET /session`
- Each session has a unique ID used for all subsequent operations
- Sessions can be forked, shared, summarized, and reverted
- Use `GET /session/:id/children` for hierarchical session trees

## Session Management

Sessions are the core concept in OpenCode Server. Each session represents an AI-powered coding conversation with full context, history, and state.

### List Sessions

`GET /session`

Returns all sessions.

**Response**:
```json
[
  {
    "id": "session-123",
    "title": "My Coding Session",
    "parentID": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
]
```

**Example**:
```bash
curl http://localhost:4096/session
```

### Create Session

`POST /session`

Creates a new session.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| parentID | string | No | Parent session ID for creating child sessions |
| title | string | No | Session title |

**Example**:
```bash
curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "Refactoring Authentication"}'
```

### Get Session

`GET /session/:id`

Returns session details.

**Example**:
```bash
curl http://localhost:4096/session/session-123
```

### Update Session

`PATCH /session/:id`

Updates session properties.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | No | New session title |

**Example**:
```bash
curl -X PATCH http://localhost:4096/session/session-123 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### Delete Session

`DELETE /session/:id`

Deletes a session and all its data.

**Example**:
```bash
curl -X DELETE http://localhost:4096/session/session-123
```

### Get Session Status

`GET /session/status`

Returns status for all sessions (running, idle, error).

**Response**:
```json
{
  "session-123": {
    "status": "running",
    "currentMessage": "msg-456"
  }
}
```

**Example**:
```bash
curl http://localhost:4096/session/status
```

### Get Child Sessions

`GET /session/:id/children`

Returns child sessions (forked or created from parent).

**Example**:
```bash
curl http://localhost:4096/session/session-123/children
```

### Fork Session

`POST /session/:id/fork`

Creates a new session branching from a specific message.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| messageID | string | No | Message ID to fork from (defaults to last message) |

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/fork \
  -H "Content-Type: application/json" \
  -d '{"messageID": "msg-456"}'
```

### Abort Session

`POST /session/:id/abort`

Stops a running session immediately.

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/abort
```

### Share Session

`POST /session/:id/share`

Creates a public shareable link for the session.

**Response**:
```json
{
  "id": "session-123",
  "shareURL": "https://opncd.ai/s/abc123",
  "shared": true
}
```

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/share
```

### Unshare Session

`DELETE /session/:id/share`

Removes public access and deletes shared data.

**Example**:
```bash
curl -X DELETE http://localhost:4096/session/session-123/share
```

### Initialize Project

`POST /session/:id/init`

Analyzes project and creates AGENTS.md file with project context.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| messageID | string | No | Message ID to associate with init |
| providerID | string | Yes | AI provider ID |
| modelID | string | Yes | Model ID |

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/init \
  -H "Content-Type: application/json" \
  -d '{
    "providerID": "anthropic",
    "modelID": "claude-3-5-sonnet-20241022"
  }'
```

### Summarize Session

`POST /session/:id/summarize`

Creates a summary of the session conversation.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| providerID | string | Yes | AI provider ID |
| modelID | string | Yes | Model ID |

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "providerID": "anthropic",
    "modelID": "claude-haiku-4-5"
  }'
```

### Get Diff

`GET /session/:id/diff`

Returns file changes made in the session.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| messageID | string | No | Get diff up to specific message |

**Response**:
```json
[
  {
    "path": "src/auth.ts",
    "status": "modified",
    "additions": 15,
    "deletions": 3,
    "diff": "... unified diff format ..."
  }
]
```

**Example**:
```bash
curl "http://localhost:4096/session/session-123/diff?messageID=msg-456"
```

### Revert Changes

`POST /session/:id/revert`

Reverts changes from a specific message.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| messageID | string | Yes | Message ID to revert |
| partID | string | No | Specific part to revert |

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/revert \
  -H "Content-Type: application/json" \
  -d '{"messageID": "msg-456"}'
```

### Unrevert Changes

`POST /session/:id/unrevert`

Restores all previously reverted messages.

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/unrevert
```

### Get Todo List

`GET /session/:id/todo`

Returns the todo list for the session.

**Example**:
```bash
curl http://localhost:4096/session/session-123/todo
```

### Handle Permissions

`POST /session/:id/permissions/:permissionID`

Responds to a permission request from the AI.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| response | string | Yes | "allow" or "deny" |
| remember | boolean | No | Remember choice for future |

**Example**:
```bash
curl -X POST http://localhost:4096/session/session-123/permissions/perm-789 \
  -H "Content-Type: application/json" \
  -d '{"response": "allow", "remember": true}'
```

## Use Cases

- Create separate sessions for different coding tasks or features
- Fork sessions to explore alternative implementations
- Share sessions with team members for code review or collaboration
- Summarize long sessions to create documentation or reports
