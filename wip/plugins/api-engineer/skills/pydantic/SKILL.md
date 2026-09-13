---
name: pydantic
description: Pydantic v2 — data validation and settings management using Python type hints. Use when defining models, validators, serializers, field constraints, or pydantic-settings configuration.
version: 1.0.0
---

# Pydantic Skill

Pydantic v2 (current docs: v2.13.4) is the most widely used data validation library for Python. It validates data against schemas defined with standard Python type hints, with core logic implemented in Rust (`pydantic-core`) for high performance. Use this skill when defining models, validators, serializers, field constraints, JSON Schema generation, or pydantic-settings configuration.

## When to Use This Skill

Use this skill when you need to:
- Define and validate data models with `BaseModel`
- Apply field constraints using `Annotated` and `annotated-types` (e.g. `Gt`, `PositiveInt`)
- Serialize models to dicts or JSON with `model_dump()` / `model_dump_json()`
- Generate JSON Schema (`model_json_schema()`) for self-documenting APIs / OpenAPI 3.1
- Validate non-model types via `TypeAdapter` (TypedDicts, dicts, lists, etc.)
- Handle validation errors via `ValidationError`
- Choose between strict mode and Pydantic's default data coercion
- Customize validation/serialization with functional validators and wrap validators

## Installation

```bash
pip install pydantic
```

Pydantic supports pure, canonical Python 3.9+. It integrates well with static typing tools (mypy, Pyright) and IDEs (PyCharm, VSCode).

## Core Concepts

### 1. Models from Type Hints
The schema Pydantic validates against is defined by Python type hints. By default Pydantic is tolerant of common incorrect types and coerces data (e.g. a numeric string `'1'` to `int`, bytes keys to `str`, ISO 8601 strings to `datetime`).

```python
from datetime import datetime
from pydantic import BaseModel, PositiveInt

class User(BaseModel):
 id: int # required; str/bytes/float coerced to int
 name: str = 'John Doe' # has default → not required
 signup_ts: datetime | None # required, but None allowed; parses timestamps/strings
 tastes: dict[str, PositiveInt] # PositiveInt == Annotated[int, Gt(0)]

external_data = {
 'id': 123,
 'signup_ts': '2019-06-01 12:22',
 'tastes': {'wine': 9, b'cheese': 7, 'cabbage': '1'},
}

user = User(**external_data)
print(user.id) #> 123
print(user.model_dump()) # convert model to dict
```

### 2. Constraints with Annotated
Use `Annotated` plus `annotated-types` to enforce constraints not encapsulated by basic types, while preserving typing support:

```python
from typing import Annotated, Literal
from annotated_types import Gt
from pydantic import BaseModel

class Fruit(BaseModel):
 name: str
 color: Literal['red', 'green'] # restrict to allowed values
 weight: Annotated[float, Gt(0)] # must be > 0
 bazam: dict[str, list[tuple[int, bool, float]]] # arbitrarily complex types
```

### 3. Validation Errors
When validation fails, Pydantic raises a `ValidationError` with a structured breakdown of every problem (type, location, message, input, and a docs URL):

```python
from datetime import datetime
from pydantic import BaseModel, PositiveInt, ValidationError

class User(BaseModel):
 id: int
 name: str = 'John Doe'
 signup_ts: datetime | None
 tastes: dict[str, PositiveInt]

try:
 User(id='not an int', tastes={})
except ValidationError as e:
 print(e.errors())
 # [{'type': 'int_parsing', 'loc': ('id',), ...},
 # {'type': 'missing', 'loc': ('signup_ts',), ...}]
```

### 4. Serialization
Pydantic can serialize models three ways, with output customizable by excluding fields, unset fields, default values, or `None` values:

```python
from datetime import datetime
from pydantic import BaseModel

class Meeting(BaseModel):
 when: datetime
 where: bytes
 why: str = 'No idea'

m = Meeting(when='2020-01-01T12:00', where='home')
print(m.model_dump(exclude_unset=True)) # python dict, only set fields
print(m.model_dump(exclude={'where'}, mode='json')) # json-mode dict, field excluded
print(m.model_dump_json(exclude_defaults=True)) # JSON string, defaults excluded
```

### 5. JSON Schema
Generate a JSON Schema (compliant with 2020-12 / OpenAPI 3.1) for any model, including nested models via `$defs`/`$ref`:

```python
from datetime import datetime
from pydantic import BaseModel

class Address(BaseModel):
 street: str
 city: str
 zipcode: str

class Meeting(BaseModel):
 when: datetime
 where: Address
 why: str = 'No idea'

print(Meeting.model_json_schema()) # nested Address appears under '$defs'
```

### 6. TypeAdapter (validate non-model types)
Use `TypeAdapter` to validate, serialize, and generate schemas for types that aren't `BaseModel` subclasses (TypedDicts, `dict[str, HttpUrl]`, lists, etc.). It can validate JSON directly with `validate_json`, and JSON parsing in Rust makes it very fast:

```python
from pydantic import HttpUrl, TypeAdapter

type_adapter = TypeAdapter(dict[str, HttpUrl])
data = type_adapter.validate_json(emojis_json) # parse + validate in one step
```

In benchmarks, Pydantic parsing JSON and validating URLs runs ~3x faster than equivalent dedicated pure-Python code.

### 7. Strict Mode vs Coercion
- **Default (lax) mode:** tolerant; coerces data to the target type where sensible.
- **Strict mode:** types are not coerced; a `ValidationError` is raised unless the input exactly matches the schema.
- Pydantic can parse and validate JSON in one step, enabling sensible conversions (strings → `datetime`, `UUID`, `bytes`) even where strict mode alone wouldn't.

### 8. Customization
Functional validators and serializers, plus a protocol for custom types, allow per-field or per-type customization. **Wrap validators** (new in V2) are among the most powerful customization tools.

## Schema Creation Approaches

Pydantic provides four ways to create schemas and perform validation/serialization:
1. `BaseModel` subclasses
2. Pydantic dataclasses
3. `TypeAdapter` for arbitrary types (including `TypedDict`)
4. Functional validators/serializers and custom type protocols

## Quick Reference

| Task | API |
|------|-----|
| Define a model | `class M(BaseModel): ...` |
| Instantiate / validate | `M(**data)` |
| Validate JSON | `M.model_validate_json(data)` / `TypeAdapter(...).validate_json(data)` |
| To dict | `model.model_dump()` (supports `exclude`, `exclude_unset`, `exclude_defaults`, `exclude_none`, `mode='json'`) |
| To JSON string | `model.model_dump_json()` |
| JSON Schema | `M.model_json_schema()` |
| Field constraints | `Annotated[T, Gt(0), ...]`, `PositiveInt`, etc. |
| Restrict values | `Literal['red', 'green']` |
| Validate non-models | `TypeAdapter(SomeType)` |
| Handle errors | `except ValidationError as e: e.errors()` |

## Reference Files

This skill bundles the official Pydantic v2 concept docs in `references/` (sourced from the `pydantic/pydantic` repo):

- **models.md** — `BaseModel`, nested/recursive models, generic models, model methods, dynamic model creation, `RootModel`.
- **fields.md** — the `Field()` function: defaults, aliases, numeric/string constraints, exclusion, computed fields, discriminators.
- **validators.md** — `@field_validator` and `@model_validator` (before/after/wrap/plain), validation context, reusable validators.
- **serialization.md** — `model_dump` / `model_dump_json`, `@field_serializer` / `@model_serializer`, include/exclude, round-tripping.
- **strict_mode.md** — strict vs lax coercion, per-field/per-call strictness, `Strict` types.
- **type_adapter.md** — `TypeAdapter` for validating/serializing non-model types (TypedDicts, dataclasses, plain types).
- **config.md** — `model_config` / `ConfigDict` (frozen, extra, alias generators, etc.).
- **json.md** — JSON parsing/serialization, partial JSON, JSON-specific validation.

Use `view` to open a reference file when you need full detail and complete examples.


## Working with This Skill

### Start Here
Read the references for the core `BaseModel` workflow, then `references/getting_started.md` for the feature overview and rationale.

### For Specific Features
Use the relevant section above (Constraints, Serialization, JSON Schema, TypeAdapter, Strict Mode, Customization) and then open the matching reference file for full context and runnable examples.

### For Code Examples
Use the inline examples above first—they are copied from the official docs and runnable—then open the reference files for additional examples.

## Notes

- Targets Pydantic **v2** (docs version v2.13.4). Many V1 APIs have changed; prefer V2 method names (`model_dump`, `model_dump_json`, `model_json_schema`, `model_validate`).
- Core validation is implemented in Rust (`pydantic-core`), making JSON parsing and validation very fast.
- Reference files preserve the structure and examples from source docs.

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration.
2. The skill will be rebuilt with the latest information.