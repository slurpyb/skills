---
name: postgresql
description: Complete PostgreSQL knowledge combining official documentation and source code. Use when designing databases, writing queries, optimizing performance, or managing PostgreSQL instances. Covers SQL, data types, indexes, constraints, partitioning, concurrency (MVCC), JSON/JSONB, full-text search, schemas, privileges, row-level security, and replication.
version: 1.2.0
---

# PostgreSQL Skill

Complete PostgreSQL knowledge combining official documentation and source code. Use when designing databases, writing queries, optimizing performance, or managing PostgreSQL instances. Covers SQL, administration, extensions, and advanced features.

## When to Use This Skill

Use this skill when you need to:
- Design schemas, tables, constraints, and relationships
- Choose the right data type (numeric, text, JSON/JSONB, arrays, ranges, UUID, network, geometric, etc.)
- Write and optimize SQL (SELECT, INSERT, UPDATE, DELETE, MERGE, CTEs, window functions)
- Select and tune indexes (B-tree, Hash, GiST, SP-GiST, GIN, BRIN) including partial, expression, covering, and unique indexes
- Implement table partitioning (range, list, hash) and understand partition pruning
- Reason about concurrency, isolation levels, MVCC, and serialization failures
- Manage schemas, privileges, and row-level security
- Work with JSON/JSONB documents, jsonpath, and full-text search
- Administer, replicate, and scale PostgreSQL instances

## Quick Reference

### Choosing a Data Type

| Need | Use | Notes |
|------|-----|-------|
| Whole numbers | `smallint`, `integer`, `bigint` | `integer` is the default balanced choice |
| Exact decimals / money | `numeric(p,s)` | Exact; slower than int/float. Avoid `float` for money |
| Approximate floats | `real`, `double precision` | IEEE 754; do not use for equality-sensitive money |
| Auto-increment | `GENERATED ... AS IDENTITY` (SQL standard) or `serial`/`bigserial` | Prefer identity columns in new code |
| Text | `text`, `varchar(n)`, `char(n)` | `text`/`varchar` preferred; `char(n)` is usually slowest |
| Boolean | `boolean` | States: true, false, NULL (unknown) |
| Timestamps | `timestamptz` (with time zone) | Stored in UTC; convert on display |
| Flexible documents | `jsonb` | Prefer over `json` unless key order/whitespace matters |
| Unique IDs | `uuid` | Better cross-system uniqueness than sequences |
| Enumerations | `CREATE TYPE ... AS ENUM` | Ordered, type-safe, 4 bytes on disk |
| Binary data | `bytea` | Hex format is default and preferred |
| WAL location | `pg_lsn` | 64-bit log sequence number |

### Choosing an Index Type

| Index | Best for | Key operators |
|-------|----------|---------------|
| **B-tree** (default) | Equality + range on sortable data; sorted output | `< <= = >= >`, `BETWEEN`, `IN`, `IS NULL`, anchored `LIKE 'foo%'` |
| **Hash** | Simple equality only | `=` |
| **GiST** | Geometric, ranges, nearest-neighbor | `<<`, `&&`, `<->` (KNN) |
| **SP-GiST** | Non-balanced structures (quadtrees, tries) | point/text-prefix ops |
| **GIN** | Composite values: arrays, jsonb, full-text | `@>`, `?`, `?|`, `?&`, `@@`, `@?` |
| **BRIN** | Huge tables physically correlated with column | `< <= = >= >` (block-range summaries) |

### High-Signal Examples

**JSON vs JSONB output normalization** — `jsonb` rewrites numbers and drops insignificant whitespace:
```sql
SELECT '{"reading": 1.230e-5}'::json, '{"reading": 1.230e-5}'::jsonb;
         json          |          jsonb
-----------------------+-------------------------
 {"reading": 1.230e-5} | {"reading": 0.00001230}
(1 row)
```

**JSON array element access** (0-relative for the `->` operator):
```sql
SELECT '[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json -> 2;
-- {"c":"baz"}
```

**JSONB containment query** (works with a GIN index):
```sql
-- Find documents where the "tags" array contains element "qui"
SELECT jdoc->'guid', jdoc->'name'
FROM api
WHERE jdoc @> '{"tags": ["qui"]}';
```

**Create a GIN index for jsonb search**:
```sql
CREATE INDEX idxgin ON api USING GIN (jdoc);
-- For containment-only, smaller and faster:
CREATE INDEX idxginp ON api USING GIN (jdoc jsonb_path_ops);
```

**jsonpath query with filter**:
```sql
SELECT jsonb_path_query('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)',
                        '{"min":2, "max":4}');
-- 2, 3, 4
```

**tsvector** is a sorted set of normalized lexemes:
```sql
SELECT 'a fat cat sat on a mat and ate a fat rat'::tsvector;
                      tsvector
----------------------------------------------------
 'a' 'and' 'ate' 'cat' 'fat' 'mat' 'on' 'rat' 'sat'
```

**Declarative range partitioning**:
```sql
CREATE TABLE measurement (
    city_id    int  not null,
    logdate    date not null,
    peaktemp   int,
    unitsales  int
) PARTITION BY RANGE (logdate);

CREATE TABLE measurement_y2006m02 PARTITION OF measurement
    FOR VALUES FROM ('2006-02-01') TO ('2006-03-01');
```

**Sub-partitioning** (partition that is itself partitioned):
```sql
CREATE TABLE measurement_y2006m02 PARTITION OF measurement
    FOR VALUES FROM ('2006-02-01') TO ('2006-03-01')
    PARTITION BY RANGE (peaktemp);
```

**Expression index for case-insensitive search**:
```sql
CREATE INDEX test1_lower_col1_idx ON test1 (lower(col1));
-- enables: SELECT * FROM test1 WHERE lower(col1) = 'value';
```

**Covering index (index-only scans)**:
```sql
CREATE INDEX tab_x_y ON tab (x) INCLUDE (y);
-- SELECT y FROM tab WHERE x = 'key';  can be index-only
```

**Partial index to skip common values**:
```sql
CREATE INDEX access_log_client_ip_ix ON access_log (client_ip)
WHERE NOT (client_ip > inet '192.168.100.0'
       AND client_ip < inet '192.168.100.255');
```

**UPSERT with ON CONFLICT**:
```sql
INSERT INTO distributors (did, dname) VALUES (5, 'Gizmo Transglobal')
ON CONFLICT (did) DO UPDATE SET dname = EXCLUDED.dname;
```

**Generated column**:
```sql
CREATE TABLE people (
    height_cm numeric,
    height_in numeric GENERATED ALWAYS AS (height_cm / 2.54) STORED
);
```

**Identity column (SQL-standard auto-increment)**:
```sql
CREATE TABLE people (
    id   bigint GENERATED ALWAYS AS IDENTITY,
    name text
);
```

## Key Concepts and Patterns

### Data Types
- **numeric** is exact and recommended for monetary values; precision up to 1000 digits, scale −1000..1000 (negative scale rounds left of decimal). `real`/`double precision` are inexact IEEE 754.
- **jsonb vs json**: `jsonb` is binary, deduplicates keys, drops whitespace, supports indexing and containment (`@>`), and is the recommended default. `json` preserves exact input text and key order.
- **jsonb operator classes**: default `jsonb_ops` supports key-exists (`?`, `?|`, `?&`), containment (`@>`), and jsonpath (`@?`, `@@`). `jsonb_path_ops` supports only `@>`, `@?`, `@@` but is smaller and faster.
- **jsonb subscripting** allows in-place update: `UPDATE t SET val['a']['b'] = '1'`. Missing intermediate objects are auto-created.
- **Text search**: `tsvector` (document) + `tsquery` (query) with operators `&` (AND), `|` (OR), `!` (NOT), `<->` (FOLLOWED BY). Normalize with `to_tsvector`/`to_tsquery`.
- **timestamptz** stores UTC internally and converts to the session `TimeZone` on output; prefer it over `timestamp` for timezone-aware data.
- **Identity columns** (`GENERATED ALWAYS/BY DEFAULT AS IDENTITY`) are the SQL-standard replacement for `serial`. Both rely on sequences and may leave gaps.

### Indexes
- Default `CREATE INDEX` builds a B-tree; choose other types with `USING <method>`.
- **Multicolumn B-tree** indexes are most efficient with constraints on leading columns; the skip-scan optimization can still help when leading columns have few distinct values.
- **Index-only scans** need the index to store all referenced columns and rely on the visibility map; `INCLUDE` adds non-key payload columns.
- **Partial indexes** index a subset (predicate), useful to exclude common/uninteresting values or enforce uniqueness over a subset.
- **Operator classes** (e.g., `text_pattern_ops`) tune comparison semantics; needed for pattern matching in non-C locales.
- Build without blocking writes using `CREATE INDEX CONCURRENTLY` (two scans, slower, cannot run in a transaction block).
- Always `ANALYZE` and inspect with `EXPLAIN`/`EXPLAIN ANALYZE`; force plan choices with `enable_seqscan`/`enable_nestloop` only for diagnosis.

### Partitioning
- Built-in strategies: **RANGE**, **LIST**, **HASH**. The partitioned table is virtual; data lives in partitions.
- Use `ATTACH PARTITION`/`DETACH PARTITION` for fast bulk add/remove; add a matching `CHECK` constraint before `ATTACH` to skip the validation scan.
- **Partition pruning** (`enable_partition_pruning`) eliminates partitions at plan and execution time; **constraint exclusion** is the older `CHECK`-based mechanism for inheritance.
- Indexes on a partitioned table propagate to all partitions; create per-partition indexes `CONCURRENTLY` then `ALTER INDEX ... ATTACH PARTITION` to avoid long locks.
- Unique/PK constraints must include all partition key columns.

### Constraints
- Types: `CHECK`, `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, `EXCLUDE`. Constraints can be `DEFERRABLE`/`INITIALLY DEFERRED` and `NOT VALID` (then `VALIDATE CONSTRAINT` later to avoid long locks).
- Foreign key actions: `NO ACTION` (default), `RESTRICT`, `CASCADE`, `SET NULL`, `SET DEFAULT`; choose based on whether referencing rows are components of the referenced object.
- Add a NOT NULL or CHECK constraint with `NOT VALID` to skip the initial table scan, then validate under a weaker `SHARE UPDATE EXCLUSIVE` lock.

### Concurrency (MVCC)
- PostgreSQL uses **MVCC**: readers never block writers and vice versa. Each statement sees a snapshot.
- Isolation levels: Read Committed (default), Repeatable Read, Serializable (SSI). Repeatable Read/Serializable can raise `serialization_failure` (SQLSTATE 40001) — retry the whole transaction.
- Also consider retrying `deadlock_detected` (40P01) and sometimes `unique_violation` (23505) / `exclusion_violation` (23P01).
- `TRUNCATE` and table-rewriting `ALTER TABLE` are not MVCC-safe for snapshots taken before commit.

### Schemas, Privileges, Security
- Schemas are namespaces; the `search_path` (default `"$user", public`) resolves unqualified names. Securing `search_path` matters because writable schemas on the path can be exploited.
- Privileges include `SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, CREATE, CONNECT, TEMPORARY, EXECUTE, USAGE, SET, ALTER SYSTEM, MAINTAIN`. Grant with `GRANT`, revoke with `REVOKE`, default-grant with `ALTER DEFAULT PRIVILEGES`.
- **Row-Level Security**: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` then define policies with `CREATE POLICY`. Permissive policies combine with OR; restrictive with AND. Owners and `BYPASSRLS` roles bypass unless `FORCE ROW LEVEL SECURITY`.

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **getting_started.md** — Tutorial and foundational concepts. *Start here if new.*
- **data_types.md** — All data types: numeric, character, JSON/JSONB, jsonpath, text search, date/time, UUID, network, geometric, enum, bit, bytea, OID, pg_lsn, pseudo-types.
- **sql_commands.md** — Command reference: CREATE/ALTER TABLE, INSERT, UPDATE, DELETE, SELECT, CREATE INDEX, CREATE SCHEMA, constraints, generated/identity columns, privileges, row security, dependency tracking.
- **indexes.md** — Index types, multicolumn, ordering, unique, partial, expression, covering/index-only scans, operator classes, combining indexes, examining usage.
- **queries.md** — Query and indexing introduction.
- **functions.md** — Functions and operators overview (incl. JSON functions, jsonpath language).
- **other.md** — Data definition: table basics, defaults, identity, generated columns, constraints, inheritance, partitioning, schemas, foreign data, MVCC, dependency tracking.
- **performance.md** — Performance tips, EXPLAIN, tuning parameters.
- **replication.md** — High availability, load balancing, and replication.
- **security.md** — Schemas, search_path, privileges, usage patterns.
- **administration.md** — Server administration overview.

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### Start Here
Begin with `getting_started.md` for foundational concepts and the SQL language.

### For Specific Features
- Designing tables/columns → `data_types.md`, `sql_commands.md` (CREATE TABLE), `other.md`
- Performance/indexing → `indexes.md`, `performance.md`, `queries.md`
- JSON, full-text, jsonpath → `data_types.md`, `functions.md`
- Concurrency/transactions → `other.md` (MVCC chapters)
- Security/multi-tenant → `security.md`, `sql_commands.md` (privileges, row security)
- Scaling/HA → `replication.md`

### For Code Examples
Use the high-signal examples above first, then open the matching reference file for full context and edge cases (e.g., jsonb indexing trade-offs, partition maintenance, NOT VALID constraints).

## Notes

- This skill was generated from official PostgreSQL documentation (current release).
- Reference files preserve structure and examples from source docs.
- Code examples include language detection for better syntax highlighting.
- Quick reference entries are curated to favor high-signal, runnable examples.

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration.
2. The skill will be rebuilt with the latest information.