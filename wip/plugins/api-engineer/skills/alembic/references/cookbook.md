# Alembic_Docs - Cookbook

**Pages:** 1

---

## Cookbook

**URL:** https://alembic.sqlalchemy.org/en/latest/cookbook.html

**Contents:**
- Cookbook
- Contents
- Cookbook#
- Building an Up to Date Database from Scratch#
- Conditional Migration Elements#
- Sharing a Connection across one or more programmatic migration commands#
- Replaceable Objects#
  - The Replaceable Object Structure#
  - Create Operations for the Target Objects#
  - Publish the Extensions#

A collection of “How-Tos” highlighting popular ways to extend Alembic.

This is a new section where we catalogue various “how-tos” based on user requests. It is often the case that users will request a feature only to learn it can be provided with a simple customization.

There’s a theory of database migrations that says that the revisions in existence for a database should be able to go from an entirely blank schema to the finished product, and back again. Alembic can roll this way. Though we think it’s kind of overkill, considering that SQLAlchemy itself can emit the full CREATE statements for any given model using create_all(). If you check out a copy of an application, running this will give you the entire database in one shot, without the need to run through all those migration files, which are instead tailored towards applying incremental changes to an existing database.

Alembic can integrate with a create_all() script quite easily. After running the create operation, tell Alembic to create a new version table, and to stamp it with the most recent revision (i.e. head):

When this approach is used, the application can generate the database using normal SQLAlchemy techniques instead of iterating through hundreds of migration scripts. Now, the purpose of the migration scripts is relegated just to movement between versions on out-of-date databases, not new databases. You can now remove old migration files that are no longer represented on any existing environments.

To prune old migration files, simply delete the files. Then, in the earliest, still-remaining migration file, set down_revision to None:

That file now becomes the “base” of the migration series.

This example features the basic idea of a common need, that of affecting how a migration runs based on command line switches.

The technique to use here is simple; within a migration script, inspect the EnvironmentContext.get_x_argument() collection for any additional, user-defined parameters. Then take action based on the presence of those arguments.

To make it such that the logic to inspect these flags is easy to use and modify, we modify our script.py.mako template to make this feature available in all new revision files:

Now, when we create a new migration file, the data_upgrades() and data_downgrades() placeholders will be available, where we can add optional data migrations:

To invoke our migrations with data included, we use the -x flag:

The EnvironmentContext.get_x_argument() is an easy way to support new commandline options within environment and migration scripts.

It is often the case that an application will need to call upon a series of commands within Commands, where it would be advantageous for all operations to proceed along a single transaction. The connectivity for a migration is typically solely determined within the env.py script of a migration environment, which is called within the scope of a command.

The steps to take here are:

Produce the Connection object to use.

Place it somewhere that env.py will be able to access it. This can be either a. a module-level global somewhere, or b. an attribute which we place into the Config.attributes dictionary (if we are on an older Alembic version, we may also attach an attribute directly to the Config object).

The env.py script is modified such that it looks for this Connection and makes use of it, in lieu of building up its own Engine instance.

We illustrate using Config.attributes a script that will run the command.upgrade() command programmatically within a transaction declared in a Python file:

Then in env.py we can update run_migrations_online:

This recipe proposes a hypothetical way of dealing with what we might call a replaceable schema object. A replaceable object is a schema object that needs to be created and dropped all at once. Examples of such objects include views, stored procedures, and triggers.

The Replaceable Object concept has been integrated by the Alembic Utils project, which provides autogenerate and migration support for PostgreSQL functions and views. See Alembic Utils at olirice/alembic_utils .

Replaceable objects present a problem in that in order to make incremental changes to them, we have to refer to the whole definition at once. If we need to add a new column to a view, for example, we have to drop it entirely and recreate it fresh with the extra column added, referring to the whole structure; but to make it even tougher, if we wish to support downgrade operations in our migration scripts, we need to refer to the previous version of that construct fully, and we’d much rather not have to type out the whole definition in multiple places.

This recipe proposes that we may refer to the older version of a replaceable construct by directly naming the migration version in which it was created, and having a migration refer to that previous file as migrations run. We will also demonstrate how to integrate this logic within the Operation Plugins feature introduced in Alembic 0.8. It may be very helpful to review this section first to get an overview of this API.

We first need to devise a simple format that represents the “CREATE XYZ” / “DROP XYZ” aspect of what it is we’re building. We will work with an object that represents a textual definition; while a SQL view is an object that we can define using a table-metadata-like system, this is not so much the case for things like stored procedures, where we pretty much need to have a full string definition written down somewhere. We’ll use a simple value object called ReplaceableObject that can represent any named set of SQL text to send to a “CREATE” statement of some kind:

Using this object in a migration script, assuming a Postgresql-style syntax, looks like:

The ReplaceableObject class is only one very simplistic way to do this. The structure of how we represent our schema objects is not too important for the purposes of this example; we can just as well put strings inside of tuples or dictionaries, as well as that we could define any kind of series of fields and class structures we want. The only important part is that below we will illustrate how organize the code that can consume the structure we create here.

We’ll use the Operations extension API to make new operations for create, drop, and replace of views and stored procedures. Using this API is also optional; we can just as well make any kind of Python function that we would invoke from our migration scripts. However, using this API gives us operations built directly into the Alembic op.* namespace very nicely.

The most intricate class is below. This is the base of our “replaceable” operation, which includes not just a base operation for emitting CREATE and DROP instructions on a ReplaceableObject, it also assumes a certain model of “reversibility” which makes use of references to other migration files in order to refer to the “previous” version of an object:

The workings of this class should become clear as we walk through the example. To create usable operations from this base, we will build a series of stub classes and use Operations.register_operation() to make them part of the op.* namespace:

To actually run the SQL like “CREATE VIEW” and “DROP SEQUENCE”, we’ll provide implementations using Operations.implementation_for() that run straight into Operations.execute():

All of the above code can be present anywhere within an application’s source tree; the only requirement is that when the env.py script is invoked, it includes imports that ultimately call upon these classes as well as the Operations.register_operation() and Operations.implementation_for() sequences.

Alternatively, custom operations and autogenerate support can be organized into reusable plugins using Alembic’s plugin system. This allows extensions to be packaged and distributed independently, and automatically discovered via Python entry points. See Plugins for information on writing and publishing plugins.

We can now illustrate how these objects look during use. For the first step, we’ll create a new migration to create a “customer” table:

We build the first revision as follows:

For the second migration, we will create a view and a stored procedure which act upon this table:

This migration will use the new directives:

We see the use of our new create_view(), create_sp(), drop_view(), and drop_sp() directives. Running these to “head” we get the following (this includes an edited view of SQL emitted):

We see that our CREATE TABLE proceeded as well as the CREATE VIEW and CREATE FUNCTION operations produced by our new directives.

Finally, we can illustrate how we would “revise” these objects. Let’s consider we added a new column email to our customer table:

We now need to recreate the customer_view view and the add_customer_sp function. To include downgrade capability, we will need to refer to the previous version of the construct; the replace_view() and replace_sp() operations we’ve created make this possible, by allowing us to refer to a specific, previous revision. the replaces and replace_with arguments accept a dot-separated string, which refers to a revision number and an object name, such as "28af9800143f.customer_view". The ReversibleOp class makes use of the Operations.get_context() method to locate the version file we refer to:

Above, instead of using create_view(), create_sp(), drop_view(), and drop_sp() methods, we now use replace_view() and replace_sp(). The replace operation we’ve built always runs a DROP and a CREATE. Running an upgrade to head we see:

After adding our new email column, we see that both customer_view and add_customer_sp() are dropped before the new version is created. If we downgrade back to the old version, we see the old version of these recreated again within the downgrade for this migration:

Multi tenancy refers to an application that accommodates for many clients simultaneously. Within the scope of a database migrations tool, multi-tenancy typically refers to the practice of maintaining multiple, identical databases where each database is assigned to one client.

Alembic does not currently have explicit multi-tenant support; typically, the approach must involve running Alembic multiple times against different database URLs.

One common approach to multi-tenancy, particularly on the PostgreSQL database, is to install tenants within individual PostgreSQL schemas; similarly when using MySQL/MariaDB, individual MySQL/MariaDB databases are addressed in the same way as “schemas” on PostgreSQL.

When using PostgreSQL’s schemas, a special variable search_path is offered that is intended to assist with targeting of different schemas. When using MySQL or MariaDB databases, a similar command is available at the SQL level called the USE command. This command may be used in a similar fashion as that of PostgreSQL’s search_path variable to achieve a similar effect.

Overall, this recipe can be used on any database that supports runtime modification of the current “tenant” via SQL commands on a particular connection.

SQLAlchemy includes a system of directing a common set of Table metadata to many schemas called schema_translate_map. Alembic at the time of this writing lacks adequate support for this feature. The recipe below should be considered interim until Alembic has more first-class support for schema-level multi-tenancy.

The recipe below can be altered for flexibility. The primary purpose of this recipe is to illustrate how to point the Alembic process towards one PostgreSQL or MySQL/MariaDB schema or another.

The model metadata used as the target for autogenerate must not include any schema name for tables; the schema must be non-present or set to None. Otherwise, Alembic autogenerate will still attempt to compare and render tables in terms of this schema:

The EnvironmentContext.configure.include_schemas flag must also be False or not included.

The “tenant” will be a schema name passed to Alembic using the “-x” flag. In env.py an approach like the following allows -xtenant=some_schema to be supported by making use of EnvironmentContext.get_x_argument():

The current tenant is set using the PostgreSQL search_path variable, or the MySQL/MariaDB USE statement, on the connection. Note above we must employ a non-supported SQLAlchemy workaround at the moment which is to hardcode the SQLAlchemy dialect’s default schema name to our target schema.

It is also important to note that the above changes remain on the connection permanently unless reversed explicitly. If the alembic application simply exits above, there is no issue. However if the application attempts to continue using the above connection for other purposes, it may be necessary to reset these variables back to the default, which for PostgreSQL is usually the name “public” however may be different based on configuration, and for MySQL/MariaDB is typically the “database” portion of the database URL.

Alembic operations will now proceed in terms of whichever schema we pass on the command line. All logged SQL will show no schema, except for reflection operations which will make use of the default_schema_name attribute:

Since all schemas are to be maintained in sync, autogenerate should be run against only one schema, generating new Alembic migration files. Autogenerated migration operations are then run against all schemas.

A common request is to have the alembic revision --autogenerate command not actually generate a revision file if no changes to the schema is detected. Using the EnvironmentContext.configure.process_revision_directives hook, this is straightforward; place a process_revision_directives hook in MigrationContext.configure() which removes the single MigrationScript directive if it is empty of any operations:

MySQL may complain when dropping an index that is against a column that also has a foreign key constraint on it. If the table is to be dropped in any case, the DROP INDEX isn’t necessary. This recipe will process the set of autogenerate directives such that all DropIndexOp directives are removed against tables that themselves are to be dropped:

Whereas autogenerate, when dropping two tables with a foreign key and an index, would previously generate something like:

With the above rewriter, it generates as:

When running autogenerate against a database that has existing tables outside of the application’s autogenerated metadata, it may be desirable to prevent autogenerate from considering any of those existing tables to be dropped. This will prevent autogenerate from detecting tables removed from the local metadata as well however this is only a small caveat.

The most direct way to achieve this using the EnvironmentContext.configure.include_object hook. There is no need to hardcode a fixed “whitelist” of table names; the hook gives enough information in the given arguments to determine if a particular table name is not part of the local MetaData being autogenerated, by checking first that the type of object is "table", then that reflected is True, indicating this table name is from the local database connection, not the MetaData, and finally that compare_to is None, indicating autogenerate is not comparing this Table to any Table in the local MetaData collection:

This example illustrates use of the Rewriter object introduced at Fine-Grained Autogenerate Generation with Rewriters. While the rewriter grants access to the individual ops.MigrateOperation objects, there are sometimes some special techniques required to get around some structural limitations that are present.

One is when trying to reorganize the order of columns in a table within a ops.CreateTableOp directive. This directive, when generated by autogenerate, actually holds onto the original Table object as the source of its information, so attempting to reorder the ops.CreateTableOp.columns collection will usually have no effect. Instead, a new ops.CreateTableOp object may be constructed with the new ordering. However, a second issue is that the Column objects inside will already be associated with the Table that is from the model being autogenerated, meaning they can’t be reassigned directly to a new Table. To get around this, we can copy all the columns and constraints using methods like Column.copy().

Below we use Rewriter to create a new ops.CreateTableOp directive and to copy the Column objects from one into another, copying each column or constraint object and applying a new sorting scheme:

Above, when we apply the writer to a table such as:

This will render in the autogenerated file as:

Sometimes CREATE/DROP operations take too long during a production deployment and it is preferable to apply them offline, and still keep alembic migrations aligned and/or for test environments.

Using the rewriter makes it possible:

Same operation is possible for ADD/DROP COLUMN on postgresql/mariadb:

It is sometimes convenient to create Table instances for views so that they can be queried using normal SQLAlchemy techniques. Unfortunately this causes Alembic to treat them as tables in need of creation and to generate spurious create_table() operations. This is easily fixable by flagging such Tables and using the include_object hook to exclude them:

Or, if you use declarative tables:

Then define include_object as:

Finally, in env.py pass your include_object as a keyword argument to EnvironmentContext.configure().

Long before Alembic had the “multiple bases” feature described in Working with Multiple Bases, projects had a need to maintain more than one Alembic version history in a single project, where these version histories are completely independent of each other and each refer to their own alembic_version table, either across multiple databases, schemas, or namespaces. A simple approach was added to support this, the --name flag on the commandline. This flag allows named sections within the alembic.ini file to be present (but note it does not apply to pyproject.toml configuration, where only the [tool.alembic] section is used).

First, one would create an alembic.ini file of this form:

Above, in the [DEFAULT] section we set up a default database URL. Then we create three sections corresponding to different revision lineages in our project. Each of these directories would have its own env.py and set of versioning files. Then when we run the alembic command, we simply give it the name of the configuration we want to use:

Above, the alembic command makes use of the configuration in [schema2], populated with defaults from the [DEFAULT] section.

The above approach can be automated by creating a custom front-end to the Alembic commandline as well.

Suppose you have a database already, and want to generate some op.create_table() and other directives that you’d have in a migration file. How can we automate generating that code? Suppose the database schema looks like (assume MySQL):

Using ops.UpgradeOps, ops.CreateTableOp, and ops.CreateIndexOp, we create a migration file structure, using Table objects that we get from SQLAlchemy reflection. The structure is passed to autogenerate.render_python_code() to produce the Python code for a migration file:

The Operations object has a method known as Operations.invoke() that will generically invoke a particular operation object. We can therefore use the autogenerate.produce_migrations() function to run an autogenerate comparison, get back a ops.MigrationScript structure representing the changes, and with a little bit of insider information we can invoke them directly.

The traversal through the ops.MigrationScript structure is as follows:

Above, we detect elements that have a collection of operations by looking for the .ops attribute. A check for ModifyTableOps allows us to use a batch context if we are supporting that.

A full example follows. The overall setup here is copied from the example at autogenerate.compare_metadata():

Changed in version 1.17.1: This recipe is now part of the alembic current command using the command.current.check_heads parameter, available from the command line as --check-heads:

A recipe to determine if a database schema is up to date in terms of applying Alembic migrations. May be useful for test or installation suites to determine if the target database is up to date. Makes use of the MigrationContext.get_current_heads() as well as ScriptDirectory.get_heads() methods so that it accommodates for a branched revision tree:

MigrationContext.get_current_heads()

ScriptDirectory.get_heads()

SQLAlchemy version 1.4 introduced experimental support for asyncio, allowing use of most of its interface from async applications. Alembic currently does not provide an async api directly, but it can use an use SQLAlchemy Async engine to run the migrations and autogenerate.

New configurations can use the template “async” or “pyproject_async” to bootstrap an environment which can be used with async DBAPI like asyncpg, running the command:

Existing configurations can be updated to use an async DBAPI by updating the env.py file that’s used by Alembic to start its operations. In particular only run_migrations_online will need to be updated to be something like the example below:

An async application can also interact with the Alembic api directly by using the SQLAlchemy run_sync method to adapt the non-async api of Alembic to an async consumer.

Combining the examples of Sharing a Connection across one or more programmatic migration commands with Using Asyncio with Alembic together, the env.py listed above can be updated as follows works:

Above, using an asyncio database URL in alembic.ini one can run commands such as alembic upgrade from the command line. Programmatically, the same env.py file can be invoked using asyncio as:

Alembic migrations are designed for schema migrations. The nature of data migrations are inherently different and it’s not in fact advisable in the general case to write data migrations that integrate with Alembic’s schema versioning model. For example downgrades are difficult to address since they might require deletion of data, which may even not be possible to detect.

The solution needs to be designed specifically for each individual application and migration. There are no general rules and the following text is only a recommendation based on experience.

There are three basic approaches for the data migrations.

Small data migrations are easy to perform, especially in cases of initial data to a new table. These can be handled using Operations.bulk_insert().

One possibility is a completely separate script aside of alembic migrations. The complete migration is then processed in following steps:

Run the initial alembic migrations (new columns etc.)

Run the separate data migration script

Run the final alembic migrations (database constraints, delete columns etc.)

The data migration script may also need a separate ORM model to handle intermediate state of the database.

The application maintains a version of schema with both versions. Writes are performed on both places, while the background script move all the remaining data across. This technique is very challenging and time demanding, since it requires custom application logic to handle the intermediate states.

Added in version 1.15.3.

While Alembic does not have a plugin system that would allow transparently extending the original alembic CLI with additional commands, it is possible to create your own instance of CommandLine and extend that via CommandLine.register_command().

Any named function may be registered as a command, provided it accepts a Config object as the first argument; a docstring is also recommended as it will show up in the help output of the CLI.

© Copyright 2010-2026, Mike Bayer.

**Examples:**

Example 1 (python):
```python
# inside of a "create the database" script, first create
# tables:
my_metadata.create_all(engine)

# then, load the Alembic configuration and generate the
# version table, "stamping" it with the most recent rev:
from alembic.config import Config
from alembic import command
alembic_cfg = Config("/path/to/yourapp/alembic.ini")
command.stamp(alembic_cfg, "head")
```

Example 2 (typescript):
```typescript
# replace this:
#down_revision = '290696571ad2'

# with this:
down_revision = None
```

Example 3 (python):
```python
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision}
Create Date: ${create_date}

"""

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}

from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

from alembic import context


def upgrade():
    schema_upgrades()
    if context.get_x_argument(as_dictionary=True).get('data', None):
        data_upgrades()

def downgrade():
    if context.get_x_argument(as_dictionary=True).get('data', None):
        data_downgrades()
    schema_downgrades()

def schema_upgrades():
    """schema upgrade migrations go here."""
    ${upgrades if upgrades else "pass"}

def schema_downgrades():
    """schema downgrade migrations go here."""
    ${downgrades if downgrades else "pass"}

def data_upgrades():
    """Add any optional data upgrade migrations here!"""
    pass

def data_downgrades():
    """Add any optional data downgrade migrations here!"""
    pass
```

Example 4 (python):
```python
"""rev one

Revision ID: 3ba2b522d10d
Revises: None
Create Date: 2014-03-04 18:05:36.992867

"""

# revision identifiers, used by Alembic.
revision = '3ba2b522d10d'
down_revision = None

from alembic import op
import sqlalchemy as sa
from sqlalchemy import String, Column
from sqlalchemy.sql import table, column

from alembic import context

def upgrade():
    schema_upgrades()
    if context.get_x_argument(as_dictionary=True).get('data', None):
        data_upgrades()

def downgrade():
    if context.get_x_argument(as_dictionary=True).get('data', None):
        data_downgrades()
    schema_downgrades()

def schema_upgrades():
    """schema upgrade migrations go here."""
    op.create_table("my_table", Column('data', String))

def schema_downgrades():
    """schema downgrade migrations go here."""
    op.drop_table("my_table")

def data_upgrades():
    """Add any optional data upgrade migrations here!"""

    my_table = table('my_table',
        column('data', String),
    )

    op.bulk_insert(my_table,
        [
            {'data': 'data 1'},
            {'data': 'data 2'},
            {'data': 'data 3'},
        ]
    )

def data_downgrades():
    """Add any optional data downgrade migrations here!"""

    op.execute("delete from my_table")
```

---
