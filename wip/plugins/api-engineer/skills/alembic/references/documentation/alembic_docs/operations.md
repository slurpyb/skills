# Alembic_Docs - Operations

**Pages:** 3

---

## Operation Reference

**URL:** https://alembic.sqlalchemy.org/en/latest/ops.html

**Contents:**
- Operation Reference
- Contents
- Operation Reference#

This file provides documentation on Alembic migration directives.

The directives here are used within user-defined migration files, within the upgrade() and downgrade() functions, as well as any functions further invoked by those.

All directives exist as methods on a class called Operations. When migration scripts are run, this object is made available to the script via the alembic.op datamember, which is a proxy to an actual instance of Operations. Currently, alembic.op is a real Python module, populated with individual proxies for each method on Operations, so symbols can be imported safely from the alembic.op namespace.

The Operations system is also fully extensible. See Operation Plugins for details on this.

A key design philosophy to the Operation Directives methods is that to the greatest degree possible, they internally generate the appropriate SQLAlchemy metadata, typically involving Table and Constraint objects. This so that migration instructions can be given in terms of just the string names and/or flags involved. The exceptions to this rule include the add_column() and create_table() directives, which require full Column objects, though the table metadata is still generated here.

The functions here all require that a MigrationContext has been configured within the env.py script first, which is typically via EnvironmentContext.configure(). Under normal circumstances they are called from an actual migration script, which itself would be invoked by the EnvironmentContext.run_migrations() method.

Base class for Operations and BatchOperations.

See Operations for full list of members

Define high level migration operations.

Each operation corresponds to some schema migration operation, executed against a particular MigrationContext which in turn represents connectivity to a database, or a file output stream.

While Operations is normally configured as part of the EnvironmentContext.run_migrations() method called from an env.py script, a standalone Operations instance can be made for use cases external to regular Alembic migrations by passing in a MigrationContext:

Note that as of 0.8, most of the methods on this class are produced dynamically using the Operations.register_operation() method.

Construct a new Operations

migration_context¶ – a MigrationContext instance.

Issue an “add column” instruction using the current migration context.

The Operations.add_column() method typically corresponds to the SQL command “ALTER TABLE… ADD COLUMN”. Within the scope of this command, the column’s name, datatype, nullability, and optional server-generated defaults may be indicated. Options also exist for control of single-column primary key and foreign key constraints to be generated.

Not all constraint types may be indicated with this directive. NOT NULL, FOREIGN KEY, and CHECK are honored, PRIMARY KEY is conditionally honored, UNIQUE is currently not.

As of 1.18.2, the following Column parameters are ignored:

unique - use the Operations.create_unique_constraint() method

index - use the Operations.create_index() method

The provided Column object may include a primary_key=True directive, indicating the column intends to be part of a primary key constraint. However by default, the inline “PRIMARY KEY” directive is not emitted, and it’s assumed that a separate Operations.create_primary_key() directive will be used to create this constraint, which may potentially include other columns as well as have an explicit name. To instead render an inline “PRIMARY KEY” directive, the AddColumnOp.inline_primary_key parameter may be indicated at the same time as the primary_key parameter (both are needed):

The primary_key=True parameter on Column also indicates behaviors such as using the SERIAL datatype with the PostgreSQL database, which is why two separate, independent parameters are provided to support all combinations.

Added in version 1.18.4: Added AddColumnOp.inline_primary_key to control use of the PRIMARY KEY inline directive.

The provided Column object may include a ForeignKey constraint directive, referencing a remote table name. By default, Alembic will automatically emit a second ALTER statement in order to add the single-column FOREIGN KEY constraint separately:

To render the FOREIGN KEY constraint inline within the ADD COLUMN directive, use the inline_references parameter. This can improve performance on large tables since the constraint is marked as valid immediately for nullable columns:

Indicating server side defaults

The column argument passed to Operations.add_column() is a Column construct, used in the same way it’s used in SQLAlchemy. In particular, values or functions to be indicated as producing the column’s default value on the database side are specified using the server_default parameter, and not default which only specifies Python-side defaults:

table_name¶ – String name of the parent table.

column¶ – a sqlalchemy.schema.Column object representing the new column.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

if_not_exists¶ – If True, adds IF NOT EXISTS operator when creating the new column for compatible dialects Added in version 1.16.0.

If True, adds IF NOT EXISTS operator when creating the new column for compatible dialects

Added in version 1.16.0.

inline_references¶ – If True, renders FOREIGN KEY constraints inline within the ADD COLUMN directive using REFERENCES syntax, rather than as a separate ALTER TABLE ADD CONSTRAINT statement. This is supported by PostgreSQL, Oracle, MySQL 5.7+, and MariaDB 10.5+. Added in version 1.18.2.

If True, renders FOREIGN KEY constraints inline within the ADD COLUMN directive using REFERENCES syntax, rather than as a separate ALTER TABLE ADD CONSTRAINT statement. This is supported by PostgreSQL, Oracle, MySQL 5.7+, and MariaDB 10.5+.

Added in version 1.18.2.

inline_primary_key¶ – If True, renders the PRIMARY KEY phrase inline within the ADD COLUMN directive. When not present or False, PRIMARY KEY is not emitted; it is assumed that the migration script will include an additional Operations.create_primary_key() directive to create a full primary key constraint. Added in version 1.18.4.

If True, renders the PRIMARY KEY phrase inline within the ADD COLUMN directive. When not present or False, PRIMARY KEY is not emitted; it is assumed that the migration script will include an additional Operations.create_primary_key() directive to create a full primary key constraint.

Added in version 1.18.4.

Issue an “alter column” instruction using the current migration context.

Generally, only that aspect of the column which is being changed, i.e. name, type, nullability, default, needs to be specified. Multiple changes can also be specified at once and the backend should “do the right thing”, emitting each change either separately or together as the backend allows.

MySQL has special requirements here, since MySQL cannot ALTER a column without a full specification. When producing MySQL-compatible migration files, it is recommended that the existing_type, existing_server_default, and existing_nullable parameters be present, if not being altered.

Type changes which are against the SQLAlchemy “schema” types Boolean and Enum may also add or drop constraints which accompany those types on backends that don’t support them natively. The existing_type argument is used in this case to identify and remove a previous constraint that was bound to the type object.

table_name¶ – string name of the target table.

column_name¶ – string name of the target column, as it exists before the operation begins.

nullable¶ – Optional; specify True or False to alter the column’s nullability.

server_default¶ – Optional; specify a string SQL expression, text(), or DefaultClause to indicate an alteration to the column’s default value. Set to None to have the default removed.

comment¶ – optional string text of a new comment to add to the column.

new_column_name¶ – Optional; specify a string name here to indicate the new name within a column rename operation.

type_¶ – Optional; a TypeEngine type object to specify a change to the column’s type. For SQLAlchemy types that also indicate a constraint (i.e. Boolean, Enum), the constraint is also generated.

autoincrement¶ – set the AUTO_INCREMENT flag of the column; currently understood by the MySQL dialect.

existing_type¶ – Optional; a TypeEngine type object to specify the previous type. This is required for all MySQL column alter operations that don’t otherwise specify a new type, as well as for when nullability is being changed on a SQL Server column. It is also used if the type is a so-called SQLAlchemy “schema” type which may define a constraint (i.e. Boolean, Enum), so that the constraint can be dropped.

existing_server_default¶ – Optional; The existing default value of the column. Required on MySQL if an existing default is not being changed; else MySQL removes the default.

existing_nullable¶ – Optional; the existing nullability of the column. Required on MySQL if the existing nullability is not being changed; else MySQL sets this to NULL.

existing_autoincrement¶ – Optional; the existing autoincrement of the column. Used for MySQL’s system of altering a column that specifies AUTO_INCREMENT.

existing_comment¶ – string text of the existing comment on the column to be maintained. Required on MySQL if the existing comment on the column is not being changed.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

postgresql_using¶ – String argument which will indicate a SQL expression to render within the Postgresql-specific USING clause within ALTER COLUMN. This string is taken directly as raw SQL which must explicitly include any necessary quoting or escaping of tokens within the expression.

Invoke a series of per-table migrations in batch.

Batch mode allows a series of operations specific to a table to be syntactically grouped together, and allows for alternate modes of table migration, in particular the “recreate” style of migration required by SQLite.

“recreate” style is as follows:

A new table is created with the new specification, based on the migration directives within the batch, using a temporary name.

the data copied from the existing table to the new table.

the existing table is dropped.

the new table is renamed to the existing table name.

The directive by default will only use “recreate” style on the SQLite backend, and only if directives are present which require this form, e.g. anything other than add_column(). The batch operation on other backends will proceed using standard ALTER TABLE operations.

The method is used as a context manager, which returns an instance of BatchOperations; this object is the same as Operations except that table names and schema names are omitted. E.g.:

The operations within the context manager are invoked at once when the context is ended. When run against SQLite, if the migrations include operations not supported by SQLite’s ALTER TABLE, the entire table will be copied to a new one with the new specification, moving all data across as well.

The copy operation by default uses reflection to retrieve the current structure of the table, and therefore batch_alter_table() in this mode requires that the migration is run in “online” mode. The copy_from parameter may be passed which refers to an existing Table object, which will bypass this reflection step.

The table copy operation will currently not copy CHECK constraints, and may not copy UNIQUE constraints that are unnamed, as is possible on SQLite. See the section Dealing with Constraints for workarounds.

table_name¶ – name of table

schema¶ – optional schema name.

recreate¶ – under what circumstances the table should be recreated. At its default of "auto", the SQLite dialect will recreate the table if any operations other than add_column(), create_index(), or drop_index() are present. Other options include "always" and "never".

copy_from¶ – optional Table object that will act as the structure of the table being copied. If omitted, table reflection is used to retrieve the structure of the table. See also Working in Offline Mode reflect_args reflect_kwargs

optional Table object that will act as the structure of the table being copied. If omitted, table reflection is used to retrieve the structure of the table.

Working in Offline Mode

reflect_args¶ – a sequence of additional positional arguments that will be applied to the table structure being reflected / copied; this may be used to pass column and constraint overrides to the table that will be reflected, in lieu of passing the whole Table using copy_from.

reflect_kwargs¶ – a dictionary of additional keyword arguments that will be applied to the table structure being copied; this may be used to pass additional table and reflection options to the table that will be reflected, in lieu of passing the whole Table using copy_from.

table_args¶ – a sequence of additional positional arguments that will be applied to the new Table when created, in addition to those copied from the source table. This may be used to provide additional constraints such as CHECK constraints that may not be reflected.

table_kwargs¶ – a dictionary of additional keyword arguments that will be applied to the new Table when created, in addition to those copied from the source table. This may be used to provide for additional table options that may not be reflected.

naming_convention¶ – a naming convention dictionary of the form described at Integration of Naming Conventions into Operations, Autogenerate which will be applied to the MetaData during the reflection process. This is typically required if one wants to drop SQLite constraints, as these constraints will not have names when reflected on this backend. Requires SQLAlchemy 0.9.4 or greater. See also Dropping Unnamed or Named Foreign Key Constraints

a naming convention dictionary of the form described at Integration of Naming Conventions into Operations, Autogenerate which will be applied to the MetaData during the reflection process. This is typically required if one wants to drop SQLite constraints, as these constraints will not have names when reflected on this backend. Requires SQLAlchemy 0.9.4 or greater.

Dropping Unnamed or Named Foreign Key Constraints

partial_reordering¶ – a list of tuples, each suggesting a desired ordering of two or more columns in the newly created table. Requires that batch_alter_table.recreate is set to "always". Examples, given a table with columns “a”, “b”, “c”, and “d”: Specify the order of all columns: with op.batch_alter_table( "some_table", recreate="always", partial_reordering=[("c", "d", "a", "b")], ) as batch_op: pass Ensure “d” appears before “c”, and “b”, appears before “a”: with op.batch_alter_table( "some_table", recreate="always", partial_reordering=[("d", "c"), ("b", "a")], ) as batch_op: pass The ordering of columns not included in the partial_reordering set is undefined. Therefore it is best to specify the complete ordering of all columns for best results.

a list of tuples, each suggesting a desired ordering of two or more columns in the newly created table. Requires that batch_alter_table.recreate is set to "always". Examples, given a table with columns “a”, “b”, “c”, and “d”:

Specify the order of all columns:

Ensure “d” appears before “c”, and “b”, appears before “a”:

The ordering of columns not included in the partial_reordering set is undefined. Therefore it is best to specify the complete ordering of all columns for best results.

batch mode requires SQLAlchemy 0.8 or above.

Running “Batch” Migrations for SQLite and Other Databases

Issue a “bulk insert” operation using the current migration context.

This provides a means of representing an INSERT of multiple rows which works equally well in the context of executing on a live connection as well as that of generating a SQL script. In the case of a SQL script, the values are rendered inline into the statement.

When using –sql mode, some datatypes may not render inline automatically, such as dates and other special types. When this issue is present, Operations.inline_literal() may be used:

When using Operations.inline_literal() in conjunction with Operations.bulk_insert(), in order for the statement to work in “online” (e.g. non –sql) mode, the multiinsert flag should be set to False, which will have the effect of individual INSERT statements being emitted to the database, each with a distinct VALUES clause, so that the “inline” values can still be rendered, rather than attempting to pass the values as bound parameters.

table¶ – a table object which represents the target of the INSERT.

rows¶ – a list of dictionaries indicating rows.

multiinsert¶ – when at its default of True and –sql mode is not enabled, the INSERT statement will be executed using “executemany()” style, where all elements in the list of dictionaries are passed as bound parameters in a single list. Setting this to False results in individual INSERT statements being emitted per parameter set, and is needed in those cases where non-literal values are present in the parameter sets.

Issue a “create check constraint” instruction using the current migration context.

CHECK constraints are usually against a SQL expression, so ad-hoc table metadata is usually needed. The function will convert the given arguments into a sqlalchemy.schema.CheckConstraint bound to an anonymous table in order to emit the CREATE statement.

name¶ – Name of the check constraint. The name is necessary so that an ALTER statement can be emitted. For setups that use an automated naming scheme such as that described at Configuring Constraint Naming Conventions, name here can be None, as the event listener will apply the name to the constraint object when it is associated with the table.

table_name¶ – String name of the source table.

condition¶ – SQL expression that’s the condition of the constraint. Can be a string or SQLAlchemy expression language structure.

deferrable¶ – optional bool. If set, emit DEFERRABLE or NOT DEFERRABLE when issuing DDL for this constraint.

initially¶ – optional string. If set, emit INITIALLY <value> when issuing DDL for this constraint.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

Issue an alter to create an EXCLUDE constraint using the current migration context.

This method is Postgresql specific, and additionally requires at least SQLAlchemy 1.0.

Note that the expressions work the same way as that of the ExcludeConstraint object itself; if plain strings are passed, quoting rules must be applied manually.

name¶ – Name of the constraint.

table_name¶ – String name of the source table.

elements¶ – exclude conditions.

where¶ – SQL expression or SQL string with optional WHERE clause.

deferrable¶ – optional bool. If set, emit DEFERRABLE or NOT DEFERRABLE when issuing DDL for this constraint.

initially¶ – optional string. If set, emit INITIALLY <value> when issuing DDL for this constraint.

schema¶ – Optional schema name to operate within.

Issue a “create foreign key” instruction using the current migration context.

This internally generates a Table object containing the necessary columns, then generates a new ForeignKeyConstraint object which it then associates with the Table. Any event listeners associated with this action will be fired off normally. The AddConstraint construct is ultimately used to generate the ALTER statement.

constraint_name¶ – Name of the foreign key constraint. The name is necessary so that an ALTER statement can be emitted. For setups that use an automated naming scheme such as that described at Configuring Constraint Naming Conventions, name here can be None, as the event listener will apply the name to the constraint object when it is associated with the table.

source_table¶ – String name of the source table.

referent_table¶ – String name of the destination table.

local_cols¶ – a list of string column names in the source table.

remote_cols¶ – a list of string column names in the remote table.

onupdate¶ – Optional string. If set, emit ON UPDATE <value> when issuing DDL for this constraint. Typical values include CASCADE, DELETE and RESTRICT.

ondelete¶ – Optional string. If set, emit ON DELETE <value> when issuing DDL for this constraint. Typical values include CASCADE, DELETE and RESTRICT.

deferrable¶ – optional bool. If set, emit DEFERRABLE or NOT DEFERRABLE when issuing DDL for this constraint.

source_schema¶ – Optional schema name of the source table.

referent_schema¶ – Optional schema name of the destination table.

Issue a “create index” instruction using the current migration context.

Functional indexes can be produced by using the sqlalchemy.sql.expression.text() construct:

index_name¶ – name of the index.

table_name¶ – name of the owning table.

columns¶ – a list consisting of string column names and/or text() constructs.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

unique¶ – If True, create a unique index.

quote¶ – Force quoting of this column’s name on or off, corresponding to True or False. When left at its default of None, the column identifier will be quoted according to whether the name is case sensitive (identifiers with at least one upper case character are treated as case sensitive), or if it’s a reserved word. This flag is only needed to force quoting of a reserved word which is not known by the SQLAlchemy dialect.

if_not_exists¶ – If True, adds IF NOT EXISTS operator when creating the new index. Added in version 1.12.0.

If True, adds IF NOT EXISTS operator when creating the new index.

Added in version 1.12.0.

**kw¶ – Additional keyword arguments not mentioned above are dialect specific, and passed in the form <dialectname>_<argname>. See the documentation regarding an individual dialect at Dialects for detail on documented arguments.

Issue a “create primary key” instruction using the current migration context.

This internally generates a Table object containing the necessary columns, then generates a new PrimaryKeyConstraint object which it then associates with the Table. Any event listeners associated with this action will be fired off normally. The AddConstraint construct is ultimately used to generate the ALTER statement.

constraint_name¶ – Name of the primary key constraint. The name is necessary so that an ALTER statement can be emitted. For setups that use an automated naming scheme such as that described at Configuring Constraint Naming Conventions name here can be None, as the event listener will apply the name to the constraint object when it is associated with the table.

table_name¶ – String name of the target table.

columns¶ – a list of string column names to be applied to the primary key constraint.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

Issue a “create table” instruction using the current migration context.

This directive receives an argument list similar to that of the traditional sqlalchemy.schema.Table construct, but without the metadata:

Note that create_table() accepts Column constructs directly from the SQLAlchemy library. In particular, default values to be created on the database side are specified using the server_default parameter, and not default which only specifies Python-side defaults:

The function also returns a newly created Table object, corresponding to the table specification given, which is suitable for immediate SQL operations, in particular Operations.bulk_insert():

table_name¶ – Name of the table

*columns¶ – collection of Column objects within the table, as well as optional Constraint objects and Index objects.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

if_not_exists¶ – If True, adds IF NOT EXISTS operator when creating the new table. Added in version 1.13.3.

If True, adds IF NOT EXISTS operator when creating the new table.

Added in version 1.13.3.

**kw¶ – Other keyword arguments are passed to the underlying sqlalchemy.schema.Table object created for the command.

the Table object corresponding to the parameters given.

Emit a COMMENT ON operation to set the comment for a table.

table_name¶ – string name of the target table.

comment¶ – string value of the comment being registered against the specified table.

existing_comment¶ – String value of a comment already registered on the specified table, used within autogenerate so that the operation is reversible, but not required for direct use.

Operations.drop_table_comment()

Operations.alter_column.comment

Issue a “create unique constraint” instruction using the current migration context.

This internally generates a Table object containing the necessary columns, then generates a new UniqueConstraint object which it then associates with the Table. Any event listeners associated with this action will be fired off normally. The AddConstraint construct is ultimately used to generate the ALTER statement.

name¶ – Name of the unique constraint. The name is necessary so that an ALTER statement can be emitted. For setups that use an automated naming scheme such as that described at Configuring Constraint Naming Conventions, name here can be None, as the event listener will apply the name to the constraint object when it is associated with the table.

table_name¶ – String name of the source table.

columns¶ – a list of string column names in the source table.

deferrable¶ – optional bool. If set, emit DEFERRABLE or NOT DEFERRABLE when issuing DDL for this constraint.

initially¶ – optional string. If set, emit INITIALLY <value> when issuing DDL for this constraint.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

Issue a “drop column” instruction using the current migration context.

table_name¶ – name of table

column_name¶ – name of column

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

if_exists¶ – If True, adds IF EXISTS operator when dropping the new column for compatible dialects Added in version 1.16.0.

If True, adds IF EXISTS operator when dropping the new column for compatible dialects

Added in version 1.16.0.

mssql_drop_check¶ – Optional boolean. When True, on Microsoft SQL Server only, first drop the CHECK constraint on the column using a SQL-script-compatible block that selects into a @variable from sys.check_constraints, then exec’s a separate DROP CONSTRAINT for that constraint.

mssql_drop_default¶ – Optional boolean. When True, on Microsoft SQL Server only, first drop the DEFAULT constraint on the column using a SQL-script-compatible block that selects into a @variable from sys.default_constraints, then exec’s a separate DROP CONSTRAINT for that default.

mssql_drop_foreign_key¶ – Optional boolean. When True, on Microsoft SQL Server only, first drop a single FOREIGN KEY constraint on the column using a SQL-script-compatible block that selects into a @variable from sys.foreign_keys/sys.foreign_key_columns, then exec’s a separate DROP CONSTRAINT for that default. Only works if the column has exactly one FK constraint which refers to it, at the moment.

Drop a constraint of the given name, typically via DROP CONSTRAINT.

constraint_name¶ – name of the constraint.

table_name¶ – table name.

type_¶ – optional, required on MySQL. can be ‘foreignkey’, ‘primary’, ‘unique’, or ‘check’.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

if_exists¶ – If True, adds IF EXISTS operator when dropping the constraint Added in version 1.16.0.

If True, adds IF EXISTS operator when dropping the constraint

Added in version 1.16.0.

Issue a “drop index” instruction using the current migration context.

index_name¶ – name of the index.

table_name¶ – name of the owning table. Some backends such as Microsoft SQL Server require this.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

if_exists¶ – If True, adds IF EXISTS operator when dropping the index. Added in version 1.12.0.

If True, adds IF EXISTS operator when dropping the index.

Added in version 1.12.0.

**kw¶ – Additional keyword arguments not mentioned above are dialect specific, and passed in the form <dialectname>_<argname>. See the documentation regarding an individual dialect at Dialects for detail on documented arguments.

Issue a “drop table” instruction using the current migration context.

table_name¶ – Name of the table

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

if_exists¶ – If True, adds IF EXISTS operator when dropping the table. Added in version 1.13.3.

If True, adds IF EXISTS operator when dropping the table.

Added in version 1.13.3.

**kw¶ – Other keyword arguments are passed to the underlying sqlalchemy.schema.Table object created for the command.

Issue a “drop table comment” operation to remove an existing comment set on a table.

table_name¶ – string name of the target table.

existing_comment¶ – An optional string value of a comment already registered on the specified table.

Operations.create_table_comment()

Operations.alter_column.comment

Execute the given SQL using the current migration context.

The given SQL can be a plain string, e.g.:

Or it can be any kind of Core SQL Expression construct, such as below where we use an update construct:

Above, we made use of the SQLAlchemy sqlalchemy.sql.expression.table() and sqlalchemy.sql.expression.column() constructs to make a brief, ad-hoc table construct just for our UPDATE statement. A full Table construct of course works perfectly fine as well, though note it’s a recommended practice to at least ensure the definition of a table is self-contained within the migration script, rather than imported from a module that may break compatibility with older migrations.

In a SQL script context, the statement is emitted directly to the output stream. There is no return result, however, as this function is oriented towards generating a change script that can run in “offline” mode. Additionally, parameterized statements are discouraged here, as they will not work in offline mode. Above, we use inline_literal() where parameters are to be used.

For full interaction with a connected database where parameters can also be used normally, use the “bind” available from the context:

Additionally, when passing the statement as a plain string, it is first coerced into a sqlalchemy.sql.expression.text() construct before being passed along. In the less likely case that the literal SQL string contains a colon, it must be escaped with a backslash, as:

sqltext¶ – Any legal SQLAlchemy expression, including:

a sqlalchemy.sql.expression.text() construct.

a sqlalchemy.sql.expression.insert() construct.

a sqlalchemy.sql.expression.update() construct.

a sqlalchemy.sql.expression.delete() construct.

Any “executable” described in SQLAlchemy Core documentation, noting that no result set is returned.

when passing a plain string, the statement is coerced into a sqlalchemy.sql.expression.text() construct. This construct considers symbols with colons, e.g. :foo to be bound parameters. To avoid this, ensure that colon symbols are escaped, e.g. \:foo.

execution_options¶ – Optional dictionary of execution options, will be passed to sqlalchemy.engine.Connection.execution_options().

Indicate a string name that has already had a naming convention applied to it.

This feature combines with the SQLAlchemy naming_convention feature to disambiguate constraint names that have already had naming conventions applied to them, versus those that have not. This is necessary in the case that the "%(constraint_name)s" token is used within a naming convention, so that it can be identified that this particular name should remain fixed.

If the Operations.f() is used on a constraint, the naming convention will not take effect:

Above, the CHECK constraint generated will have the name ck_bool_t_x regardless of whether or not a naming convention is in use.

Alternatively, if a naming convention is in use, and ‘f’ is not used, names will be converted along conventions. If the target_metadata contains the naming convention {"ck": "ck_bool_%(table_name)s_%(constraint_name)s"}, then the output of the following:

The function is rendered in the output of autogenerate when a particular constraint name is already converted.

Return the current ‘bind’.

Under normal circumstances, this is the Connection currently being used to emit SQL to the database.

In a SQL script context, this value is None. [TODO: verify this]

Return the MigrationContext object that’s currently in use.

Register an implementation for a given MigrateOperation.

replace¶ – when True, allows replacement of an already registered implementation for the given operation class. This enables customization of built-in operations such as CreateTableOp by providing an alternate implementation that can augment, modify, or conditionally invoke the default behavior. Added in version 1.17.2.

when True, allows replacement of an already registered implementation for the given operation class. This enables customization of built-in operations such as CreateTableOp by providing an alternate implementation that can augment, modify, or conditionally invoke the default behavior.

Added in version 1.17.2.

This is part of the operation extensibility API.

Extending Existing Operations

Produce an ‘inline literal’ expression, suitable for using in an INSERT, UPDATE, or DELETE statement.

When using Alembic in “offline” mode, CRUD operations aren’t compatible with SQLAlchemy’s default behavior surrounding literal values, which is that they are converted into bound values and passed separately into the execute() method of the DBAPI cursor. An offline SQL script needs to have these rendered inline. While it should always be noted that inline literal values are an enormous security hole in an application that handles untrusted input, a schema migration is not run in this context, so literals are safe to render inline, with the caveat that advanced types like dates may not be supported directly by SQLAlchemy.

See Operations.execute() for an example usage of Operations.inline_literal().

The environment can also be configured to attempt to render “literal” values inline automatically, for those simple types that are supported by the dialect; see EnvironmentContext.configure.literal_binds for this more recently added feature.

value¶ – The value to render. Strings, integers, and simple numerics should be supported. Other types like boolean, dates, etc. may or may not be supported yet by various backends.

type_¶ – optional - a sqlalchemy.types.TypeEngine subclass stating the type of this value. In SQLAlchemy expressions, this is usually derived automatically from the Python type of the value itself, as well as based on the context in which the value is used.

EnvironmentContext.configure.literal_binds

Given a MigrateOperation, invoke it in terms of this Operations instance.

Register a new operation for this class.

This method is normally used to add new operations to the Operations class, and possibly the BatchOperations class as well. All Alembic migration operations are implemented via this system, however the system is also available as a public API to facilitate adding custom operations.

Emit an ALTER TABLE to rename a table.

old_table_name¶ – old name.

new_table_name¶ – new name.

schema¶ – Optional schema name to operate within. To control quoting of the schema outside of the default behavior, use the SQLAlchemy construct quoted_name.

Invoke the given asynchronous callable, passing an asynchronous AsyncConnection as the first argument.

This method allows calling async functions from within the synchronous upgrade() or downgrade() alembic migration method.

The async connection passed to the callable shares the same transaction as the connection running in the migration context.

Any additional arg or kw_arg passed to this function are passed to the provided async function.

This method can be called only when alembic is called using an async dialect.

Modifies the interface Operations for batch mode.

This basically omits the table_name and schema parameters from associated methods, as these are a given when running under batch mode.

Operations.batch_alter_table()

Note that as of 0.8, most of the methods on this class are produced dynamically using the Operations.register_operation() method.

Construct a new Operations

migration_context¶ – a MigrationContext instance.

Issue an “add column” instruction using the current batch migration context.

Operations.add_column()

Issue an “alter column” instruction using the current batch migration context.

Parameters are the same as that of Operations.alter_column(), as well as the following option(s):

insert_before¶ – String name of an existing column which this column should be placed before, when creating the new table.

insert_after¶ – String name of an existing column which this column should be placed after, when creating the new table. If both BatchOperations.alter_column.insert_before and BatchOperations.alter_column.insert_after are omitted, the column is inserted after the last existing column in the table.

Operations.alter_column()

Issue a “create check constraint” instruction using the current batch migration context.

The batch form of this call omits the source and schema arguments from the call.

Operations.create_check_constraint()

Issue a “create exclude constraint” instruction using the current batch migration context.

This method is Postgresql specific, and additionally requires at least SQLAlchemy 1.0.

Operations.create_exclude_constraint()

Issue a “create foreign key” instruction using the current batch migration context.

The batch form of this call omits the source and source_schema arguments from the call.

Operations.create_foreign_key()

Issue a “create index” instruction using the current batch migration context.

Operations.create_index()

Issue a “create primary key” instruction using the current batch migration context.

The batch form of this call omits the table_name and schema arguments from the call.

Operations.create_primary_key()

Emit a COMMENT ON operation to set the comment for a table using the current batch migration context.

comment¶ – string value of the comment being registered against the specified table.

existing_comment¶ – String value of a comment already registered on the specified table, used within autogenerate so that the operation is reversible, but not required for direct use.

Issue a “create unique constraint” instruction using the current batch migration context.

The batch form of this call omits the source and schema arguments from the call.

Operations.create_unique_constraint()

Issue a “drop column” instruction using the current batch migration context.

Operations.drop_column()

Issue a “drop constraint” instruction using the current batch migration context.

The batch form of this call omits the table_name and schema arguments from the call.

Operations.drop_constraint()

Issue a “drop index” instruction using the current batch migration context.

Operations.drop_index()

Issue a “drop table comment” operation to remove an existing comment set on a table using the current batch operations context.

existing_comment¶ – An optional string value of a comment already registered on the specified table.

Execute the given SQL using the current migration context.

Working with Branches

© Copyright 2010-2026, Mike Bayer.

**Examples:**

Example 1 (sass):
```sass
from alembic.migration import MigrationContext
from alembic.operations import Operations

conn = myengine.connect()
ctx = MigrationContext.configure(conn)
op = Operations(ctx)

op.alter_column("t", "c", nullable=True)
```

Example 2 (python):
```python
from alembic import op
from sqlalchemy import Column, String

op.add_column("organization", Column("name", String()))
```

Example 3 (sass):
```sass
from alembic import op
from sqlalchemy import Column, INTEGER

op.add_column(
    "organization",
    Column("id", INTEGER, primary_key=True),
    inline_primary_key=True
)
```

Example 4 (python):
```python
from alembic import op
from sqlalchemy import Column, INTEGER, ForeignKey

op.add_column(
    "organization",
    Column("account_id", INTEGER, ForeignKey("accounts.id")),
)
```

---

## DDL Internals

**URL:** https://alembic.sqlalchemy.org/en/latest/api/ddl.html

**Contents:**
- DDL Internals
- Contents
- DDL Internals#
- MySQL#
- MS-SQL#
- Postgresql#
- SQLite#

These are some of the constructs used to generate migration instructions. The APIs here build off of the sqlalchemy.schema.DDLElement and Custom SQL Constructs and Compilation Extension systems.

For programmatic usage of Alembic’s migration directives, the easiest route is to use the higher level functions given by Operation Directives.

Represent an ALTER TABLE statement.

Only the string name and optional schema name of the table is required, not a full Table object.

quote the elements of a dotted name

Provide the entrypoint for major migration operations, including database-specific behavioral variances.

While individual SQL/DDL constructs already provide for database-specific implementations, variances here allow for entirely different sequences of operations to take place for a particular migration, such as SQL Server’s special ‘IDENTITY INSERT’ step for bulk inserts.

A hook that is attached to the ‘column_reflect’ event for when a Table is reflected from the database during the autogenerate process.

Dialects can elect to modify the information gathered here.

Compare two indexes by comparing the signature generated by create_index_sig.

This method returns a ComparisonResult.

Returns True if there ARE differences between the types of the two columns. Takes impl.type_synonyms into account between retrospected and metadata types

Compare two unique constraints by comparing the two signatures.

The arguments are two tuples that contain the unique constraint and the signatures generated by create_unique_constraint_sig.

This method returns a ComparisonResult.

Emit the string BEGIN, or the backend-specific equivalent, on the current connection context.

This is used in offline mode and typically via EnvironmentContext.begin_transaction().

Emit the string COMMIT, or the backend-specific equivalent, on the current connection context.

This is used in offline mode and typically via EnvironmentContext.begin_transaction().

perform any operations needed on a table before a new one is created to replace it in batch mode.

the PG dialect uses this to drop constraints on the table before the new one uses those same names.

Render a SQL expression that is typically a server default, index expression, etc.

Return True if the given BatchOperationsImpl would need the table to be recreated and copied in order to proceed.

Normally, only returns True on SQLite when operations other than add_column are present.

A hook called when EnvironmentContext.run_migrations() is called.

Implementations can set up per-migration-run state here.

Generate a Table object which will be used as the structure for the Alembic version table.

Third party dialects may override this hook to provide an alternate structure for this Table; requirements are only that it be named based on the version_table parameter and contains at least a single string-holding column named version_num.

Added in version 1.14.

Create new instance of Params(token0, tokens, args, kwargs)

Alias for field number 2

Alias for field number 3

Alias for field number 0

Alias for field number 1

Override compare_type to properly detect MySQL native ENUM changes.

This addresses the issue where autogenerate fails to detect when new values are added to or removed from MySQL native ENUM columns.

Render a SQL expression that is typically a server default, index expression, etc.

Bases: MySQLChangeColumn

Emit the string BEGIN, or the backend-specific equivalent, on the current connection context.

This is used in offline mode and typically via EnvironmentContext.begin_transaction().

Emit the string COMMIT, or the backend-specific equivalent, on the current connection context.

This is used in offline mode and typically via EnvironmentContext.begin_transaction().

Bases: AddConstraintOp

Represent a create exclude constraint operation.

This method is proxied on the BatchOperations class, via the BatchOperations.create_exclude_constraint() method.

This method is proxied on the Operations class, via the Operations.create_exclude_constraint() method.

A hook that is attached to the ‘column_reflect’ event for when a Table is reflected from the database during the autogenerate process.

Dialects can elect to modify the information gathered here.

Compare two indexes by comparing the signature generated by create_index_sig.

This method returns a ComparisonResult.

Compare two unique constraints by comparing the two signatures.

The arguments are two tuples that contain the unique constraint and the signatures generated by create_unique_constraint_sig.

This method returns a ComparisonResult.

perform any operations needed on a table before a new one is created to replace it in batch mode.

the PG dialect uses this to drop constraints on the table before the new one uses those same names.

Render a SQL expression that is typically a server default, index expression, etc.

A hook that is attached to the ‘column_reflect’ event for when a Table is reflected from the database during the autogenerate process.

Dialects can elect to modify the information gathered here.

Render a SQL expression that is typically a server default, index expression, etc.

Return True if the given BatchOperationsImpl would need the table to be recreated and copied in order to proceed.

Normally, only returns True on SQLite when operations other than add_column are present.

SQLite supports transactional DDL, but pysqlite does not: see: http://bugs.python.org/issue10740

© Copyright 2010-2026, Mike Bayer.

---

## Operation Directives

**URL:** https://alembic.sqlalchemy.org/en/latest/api/operations.html

**Contents:**
- Operation Directives
- Contents
- Operation Directives#
- Operation Plugins#
- Built-in Operation Objects#
- Extending Existing Operations#

this section discusses the internal API of Alembic as regards the internal system of defining migration operation directives. This section is only useful for developers who wish to extend the capabilities of Alembic. For end-user guidance on Alembic migration operations, please see Operation Reference.

Within migration scripts, actual database migration operations are handled via an instance of Operations. The Operations class lists out available migration operations that are linked to a MigrationContext, which communicates instructions originated by the Operations object into SQL that is sent to a database or SQL output stream.

Most methods on the Operations class are generated dynamically using a “plugin” system, described in the next section Operation Plugins. Additionally, when Alembic migration scripts actually run, the methods on the current Operations object are proxied out to the alembic.op module, so that they are available using module-style access.

For an overview of how to use an Operations object directly in programs, as well as for reference to the standard operation methods as well as “batch” methods, see Operation Reference.

The Operations object is extensible using a plugin system. This system allows one to add new op.<some_operation> methods at runtime. The steps to use this system are to first create a subclass of MigrateOperation, register it using the Operations.register_operation() class decorator, then build a default “implementation” function which is established using the Operations.implementation_for() decorator.

Below we illustrate a very simple operation CreateSequenceOp which will implement a new method op.create_sequence() for use in migration scripts:

Above, the CreateSequenceOp and DropSequenceOp classes represent new operations that will be available as op.create_sequence() and op.drop_sequence(). The reason the operations are represented as stateful classes is so that an operation and a specific set of arguments can be represented generically; the state can then correspond to different kinds of operations, such as invoking the instruction against a database, or autogenerating Python code for the operation into a script.

In order to establish the migrate-script behavior of the new operations, we use the Operations.implementation_for() decorator:

Above, we use the simplest possible technique of invoking our DDL, which is just to call Operations.execute() with literal SQL. If this is all a custom operation needs, then this is fine. However, options for more comprehensive support include building out a custom SQL construct, as documented at Custom SQL Constructs and Compilation Extension.

With the above two steps, a migration script can now use new methods op.create_sequence() and op.drop_sequence() that will proxy to our object as a classmethod:

The registration of new operations only needs to occur in time for the env.py script to invoke MigrationContext.run_migrations(); within the module level of the env.py script is sufficient.

Autogenerating Custom Operation Directives - how to add autogenerate support to custom operations.

The migration operations present on Operations are themselves delivered via operation objects that represent an operation and its arguments. All operations descend from the MigrateOperation class, and are registered with the Operations class using the Operations.register_operation() class decorator. The MigrateOperation objects also serve as the basis for how the autogenerate system renders new migration scripts.

Customizing Revision Generation

The built-in operation objects are listed below.

Represent an add column operation.

This method is proxied on the Operations class, via the Operations.add_column() method.

This method is proxied on the BatchOperations class, via the BatchOperations.add_column() method.

Represent an add constraint operation.

Represent an alter column operation.

This method is proxied on the Operations class, via the Operations.alter_column() method.

This method is proxied on the BatchOperations class, via the BatchOperations.alter_column() method.

Represent an alter table operation.

Represent a bulk insert operation.

This method is proxied on the Operations class, via the Operations.bulk_insert() method.

Represent a create check constraint operation.

This method is proxied on the BatchOperations class, via the BatchOperations.create_check_constraint() method.

This method is proxied on the Operations class, via the Operations.create_check_constraint() method.

Represent a create foreign key constraint operation.

This method is proxied on the BatchOperations class, via the BatchOperations.create_foreign_key() method.

This method is proxied on the Operations class, via the Operations.create_foreign_key() method.

Represent a create index operation.

This method is proxied on the BatchOperations class, via the BatchOperations.create_index() method.

This method is proxied on the Operations class, via the Operations.create_index() method.

Represent a create primary key operation.

This method is proxied on the BatchOperations class, via the BatchOperations.create_primary_key() method.

This method is proxied on the Operations class, via the Operations.create_primary_key() method.

Represent a COMMENT ON table operation.

This method is proxied on the BatchOperations class, via the BatchOperations.create_table_comment() method.

This method is proxied on the Operations class, via the Operations.create_table_comment() method.

Reverses the COMMENT ON operation against a table.

Represent a create table operation.

This method is proxied on the Operations class, via the Operations.create_table() method.

Represent a create unique constraint operation.

This method is proxied on the BatchOperations class, via the BatchOperations.create_unique_constraint() method.

This method is proxied on the Operations class, via the Operations.create_unique_constraint() method.

contains a sequence of operations that would apply to the ‘downgrade’ stream of a script.

Customizing Revision Generation

Represent a drop column operation.

This method is proxied on the BatchOperations class, via the BatchOperations.drop_column() method.

This method is proxied on the Operations class, via the Operations.drop_column() method.

Represent a drop constraint operation.

This method is proxied on the BatchOperations class, via the BatchOperations.drop_constraint() method.

This method is proxied on the Operations class, via the Operations.drop_constraint() method.

Represent a drop index operation.

This method is proxied on the BatchOperations class, via the BatchOperations.drop_index() method.

This method is proxied on the Operations class, via the Operations.drop_index() method.

Represent an operation to remove the comment from a table.

This method is proxied on the BatchOperations class, via the BatchOperations.drop_table_comment() method.

This method is proxied on the Operations class, via the Operations.drop_table_comment() method.

Reverses the COMMENT ON operation against a table.

Represent a drop table operation.

This method is proxied on the Operations class, via the Operations.drop_table() method.

Represent an execute SQL operation.

This method is proxied on the BatchOperations class, via the BatchOperations.execute() method.

This method is proxied on the Operations class, via the Operations.execute() method.

base class for migration command and organization objects.

This system is part of the operation extensibility API.

Built-in Operation Objects

Customizing Revision Generation

A dictionary that may be used to store arbitrary information along with this MigrateOperation object.

represents a migration script.

E.g. when autogenerate encounters this object, this corresponds to the production of an actual script file.

A normal MigrationScript object would contain a single UpgradeOps and a single DowngradeOps directive. These are accessible via the .upgrade_ops and .downgrade_ops attributes.

In the case of an autogenerate operation that runs multiple times, such as the multiple database example in the “multidb” template, the .upgrade_ops and .downgrade_ops attributes are disabled, and instead these objects should be accessed via the .upgrade_ops_list and .downgrade_ops_list list-based attributes. These latter attributes are always available at the very least as single-element lists.

Customizing Revision Generation

An instance of DowngradeOps.

MigrationScript.downgrade_ops_list

A list of DowngradeOps instances.

This is used in place of the MigrationScript.downgrade_ops attribute when dealing with a revision operation that does multiple autogenerate passes.

An instance of UpgradeOps.

MigrationScript.upgrade_ops_list

A list of UpgradeOps instances.

This is used in place of the MigrationScript.upgrade_ops attribute when dealing with a revision operation that does multiple autogenerate passes.

Contains a sequence of operations that all apply to a single Table.

Represent a sequence of operations operation.

Represent a rename table operation.

This method is proxied on the Operations class, via the Operations.rename_table() method.

contains a sequence of operations that would apply to the ‘upgrade’ stream of a script.

Customizing Revision Generation

Added in version 1.17.2.

The Operations.implementation_for.replace parameter allows replacement of existing operation implementations, including built-in operations such as CreateTableOp. This enables customization of migration execution for purposes such as logging operations, running integrity checks, conditionally canceling operations, or adapting operations with dialect-specific options.

The example below illustrates replacing the implementation of CreateTableOp to log each table creation to a separate metadata table:

The above code can be placed in the env.py file to ensure it is loaded before migrations run. Once registered, all op.create_table() calls within migration scripts will use the augmented implementation.

The original implementation is imported from alembic.operations.toimpl and invoked within the replacement implementation. The replace parameter also enables conditional execution or complete replacement of operation behavior. The example below demonstrates skipping a CreateTableOp based on custom logic:

© Copyright 2010-2026, Mike Bayer.

**Examples:**

Example 1 (python):
```python
from alembic.operations import Operations, MigrateOperation

@Operations.register_operation("create_sequence")
class CreateSequenceOp(MigrateOperation):
    """Create a SEQUENCE."""

    def __init__(self, sequence_name, schema=None):
        self.sequence_name = sequence_name
        self.schema = schema

    @classmethod
    def create_sequence(cls, operations, sequence_name, **kw):
        """Issue a "CREATE SEQUENCE" instruction."""

        op = CreateSequenceOp(sequence_name, **kw)
        return operations.invoke(op)

    def reverse(self):
        # only needed to support autogenerate
        return DropSequenceOp(self.sequence_name, schema=self.schema)

@Operations.register_operation("drop_sequence")
class DropSequenceOp(MigrateOperation):
    """Drop a SEQUENCE."""

    def __init__(self, sequence_name, schema=None):
        self.sequence_name = sequence_name
        self.schema = schema

    @classmethod
    def drop_sequence(cls, operations, sequence_name, **kw):
        """Issue a "DROP SEQUENCE" instruction."""

        op = DropSequenceOp(sequence_name, **kw)
        return operations.invoke(op)

    def reverse(self):
        # only needed to support autogenerate
        return CreateSequenceOp(self.sequence_name, schema=self.schema)
```

Example 2 (python):
```python
@Operations.implementation_for(CreateSequenceOp)
def create_sequence(operations, operation):
    if operation.schema is not None:
        name = "%s.%s" % (operation.schema, operation.sequence_name)
    else:
        name = operation.sequence_name
    operations.execute("CREATE SEQUENCE %s" % name)


@Operations.implementation_for(DropSequenceOp)
def drop_sequence(operations, operation):
    if operation.schema is not None:
        name = "%s.%s" % (operation.schema, operation.sequence_name)
    else:
        name = operation.sequence_name
    operations.execute("DROP SEQUENCE %s" % name)
```

Example 3 (python):
```python
def upgrade():
    op.create_sequence("my_sequence")

def downgrade():
    op.drop_sequence("my_sequence")
```

Example 4 (python):
```python
from alembic import op
from alembic.operations import Operations
from alembic.operations.ops import CreateTableOp
from alembic.operations.toimpl import create_table as _create_table
from sqlalchemy import MetaData, Table, Column, String

# Define a metadata table to track table operations
log_table = Table(
    "table_metadata_log",
    MetaData(),
    Column("operation", String),
    Column("table_name", String),
)

@Operations.implementation_for(CreateTableOp, replace=True)
def create_table_with_logging(operations, operation):
    # First, run the original CREATE TABLE implementation
    _create_table(operations, operation)

    # Then, log the operation to the metadata table
    operations.execute(
        log_table.insert().values(
            operation="create",
            table_name=operation.table_name
        )
    )
```

---
