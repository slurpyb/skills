---
name: httpx
description: Use this skill when working with HTTPX, a fully featured HTTP client for Python 3 with sync and async APIs. HTTPX provides a familiar requests-like interface with support for HTTP/1.1 and HTTP/2, connection pooling, streaming, proxies, custom transports, and comprehensive authentication and middleware capabilities.
version: 2.0.0
---

# HTTPX Skill

Use this skill when working with HTTPX, a fully featured HTTP client for Python 3 with sync and async APIs. HTTPX builds on the well-established usability of `requests` and adds HTTP/2 support, connection pooling, async, streaming, custom transports, and more.

## When to Use This Skill

Use this skill when you need to:
- Make HTTP requests in Python (sync or async)
- Migrate from `requests` to `httpx` (see compatibility notes)
- Configure clients with connection pooling, timeouts, auth, proxies, or SSL
- Stream large downloads/uploads or work with HTTP/2
- Build custom transports, mock requests for testing, or route requests
- Debug HTTPX behavior or find concrete code examples

## Installation

```bash
# Core install (requires Python 3.9+)
pip install httpx

# Optional HTTP/2 support
pip install httpx[http2]

# Optional command-line client
pip install 'httpx[cli]'

# Optional SOCKS proxy support
pip install httpx[socks]

# Optional brotli / zstandard decoders
pip install httpx[brotli,zstd]
```

## Quick Start

```python
>>> import httpx
>>> r = httpx.get('https://www.example.org/')
>>> r
<Response [200 OK]>
>>> r.status_code
200
>>> r.headers['content-type']
'text/html; charset=UTF-8'
>>> r.text
'<!doctype html>\n<html>\n<head>\n<title>Example Domain</title>...'
```

> **Important:** Top-level functions (`httpx.get`, `httpx.post`, etc.) open a new connection per request. For anything beyond experimentation, use a `Client` to enable connection pooling and HTTP/2.

## Core Workflows

### Making Requests (Top-Level API)

```python
>>> r = httpx.get('https://httpbin.org/get')
>>> r = httpx.post('https://httpbin.org/post', data={'key': 'value'})
>>> r = httpx.put('https://httpbin.org/put', data={'key': 'value'})
>>> r = httpx.delete('https://httpbin.org/delete')
>>> r = httpx.head('https://httpbin.org/get')
>>> r = httpx.options('https://httpbin.org/get')
```

> Note: `get`, `delete`, `head`, and `options` do **not** accept `content`, `files`, `data`, or `json` arguments. Use `httpx.request(...)` if you truly need a body on these methods.

### Query Parameters, Headers, and Body Types

```python
# Query parameters (list values supported)
httpx.get('https://httpbin.org/get', params={'key1': 'value1', 'key2': ['v2', 'v3']})

# Custom headers
httpx.get('https://httpbin.org/get', headers={'X-Custom': 'value'})

# Form-encoded data
httpx.post('https://httpbin.org/post', data={'key': 'value'})

# JSON body
httpx.post('https://httpbin.org/post', json={'key': 'value'})

# Raw binary/text content (preferred over data= for non-form bodies)
httpx.post('https://httpbin.org/post', content=b'raw bytes')

# Multipart file uploads (open files in BINARY mode)
files = {'upload-file': open('report.xls', 'rb')}
httpx.post('https://httpbin.org/post', files=files)

# Explicit filename and content type
files = {'upload-file': ('report.xls', open('report.xls', 'rb'), 'application/vnd.ms-excel')}
```

### Reading Responses

```python
r.text            # Decoded unicode text
r.content         # Raw bytes (gzip/deflate auto-decoded; brotli/zstd if installed)
r.json()          # Parsed JSON
r.encoding        # Encoding used for .text
r.status_code     # e.g. 200
r.headers         # Case-insensitive dict-like
r.cookies         # dict-like cookie store
r.history         # List of followed redirect responses
r.http_version    # "HTTP/1.0", "HTTP/1.1", or "HTTP/2"
r.url             # A URL instance (use str(r.url) for a string)

# Raise on 4xx/5xx, returns response inline on success
r.raise_for_status()
data = httpx.get('https://example.org/').raise_for_status().json()
```

## Using a Client (Recommended)

A `Client` enables connection pooling, HTTP/2, cookie persistence, and shared configuration. It is the HTTPX equivalent of `requests.Session`.

```python
# Recommended: context-managed
with httpx.Client() as client:
    r = client.get('https://example.com')

# Or explicit close
client = httpx.Client()
try:
    r = client.get('https://example.com')
finally:
    client.close()
```

### Shared Configuration

```python
client = httpx.Client(
    base_url="https://api.example.com",
    headers={"X-Custom": "value"},
    timeout=10.0,
    follow_redirects=True,
)
r = client.get("/users")  # Resolves to https://api.example.com/users
```

Request-level options merge with client-level ones. For dictionary-style settings (headers, params, cookies) they merge; for primitives the request value overrides. For finer control, build requests explicitly.

### Explicit Request Instances

```python
request = client.build_request("GET", "https://example.com")
# ...modify request as needed...
response = client.send(request)
```

> `httpx.Request()` does **not** accept `auth`, `timeout`, `follow_redirects`, `mounts`, `verify`, or `cert`. Those belong on the client or top-level functions.

## Async Support

```python
import httpx

async def main():
    async with httpx.AsyncClient() as client:
        r = await client.get('https://www.example.com/')
        print(r)

# Run with: python -m asyncio  (or inside an event loop)
```

Key async differences:
- All request methods are awaitable: `await client.get(...)`
- Close with `await client.aclose()`
- Streaming uses `aiter_bytes()`, `aiter_text()`, `aiter_lines()`
- Streaming request bodies use **async** byte generators
- Use `httpx.AsyncHTTPTransport` for explicit transports
- Event hooks **must** be `async def` functions
- Avoid creating clients inside hot loops — reuse a single scoped/global client
- Supported backends: asyncio, trio, or anyio (auto-detected)

```python
async with httpx.AsyncClient() as client:
    async with client.stream('GET', 'https://www.example.com/') as response:
        async for chunk in response.aiter_bytes():
            ...
```

## HTTP/2

```python
# Requires: pip install httpx[http2]
client = httpx.AsyncClient(http2=True)
response = await client.get(...)
print(response.http_version)  # "HTTP/1.0", "HTTP/1.1", or "HTTP/2"
```

HTTP/2 is most beneficial in async contexts with highly concurrent requests. Both client and server must support it; otherwise HTTP/1.1 is used.

## Streaming

Use `.stream()` instead of `requests`-style `stream=True`. This guarantees responses are properly closed.

```python
with httpx.stream("GET", "https://www.example.com") as response:
    for chunk in response.iter_bytes():
        ...
    # Also: iter_text(), iter_lines(), iter_raw() (raw = no content decoding)
```

Inside a stream block, `response.content` and `response.text` are unavailable. Monitor downloads via `response.num_bytes_downloaded`.

For manual streaming (e.g. forwarding to a web endpoint), use `client.send(request, stream=True)` and ensure you call `response.close()` / `await response.aclose()` yourself.

## Timeouts

HTTPX enforces a default **5 second** timeout on network inactivity (unlike `requests`, which has none).

```python
# Per-request
httpx.get('http://example.com/', timeout=10.0)
httpx.get('http://example.com/', timeout=None)   # Disable

# Client default
client = httpx.Client(timeout=10.0)
client = httpx.Client(timeout=None)              # Matches requests' default behavior

# Fine-grained: connect, read, write, pool
timeout = httpx.Timeout(10.0, connect=60.0)
client = httpx.Client(timeout=timeout)
```

## Authentication

```python
# Basic auth
auth = httpx.BasicAuth(username="username", password="secret")
client = httpx.Client(auth=auth)              # Client-wide
httpx.get("https://example.com", auth=auth)   # Per-request
httpx.get("https://example.com", auth=("user", "pass"))  # 2-tuple shortcut

# Digest auth (challenge-response, adds a round-trip)
auth = httpx.DigestAuth(username="olivia", password="secret")

# NetRC auth
auth = httpx.NetRCAuth()                       # ~/.netrc
auth = httpx.NetRCAuth(file="/path/to/.netrc") # explicit path
```

### Custom Auth Flows

Subclass `httpx.Auth` and implement `auth_flow(request)`, yielding requests:

```python
class MyAuth(httpx.Auth):
    def auth_flow(self, request):
        request.headers["Authorization"] = "..."
        yield request
```

- Set `requires_request_body = True` to access `request.content`
- Set `requires_response_body = True` to access response body
- For I/O (caches, locks), override `sync_auth_flow()` / `async_auth_flow()` instead of `auth_flow()`

## Proxies

```python
# Route all traffic through a proxy
with httpx.Client(proxy="http://localhost:8030") as client:
    ...

# With credentials in the userinfo
with httpx.Client(proxy="http://username:password@localhost:8030") as client:
    ...

# Different proxies per scheme via mounts
proxy_mounts = {
    "http://": httpx.HTTPTransport(proxy="http://localhost:8030"),
    "https://": httpx.HTTPTransport(proxy="http://localhost:8031"),
}
with httpx.Client(mounts=proxy_mounts) as client:
    ...
```

> For the `https://` key, the proxy URL usually still uses the `http://` scheme. SOCKS proxies require `pip install httpx[socks]`. Environment variables `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, `NO_PROXY` are respected.

## SSL / TLS

```python
# Default: verification enabled (uses certifi CA bundle)
httpx.get("https://expired.badssl.com/")  # raises httpx.ConnectError

# Disable verification (insecure)
httpx.get("https://expired.badssl.com/", verify=False)

# Custom SSL context
import certifi, ssl, httpx
ctx = ssl.create_default_context(cafile=certifi.where())
client = httpx.Client(verify=ctx)

# Use system certificate stores via truststore
import truststore
ctx = truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
client = httpx.Client(verify=ctx)

# Client-side certificates
ctx.load_cert_chain(certfile="client.pem")
```

> When using a `Client`, always pass `verify=...` at instantiation, not per-request. Use separate clients for differing SSL configs. `SSL_CERT_FILE` and `SSL_CERT_DIR` env vars are honored.

## Transports & Routing

`Client(transport=...)` lets you customize how requests are sent.

```python
# Bind to a local address
transport = httpx.HTTPTransport(local_address="0.0.0.0")
client = httpx.Client(transport=transport)

# Connection retries (on ConnectError / ConnectTimeout)
transport = httpx.HTTPTransport(retries=1)

# Unix Domain Socket (e.g. Docker)
transport = httpx.HTTPTransport(uds="/var/run/docker.sock")
client = httpx.Client(transport=transport)
client.get("http://docker/info").json()
```

### WSGI / ASGI In-Process Testing

```python
# WSGI (Flask, etc.)
transport = httpx.WSGITransport(app=app)
with httpx.Client(transport=transport, base_url="http://testserver") as client:
    r = client.get("/")

# ASGI (Starlette, FastAPI, etc.)
transport = httpx.ASGITransport(app=app)
async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
    r = await client.get("/")
```

> HTTPX does not trigger ASGI lifespan events; use `LifespanManager` from `asgi-lifespan` if needed.

### Mocking Transports for Tests

```python
def handler(request):
    return httpx.Response(200, json={"text": "hello"})

transport = httpx.MockTransport(handler)
client = httpx.Client(transport=transport)
```

For richer mocking, use the third-party libraries **RESPX** or **pytest-httpx**.

### Mounting & Routing

`mounts` maps URL patterns to transports, matched most-specific first. Use `None` to exclude a route from proxying. Patterns can be by scheme (`"https://"`), domain (`"all://example.com"`), subdomain, or port.

## Extensions

Request/response extensions provide an untyped space for transport-specific features.

```python
# Per-request timeout extension (normally use the timeout API instead)
client.get("https://example.com", extensions={"timeout": {"connect": 5.0, "pool": 10.0}})

# Connect to an explicit IP while validating a given hostname
client.get(
    "https://185.199.108.153/path",
    headers={"Host": "www.encode.io"},
    extensions={"sni_hostname": "www.encode.io"},
)

# Trace internal httpcore events (use async def for async clients)
def log(event_name, info):
    print(event_name, info)
client.get("https://www.example.com/", extensions={"trace": log})

# Response extensions
response.extensions["http_version"]   # b"HTTP/1.1"
response.extensions["reason_phrase"]  # b"OK"
response.extensions["stream_id"]      # HTTP/2 only
response.extensions["network_stream"] # CONNECT / Upgrade handling
```

## Event Hooks

Install client-wide logging, monitoring, or response processing. Hooks may inspect (but not mutate, in async note) request/response objects and are set as lists of callables.

```python
def log_request(request):
    print(f"Request: {request.method} {request.url}")

def log_response(response):
    request = response.request
    print(f"Response: {request.method} {request.url} - {response.status_code}")

def raise_on_4xx_5xx(response):
    response.raise_for_status()

client = httpx.Client(event_hooks={
    'request': [log_request],
    'response': [log_response, raise_on_4xx_5xx],
})

# Inspect/modify after creation
client.event_hooks['response'] = [log_response, raise_on_4xx_5xx]
```

> Response hooks run before the body is read; call `response.read()` (or `await response.aread()`) inside the hook if you need the body. For `AsyncClient`, hooks must be `async def`.

## Resource Limits

```python
limits = httpx.Limits(max_keepalive_connections=5, max_connections=10)
client = httpx.Client(limits=limits)
```

## Text Encodings

`response.text` decodes using the `Content-Type` charset, falling back to UTF-8.

```python
# Explicit default when servers omit charset
client = httpx.Client(default_encoding="shift-jis")

# Auto-detection via a callable (requires chardet or charset_normalizer)
import chardet
def autodetect(content):
    return chardet.detect(content).get("encoding")
client = httpx.Client(default_encoding=autodetect)
```

## Migrating from `requests`

Key differences to watch for:

| Topic | requests | httpx |
|-------|----------|-------|
| Session class | `requests.Session()` | `httpx.Client()` |
| Redirects | Followed by default | **Not** followed by default; use `follow_redirects=True` |
| Timeouts | None by default | 5s default; use `timeout=None` to disable |
| Next redirect | `response.next` | `response.next_request` |
| Streaming | `stream=True` | `.stream()` context block |
| Response URL | string | `URL` instance (use `str(r.url)`) |
| Raw/binary body | `data=` | `content=` (data= for forms only) |
| Upload file mode | text or binary | **binary only** |
| str body encoding | latin1 | utf-8 |
| Proxy config | `proxies={"http": ...}` | `mounts={"http://": ...}` or `proxy=...` |
| OK check | `response.is_ok` | `response.is_success` |
| Prepared requests | yes | use `build_request()` / `Request` |
| Networking core | urllib3 | httpcore |
| `params={"foo": None}` | omitted | not supported (don't pass None) |
| List params/data | list of tuples | dict with list values |
| Caching | cachecontrol/requests-cache | Hishel |
| Mocking | responses/requests-mock | RESPX / pytest-httpx |

Cookies should be set on the client (not per-request) for predictable persistence across redirects.

## Status Codes & Exceptions

```python
import httpx

# Status code helpers
r.status_code == httpx.codes.OK         # uppercase preferred
r.status_code == httpx.codes.NOT_FOUND

# Exception hierarchy
try:
    r = httpx.get("https://example.com")
    r.raise_for_status()
except httpx.HTTPError as exc:           # base class for both categories
    ...
except httpx.RequestError as exc:        # request never completed (.request)
    ...
except httpx.HTTPStatusError as exc:     # 4xx/5xx (.request and .response)
    ...
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **getting_started.md** — Overview, installation, and QuickStart (requests, params, content types, streaming, cookies, redirects, timeouts, auth, exceptions)
- **core_concepts.md** — Clients, Async, HTTP/2, Authentication, Proxies, Transports & Routing, SSL, Timeouts, Event Hooks, Extensions, Resource Limits, Requests Compatibility Guide, Developer Interface/API reference
- **other.md** — Text encoding behavior and auto-detection

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### Start Here
For foundational usage, read `getting_started.md` (QuickStart). Then use the Quick Start and Core Workflows sections above.

### For Specific Features
- **Clients, Async, HTTP/2, Auth, Proxies, SSL, Transports, Timeouts, Hooks, Extensions** → `core_concepts.md`
- **API/parameter reference** → Developer Interface section in `core_concepts.md`
- **Encoding issues** → `other.md`

### For Code Examples
Use the inline examples above first, then open the matching reference file for full context and additional variations.

## Notes

- This skill was assembled from the official HTTPX documentation (python-httpx.org)
- Reference files preserve the structure and examples from source docs
- HTTPX requires Python 3.9+
- Prefer `Client`/`AsyncClient` over top-level functions for real workloads

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information