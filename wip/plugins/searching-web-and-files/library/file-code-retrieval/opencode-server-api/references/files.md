## TL;DR

- Search for text in files with `GET /find?pattern=<query>`
- Find files by name with `GET /find/file?query=<query>`
- Find code symbols with `GET /find/symbol?query=<query>`
- Read file contents with `GET /file/content?path=<path>`
- List directory contents with `GET /file?path=<path>`
- Get file status (tracked files) with `GET /file/status`

## File Search Operations

### Search Text in Files

`GET /find`

Searches for text patterns across all files in the project.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pattern | string | Yes | Text pattern to search for |

**Response**:
```json
[
  {
    "path": "src/auth.ts",
    "line": 42,
    "column": 10,
    "match": "async function authenticate(token: string)",
    "context": "... surrounding code ..."
  }
]
```

**Example**:
```bash
curl "http://localhost:4096/find?pattern=async%20function"
```

### Find Files and Directories

`GET /find/file`

Finds files and directories by name or pattern.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Search query (name or pattern) |
| type | string | No | Filter by type: "file" or "directory" |
| directory | string | No | Search within specific directory |
| limit | number | No | Maximum results to return |
| dirs | boolean | No | Include directories in results |

**Response**:
```json
[
  "src/auth.ts",
  "src/auth/login.ts",
  "src/auth/register.ts",
  "tests/auth.test.ts"
]
```

**Example (Find all auth files)**:
```bash
curl "http://localhost:4096/find/file?query=auth&type=file"
```

**Example (Search in specific directory)**:
```bash
curl "http://localhost:4096/find/file?query=test&directory=src&limit=10"
```

### Find Workspace Symbols

`GET /find/symbol`

Finds code symbols (functions, classes, variables) using LSP.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Symbol name to search for |

**Response**:
```json
[
  {
    "name": "authenticate",
    "kind": "Function",
    "location": {
      "uri": "file:///project/src/auth.ts",
      "range": {
        "start": {"line": 42, "character": 0},
        "end": {"line": 58, "character": 1}
      }
    },
    "containerName": "AuthService"
  }
]
```

**Example**:
```bash
curl "http://localhost:4096/find/symbol?query=UserAuth"
```

## File Operations

### List Files

`GET /file`

Lists files and directories at a path.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | string | No | Directory path (default: project root) |

**Response**:
```json
[
  {
    "name": "src",
    "type": "directory",
    "path": "src"
  },
  {
    "name": "package.json",
    "type": "file",
    "path": "package.json",
    "size": 1024
  }
]
```

**Example**:
```bash
curl "http://localhost:4096/file?path=src"
```

### Read File Content

`GET /file/content`

Reads the contents of a file.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | string | Yes | File path relative to project root |

**Response**:
```json
{
  "path": "src/auth.ts",
  "content": "import { User } from './types';

export async function authenticate...",
  "encoding": "utf-8",
  "size": 2048
}
```

**Example**:
```bash
curl "http://localhost:4096/file/content?path=src/auth.ts"
```

### Get File Status

`GET /file/status`

Returns status of tracked files (modified, added, deleted).

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | No | Filter by path pattern |

**Response**:
```json
[
  {
    "path": "src/auth.ts",
    "status": "modified",
    "tracked": true
  },
  {
    "path": "src/new-file.ts",
    "status": "added",
    "tracked": false
  }
]
```

**Example**:
```bash
curl "http://localhost:4096/file/status"
```

**Example (Filter by path)**:
```bash
curl "http://localhost:4096/file/status?query=src/auth"
```

## Common Search Patterns

### Find All TypeScript Files
```bash
curl "http://localhost:4096/find/file?query=.ts&type=file"
```

### Find Test Files
```bash
curl "http://localhost:4096/find/file?query=test&type=file"
```

### Search for TODO Comments
```bash
curl "http://localhost:4096/find?pattern=TODO:"
```

### Find Configuration Files
```bash
curl "http://localhost:4096/find/file?query=config"
```

### Find Functions Named "parse"
```bash
curl "http://localhost:4096/find/symbol?query=parse"
```

### Find All Modified Files
```bash
curl "http://localhost:4096/file/status" | jq '.[] | select(.status=="modified")'
```

## Use Cases

- Search codebase for specific patterns or implementations
- Locate files before reading or modifying them
- Find symbols (functions, classes) for refactoring
- Discover configuration files across project
- Identify recently modified files for review
- Build file explorers or navigation tools
