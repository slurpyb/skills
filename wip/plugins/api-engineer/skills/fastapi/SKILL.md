---
name: fastapi
description: Complete FastAPI knowledge combining official documentation and FastAPI codebase. Use when building FastAPI applications, defining routes and path operations, working with Pydantic models, handling dependencies and security, async patterns, testing, deployment, or any FastAPI feature.
version: 2.0.0
---

# FastAPI Skill

Complete FastAPI knowledge combining official documentation and the FastAPI codebase. Use when building FastAPI applications, understanding async patterns, working with Pydantic models, configuring dependency injection, implementing security/authentication, testing, or deploying FastAPI apps.

## When to Use This Skill

Use this skill when you need to:
- Build or modify FastAPI applications (routes, path operations, request/response handling)
- Define and validate data with Pydantic models (request bodies, response models, query/path/header/cookie params)
- Implement dependency injection (`Depends`, sub-dependencies, dependencies with `yield`, scopes)
- Add security and authentication (OAuth2, JWT, HTTP Basic, API keys, scopes)
- Work with async/await and understand concurrency vs. parallelism in FastAPI
- Stream data (JSON Lines, Server-Sent Events, binary streaming)
- Test FastAPI apps (`TestClient`, async tests, dependency overrides)
- Deploy FastAPI apps (Uvicorn, Docker, workers, HTTPS, behind a proxy)
- Customize OpenAPI, docs UIs, responses, middleware, and more
- Find concrete code examples before implementing or debugging

## Quick Start

The simplest FastAPI app:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
 return {"message": "Hello World"}
```

Run it with the FastAPI CLI:

```bash
fastapi dev main.py # development, with auto-reload
fastapi run main.py # production
```

Install FastAPI (always quote `fastapi[standard]`):

```bash
pip install "fastapi[standard]"
```

Interactive docs are automatically available at `/docs` (Swagger UI) and `/redoc` (ReDoc). The OpenAPI schema is at `/openapi.json`.

## Core Concepts Cheat Sheet

### Path Operations and Parameters

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}") # path parameter (typed -> validated/converted)
async def read_item(item_id: int, q: str | None = None): # q is a query parameter
 return {"item_id": item_id, "q": q}
```

- **Path params**: declared in the path string and as typed function args.
- **Query params**: function args not in the path. Defaults make them optional; no default makes them required.
- **Order matters**: declare fixed paths (`/users/me`) before variable paths (`/users/{user_id}`).
- Use `Enum` subclasses (inheriting `str, Enum`) for predefined path values.

### Request Body with Pydantic

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
 name: str
 description: str | None = None
 price: float
 tax: float | None = None

app = FastAPI()

@app.post("/items/")
async def create_item(item: Item):
 return item
```

Use POST/PUT/PATCH/DELETE for bodies. Combine path + query + body freely; FastAPI infers each from its declaration.

### Validation and Metadata

Use `Query`, `Path`, `Body`, `Header`, `Cookie`, `Form`, `File` (functions from `fastapi`) and `Field` (from `pydantic`) — prefer the `Annotated` style:

```python
from typing import Annotated
from fastapi import FastAPI, Query, Path

app = FastAPI()

@app.get("/items/")
async def read_items(
 q: Annotated[str | None, Query(max_length=50, min_length=3, pattern="^fixedquery$")] = None,
):
 return {"q": q}

@app.get("/items/{item_id}")
async def read_item(item_id: Annotated[int, Path(title="Item ID", ge=1)]):
 return {"item_id": item_id}
```

Numeric constraints: `gt`, `ge`, `lt`, `le`. String constraints: `min_length`, `max_length`, `pattern`. For custom checks, use Pydantic's `AfterValidator` inside `Annotated`.

You can group related Query/Cookie/Header params into a Pydantic model and declare with `Query()`/`Cookie()`/`Header()`. Use `model_config = {"extra": "forbid"}` to reject extras.

### Response Model

```python
@app.post("/items/")
async def create_item(item: Item) -> Item: # return type annotation = response model
 return item
```

- Use `response_model=...` in the decorator when the return type differs from the model used for serialization/filtering (e.g. to strip a password field).
- `response_model` takes priority over return type annotation.
- Use class inheritance (e.g. `BaseUser` -> `UserIn`) to get tooling support AND data filtering.
- `response_model_exclude_unset=True` omits default values not explicitly set.
- `response_model=None` disables response model generation.
- Declaring a return type/response model gives best JSON performance (Pydantic serializes to bytes in Rust).

### Status Codes

```python
from fastapi import FastAPI, status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(name: str):
 return {"name": name}
```

Use the named constants in `fastapi.status` for readability.

## Async and Concurrency

- Use `async def` for path operations that `await` async libraries.
- Use plain `def` when calling blocking libraries (most DB libraries); FastAPI runs `def` path operations in a threadpool automatically.
- You can mix `async def` and `def` freely. When unsure, use `def`.
- `await` can only be used inside `async def`.
- The same rules apply to dependencies: `def` dependencies run in the threadpool.
- FastAPI excels at concurrency (I/O-bound waiting) like web APIs, and supports parallelism/multiprocessing for CPU-bound work (e.g. ML).

```python
@app.get("/")
async def read_results():
 results = await some_library()
 return results
```

## Dependency Injection

```python
from typing import Annotated
from fastapi import Depends, FastAPI

app = FastAPI()

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
 return {"q": q, "skip": skip, "limit": limit}

CommonsDep = Annotated[dict, Depends(common_parameters)]

@app.get("/items/")
async def read_items(commons: CommonsDep):
 return commons
```

- A dependency is any callable (function or class). Pass it to `Depends()` without calling it.
- Classes can be dependencies; FastAPI uses `__init__` parameters. Shortcut: `commons: Annotated[CommonQueryParams, Depends()]`.
- **Sub-dependencies**: dependencies can depend on other dependencies; results are cached per-request (disable with `Depends(use_cache=False)`).
- **Dependencies in decorators**: use `dependencies=[Depends(...)]` in the path operation decorator when you don't need the return value.
- **Global dependencies**: `FastAPI(dependencies=[Depends(...)])` applies to all path operations.
- **Dependency overrides**: `app.dependency_overrides[original] = override` for testing.

### Dependencies with `yield`

```python
async def get_db():
 db = DBSession()
 try:
 yield db
 finally:
 db.close()
```

- Code before `yield` runs before the response; code after `yield` runs after (cleanup).
- Use `try/except/finally` to handle exceptions. **Always re-raise** caught exceptions (unless raising a new `HTTPException`/similar) so FastAPI/logs see them.
- Sub-dependencies with `yield` run exit code in correct order.
- **Scope** (`Depends(scope="function")` vs default `"request"`): `"function"` closes the dependency right after the path operation returns, before the response is sent; `"request"` (default) closes after the response is sent. A `"request"`-scoped dependency requires sub-dependencies to also be `"request"`-scoped.

## Security

```python
from typing import Annotated
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
 return {"token": token}
```

- **OAuth2 password flow + JWT**: use `OAuth2PasswordRequestForm`, `OAuth2PasswordBearer`, PyJWT, and pwdlib (`PasswordHash.recommended()` — Argon2) for password hashing.
- **Get current user**: build a `get_current_user` dependency that decodes the token and returns a Pydantic `User` model; chain `get_current_active_user` to check `disabled`.
- **Always hash passwords** (never store plaintext). Use `secrets.compare_digest()` for HTTP Basic to avoid timing attacks.
- **Scopes**: use `Security(dependency, scopes=[...])` and `SecurityScopes` for fine-grained OAuth2 permissions integrated with OpenAPI.
- **API keys / HTTP Basic / HTTP Bearer**: available in `fastapi.security`.
- Since FastAPI 0.122.0, security utilities return `401 Unauthorized` (not `403`) on auth failure, with a `WWW-Authenticate` header. Override `make_not_authenticated_error` to revert to `403`.

Install: `pip install pyjwt "pwdlib[argon2]" python-multipart`.

## Handling Errors

```python
from fastapi import FastAPI, HTTPException

@app.get("/items/{item_id}")
async def read_item(item_id: str):
 if item_id not in items:
 raise HTTPException(status_code=404, detail="Item not found", headers={"X-Error": "..."})
 return {"item": items[item_id]}
```

- `raise` (don't return) `HTTPException`. `detail` can be any JSON-able value.
- Custom handlers: `@app.exception_handler(SomeException)`.
- Override defaults for `RequestValidationError` and Starlette's `HTTPException`.
- FastAPI's `HTTPException` accepts JSON-able `detail`; register handlers against Starlette's `HTTPException`.

## Streaming and Background Tasks

- **JSON Lines** (`tutorial/stream-json-lines`): `yield` Pydantic models; declare return type `AsyncIterable[Item]` for validation/serialization. Content type `application/jsonl`.
- **Server-Sent Events** (`tutorial/server-sent-events`): `response_class=EventSourceResponse` from `fastapi.sse`; `yield` items or `ServerSentEvent` objects. Supports `Last-Event-ID` resume and works over POST.
- **Binary/string streaming** (`advanced/stream-data`): `response_class=StreamingResponse`; create custom subclasses (e.g. set `media_type="image/png"`).
- **Background tasks**: declare a `BackgroundTasks` parameter and call `background_tasks.add_task(func, *args, **kwargs)`. Works in path operations and dependencies. For heavy/distributed work, use Celery.

## Bigger Applications

- Use `APIRouter` (a "mini FastAPI") to split routes across files. Think of it as Flask Blueprints.
- Include with `app.include_router(router, prefix="/items", tags=["items"], dependencies=[...], responses={...})`.
- Routers can include other routers via `router.include_router(other_router)`.
- Configure the app entrypoint in `pyproject.toml` so `fastapi` CLI, the VS Code extension, and FastAPI Cloud can find it:

 ```toml
 [tool.fastapi]
 app = "app.main:app"
 ```

- Don't mutate `router.routes` directly; use decorators and `.include_router()`.

## Testing

```python
from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_read_main():
 response = client.get("/")
 assert response.status_code == 200
 assert response.json() == {"msg": "Hello World"}
```

- Tests are normal `def` functions; calls are synchronous (no `await`). Install `httpx`.
- For async tests, use `@pytest.mark.anyio` and `httpx.AsyncClient` with `ASGITransport(app=app)`.
- Run lifespan in tests with `with TestClient(app) as client:`.
- Override dependencies for tests via `app.dependency_overrides`.

## Deployment

- **Run a server**: `fastapi run main.py` (uses Uvicorn). Or `uvicorn main:app --host 0.0.0.0 --port 80`.
- **Workers**: `fastapi run --workers 4 main.py` to use multiple CPU cores. On Kubernetes, prefer one Uvicorn process per container and scale at the cluster level.
- **Docker**: build from the official Python image; copy `requirements.txt` first (cache layer), then code. Use the exec form `CMD ["fastapi", "run", "app/main.py", "--port", "80"]`. Add `--proxy-headers` when behind Nginx/Traefik.
- **HTTPS**: handled by a TLS Termination Proxy (Traefik, Nginx, Caddy) + Let's Encrypt. The app speaks plain HTTP to the proxy.
- **Behind a proxy**: enable `--forwarded-allow-ips="*"` to trust `X-Forwarded-*` headers; use `root_path` (or `--root-path`) when the proxy strips a path prefix like `/api/v1`.
- **Pin versions**: e.g. `fastapi[standard]>=0.112.0,<0.113.0`. FastAPI is still `0.x`, so minor versions may have breaking changes — add tests.
- **FastAPI Cloud**: deploy with `fastapi deploy`.

Key deployment concepts: HTTPS, run on startup, restart on failure, replication (workers), memory limits, and previous steps (e.g. DB migrations run once).

## Custom Responses and Middleware

- Default is JSON. Override with `response_class` (e.g. `HTMLResponse`, `FileResponse`, `RedirectResponse`, `StreamingResponse`, `PlainTextResponse`).
- Return a `Response` (or subclass) directly to bypass conversion — you control content/headers/status. Use `jsonable_encoder()` to make data JSON-compatible first.
- For best JSON performance, use a response model rather than returning `JSONResponse` directly (`ORJSONResponse`/`UJSONResponse` are now deprecated).
- **Middleware**: `@app.middleware("http")` runs before/after each request. Use `app.add_middleware(Class, ...)` for ASGI middlewares (CORS, GZip, TrustedHost, HTTPSRedirect). Middleware added last is outermost.
- **CORS**: `app.add_middleware(CORSMiddleware, allow_origins=[...], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])`. Can't use `["*"]` for origins/methods/headers when `allow_credentials=True`.

## Frontend and Static Files

- **Serve a static frontend** (React/Vite, Vue, Astro, etc.): `app.frontend("/", directory="dist")`. Path operations win; frontend files are low-priority fallbacks. Supports `fallback="auto"|"index.html"|"404.html"|None` and `check_dir=False`.
- **Static files** (CSS/JS/images): `app.mount("/static", StaticFiles(directory="static"), name="static")`.
- **Templates**: `Jinja2Templates(directory="templates")`; return `templates.TemplateResponse(request=request, name="item.html", context={...})`.

## Lifespan Events

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
 ml_models["model"] = load_model() # startup
 yield
 ml_models.clear() # shutdown

app = FastAPI(lifespan=lifespan)
```

Prefer `lifespan` over the deprecated `@app.on_event("startup"/"shutdown")`. Lifespan events run only for the main app, not sub-applications.

## OpenAPI and Docs Customization

- Metadata: `FastAPI(title=..., description=..., version=..., openapi_tags=[...], terms_of_service=..., contact={...}, license_info={...})`.
- Tags: pass `tags=[...]` to path operations (or `APIRouter`). Order in `openapi_tags` controls docs ordering.
- Docs URLs: configure/disable with `docs_url`, `redoc_url`, `openapi_url` (set to `None` to disable).
- Configure Swagger UI via `swagger_ui_parameters={...}`.
- Conditional OpenAPI: drive `openapi_url` from settings/env vars (hiding docs is NOT real security).
- Extend OpenAPI: override `app.openapi` with a custom function using `fastapi.openapi.utils.get_openapi`.
- Separate input/output schemas (Pydantic v2 default). Disable with `FastAPI(separate_input_output_schemas=False)`.
- Generate SDKs/clients from the OpenAPI schema (e.g. Hey API for TypeScript). Customize operation IDs via `generate_unique_id_function`.

## Settings and Environment Variables

Use `pydantic-settings`:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
 app_name: str = "Awesome API"
 admin_email: str
 items_per_user: int = 50

 model_config = {"env_file": ".env"}
```

Provide settings via a dependency (`get_settings`) for easy testing/overrides; cache with `@lru_cache`.

## Pydantic Migration (v1 -> v2)

- Latest FastAPI requires Pydantic v2. Use the official Pydantic migration guide and `bump-pydantic`.
- `model_dump()`, `model_copy(update=...)`, `model_config`, and `Field` are the v2 APIs.
- Use `exclude_unset=True` for partial updates (PATCH).

## Reference Files

This skill bundles the official FastAPI tutorial/advanced docs (with rendered code) in `references/`:

**Routing & request/response**
- **first-steps.md**, **path-params.md**, **query-params.md**, **request-body.md** — defining endpoints and reading path/query/body params.
- **response-model.md**, **response-status-code.md** — declaring response types and status codes.
- **handling-errors.md** — `HTTPException`, custom handlers, validation errors.
- **metadata.md** — app/tag metadata and docs URLs.

**Dependencies**
- **dependencies.md**, **dependencies-with-yield.md** — the DI system; `yield` dependencies for DB sessions/cleanup.

**Structure, DB & testing**
- **bigger-applications.md** — `APIRouter`, multi-file project layout.
- **sql-databases.md** — SQLModel/SQLAlchemy integration (pairs with the `sqlmodel` skill).
- **testing.md** — `TestClient` and testing patterns.
- **background-tasks.md**, **cors.md** — background work and CORS middleware.

**Async, config & lifecycle**
- **async-await.md** — when to use `async def` vs `def`; concurrency model.
- **settings.md** — pydantic-settings / `BaseSettings` configuration (pairs with the `pydantic` skill).
- **lifespan-events.md** — startup/shutdown via the lifespan context manager.

**Security**
- **security-first-steps.md**, **security-oauth2.md**, **security-get-current-user.md** — OAuth2 password flow, bearer tokens, current-user dependencies.

Use `view` to open a reference file when you need full, rendered code examples.


## Working with This Skill

1. **Start here** for foundational concepts: the cheat sheets above and .
2. **For a specific feature**: jump to the relevant section above, then open the matching reference file for full context and complete examples.
3. **For API/class details** (exact parameters, attributes, methods): use .
4. **For advanced/edge cases**: use , `dependencies.md`, `security.md`, or `deployment.md`.

## Notes

- Always prefer the `Annotated` style for parameters and dependencies — it preserves type information, works with non-FastAPI tooling, and avoids default-value ambiguity.
- `python-multipart` is required for forms and file uploads (`pip install python-multipart`); it's included with `fastapi[standard]`.
- The interactive docs (`/docs`) use JavaScript and won't send cookies, so cookie-based path operations can't be fully exercised there.
- Code examples include language detection for syntax highlighting.

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration.
2. The skill will be rebuilt with the latest information.