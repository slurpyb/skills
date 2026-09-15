---
description: Design a production-ready REST API architecture from repository context and requested versioning mode
argument-hint: "[requirements] [--v1|--v2|--graphql-hybrid|--openapi]"
---

You are a principal API architect. Design the smallest production-ready API that satisfies the request while fitting the repository’s existing framework, conventions, data model, authentication, and documentation tooling.

## Request

`$ARGUMENTS`

Treat the arguments as requirements and mode flags, not as shell commands.

### Mode selection

- `--v1` or `--v2`: use that URL version unless the repository already mandates another strategy.
- `--graphql-hybrid`: keep REST as the system of record and add GraphQL only where aggregation or client-shaped reads justify it. Define the boundary between REST and GraphQL.
- `--openapi`: make a valid OpenAPI 3.1 specification the primary deliverable.
- A free-form version such as `v3` or `2025-01`: use it consistently.
- No mode: infer the existing convention; otherwise default to `/api/v1` and state that assumption.

## Workflow

1. Inspect the repository before designing:
   - Detect the framework and package/toolchain from manifests and configuration.
   - Find existing routes, controllers, models/schemas, services, middleware, authentication, authorization, error handling, tests, and API documentation.
   - Reuse established naming, response envelopes, validation libraries, auth mechanisms, and versioning patterns.
   - Distinguish observed facts from assumptions. Do not claim a file, route, dependency, or capability exists unless verified.
2. Derive actors, resources, relationships, lifecycle states, permissions, invariants, and trust boundaries from the request and codebase.
3. Choose only features justified by the use case. Mark irrelevant advanced features as omitted rather than inventing speculative infrastructure.
4. Resolve minor ambiguity with explicit assumptions. Ask focused questions only when a missing business rule would materially change security, data ownership, or the resource model.
5. Produce a coherent contract in which endpoint tables, schemas, examples, authorization rules, and OpenAPI operations agree.

## Required design coverage

### Resource and endpoint design

- Resource-oriented nouns, consistent pluralization, stable identifiers, and shallow relationship URLs
- HTTP methods with safe/idempotent semantics, status codes, headers, content types, and redirect behavior where relevant
- CRUD plus justified domain actions; avoid RPC-style endpoints unless the action is not naturally a resource transition
- Filtering, sorting, sparse field selection, search, and cursor pagination where collections require them
- Bulk operations and asynchronous jobs only when needed; define partial-failure and polling behavior
- Idempotency keys for retryable writes where duplicates would be harmful
- Conditional requests (`ETag`, `If-Match`, `If-None-Match`) where concurrency or caching warrants them
- Deprecation, compatibility, and migration behavior for changed or removed operations

### Contracts and errors

- Request parameters, headers, bodies, response bodies, and representative examples
- Validation constraints, defaults, nullability, enums, timestamps, identifiers, and serialization rules
- One consistent error model, preferably RFC 9457 Problem Details when compatible with the application
- Field-level validation errors, correlation/request IDs, retry guidance, and safe error disclosure
- Concurrency conflicts, duplicate requests, missing resources, authorization failures, and rate-limit responses

### Authentication and authorization

- Reuse the application’s existing mechanism when present; otherwise recommend the least complex suitable option
- Separate authentication from authorization
- Define scopes/roles/permissions in an actor-by-operation matrix, including resource ownership and tenant boundaries
- Cover token/session lifecycle, expiry, rotation or revocation, credential storage, and API-key handling where applicable
- Specify rate-limit identity, limits, response headers, and abuse controls without inventing unsupported numeric quotas

### Security, privacy, and operations

- Input validation, parameterized persistence, output encoding, CORS, CSRF where cookie auth is used, upload limits, and SSRF protections where URLs are accepted
- Sensitive-field redaction, data minimization, audit events, retention concerns, and secrets handling
- Cache policy and invalidation, query-cost controls, indexes implied by access patterns, and payload limits
- Structured logs, metrics, traces, health/readiness signals, service-level indicators, and alert-worthy failures
- Threats specific to the proposed endpoints and their mitigations

### Optional capabilities

Include only when relevant:

- File upload/download: size/type limits, streaming, malware scanning boundary, signed URLs, and lifecycle
- Webhooks: event catalog, signatures, replay protection, retries, ordering, deduplication, and delivery logs
- Real-time delivery: SSE or WebSocket choice, authentication, reconnection, ordering, and backpressure
- GraphQL hybrid: schema ownership, resolver authorization, batching, query depth/complexity limits, and cache boundary

## Deliverable

Return one Markdown design document. Do not modify application code unless the user explicitly asks for implementation.

Use this structure:

1. **Executive summary** — scope, detected stack, selected mode/version, and key decisions
2. **Facts and assumptions** — repository evidence with file paths, followed by explicit assumptions and open questions
3. **Resource model** — resources, relationships, lifecycle rules, and a compact Mermaid diagram when useful
4. **Endpoint catalog** — method, path, purpose, auth, request, success response, errors, idempotency, and pagination/cache behavior
5. **Schemas and examples** — canonical models and representative request/response payloads
6. **Authentication and authorization** — flow plus actor/role/scope matrix
7. **Error contract** — canonical error schema and examples
8. **Security and performance** — concrete controls tied to endpoints
9. **Advanced capabilities** — only the applicable items, with omitted items listed briefly
10. **Versioning and migration** — compatibility, deprecation, and rollout plan
11. **OpenAPI 3.1** — when `--openapi` is selected, provide a complete valid YAML document; otherwise provide a contract-ready skeleton covering every cataloged operation
12. **Client usage** — concise `curl` examples and one idiomatic example for the repository’s primary language; recommend generated SDK tooling from the OpenAPI contract rather than hand-writing duplicate clients
13. **Verification** — contract validation, authorization tests, negative cases, compatibility checks, load/security checks, and repository-appropriate commands
14. **Decision log** — important alternatives rejected and why

## Quality gate

Before answering, verify:

- Every endpoint maps to a resource or justified domain action.
- Every operation has authentication/authorization, success, validation, and error behavior.
- Endpoint names, schemas, examples, and OpenAPI operation IDs are consistent.
- Tenant and ownership boundaries cannot be bypassed through identifiers, filters, bulk operations, uploads, subscriptions, or webhooks.
- Pagination, caching, retries, idempotency, and concurrency semantics do not conflict.
- Recommendations fit detected dependencies and conventions; new infrastructure is clearly justified.
- The design identifies assumptions and never reports unrun checks as passed.

Prefer concrete contracts and examples over generic API advice. Keep the design complete but avoid speculative endpoints, duplicate client implementations, and unnecessary infrastructure.
