---
name: sqlmodel
description: SQLModel — SQL databases in Python with type annotations, built on SQLAlchemy and Pydantic. Use when defining table models, relationships, queries (select/where/join), sessions, indexes, or FastAPI database integration.
version: 2.0.0
---

# SQLModel Skill

SQLModel is a library for interacting with SQL databases from Python code using Python objects. It is built on top of **Pydantic** and **SQLAlchemy** by the same author as FastAPI. A single SQLModel class can simultaneously be a Pydantic model (for data validation) and a SQLAlchemy model (for the database table), letting you avoid code duplication.

## When to Use This Skill

Use this skill when you need to:
- Define database table models with Python type annotations
- Create, read, update, or delete rows (CRUD operations)
- Filter and query data with `select`, `where`, `join`, `limit`, `offset`
- Manage sessions and engines
- Work with relationships (one-to-many, many-to-many) and relationship attributes
- Add indexes to optimize queries
- Integrate a SQL database with a FastAPI application
- Handle UUIDs, Decimals, cascade deletes, and other advanced patterns

## Core Concepts

### Engine vs Session
- **Engine**: One per application. Handles communication with the database and manages connections. Created with `create_engine(url, echo=True)`.
- **Session**: One per group of related operations (e.g., one per web request). Holds objects in memory and saves them in a single batch on `commit()`. Always use within a `with` block so it closes automatically.

### Table Models vs Data Models
- A class with `table=True` is a **table model** — it maps to a real database table.
- A class without `table=True` is a **data model** — pure Pydantic, used for validation/serialization (e.g., request/response schemas). Only table models create tables via `SQLModel.metadata.create_all()`.

### The `id: int | None` Pattern
Primary keys are declared `int | None` with `Field(default=None, primary_key=True)`. The value is `None` in Python before saving, but the database generates the real `int` on commit. After commit, objects are "expired" and refresh automatically when you access an attribute.

## Quick Reference

### Define a Table Model and Create the Database
```python
from sqlmodel import Field, SQLModel, create_engine

class Hero(SQLModel, table=True):
 id: int | None = Field(default=None, primary_key=True)
 name: str = Field(index=True)
 secret_name: str
 age: int | None = Field(default=None, index=True)

sqlite_url = "sqlite:///database.db"
engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
 SQLModel.metadata.create_all(engine)
```
Put side-effecting code in functions and guard execution with `if __name__ == "__main__":` so importing the module doesn't create the database.

### Create Rows (INSERT)
```python
from sqlmodel import Session

def create_heroes():
 hero_1 = Hero(name="Deadpond", secret_name="Dive Wilson")
 hero_2 = Hero(name="Spider-Boy", secret_name="Pedro Parqueador")
 hero_3 = Hero(name="Rusty-Man", secret_name="Tommy Sharp", age=48)
 with Session(engine) as session:
 session.add(hero_1)
 session.add(hero_2)
 session.add(hero_3)
 session.commit()
 session.refresh(hero_1) # refresh to access generated id
```
Use `session.add()` to stage objects, then `session.commit()` to persist all in one transaction. Use `session.refresh(obj)` to explicitly reload fresh data (e.g., before returning from an API).

### Read Data (SELECT)
```python
from sqlmodel import select

def select_heroes():
 with Session(engine) as session:
 statement = select(Hero)
 results = session.exec(statement)
 heroes = results.all() # list of all
 print(heroes)
```
**Always use `session.exec()`** (not `session.execute()`) — it gives the best editor support and avoids needing `.scalars()`.

### Filter with WHERE
```python
statement = select(Hero).where(Hero.age >= 35) # comparison
statement = select(Hero).where(Hero.name == "Deadpond") # equality (==, not =)
statement = select(Hero).where(Hero.age >= 35, Hero.age < 40) # multiple = AND
```
Use the **class** attribute (`Hero.age`) in `.where()` to build expressions — not an instance attribute. Combine with `OR`:
```python
from sqlmodel import or_, col
statement = select(Hero).where(or_(Hero.age < 25, Hero.age > 90))
statement = select(Hero).where(col(Hero.name).in_(["Deadpond", "Rusty-Man"]))
```
Wrap a column in `col()` for `.in_()` and to silence editor warnings on `Optional` comparisons.

### Read One Row
```python
hero = results.first() # first match or None
hero = results.one() # exactly one, else raises
hero = session.get(Hero, 1) # by primary key, returns None if not found
```

### Limit and Offset (Pagination)
```python
statement = select(Hero).offset(3).limit(3) # skip 3, take next 3
```

### Update (UPDATE)
```python
def update_heroes():
 with Session(engine) as session:
 hero = session.exec(select(Hero).where(Hero.name == "Spider-Boy")).one()
 hero.age = 16
 session.add(hero)
 session.commit()
 session.refresh(hero)
```

### Delete (DELETE)
```python
def delete_heroes():
 with Session(engine) as session:
 hero = session.exec(select(Hero).where(Hero.name == "Spider-Youngster")).one()
 session.delete(hero)
 session.commit()
```

### Indexes
Add `index=True` in `Field()` to speed up queries that filter on that column. SQLModel auto-generates index names (e.g., `ix_hero_name`). Primary keys are indexed automatically. Indexes trade slower writes/extra space for faster reads.

## Relationships

### Foreign Keys (Connecting Tables)
```python
class Team(SQLModel, table=True):
 id: int | None = Field(default=None, primary_key=True)
 name: str = Field(index=True)
 headquarters: str

class Hero(SQLModel, table=True):
 id: int | None = Field(default=None, primary_key=True)
 name: str = Field(index=True)
 secret_name: str
 team_id: int | None = Field(default=None, foreign_key="team.id") # note lowercase table name
```

### JOIN
```python
# Implicit ON via foreign key
statement = select(Hero, Team).join(Team)
# LEFT OUTER JOIN to include heroes without a team
statement = select(Hero, Team).join(Team, isouter=True)
# Filter joined data
statement = select(Hero).join(Team).where(Team.name == "Preventers")
```
Include a model in `select()` to retrieve its data; put it in `.join()` only to filter on it.

### Relationship Attributes
```python
from sqlmodel import Relationship

class Team(SQLModel, table=True):
 id: int | None = Field(default=None, primary_key=True)
 name: str = Field(index=True)
 headquarters: str
 heroes: list["Hero"] = Relationship(back_populates="team")

class Hero(SQLModel, table=True):
 id: int | None = Field(default=None, primary_key=True)
 name: str = Field(index=True)
 secret_name: str
 team_id: int | None = Field(default=None, foreign_key="team.id")
 team: Team | None = Relationship(back_populates="heroes")
```
- Assign related objects directly: `hero = Hero(name="...", team=team_preventers)` — no need to commit the team first or set `team_id` manually.
- Append on the "many" side: `team.heroes.append(hero)`.
- Access fetches automatically while the session is open: `hero.team`, `team.heroes`.
- Remove a relationship: `hero.team = None`.
- `back_populates` keeps both sides in sync **before** commit. The string value names the attribute on the *other* model.
- Use `list["Hero"]` (quoted) when the class isn't defined yet at that point in the code.

### Many-to-Many (Link Table)
```python
class HeroTeamLink(SQLModel, table=True):
 team_id: int | None = Field(default=None, foreign_key="team.id", primary_key=True)
 hero_id: int | None = Field(default=None, foreign_key="hero.id", primary_key=True)

class Team(SQLModel, table=True):
 id: int | None = Field(default=None, primary_key=True)
 name: str = Field(index=True)
 headquarters: str
 heroes: list["Hero"] = Relationship(back_populates="teams", link_model=HeroTeamLink)

class Hero(SQLModel, table=True):
 id: int | None = Field(default=None, primary_key=True)
 name: str = Field(index=True)
 secret_name: str
 teams: list[Team] = Relationship(back_populates="heroes", link_model=HeroTeamLink)
```
- The link table uses both foreign keys as a composite primary key (prevents duplicate links).
- Update with normal list operations: `team.heroes.append(hero)`, `hero.teams.remove(team)`.
- For **extra data on the link** (e.g. `is_training: bool`), make the link model an association object with its own `Relationship()` attributes (`team`, `hero`) and reference `hero_links` / `team_links` lists instead of `link_model`.

### Cascade Deletes (SQLModel ≥ 0.0.21)
- `Relationship(cascade_delete=True)` — deletes related Python objects when parent is deleted.
- `Field(foreign_key="team.id", ondelete="CASCADE")` — configures the database (`ON DELETE CASCADE`). Options: `"CASCADE"`, `"SET NULL"`, `"RESTRICT"`.
- Use **both** together for safety (Python + DB level). SQLite needs `PRAGMA foreign_keys=ON`.
- `passive_deletes="all"` tells SQLAlchemy to let the DB handle deletes/updates without loading rows first.

## FastAPI Integration

### Multiple Models with Inheritance
Avoid duplicating fields and control request/response schemas:
```python
class HeroBase(SQLModel): # shared fields, NOT a table
 name: str = Field(index=True)
 secret_name: str
 age: int | None = Field(default=None, index=True)

class Hero(HeroBase, table=True): # table model
 id: int | None = Field(default=None, primary_key=True)

class HeroCreate(HeroBase): # request body (no id)
 pass

class HeroPublic(HeroBase): # response (id required)
 id: int

class HeroUpdate(SQLModel): # all optional for PATCH
 name: str | None = None
 secret_name: str | None = None
 age: int | None = None
```
**Rule of thumb:** only inherit from data models, never from table models.

### Session Dependency
```python
from fastapi import Depends, FastAPI

connect_args = {"check_same_thread": False} # required for SQLite + FastAPI
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def get_session():
 with Session(engine) as session:
 yield session

app = FastAPI()

@app.on_event("startup")
def on_startup():
 create_db_and_tables()
```

### CRUD Path Operations
```python
@app.post("/heroes/", response_model=HeroPublic)
def create_hero(*, session: Session = Depends(get_session), hero: HeroCreate):
 db_hero = Hero.model_validate(hero) # convert data model -> table model
 session.add(db_hero)
 session.commit()
 session.refresh(db_hero)
 return db_hero

@app.get("/heroes/", response_model=list[HeroPublic])
def read_heroes(*, session: Session = Depends(get_session),
 offset: int = 0, limit: int = Query(default=100, le=100)):
 return session.exec(select(Hero).offset(offset).limit(limit)).all()

@app.get("/heroes/{hero_id}", response_model=HeroPublic)
def read_hero(*, session: Session = Depends(get_session), hero_id: int):
 hero = session.get(Hero, hero_id)
 if not hero:
 raise HTTPException(status_code=404, detail="Hero not found")
 return hero

@app.patch("/heroes/{hero_id}", response_model=HeroPublic)
def update_hero(*, session: Session = Depends(get_session), hero_id: int, hero: HeroUpdate):
 db_hero = session.get(Hero, hero_id)
 if not db_hero:
 raise HTTPException(status_code=404, detail="Hero not found")
 hero_data = hero.model_dump(exclude_unset=True) # only fields the client sent
 db_hero.sqlmodel_update(hero_data)
 session.add(db_hero)
 session.commit()
 session.refresh(db_hero)
 return db_hero

@app.delete("/heroes/{hero_id}")
def delete_hero(*, session: Session = Depends(get_session), hero_id: int):
 hero = session.get(Hero, hero_id)
 if not hero:
 raise HTTPException(status_code=404, detail="Hero not found")
 session.delete(hero)
 session.commit()
 return {"ok": True}
```
Key methods:
- `Hero.model_validate(data, update={...})` — build a table model from a data model, optionally adding extra fields (e.g., a `hashed_password`).
- `obj.model_dump(exclude_unset=True)` — get only client-provided fields for partial updates.
- `db_obj.sqlmodel_update(data, update={...})` — apply updates plus extra data (≥ 0.0.16).

### Models with Relationships in Responses
To include related data, create dedicated response models and avoid infinite recursion by referencing the *plain* models:
```python
class HeroPublicWithTeam(HeroPublic):
 team: TeamPublic | None = None

class TeamPublicWithHeroes(TeamPublic):
 heroes: list[HeroPublic] = []
```

### Testing
- Override `get_session` via `app.dependency_overrides[get_session] = ...`.
- Use an in-memory SQLite DB with `StaticPool` for fast, isolated tests:
```python
from sqlmodel import StaticPool
engine = create_engine("sqlite://", connect_args={"check_same_thread": False},
 poolclass=StaticPool)
```
- Use pytest fixtures for `session` and `client` to avoid boilerplate.

## Advanced Patterns

### UUID Primary Keys (≥ 0.0.20)
```python
import uuid
class Hero(SQLModel, table=True):
 id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
 name: str = Field(index=True)
```
`default_factory=uuid.uuid4` (no parentheses) generates the UUID in Python before insert. UUIDs prevent ID-based information leakage and enable client-side ID generation.

### Decimal Numbers
```python
from decimal import Decimal
class Hero(SQLModel, table=True):
 id: int | None = Field(default=None, primary_key=True)
 money: Decimal = Field(default=0, max_digits=5, decimal_places=3)
```
Use `Decimal` for currency/precision-sensitive values. SQLite stores them as NUMERIC; most other databases support a true DECIMAL type.

### Code Structure / Circular Imports
- Simplest approach: keep all table models in a single `models.py` file.
- For separate model files with circular references, use `TYPE_CHECKING` and string annotations:
```python
from typing import TYPE_CHECKING
if TYPE_CHECKING:
 from .team_model import Team
```
- **Order matters:** import model modules before calling `SQLModel.metadata.create_all()`.

## Reference Files

This skill bundles the official SQLModel tutorial docs in `references/` (sourced from the `fastapi/sqlmodel` repo):

- **create-db-and-table.md** — defining table models (`table=True`), `Field`, the engine, `SQLModel.metadata.create_all`.
- **insert.md** / **select.md** / **where.md** / **one.md** — creating rows and reading them back; `select()`, `.where()`, fetching a single row.
- **update.md** / **delete.md** — modifying and removing rows via the session.
- **limit-and-offset.md** — pagination with `.limit()` / `.offset()`.
- **indexes.md** — single- and multi-column indexes via `Field(index=True)` / `__table_args__`.
- **automatic-id-none-refresh.md** — primary keys, `None` before commit, `session.refresh()`, expiry behavior.
- **create-connected-tables.md** / **read-connected-data.md** — foreign keys and querying across related tables with joins.
- **back-populates.md** / **relationships.md** — `Relationship()` attributes, `back_populates`, and using relationships in queries and FastAPI.

Use `view` to open a reference file when you need full, step-by-step examples.


## Common Pitfalls

- Use `session.exec()`, not `session.execute()`.
- Use `==` (not `=`) in `.where()` comparisons.
- `foreign_key="team.id"` uses the lowercase **table** name, not the class name.
- After `commit()`, objects are expired; accessing an attribute or calling `session.refresh()` reloads them.
- Quote forward-referenced model types: `list["Hero"]`.
- For SQLite with FastAPI, pass `connect_args={"check_same_thread": False}`.
- One engine per app; one session per group of operations (typically per request).

## Notes

- Reference files preserve the structure and runnable examples from the official documentation.
- SQLModel is a thin, compatible layer over Pydantic and SQLAlchemy — you can drop down to SQLAlchemy for exotic queries when needed.

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration.
2. The skill will be rebuilt with the latest information.