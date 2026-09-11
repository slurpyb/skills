# Alembic_Docs - Other

**Pages:** 8

---

## Welcome to Alembic’s documentation!

**URL:** https://alembic.sqlalchemy.org/en/latest/

**Contents:**
- Welcome to Alembic’s documentation!
- Contents
- Welcome to Alembic’s documentation!#
- Indices and tables#

Alembic is a lightweight database migration tool for usage with the SQLAlchemy Database Toolkit for Python.

© Copyright 2010-2026, Mike Bayer.

---

## Runtime Objects

**URL:** https://alembic.sqlalchemy.org/en/latest/api/runtime.html

**Contents:**
- Runtime Objects
- Contents
- Runtime Objects#
- The Environment Context#
- The Migration Context#

The “runtime” of Alembic involves the EnvironmentContext and MigrationContext objects. These are the objects that are in play once the env.py script is loaded up by a command and a migration operation proceeds.

The EnvironmentContext class provides most of the API used within an env.py script. Within env.py, the instantiated EnvironmentContext is made available via a special proxy module called alembic.context. That is, you can import alembic.context like a regular Python module, and each name you call upon it is ultimately routed towards the current EnvironmentContext in use.

In particular, the key method used within env.py is EnvironmentContext.configure(), which establishes all the details about how the database will be accessed.

A configurational facade made available in an env.py script.

The EnvironmentContext acts as a facade to the more nuts-and-bolts objects of MigrationContext as well as certain aspects of Config, within the context of the env.py script that is invoked by most Alembic commands.

EnvironmentContext is normally instantiated when a command in alembic.command is run. It then makes itself available in the alembic.context module for the scope of the command. From within an env.py script, the current EnvironmentContext is available by importing this module.

EnvironmentContext also supports programmatic usage. At this level, it acts as a Python context manager, that is, is intended to be used using the with: statement. A typical use of EnvironmentContext:

The above script will invoke the env.py script within the migration environment. If and when env.py calls MigrationContext.run_migrations(), the my_function() function above will be called by the MigrationContext, given the context itself as well as the current revision in the database.

For most API usages other than full blown invocation of migration scripts, the MigrationContext and ScriptDirectory objects can be created and used directly. The EnvironmentContext object is only needed when you need to actually invoke the env.py module present in the migration environment.

Construct a new EnvironmentContext.

config¶ – a Config instance.

script¶ – a ScriptDirectory instance.

**kw¶ – keyword options that will be ultimately passed along to the MigrationContext when EnvironmentContext.configure() is called.

Return a context manager that will enclose an operation within a “transaction”, as defined by the environment’s offline and transactional DDL settings.

begin_transaction() is intended to “do the right thing” regardless of calling context:

If is_transactional_ddl() is False, returns a “do nothing” context manager which otherwise produces no transactional state or directives.

If is_offline_mode() is True, returns a context manager that will invoke the DefaultImpl.emit_begin() and DefaultImpl.emit_commit() methods, which will produce the string directives BEGIN and COMMIT on the output stream, as rendered by the target backend (e.g. SQL Server would emit BEGIN TRANSACTION).

Otherwise, calls sqlalchemy.engine.Connection.begin() on the current online connection, which returns a sqlalchemy.engine.Transaction object. This object demarcates a real transaction and is itself a context manager, which will roll back if an exception is raised.

Note that a custom env.py script which has more specific transactional needs can of course manipulate the Connection directly to produce transactional state in “online” mode.

An instance of Config representing the configuration file contents as well as other variables set programmatically within it.

Configure a MigrationContext within this EnvironmentContext which will provide database connectivity and other configuration to a series of migration scripts.

Many methods on EnvironmentContext require that this method has been called in order to function, as they ultimately need to have database access or at least access to the dialect in use. Those which do are documented as such.

The important thing needed by configure() is a means to determine what kind of database dialect is in use. An actual connection to that database is needed only if the MigrationContext is to be used in “online” mode.

If the is_offline_mode() function returns True, then no connection is needed here. Otherwise, the connection parameter should be present as an instance of sqlalchemy.engine.Connection.

This function is typically called from the env.py script within a migration environment. It can be called multiple times for an invocation. The most recent Connection for which it was called is the one that will be operated upon by the next call to run_migrations().

connection¶ – a Connection to use for SQL execution in “online” mode. When present, is also used to determine the type of dialect in use.

url¶ – a string database url, or a sqlalchemy.engine.url.URL object. The type of dialect to be used will be derived from this if connection is not passed.

dialect_name¶ – string name of a dialect, such as “postgresql”, “mssql”, etc. The type of dialect to be used will be derived from this if connection and url are not passed.

dialect_opts¶ – dictionary of options to be passed to dialect constructor.

transactional_ddl¶ – Force the usage of “transactional” DDL on or off; this otherwise defaults to whether or not the dialect in use supports it.

transaction_per_migration¶ – if True, nest each migration script in a transaction rather than the full series of migrations to run.

output_buffer¶ – a file-like object that will be used for textual output when the --sql option is used to generate SQL scripts. Defaults to sys.stdout if not passed here and also not present on the Config object. The value here overrides that of the Config object.

output_encoding¶ – when using --sql to generate SQL scripts, apply this encoding to the string output.

literal_binds¶ – when using --sql to generate SQL scripts, pass through the literal_binds flag to the compiler so that any literal values that would ordinarily be bound parameters are converted to plain strings. Warning Dialects can typically only handle simple datatypes like strings and numbers for auto-literal generation. Datatypes like dates, intervals, and others may still require manual formatting, typically using Operations.inline_literal(). Note the literal_binds flag is ignored on SQLAlchemy versions prior to 0.8 where this feature is not supported. See also Operations.inline_literal()

when using --sql to generate SQL scripts, pass through the literal_binds flag to the compiler so that any literal values that would ordinarily be bound parameters are converted to plain strings.

Dialects can typically only handle simple datatypes like strings and numbers for auto-literal generation. Datatypes like dates, intervals, and others may still require manual formatting, typically using Operations.inline_literal().

the literal_binds flag is ignored on SQLAlchemy versions prior to 0.8 where this feature is not supported.

Operations.inline_literal()

starting_rev¶ – Override the “starting revision” argument when using --sql mode.

tag¶ – a string tag for usage by custom env.py scripts. Set via the --tag option, can be overridden here.

template_args¶ – dictionary of template arguments which will be added to the template argument environment when running the “revision” command. Note that the script environment is only run within the “revision” command if the –autogenerate option is used, or if the option “revision_environment=true” is present in the alembic.ini file.

version_table¶ – The name of the Alembic version table. The default is 'alembic_version'.

version_table_schema¶ – Optional schema to place version table within.

version_table_pk¶ – boolean, whether the Alembic version table should use a primary key constraint for the “value” column; this only takes effect when the table is first created. Defaults to True; setting to False should not be necessary and is here for backwards compatibility reasons.

on_version_apply¶ – a callable or collection of callables to be run for each migration step. The callables will be run in the order they are given, once for each migration step, after the respective operation has been applied but before its transaction is finalized. Each callable accepts no positional arguments and the following keyword arguments: ctx: the MigrationContext running the migration, step: a MigrationInfo representing the step currently being applied, heads: a collection of version strings representing the current heads, run_args: the **kwargs passed to run_migrations().

a callable or collection of callables to be run for each migration step. The callables will be run in the order they are given, once for each migration step, after the respective operation has been applied but before its transaction is finalized. Each callable accepts no positional arguments and the following keyword arguments:

ctx: the MigrationContext running the migration,

step: a MigrationInfo representing the step currently being applied,

heads: a collection of version strings representing the current heads,

run_args: the **kwargs passed to run_migrations().

Parameters specific to the autogenerate feature, when alembic revision is run with the --autogenerate feature:

target_metadata¶ – a sqlalchemy.schema.MetaData object, or a sequence of MetaData objects, that will be consulted during autogeneration. The tables present in each MetaData will be compared against what is locally available on the target Connection to produce candidate upgrade/downgrade operations.

compare_type¶ – Indicates type comparison behavior during an autogenerate operation. Defaults to True turning on type comparison, which has good accuracy on most backends. See Comparing Types for an example as well as information on other type comparison options. Set to False which disables type comparison. A callable can also be passed to provide custom type comparison, see Comparing Types for additional details. Changed in version 1.12.0: The default value of EnvironmentContext.configure.compare_type has been changed to True. See also Comparing Types EnvironmentContext.configure.compare_server_default

Indicates type comparison behavior during an autogenerate operation. Defaults to True turning on type comparison, which has good accuracy on most backends. See Comparing Types for an example as well as information on other type comparison options. Set to False which disables type comparison. A callable can also be passed to provide custom type comparison, see Comparing Types for additional details.

Changed in version 1.12.0: The default value of EnvironmentContext.configure.compare_type has been changed to True.

EnvironmentContext.configure.compare_server_default

compare_server_default¶ – Indicates server default comparison behavior during an autogenerate operation. Defaults to False which disables server default comparison. Set to True to turn on server default comparison, which has varied accuracy depending on backend. To customize server default comparison behavior, a callable may be specified which can filter server default comparisons during an autogenerate operation. defaults during an autogenerate operation. The format of this callable is: def my_compare_server_default(context, inspected_column, metadata_column, inspected_default, metadata_default, rendered_metadata_default): # return True if the defaults are different, # False if not, or None to allow the default implementation # to compare these defaults return None context.configure( # ... compare_server_default = my_compare_server_default ) inspected_column is a dictionary structure as returned by sqlalchemy.engine.reflection.Inspector.get_columns(), whereas metadata_column is a sqlalchemy.schema.Column from the local model environment. A return value of None indicates to allow default server default comparison to proceed. Note that some backends such as Postgresql actually execute the two defaults on the database side to compare for equivalence. See also EnvironmentContext.configure.compare_type

Indicates server default comparison behavior during an autogenerate operation. Defaults to False which disables server default comparison. Set to True to turn on server default comparison, which has varied accuracy depending on backend.

To customize server default comparison behavior, a callable may be specified which can filter server default comparisons during an autogenerate operation. defaults during an autogenerate operation. The format of this callable is:

inspected_column is a dictionary structure as returned by sqlalchemy.engine.reflection.Inspector.get_columns(), whereas metadata_column is a sqlalchemy.schema.Column from the local model environment.

A return value of None indicates to allow default server default comparison to proceed. Note that some backends such as Postgresql actually execute the two defaults on the database side to compare for equivalence.

EnvironmentContext.configure.compare_type

include_name¶ – A callable function which is given the chance to return True or False for any database reflected object based on its name, including database schema names when the EnvironmentContext.configure.include_schemas flag is set to True. The function accepts the following positional arguments: name: the name of the object, such as schema name or table name. Will be None when indicating the default schema name of the database connection. type: a string describing the type of object; currently "schema", "table", "column", "index", "unique_constraint", or "foreign_key_constraint" parent_names: a dictionary of “parent” object names, that are relative to the name being given. Keys in this dictionary may include: "schema_name", "table_name" or "schema_qualified_table_name". E.g.: def include_name(name, type_, parent_names): if type_ == "schema": return name in ["schema_one", "schema_two"] else: return True context.configure( # ... include_schemas = True, include_name = include_name ) See also Controlling What to be Autogenerated EnvironmentContext.configure.include_object EnvironmentContext.configure.include_schemas

A callable function which is given the chance to return True or False for any database reflected object based on its name, including database schema names when the EnvironmentContext.configure.include_schemas flag is set to True.

The function accepts the following positional arguments:

name: the name of the object, such as schema name or table name. Will be None when indicating the default schema name of the database connection.

type: a string describing the type of object; currently "schema", "table", "column", "index", "unique_constraint", or "foreign_key_constraint"

parent_names: a dictionary of “parent” object names, that are relative to the name being given. Keys in this dictionary may include: "schema_name", "table_name" or "schema_qualified_table_name".

Controlling What to be Autogenerated

EnvironmentContext.configure.include_object

EnvironmentContext.configure.include_schemas

include_object¶ – A callable function which is given the chance to return True or False for any object, indicating if the given object should be considered in the autogenerate sweep. The function accepts the following positional arguments: object: a SchemaItem object such as a Table, Column, Index UniqueConstraint, or ForeignKeyConstraint object name: the name of the object. This is typically available via object.name. type: a string describing the type of object; currently "table", "column", "index", "unique_constraint", or "foreign_key_constraint" reflected: True if the given object was produced based on table reflection, False if it’s from a local MetaData object. compare_to: the object being compared against, if available, else None. E.g.: def include_object(object, name, type_, reflected, compare_to): if (type_ == "column" and not reflected and object.info.get("skip_autogenerate", False)): return False else: return True context.configure( # ... include_object = include_object ) For the use case of omitting specific schemas from a target database when EnvironmentContext.configure.include_schemas is set to True, the schema attribute can be checked for each Table object passed to the hook, however it is much more efficient to filter on schemas before reflection of objects takes place using the EnvironmentContext.configure.include_name hook. See also Controlling What to be Autogenerated EnvironmentContext.configure.include_name EnvironmentContext.configure.include_schemas

A callable function which is given the chance to return True or False for any object, indicating if the given object should be considered in the autogenerate sweep.

The function accepts the following positional arguments:

object: a SchemaItem object such as a Table, Column, Index UniqueConstraint, or ForeignKeyConstraint object

name: the name of the object. This is typically available via object.name.

type: a string describing the type of object; currently "table", "column", "index", "unique_constraint", or "foreign_key_constraint"

reflected: True if the given object was produced based on table reflection, False if it’s from a local MetaData object.

compare_to: the object being compared against, if available, else None.

For the use case of omitting specific schemas from a target database when EnvironmentContext.configure.include_schemas is set to True, the schema attribute can be checked for each Table object passed to the hook, however it is much more efficient to filter on schemas before reflection of objects takes place using the EnvironmentContext.configure.include_name hook.

Controlling What to be Autogenerated

EnvironmentContext.configure.include_name

EnvironmentContext.configure.include_schemas

render_as_batch¶ – if True, commands which alter elements within a table will be placed under a with batch_alter_table(): directive, so that batch migrations will take place. See also Running “Batch” Migrations for SQLite and Other Databases

if True, commands which alter elements within a table will be placed under a with batch_alter_table(): directive, so that batch migrations will take place.

Running “Batch” Migrations for SQLite and Other Databases

include_schemas¶ – If True, autogenerate will scan across all schemas located by the SQLAlchemy get_schema_names() method, and include all differences in tables found across all those schemas. When using this option, you may want to also use the EnvironmentContext.configure.include_name parameter to specify a callable which can filter the tables/schemas that get included. See also Controlling What to be Autogenerated EnvironmentContext.configure.include_name EnvironmentContext.configure.include_object

If True, autogenerate will scan across all schemas located by the SQLAlchemy get_schema_names() method, and include all differences in tables found across all those schemas. When using this option, you may want to also use the EnvironmentContext.configure.include_name parameter to specify a callable which can filter the tables/schemas that get included.

Controlling What to be Autogenerated

EnvironmentContext.configure.include_name

EnvironmentContext.configure.include_object

render_item¶ – Callable that can be used to override how any schema item, i.e. column, constraint, type, etc., is rendered for autogenerate. The callable receives a string describing the type of object, the object, and the autogen context. If it returns False, the default rendering method will be used. If it returns None, the item will not be rendered in the context of a Table construct, that is, can be used to skip columns or constraints within op.create_table(): def my_render_column(type_, col, autogen_context): if type_ == "column" and isinstance(col, MySpecialCol): return repr(col) else: return False context.configure( # ... render_item = my_render_column ) Available values for the type string include: "column", "primary_key", "foreign_key", "unique", "check", "type", "server_default". See also Affecting the Rendering of Types Themselves

Callable that can be used to override how any schema item, i.e. column, constraint, type, etc., is rendered for autogenerate. The callable receives a string describing the type of object, the object, and the autogen context. If it returns False, the default rendering method will be used. If it returns None, the item will not be rendered in the context of a Table construct, that is, can be used to skip columns or constraints within op.create_table():

Available values for the type string include: "column", "primary_key", "foreign_key", "unique", "check", "type", "server_default".

Affecting the Rendering of Types Themselves

upgrade_token¶ – When autogenerate completes, the text of the candidate upgrade operations will be present in this template variable when script.py.mako is rendered. Defaults to upgrades.

downgrade_token¶ – When autogenerate completes, the text of the candidate downgrade operations will be present in this template variable when script.py.mako is rendered. Defaults to downgrades.

alembic_module_prefix¶ – When autogenerate refers to Alembic alembic.operations constructs, this prefix will be used (i.e. op.create_table) Defaults to “op.”. Can be None to indicate no prefix.

sqlalchemy_module_prefix¶ – When autogenerate refers to SQLAlchemy Column or type classes, this prefix will be used (i.e. sa.Column("somename", sa.Integer)) Defaults to “sa.”. Can be None to indicate no prefix. Note that when dialect-specific types are rendered, autogenerate will render them using the dialect module name, i.e. mssql.BIT(), postgresql.UUID().

user_module_prefix¶ – When autogenerate refers to a SQLAlchemy type (e.g. TypeEngine) where the module name is not under the sqlalchemy namespace, this prefix will be used within autogenerate. If left at its default of None, the __module__ attribute of the type is used to render the import module. It’s a good practice to set this and to have all custom types be available from a fixed module space, in order to future-proof migration files against reorganizations in modules. See also Controlling the Module Prefix

When autogenerate refers to a SQLAlchemy type (e.g. TypeEngine) where the module name is not under the sqlalchemy namespace, this prefix will be used within autogenerate. If left at its default of None, the __module__ attribute of the type is used to render the import module. It’s a good practice to set this and to have all custom types be available from a fixed module space, in order to future-proof migration files against reorganizations in modules.

Controlling the Module Prefix

process_revision_directives¶ – a callable function that will be passed a structure representing the end result of an autogenerate or plain “revision” operation, which can be manipulated to affect how the alembic revision command ultimately outputs new revision scripts. The structure of the callable is: def process_revision_directives(context, revision, directives): pass The directives parameter is a Python list containing a single MigrationScript directive, which represents the revision file to be generated. This list as well as its contents may be freely modified to produce any set of commands. The section Customizing Revision Generation shows an example of doing this. The context parameter is the MigrationContext in use, and revision is a tuple of revision identifiers representing the current revision of the database. The callable is invoked at all times when the --autogenerate option is passed to alembic revision. If --autogenerate is not passed, the callable is invoked only if the revision_environment variable is set to True in the Alembic configuration, in which case the given directives collection will contain empty UpgradeOps and DowngradeOps collections for .upgrade_ops and .downgrade_ops. The --autogenerate option itself can be inferred by inspecting context.config.cmd_opts.autogenerate. The callable function may optionally be an instance of a Rewriter object. This is a helper object that assists in the production of autogenerate-stream rewriter functions. See also Customizing Revision Generation Fine-Grained Autogenerate Generation with Rewriters command.revision.process_revision_directives

a callable function that will be passed a structure representing the end result of an autogenerate or plain “revision” operation, which can be manipulated to affect how the alembic revision command ultimately outputs new revision scripts. The structure of the callable is:

The directives parameter is a Python list containing a single MigrationScript directive, which represents the revision file to be generated. This list as well as its contents may be freely modified to produce any set of commands. The section Customizing Revision Generation shows an example of doing this. The context parameter is the MigrationContext in use, and revision is a tuple of revision identifiers representing the current revision of the database.

The callable is invoked at all times when the --autogenerate option is passed to alembic revision. If --autogenerate is not passed, the callable is invoked only if the revision_environment variable is set to True in the Alembic configuration, in which case the given directives collection will contain empty UpgradeOps and DowngradeOps collections for .upgrade_ops and .downgrade_ops. The --autogenerate option itself can be inferred by inspecting context.config.cmd_opts.autogenerate.

The callable function may optionally be an instance of a Rewriter object. This is a helper object that assists in the production of autogenerate-stream rewriter functions.

Customizing Revision Generation

Fine-Grained Autogenerate Generation with Rewriters

command.revision.process_revision_directives

autogenerate_plugins¶ – A list of string names of “plugins” that should participate in this autogenerate run. Defaults to the list ["alembic.autogenerate.*"], which indicates that Alembic’s default autogeneration plugins will be used. See the section Enabling Autogenerate Plugins in env.py for complete background on how to use this parameter. Added in version 1.18.0: Added a new plugin system for autogenerate compare directives. See also Enabling Autogenerate Plugins in env.py - background on enabling/disabling autogenerate plugins Plugins - Introduction and documentation to the plugin system

A list of string names of “plugins” that should participate in this autogenerate run. Defaults to the list ["alembic.autogenerate.*"], which indicates that Alembic’s default autogeneration plugins will be used.

See the section Enabling Autogenerate Plugins in env.py for complete background on how to use this parameter.

Added in version 1.18.0: Added a new plugin system for autogenerate compare directives.

Enabling Autogenerate Plugins in env.py - background on enabling/disabling autogenerate plugins

Plugins - Introduction and documentation to the plugin system

Parameters specific to individual backends:

mssql_batch_separator¶ – The “batch separator” which will be placed between each statement when generating offline SQL Server migrations. Defaults to GO. Note this is in addition to the customary semicolon ; at the end of each statement; SQL Server considers the “batch separator” to denote the end of an individual statement execution, and cannot group certain dependent operations in one step.

oracle_batch_separator¶ – The “batch separator” which will be placed between each statement when generating offline Oracle migrations. Defaults to /. Oracle doesn’t add a semicolon between statements like most other backends.

Execute the given SQL using the current change context.

The behavior of execute() is the same as that of Operations.execute(). Please see that function’s documentation for full detail including caveats and limitations.

This function requires that a MigrationContext has first been made available via configure().

Return the current ‘bind’.

In “online” mode, this is the sqlalchemy.engine.Connection currently being used to emit SQL to the database.

This function requires that a MigrationContext has first been made available via configure().

Return the current MigrationContext object.

If EnvironmentContext.configure() has not been called yet, raises an exception.

Return the hex identifier of the ‘head’ script revision.

If the script directory has multiple heads, this method raises a CommandError; EnvironmentContext.get_head_revisions() should be preferred.

This function does not require that the MigrationContext has been configured.

EnvironmentContext.get_head_revisions()

Return the hex identifier of the ‘heads’ script revision(s).

This returns a tuple containing the version number of all heads in the script directory.

This function does not require that the MigrationContext has been configured.

Get the ‘destination’ revision argument.

This is typically the argument passed to the upgrade or downgrade command.

If it was specified as head, the actual version number is returned; if specified as base, None is returned.

This function does not require that the MigrationContext has been configured.

Return the ‘starting revision’ argument, if the revision was passed using start:end.

This is only meaningful in “offline” mode. Returns None if no value is available or was configured.

This function does not require that the MigrationContext has been configured.

Return the value passed for the --tag argument, if any.

The --tag argument is not used directly by Alembic, but is available for custom env.py configurations that wish to use it; particularly for offline generation scripts that wish to generate tagged filenames.

This function does not require that the MigrationContext has been configured.

EnvironmentContext.get_x_argument() - a newer and more open ended system of extending env.py scripts via the command line.

Return the value(s) passed for the -x argument, if any.

The -x argument is an open ended flag that allows any user-defined value or values to be passed on the command line, then available here for consumption by a custom env.py script.

The return value is a list, returned directly from the argparse structure. If as_dictionary=True is passed, the x arguments are parsed using key=value format into a dictionary that is then returned. If there is no = in the argument, value is an empty string.

Changed in version 1.13.1: Support as_dictionary=True when arguments are passed without the = symbol.

For example, to support passing a database URL on the command line, the standard env.py script can be modified like this:

This then takes effect by running the alembic script as:

This function does not require that the MigrationContext has been configured.

EnvironmentContext.get_tag_argument()

Return True if the current migrations environment is running in “offline mode”.

This is True or False depending on the --sql flag passed.

This function does not require that the MigrationContext has been configured.

Return True if the context is configured to expect a transactional DDL capable backend.

This defaults to the type of database in use, and can be overridden by the transactional_ddl argument to configure()

This function requires that a MigrationContext has first been made available via configure().

Run migrations as determined by the current command line configuration as well as versioning information present (or not) in the current database connection (if one is present).

The function accepts optional **kw arguments. If these are passed, they are sent directly to the upgrade() and downgrade() functions within each target revision file. By modifying the script.py.mako file so that the upgrade() and downgrade() functions accept arguments, parameters can be passed here so that contextual information, usually information to identify a particular database in use, can be passed from a custom env.py script to the migration functions.

This function requires that a MigrationContext has first been made available via configure().

An instance of ScriptDirectory which provides programmatic access to version files within the versions/ directory.

Emit text directly to the “offline” SQL stream.

Typically this is for emitting comments that start with –. The statement is not treated as a SQL execution, no ; or batch separator is added, etc.

The MigrationContext handles the actual work to be performed against a database backend as migration operations proceed. It is generally not exposed to the end-user, except when the on_version_apply callback hook is used.

Represent the database state made available to a migration script.

MigrationContext is the front end to an actual database connection, or alternatively a string output stream given a particular database dialect, from an Alembic perspective.

When inside the env.py script, the MigrationContext is available via the EnvironmentContext.get_context() method, which is available at alembic.context:

For usage outside of an env.py script, such as for utility routines that want to check the current version in the database, the MigrationContext.configure() method to create new MigrationContext objects. For example, to get at the current revision in the database using MigrationContext.get_current_revision():

The above context can also be used to produce Alembic migration operations with an Operations instance:

Enter an “autocommit” block, for databases that support AUTOCOMMIT isolation levels.

This special directive is intended to support the occasional database DDL or system operation that specifically has to be run outside of any kind of transaction block. The PostgreSQL database platform is the most common target for this style of operation, as many of its DDL operations must be run outside of transaction blocks, even though the database overall supports transactional DDL.

The method is used as a context manager within a migration script, by calling on Operations.get_context() to retrieve the MigrationContext, then invoking MigrationContext.autocommit_block() using the with: statement:

Above, a PostgreSQL “ALTER TYPE..ADD VALUE” directive is emitted, which must be run outside of a transaction block at the database level. The MigrationContext.autocommit_block() method makes use of the SQLAlchemy AUTOCOMMIT isolation level setting, which against the psycogp2 DBAPI corresponds to the connection.autocommit setting, to ensure that the database driver is not inside of a DBAPI level transaction block.

As is necessary, the database transaction preceding the block is unconditionally committed. This means that the run of migrations preceding the operation will be committed, before the overall migration operation is complete.

It is recommended that when an application includes migrations with “autocommit” blocks, that EnvironmentContext.transaction_per_migration be used so that the calling environment is tuned to expect short per-file migrations whether or not one of them has an autocommit block.

Begin a logical transaction for migration operations.

This method is used within an env.py script to demarcate where the outer “transaction” for a series of migrations begins. Example:

Above, MigrationContext.begin_transaction() is used to demarcate where the outer logical transaction occurs around the MigrationContext.run_migrations() operation.

A “Logical” transaction means that the operation may or may not correspond to a real database transaction. If the target database supports transactional DDL (or EnvironmentContext.configure.transactional_ddl is true), the EnvironmentContext.configure.transaction_per_migration flag is not set, and the migration is against a real database connection (as opposed to using “offline” --sql mode), a real transaction will be started. If --sql mode is in effect, the operation would instead correspond to a string such as “BEGIN” being emitted to the string output.

The returned object is a Python context manager that should only be used in the context of a with: statement as indicated above. The object has no other guaranteed API features present.

MigrationContext.autocommit_block()

Return the current “bind”.

In online mode, this is an instance of sqlalchemy.engine.Connection, and is suitable for ad-hoc execution of any kind of usage described in SQLAlchemy Core documentation as well as for usage with the sqlalchemy.schema.Table.create() and sqlalchemy.schema.MetaData.create_all() methods of Table, MetaData.

Note that when “standard output” mode is enabled, this bind will be a “mock” connection handler that cannot return results and is only appropriate for a very limited subset of commands.

Return the Config used by the current environment, if any.

Create a new MigrationContext.

This is a factory method usually called by EnvironmentContext.configure().

connection¶ – a Connection to use for SQL execution in “online” mode. When present, is also used to determine the type of dialect in use.

url¶ – a string database url, or a sqlalchemy.engine.url.URL object. The type of dialect to be used will be derived from this if connection is not passed.

dialect_name¶ – string name of a dialect, such as “postgresql”, “mssql”, etc. The type of dialect to be used will be derived from this if connection and url are not passed.

opts¶ – dictionary of options. Most other options accepted by EnvironmentContext.configure() are passed via this dictionary.

Execute a SQL construct or string statement.

The underlying execution mechanics are used, that is if this is “offline mode” the SQL is written to the output buffer, otherwise the SQL is emitted on the current SQLAlchemy connection.

Return a tuple of the current ‘head versions’ that are represented in the target database.

For a migration stream without branches, this will be a single value, synonymous with that of MigrationContext.get_current_revision(). However when multiple unmerged branches exist within the target database, the returned tuple will contain a value for each head.

If this MigrationContext was configured in “offline” mode, that is with as_sql=True, the starting_rev parameter is returned in a one-length tuple.

If no version table is present, or if there are no revisions present, an empty tuple is returned.

Return the current revision, usually that which is present in the alembic_version table in the database.

This method intends to be used only for a migration stream that does not contain unmerged branches in the target database; if there are multiple branches present, an exception is raised. The MigrationContext.get_current_heads() should be preferred over this method going forward in order to be compatible with branch migration support.

If this MigrationContext was configured in “offline” mode, that is with as_sql=True, the starting_rev parameter is returned instead, if any.

Run the migration scripts established for this MigrationContext, if any.

The commands in alembic.command will set up a function that is ultimately passed to the MigrationContext as the fn argument. This function represents the “work” that will be done when MigrationContext.run_migrations() is called, typically from within the env.py script of the migration environment. The “work function” then provides an iterable of version callables and other version information which in the case of the upgrade or downgrade commands are the list of version scripts to invoke. Other commands yield nothing, in the case that a command wants to run some other operation against the database such as the current or stamp commands.

**kw¶ – keyword arguments here will be passed to each migration callable, that is the upgrade() or downgrade() method within revision scripts.

Stamp the version table with a specific revision.

This method calculates those branches to which the given revision can apply, and updates those branches as though they were migrated towards that revision (either up or down). If no current branches include the revision, it is added as a new branch head.

© Copyright 2010-2026, Mike Bayer.

**Examples:**

Example 1 (python):
```python
from alembic.config import Config
from alembic.script import ScriptDirectory

config = Config()
config.set_main_option("script_location", "myapp:migrations")
script = ScriptDirectory.from_config(config)


def my_function(rev, context):
    '''do something with revision "rev", which
    will be the current database revision,
    and "context", which is the MigrationContext
    that the env.py will create'''


with EnvironmentContext(
    config,
    script,
    fn=my_function,
    as_sql=False,
    starting_rev="base",
    destination_rev="head",
    tag="sometag",
):
    script.run_env()
```

Example 2 (unknown):
```unknown
with context.begin_transaction():
    context.run_migrations()
```

Example 3 (lua):
```lua
def my_compare_server_default(context, inspected_column,
            metadata_column, inspected_default, metadata_default,
            rendered_metadata_default):
    # return True if the defaults are different,
    # False if not, or None to allow the default implementation
    # to compare these defaults
    return None

context.configure(
    # ...
    compare_server_default = my_compare_server_default
)
```

Example 4 (lua):
```lua
def include_name(name, type_, parent_names):
    if type_ == "schema":
        return name in ["schema_one", "schema_two"]
    else:
        return True

context.configure(
    # ...
    include_schemas = True,
    include_name = include_name
)
```

---

## Commands

**URL:** https://alembic.sqlalchemy.org/en/latest/api/commands.html

**Contents:**
- Commands
- Contents
- Commands#

this section discusses the internal API of Alembic as regards its command invocation system. This section is only useful for developers who wish to extend the capabilities of Alembic. For documentation on using Alembic commands, please see Tutorial.

Alembic commands are all represented by functions in the Commands package. They all accept the same style of usage, being sent the Config object as the first argument.

Commands can be run programmatically, by first constructing a Config object, as in:

In many cases, and perhaps more often than not, an application will wish to call upon a series of Alembic commands and/or other features. It is usually a good idea to link multiple commands along a single connection and transaction, if feasible. This can be achieved using the Config.attributes dictionary in order to share a connection:

This recipe requires that env.py consumes this connection argument; see the example in Sharing a Connection across one or more programmatic migration commands for details.

To write small API functions that make direct use of database and script directory information, rather than just running one of the built-in commands, use the ScriptDirectory and MigrationContext classes directly.

Show current branch points.

config¶ – a Config instance.

verbose¶ – output in verbose mode.

Check if revision command with autogenerate has pending upgrade ops.

config¶ – a Config object.

Added in version 1.9.0.

Display the current revision for a database.

config¶ – a Config instance.

check_heads¶ – Check if all head revisions are applied to the database. Raises DatabaseNotAtHead if this is not the case. Added in version 1.17.1.

Check if all head revisions are applied to the database. Raises DatabaseNotAtHead if this is not the case.

Added in version 1.17.1.

verbose¶ – output in verbose mode.

Revert to a previous version.

config¶ – a Config instance.

revision¶ – string revision target or range for –sql mode. May be "base" to target the first revision.

sql¶ – if True, use --sql mode.

tag¶ – an arbitrary “tag” that can be intercepted by custom env.py scripts via the EnvironmentContext.get_tag_argument() method.

Edit revision script(s) using $EDITOR.

config¶ – a Config instance.

rev¶ – target revision.

Create the alembic version table if it doesn’t exist already .

config¶ – a Config instance.

sql¶ – use --sql mode. Added in version 1.7.6.

Added in version 1.7.6.

Show current available heads in the script directory.

config¶ – a Config instance.

verbose¶ – output in verbose mode.

resolve_dependencies¶ – treat dependency version as down revisions.

List changeset scripts in chronological order.

config¶ – a Config instance.

rev_range¶ – string revision range.

verbose¶ – output in verbose mode.

indicate_current¶ – indicate current revision.

Initialize a new scripts directory.

config¶ – a Config object.

directory¶ – string path of the target directory.

template¶ – string name of the migration environment template to use.

package¶ – when True, write __init__.py files into the environment location as well as the versions/ location.

List available templates.

config¶ – a Config object.

Merge two revisions together. Creates a new migration file.

config¶ – a Config instance

revisions¶ – The revisions to merge.

message¶ – string message to apply to the revision.

branch_label¶ – string label name to apply to the new revision.

rev_id¶ – hardcoded revision identifier instead of generating a new one.

splice¶ – if True, allow the merge to create a new branch point even if the given revisions are not heads. Added in version 1.18.5.

if True, allow the merge to create a new branch point even if the given revisions are not heads.

Added in version 1.18.5.

Working with Branches

Create a new revision file.

config¶ – a Config object.

message¶ – string message to apply to the revision; this is the -m option to alembic revision.

autogenerate¶ – whether or not to autogenerate the script from the database; this is the --autogenerate option to alembic revision.

sql¶ – whether to dump the script out as a SQL string; when specified, the script is dumped to stdout. This is the --sql option to alembic revision.

head¶ – head revision to build the new revision upon as a parent; this is the --head option to alembic revision.

splice¶ – whether or not the new revision should be made into a new head of its own; is required when the given head is not itself a head. This is the --splice option to alembic revision.

branch_label¶ – string label to apply to the branch; this is the --branch-label option to alembic revision.

version_path¶ – string symbol identifying a specific version path from the configuration; this is the --version-path option to alembic revision.

rev_id¶ – optional revision identifier to use instead of having one generated; this is the --rev-id option to alembic revision.

depends_on¶ – optional list of “depends on” identifiers; this is the --depends-on option to alembic revision.

process_revision_directives¶ – this is a callable that takes the same form as the callable described at EnvironmentContext.configure.process_revision_directives; will be applied to the structure generated by the revision process where it can be altered programmatically. Note that unlike all the other parameters, this option is only available via programmatic use of command.revision().

Show the revision(s) denoted by the given symbol.

config¶ – a Config instance.

rev¶ – string revision target. May be "current" to show the revision(s) currently applied in the database.

‘stamp’ the revision table with the given revision; don’t run any migrations.

config¶ – a Config instance.

revision¶ – target revision or list of revisions. May be a list to indicate stamping of multiple branch heads; may be "base" to remove all revisions from the table or "heads" to stamp the most recent revision(s). Note this parameter is called “revisions” in the command line interface.

target revision or list of revisions. May be a list to indicate stamping of multiple branch heads; may be "base" to remove all revisions from the table or "heads" to stamp the most recent revision(s).

this parameter is called “revisions” in the command line interface.

sql¶ – use --sql mode

tag¶ – an arbitrary “tag” that can be intercepted by custom env.py scripts via the EnvironmentContext.get_tag_argument method.

purge¶ – delete all entries in the version table before stamping.

Upgrade to a later version.

config¶ – a Config instance.

revision¶ – string revision target or range for –sql mode. May be "heads" to target the most recent revision(s).

sql¶ – if True, use --sql mode.

tag¶ – an arbitrary “tag” that can be intercepted by custom env.py scripts via the EnvironmentContext.get_tag_argument() method.

© Copyright 2010-2026, Mike Bayer.

**Examples:**

Example 1 (python):
```python
from alembic.config import Config
from alembic import command
alembic_cfg = Config("/path/to/yourapp/alembic.ini")
command.upgrade(alembic_cfg, "head")
```

Example 2 (typescript):
```typescript
with engine.begin() as connection:
    alembic_cfg.attributes['connection'] = connection
    command.upgrade(alembic_cfg, "head")
```

---

## Plugins

**URL:** https://alembic.sqlalchemy.org/en/latest/api/plugins.html

**Contents:**
- Plugins
- Contents
- Plugins#
- Overview#
- Installing and Using Plugins#
  - Enable Autogenerate Plugins#
  - Using Plugins without entry points (such as local plugin code)#
- Enabling Autogenerate Plugins in env.py#
- Writing a Plugin#
  - Creating a Plugin Module#

Added in version 1.18.0.

Alembic provides a plugin system that allows third-party extensions to integrate with Alembic’s functionality. Plugins can register custom operations, operation implementations, autogenerate comparison functions, and other extension points to add new capabilities to Alembic.

The plugin system provides a structured way to organize and distribute these extensions, allowing them to be discovered automatically using Python entry points.

The Plugin class provides the foundation for creating plugins. A plugin’s setup() function can perform various types of registrations:

Custom operations - Register new operation directives using Operations.register_operation() (e.g., op.create_view())

Operation implementations - Provide database-specific implementations using Operations.implementation_for()

Autogenerate comparators - Add comparison functions for detecting schema differences during autogeneration

Other extensions - Register any other global handlers or customizations

A single plugin can register handlers across all of these categories. For example, a plugin for custom database objects might register both the operations to create/drop those objects and the autogenerate logic to detect changes to them.

Replaceable Objects - Cookbook recipe demonstrating custom operations and implementations that would be suitable for packaging as a plugin

Third-party plugins are typically distributed as Python packages that can be installed via pip or other package managers:

Once installed, plugins that use Python’s entry point system are automatically discovered and loaded by Alembic at startup, which calls the plugin’s setup() function to perform any registrations.

For plugins that provide autogenerate comparison functions via the Plugin.add_autogenerate_comparator() hook, the specific autogenerate functionality registered by the plugin must be enabled with EnvironmentContext.configure.autogenerate_plugins parameter, which by default indicates that only Alembic’s built-in plugins should be used. Note that this step does not apply to older plugins that may be registering autogenerate comparison functions globally.

See the section Enabling Autogenerate Plugins in env.py for background on enabling autogenerate comparison plugins per environment.

Plugins do not need to be published with entry points to be used. A plugin can be manually registered by calling Plugin.setup_plugin_from_module() in the env.py file:

This approach is useful for project-specific plugins that are not intended for distribution, or for testing plugins during development.

If a plugin provides autogenerate functionality that’s registered via the Plugin.add_autogenerate_comparator() hook, it can be selectively enabled or disabled using the EnvironmentContext.configure.autogenerate_plugins parameter in the EnvironmentContext.configure() call, typically as used within the env.py file. This parameter is passed as a list of strings each naming a specific plugin or a matching wildcard. The default value is ["alembic.autogenerate.*"] which indicates that the full set of Alembic’s internal plugins should be used.

The EnvironmentContext.configure.autogenerate_plugins parameter accepts a list of string patterns:

Simple names match plugin names exactly: "alembic.autogenerate.tables"

Wildcards match multiple plugins: "alembic.autogenerate.*" matches all built-in plugins

Negation patterns exclude plugins: "~alembic.autogenerate.comments" excludes the comments plugin

For example, to use all built-in plugins except comments, plus a custom plugin:

The wildcard syntax using * indicates that tokens in that segment of the name (separated by period characters) will match any name. For Alembic’s alembic.autogenerate.* namespace, the built in names being invoked are:

alembic.autogenerate.schemas - Schema creation and dropping

alembic.autogenerate.tables - Table creation, dropping, and modification. This plugin depends on the schemas plugin in order to iterate through tables.

alembic.autogenerate.types - Column type changes. This plugin depends on the tables plugin in order to iterate through columns.

alembic.autogenerate.constraints - Constraint creation and dropping. This plugin depends on the tables plugin in order to iterate through columns.

alembic.autogenerate.defaults - Server default changes. This plugin depends on the tables plugin in order to iterate through columns.

alembic.autogenerate.comments - Table and column comment changes. This plugin depends on the tables plugin in order to iterate through columns.

While these names can be specified individually, they are subject to change as Alembic evolves. Using the wildcard pattern is recommended.

Omitting the built-in plugins entirely would prevent autogeneration from proceeding, unless other plugins were provided that replaced its functionality (which is possible!). Additionally, as noted above, the column-oriented plugins rely on the table- and schema- oriented plugins in order to receive iterated columns.

The EnvironmentContext.configure.autogenerate_plugins parameter only controls which plugins participate in autogenerate operations. Other plugin functionality, such as custom operations registered with Operations.register_operation(), is available regardless of this setting.

A plugin module must define a setup() function that accepts a Plugin instance. This function is called when the plugin is loaded, either automatically via entry points or manually via Plugin.setup_plugin_from_module():

The setup() function serves as the entry point for all plugin registrations. It can call various Alembic APIs to extend functionality.

To make a plugin available for installation via pip, create a package with an entry point in pyproject.toml:

Where mycompany.alembic_plugin is the module containing the setup() function.

When the package is installed, Alembic automatically discovers and loads the plugin through the entry point system. If the plugin provides autogenerate functionality, users can then enable it by adding its name mycompany.plugin_name to the autogenerate_plugins list in their env.py.

Plugins can register new operation directives that become available as op.custom_operation() in migration scripts. This is done using Operations.register_operation() and Operations.implementation_for().

Example from the Replaceable Objects recipe:

These registrations can be performed in the plugin’s setup() function, making the custom operations available globally.

Replaceable Objects - Complete example of registering custom operations

Operation Plugins - Documentation on the operations plugin system

Plugins can register comparison functions that participate in the autogenerate process, detecting differences between database schema and SQLAlchemy metadata. These functions may be registered globally, where they take place unconditionally as documented at Registering a Comparison Function Globally; for older versions of Alembic prior to 1.18.0 this is the only registration system available. However when targeting Alembic 1.18.0 or higher, the Plugin approach provides a more configurable version of these registration hooks.

Plugin level comparison functions are registered using Plugin.add_autogenerate_comparator(). Each comparison function establishes itself as part of a named “target”, which is invoked by a parent handler. For example, if a handler establishes itself as part of the "column" target, it will be invoked when the alembic.autogenerate.tables plugin proceeds through SQLAlchemy Table objects and invokes comparison operations for pairs of same-named columns.

For an example of a complete comparison function, see the example at Registering a Comparison Function Globally.

The current levels of comparison are the same between global and plugin-level comparison functions, and include:

"autogenerate" - this target is invoked at the top of the autogenerate chain. These hooks are passed a AutogenContext and an UpgradeOps collection. Functions that subscribe to the autogenerate target should look like:

The function should return either PriorityDispatchResult.CONTINUE or PriorityDispatchResult.STOP to halt any further comparisons from proceeding, and should respond to detected changes by mutating the given UpgradeOps collection in place (the DowngradeOps version is produced later by reversing the UpgradeOps).

An autogenerate compare function that seeks to run entirely independently of Alembic’s built-in autogenerate plugins, or to replace them completely, would register at the "autogenerate" level. The remaining levels indicated below are all invoked from within Alembic’s own autogenerate plugins and will not take place if alembic.autogenerate.* is not enabled.

Added in version 1.18.0: The "autogenerate" comparison scope was introduced, replacing "schema" as the topmost comparison scope.

"schema" - this target is invoked for each individual “schema” being compared, and hooks are passed a AutogenContext, an UpgradeOps collection, and a set of schema names, featuring the value None for the “default” schema. Functions that subscribe to the "schema" target should look like:

The function should normally return PriorityDispatchResult.CONTINUE and should respond to detected changes by mutating the given UpgradeOps collection in place (the DowngradeOps version is produced later by reversing the UpgradeOps).

The registration example above includes the "tables" “compare element”, which is optional. This indicates that the comparison function is part of a chain called “tables”, which is what Alembic’s own alembic.autogenerate.tables plugin uses. If our custom comparison function were to return the value PriorityDispatchResult.STOP, further comparison functions in the "tables" chain would not be called. Similarly, if another plugin in the "tables" chain returned PriorityDispatchResult.STOP, then our plugin would not be called. Making use of PriorityDispatchResult.STOP in terms of other plugins in the same “compare element” may be assisted by placing our function in the comparator chain using DispatchPriority.FIRST or DispatchPriority.LAST when registering.

"table" - this target is invoked per Table being compared between a database autoloaded version and the local metadata version. These hooks are passed an AutogenContext, a ModifyTableOps collection, a schema name, table name, a Table reflected from the database if any or None, and a Table present in the local MetaData. If the ModifyTableOps collection contains changes after all hooks are run, it is included in the migration script:

This hook may be used to compare elements of tables, such as comments or database-specific storage configurations. It should mutate the given ModifyTableOps object in place to add new change operations.

"column" - this target is invoked per Column being compared between a database autoloaded version and the local metadata version. These hooks are passed an AutogenContext, an AlterColumnOp object, a schema name, table name, column name, a Column reflected from the database and a Column present in the local table. If the AlterColumnOp contains changes after all hooks are run, it is included in the migration script; a “change” is considered to be present if any of the modify_ attributes are set to a non-default value, or there are any keys in the .kw collection with the prefix "modify_":

Pre-existing compare chains within the "column" target include "comment", "server_default", and "types". Comparison functions here should mutate the given AlterColumnOp object in place to add new change operations.

Autogeneration - Detailed documentation on the autogenerate system

Registering a Comparison Function Globally - a companion section to this one which explains autogenerate comparison functions in terms of the older “global” dispatch, but also includes a complete example of a comparison function.

Customizing Revision Generation - Customizing autogenerate behavior

Describe a series of functions that are pulled in as a plugin.

This is initially to provide for portable lists of autogenerate comparison functions, however the setup for a plugin can run any other kinds of global registration as well.

Added in version 1.18.0.

Register an autogenerate comparison function.

See the section Registering Autogenerate Comparators at the Plugin Level for detailed examples on how to use this method.

fn¶ – The comparison function to register. The function receives arguments specific to the type of comparison being performed and should return a PriorityDispatchResult value.

compare_target¶ – The type of comparison being performed (e.g., "table", "column", "type").

compare_element¶ – Optional sub-element being compared within the target type.

qualifier¶ – Database dialect qualifier. Use "default" for all dialects, or specify a dialect name like "postgresql" to register a dialect-specific handler. Defaults to "default".

priority¶ – Execution priority for this comparison function. Functions are executed in priority order from DispatchPriority.FIRST to DispatchPriority.LAST. Defaults to DispatchPriority.MEDIUM.

Populate all current autogenerate comparison functions into a given PriorityDispatcher.

Call the setup() function of a plugin module, identified by passing the module object itself.

This will generate a new Plugin object with the given name, which will register itself in the global list of plugins. Then the module’s setup() function is invoked, passing that Plugin object.

This exact process is invoked automatically at import time for any plugin module that is published via the alembic.plugins entrypoint.

indicate an action after running a function within a PriorityDispatcher

Added in version 1.18.0.

Continue running more functions.

Any return value that is not PriorityDispatchResult.STOP is equivalent to this.

Stop running any additional functions within the subgroup

Indicate which of three sub-collections a function inside a PriorityDispatcher should be placed.

Added in version 1.18.0.

Run the function in the first batch of functions (highest priority)

Run the function in the last batch of functions

Run the function at normal priority (this is the default)

EnvironmentContext.configure.autogenerate_plugins - Configuration parameter for enabling autogenerate plugins

Operation Plugins - Documentation on custom operations

Replaceable Objects - Example of custom operations suitable for a plugin

Customizing Revision Generation - General information on customizing autogenerate behavior

© Copyright 2010-2026, Mike Bayer.

**Examples:**

Example 1 (unknown):
```unknown
pip install mycompany-alembic-plugin
```

Example 2 (sql):
```sql
from alembic.runtime.plugins import Plugin
import myproject.alembic_plugin

# Register the plugin manually
Plugin.setup_plugin_from_module(
    myproject.alembic_plugin,
    "myproject.custom_operations"
)
```

Example 3 (lua):
```lua
context.configure(
    # ...
    autogenerate_plugins=[
        "alembic.autogenerate.*",
        "~alembic.autogenerate.comments",
        "mycompany.custom_types",
    ]
)
```

Example 4 (python):
```python
from alembic import op
from alembic.operations import Operations
from alembic.runtime.plugins import Plugin
from alembic.util import DispatchPriority

def setup(plugin: Plugin) -> None:
    """Setup function called by Alembic when loading the plugin."""

    # Register custom operations
    Operations.register_operation("create_view")(CreateViewOp)
    Operations.implementation_for(CreateViewOp)(create_view_impl)

    # Register autogenerate comparison functions
    plugin.add_autogenerate_comparator(
        _compare_views,
        "view",
        qualifier="default",
        priority=DispatchPriority.MEDIUM,
    )
```

---

## Configuration

**URL:** https://alembic.sqlalchemy.org/en/latest/api/config.html

**Contents:**
- Configuration
- Contents
- Configuration#

this section discusses the internal API of Alembic as regards internal configuration constructs. This section is only useful for developers who wish to extend the capabilities of Alembic. For documentation on configuration of an Alembic environment, please see Tutorial.

The Config object represents the configuration passed to the Alembic environment. From an API usage perspective, it is needed for the following use cases:

to create a ScriptDirectory, which allows you to work with the actual script files in a migration environment

to create an EnvironmentContext, which allows you to actually run the env.py module within the migration environment

to programmatically run any of the commands in the Commands module.

The Config is not needed for these cases:

to instantiate a MigrationContext directly - this object only needs a SQLAlchemy connection or dialect name.

to instantiate a Operations object - this object only needs a MigrationContext.

A function that may be registered in the CLI as an alembic command. It must be a named function and it must accept a Config object as the first argument.

Added in version 1.15.3.

Provides the command line interface to Alembic.

Executes the command line with the provided arguments.

Registers a function as a CLI subcommand. The subcommand name matches the function name, the arguments are extracted from the signature and the help text is read from the docstring.

Added in version 1.15.3.

Extend CommandLine with custom commands

Represent an Alembic configuration.

Within an env.py script, this is available via the EnvironmentContext.config attribute, which in turn is available at alembic.context:

When invoking Alembic programmatically, a new Config can be created by passing the name of an .ini file to the constructor:

With a Config object, you can then run Alembic commands programmatically using the directives in alembic.command.

The Config object can also be constructed without a filename. Values can be set programmatically, and new sections will be created as needed:

When using programmatic configuration, make sure the env.py file in use is compatible with the target configuration; including that the call to Python logging.fileConfig() is omitted if the programmatic configuration doesn’t actually include logging directives.

For passing non-string values to environments, such as connections and engines, use the Config.attributes dictionary:

file_¶ – name of the .ini file to open if an alembic.ini is to be used. This should refer to the alembic.ini file, either as a filename or a full path to the file. This filename if passed must refer to an ini file in ConfigParser format only.

toml_file¶ – name of the pyproject.toml file to open if a pyproject.toml file is to be used. This should refer to the pyproject.toml file, either as a filename or a full path to the file. This file must be in toml format. Both Config.file_ and Config.toml_file may be passed simultaneously, or exclusively. Added in version 1.16.0.

name of the pyproject.toml file to open if a pyproject.toml file is to be used. This should refer to the pyproject.toml file, either as a filename or a full path to the file. This file must be in toml format. Both Config.file_ and Config.toml_file may be passed simultaneously, or exclusively.

Added in version 1.16.0.

ini_section¶ – name of the main Alembic section within the .ini file

output_buffer¶ – optional file-like input buffer which will be passed to the MigrationContext - used to redirect the output of “offline generation” when using Alembic programmatically.

stdout¶ – buffer where the “print” output of commands will be sent. Defaults to sys.stdout.

config_args¶ – A dictionary of keys and values that will be used for substitution in the alembic config file, as well as the pyproject.toml file, depending on which / both are used. The dictionary as given is copied to two new, independent dictionaries, stored locally under the attributes .config_args and .toml_args. Both of these dictionaries will also be populated with the replacement variable %(here)s, which refers to the location of the .ini and/or .toml file as appropriate.

attributes¶ – optional dictionary of arbitrary Python keys/values, which will be populated into the Config.attributes dictionary. See also Sharing a Connection across one or more programmatic migration commands

optional dictionary of arbitrary Python keys/values, which will be populated into the Config.attributes dictionary.

Sharing a Connection across one or more programmatic migration commands

Construct a new Config

A Python dictionary for storage of additional state.

This is a utility dictionary which can include not just strings but engines, connections, schema objects, or anything else. Use this to pass objects into an env.py script, such as passing a sqlalchemy.engine.base.Connection when calling commands from alembic.command programmatically.

Sharing a Connection across one or more programmatic migration commands

The command-line options passed to the alembic script.

Within an env.py script this can be accessed via the EnvironmentContext.config attribute.

EnvironmentContext.get_x_argument()

Filesystem path to the .ini file in use.

Name of the config file section to read basic configuration from. Defaults to alembic, that is the [alembic] section of the .ini file. This value is modified using the -n/--name option to the Alembic runner.

Return the underlying ConfigParser object.

Dir*-ect access to the .ini file is available here, though the Config.get_section() and Config.get_main_option() methods provide a possibly simpler interface.

Return an option from the “[alembic]” or “[tool.alembic]” section of the configparser-parsed .ini file (e.g. alembic.ini) or toml-parsed pyproject.toml file.

The value returned is expected to be None, string, list of strings, or dictionary of strings. Within each type of string value, the %(here)s token is substituted out with the absolute path of the pyproject.toml file, as are other tokens which are extracted from the Config.config_args dictionary.

Searches always prioritize the configparser namespace first, before searching in the toml namespace.

If Alembic was run using the -n/--name flag to indicate an alternate main section name, this is taken into account only for the configparser-parsed .ini file. The section name in toml is always [tool.alembic].

Added in version 1.16.0.

Return an option from the ‘main’ section of the .ini file.

This defaults to being a key from the [alembic] section, unless the -n/--name flag were used to indicate a different section.

Does NOT consume from the pyproject.toml file.

Config.get_alembic_option() - includes pyproject support

Return all the configuration options from a given .ini file section as a dictionary.

If the given section does not exist, the value of default is returned, which is expected to be a dictionary or other mapping.

Return an option from the given section of the .ini file.

Return the directory where Alembic setup templates are found.

This method is used by the alembic init and list_templates commands.

The messaging options.

Render a message to standard out.

When Config.print_stdout() is called with additional args those arguments will formatted against the provided text, otherwise we simply output the provided text verbatim.

This is a no-op when the``quiet`` messaging option is enabled.

Set an option programmatically within the ‘main’ section.

This overrides whatever was in the .ini file.

name¶ – name of the value

value¶ – the value. Note that this value is passed to ConfigParser.set, which supports variable interpolation using pyformat (e.g. %(some_value)s). A raw percent sign not part of an interpolation symbol must therefore be escaped, e.g. %%. The given value may refer to another value already in the file using the interpolation format.

Set an option programmatically within the given section.

The section is created if it doesn’t exist already. The value here will override whatever was in the .ini file.

Does NOT consume from the pyproject.toml file.

Config.get_alembic_option() - includes pyproject support

section¶ – name of the section

name¶ – name of the value

value¶ – the value. Note that this value is passed to ConfigParser.set, which supports variable interpolation using pyformat (e.g. %(some_value)s). A raw percent sign not part of an interpolation symbol must therefore be escaped, e.g. %%. The given value may refer to another value already in the file using the interpolation format.

Return a dictionary of the [tool.alembic] section from pyproject.toml

Filesystem path to the pyproject.toml file in use.

Added in version 1.16.0.

The console runner function for Alembic.

© Copyright 2010-2026, Mike Bayer.

**Examples:**

Example 1 (python):
```python
from alembic import context

some_param = context.config.get_main_option("my option")
```

Example 2 (sql):
```sql
from alembic.config import Config
alembic_cfg = Config("/path/to/yourapp/alembic.ini")
```

Example 3 (sql):
```sql
from alembic.config import Config
alembic_cfg = Config()
alembic_cfg.set_main_option("script_location", "myapp:migrations")
alembic_cfg.set_main_option("sqlalchemy.url", "postgresql://foo/bar")
alembic_cfg.set_section_option("mysection", "foo", "bar")
```

Example 4 (typescript):
```typescript
with engine.begin() as connection:
    alembic_cfg.attributes['connection'] = connection
    command.upgrade(alembic_cfg, "head")
```

---

## Exception Objects

**URL:** https://alembic.sqlalchemy.org/en/latest/api/exceptions.html

**Contents:**
- Exception Objects
- Contents
- Exception Objects#

Raised when diffs were detected by the command.check() command.

Added in version 1.9.0.

Base command error for all exceptions

Indicates the database is not at current head revisions.

Raised by the command.current() command when the command.current.check_heads parameter is used.

Added in version 1.17.1.

© Copyright 2010-2026, Mike Bayer.

---

## Overview

**URL:** https://alembic.sqlalchemy.org/en/latest/api/overview.html

**Contents:**
- Overview
- Overview#

this section is a technical overview of the internal API of Alembic. This section is only useful for developers who wish to extend the capabilities of Alembic; for regular users, reading this section is not necessary.

A visualization of the primary features of Alembic’s internals is presented in the following figure. The module and class boxes do not list out all the operations provided by each unit; only a small set of representative elements intended to convey the primary purpose of each system.

The script runner for Alembic is present in the Configuration module. This module produces a Config object and passes it to the appropriate function in Commands. Functions within Commands will typically instantiate an ScriptDirectory instance, which represents the collection of version files, and an EnvironmentContext, which is a configurational facade passed to the environment’s env.py script.

The EnvironmentContext object is the primary object used within the env.py script, whose main purpose is that of a facade for creating and using a MigrationContext object, which is the actual migration engine that refers to a database implementation. The primary method called on this object within an env.py script is the EnvironmentContext.configure() method, which sets up the MigrationContext with database connectivity and behavioral configuration. It also supplies methods for transaction demarcation and migration running, but these methods ultimately call upon the MigrationContext that’s been configured.

MigrationContext is the gateway to the database for other parts of the application, and produces a DefaultImpl object which does the actual database communication, and knows how to create the specific SQL text of the various DDL directives such as ALTER TABLE; DefaultImpl has subclasses that are per-database-backend. In “offline” mode (e.g. --sql), the MigrationContext will produce SQL to a file output stream instead of a database.

During an upgrade or downgrade operation, a specific series of migration scripts are invoked starting with the MigrationContext in conjunction with the ScriptDirectory; the actual scripts themselves make use of the Operations object, which provide the end-user interface to specific database operations. The Operations object is generated based on a series of “operation directive” objects that are user-extensible, and start out in the Built-in Operation Objects module.

Another prominent feature of Alembic is the “autogenerate” feature, which produces new migration scripts that contain Python code. The autogenerate feature starts in Autogeneration, and is used exclusively by the alembic.command.revision() command when the --autogenerate flag is passed. Autogenerate refers to the MigrationContext and DefaultImpl in order to access database connectivity and access per-backend rules for autogenerate comparisons. It also makes use of Built-in Operation Objects in order to represent the operations that it will render into scripts.

© Copyright 2010-2026, Mike Bayer.

---

## Script Directory

**URL:** https://alembic.sqlalchemy.org/en/latest/api/script.html

**Contents:**
- Script Directory
- Contents
- Script Directory#
- Revision#
- Write Hooks#

The ScriptDirectory object provides programmatic access to the Alembic version files present in the filesystem.

Represent a single revision file in a versions/ directory.

The Script instance is returned by methods such as ScriptDirectory.iterate_revisions().

Return the docstring given in the script.

Return the docstring given in the script.

The Python module representing the actual script itself.

Filesystem path of the script.

Provides operations upon an Alembic script directory.

This object is useful to get information as to current revisions, most notably being able to get at the “head” revision, for schemes that want to test if the current revision in the database is the most recent:

Convert a symbolic revision, i.e. ‘head’ or ‘base’, into an actual revision number.

Produce a new ScriptDirectory given a Config instance.

The Config need only have the script_location key present.

Generate a new revision file.

This runs the script.py.mako template, given template arguments, and creates a new file.

revid¶ – String revision id. Typically this comes from alembic.util.rev_id().

message¶ – the revision message, the one passed by the -m argument to the revision command.

head¶ – the head revision to generate against. Defaults to the current “head” if no branches are present, else raises an exception.

splice¶ – if True, allow the “head” version to not be an actual head; otherwise, the selected head must be a head (e.g. endpoint) revision.

Return the “base” revision as a string.

This is the revision number of the script that has a down_revision of None.

If the script directory has multiple bases, an error is raised; ScriptDirectory.get_bases() should be preferred.

return all “base” revisions as strings.

This is the revision number of all scripts that have a down_revision of None.

Return the current head revision.

If the script directory has multiple heads due to branching, an error is raised; ScriptDirectory.get_heads() should be preferred.

a string revision number.

ScriptDirectory.get_heads()

Return all “versioned head” revisions as strings.

This is normally a list of length one, unless branches are present. The ScriptDirectory.get_current_head() method can be used normally when a script directory has only one head.

consider_depends_on¶ – if True, head revisions that are also a dependency of another revision via Operations.create_revision.depends_on will not be included in the returned list, matching the effective heads that would be present in the alembic_version table after running all upgrades. Added in version 1.18.5.

if True, head revisions that are also a dependency of another revision via Operations.create_revision.depends_on will not be included in the returned list, matching the effective heads that would be present in the alembic_version table after running all upgrades.

Added in version 1.18.5.

a list of string revision numbers.

Return the Script instance with the given rev id.

ScriptDirectory.get_revisions()

Return the Script instance with the given rev identifier, symbolic name, or sequence of identifiers.

Iterate through script revisions, starting at the given upper revision identifier and ending at the lower.

The traversal uses strictly the down_revision marker inside each migration script, so it is a requirement that upper >= lower, else you’ll get nothing back.

The iterator yields Script objects.

RevisionMap.iterate_revisions()

Run the script environment.

This basically runs the env.py script present in the migration environment. It is called exclusively by the command functions in alembic.command.

return a single version location based on the sole path passed within version_locations.

If multiple version locations are configured, an error is raised.

Iterate through all revisions.

base¶ – the base revision, or “base” to start from the empty revision.

head¶ – the head revision; defaults to “heads” to indicate all head revisions. May also be “head” to indicate a single head revision.

The RevisionMap object serves as the basis for revision management, used exclusively by ScriptDirectory.

Base class for revisioned objects.

The Revision class is the base of the more public-facing Script object, which represents a migration script. The mechanics of revision management and traversal are encapsulated within Revision, while Script applies this logic to Python files in a version directory.

Optional string/tuple of symbolic names to apply to this revision’s branch

Additional revisions which this revision is dependent on.

From a migration standpoint, these dependencies are added to the down_revision to form the full iteration. However, the separation of down_revision from “dependencies” is to assist in navigating a history that contains many branches, typically a multi-root scenario.

The down_revision identifier(s) within the migration script.

Note that the total set of “down” revisions is down_revision + dependencies.

Return True if this Revision is a ‘base’ revision.

Return True if this Script is a branch point.

A branchpoint is defined as a Script which is referred to by more than one succeeding Script, that is more than one Script has a down_revision identifier pointing here.

Return True if this Revision is a ‘head’ revision.

This is determined based on whether any other Script within the ScriptDirectory refers to this Script. Multiple heads can be present.

Return True if this Script is a merge point.

following revisions, based on down_revision only.

The string revision number.

Maintains a map of Revision objects.

RevisionMap is used by ScriptDirectory to maintain and traverse the collection of Script objects, which are themselves instances of Revision.

Construct a new RevisionMap.

generator¶ – a zero-arg callable that will generate an iterable of Revision instances to be used. These are typically Script subclasses within regular Alembic use.

add a single revision to an existing map.

This method is for single-revision use cases, it’s not appropriate for fully populating an entire revision map.

All “base” revisions as strings.

These are revisions that have a down_revision of None, or empty tuple.

a tuple of string revision numbers.

Return the current head revision.

If the script directory has multiple heads due to branching, an error is raised; ScriptDirectory.get_heads() should be preferred.

branch_label¶ – optional branch name which will limit the heads considered to those which include that branch_label.

a string revision number.

ScriptDirectory.get_heads()

Return the Revision instance with the given rev id.

If a symbolic name such as “head” or “base” is given, resolves the identifier into the current head or base revision. If the symbolic name refers to multiples, MultipleHeads is raised.

Supports partial identifiers, where the given identifier is matched against all identifiers that start with the given characters; if there is exactly one match, that determines the full revision.

Return the Revision instances with the given rev id or identifiers.

May be given a single identifier, a sequence of identifiers, or the special symbols “head” or “base”. The result is a tuple of one or more identifiers, or an empty tuple in the case of “base”.

In the cases where ‘head’, ‘heads’ is requested and the revision map is empty, returns an empty tuple.

Supports partial identifiers, where the given identifier is matched against all identifiers that start with the given characters; if there is exactly one match, that determines the full revision.

All “head” revisions as strings.

This is normally a tuple of length one, unless unmerged branches are present.

a tuple of string revision numbers.

Iterate through script revisions, starting at the given upper revision identifier and ending at the lower.

The traversal uses strictly the down_revision marker inside each migration script, so it is a requirement that upper >= lower, else you’ll get nothing back.

The iterator yields Revision objects.

A function decorator that will register that function as a write hook.

See the documentation linked below for an example.

Writing Custom Hooks as Python Functions

© Copyright 2010-2026, Mike Bayer.

**Examples:**

Example 1 (sql):
```sql
from alembic.script import ScriptDirectory
from alembic.config import Config
config = Config()
config.set_main_option("script_location", "myapp:migrations")
script = ScriptDirectory.from_config(config)

head_revision = script.get_current_head()
```

---
