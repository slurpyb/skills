# Postgresql_Docs - Data Types

**Pages:** 18

---

## 8.14. JSON Types #

**URL:** https://www.postgresql.org/docs/current/datatype-json.html

**Contents:**
- 8.14. JSON Types #
  - Note
  - 8.14.1. JSON Input and Output Syntax #
  - 8.14.2. Designing JSON Documents #
  - 8.14.3. jsonb Containment and Existence #
  - Tip
  - 8.14.4. jsonb Indexing #
  - 8.14.5. jsonb Subscripting #
  - 8.14.6. Transforms #
  - 8.14.7. jsonpath Type #

JSON data types are for storing JSON (JavaScript Object Notation) data, as specified in RFC 7159. Such data can also be stored as text, but the JSON data types have the advantage of enforcing that each stored value is valid according to the JSON rules. There are also assorted JSON-specific functions and operators available for data stored in these data types; see Section 9.16.

PostgreSQL offers two types for storing JSON data: json and jsonb. To implement efficient query mechanisms for these data types, PostgreSQL also provides the jsonpath data type described in Section 8.14.7.

The json and jsonb data types accept almost identical sets of values as input. The major practical difference is one of efficiency. The json data type stores an exact copy of the input text, which processing functions must reparse on each execution; while jsonb data is stored in a decomposed binary format that makes it slightly slower to input due to added conversion overhead, but significantly faster to process, since no reparsing is needed. jsonb also supports indexing, which can be a significant advantage.

Because the json type stores an exact copy of the input text, it will preserve semantically-insignificant white space between tokens, as well as the order of keys within JSON objects. Also, if a JSON object within the value contains the same key more than once, all the key/value pairs are kept. (The processing functions consider the last value as the operative one.) By contrast, jsonb does not preserve white space, does not preserve the order of object keys, and does not keep duplicate object keys. If duplicate keys are specified in the input, only the last value is kept.

In general, most applications should prefer to store JSON data as jsonb, unless there are quite specialized needs, such as legacy assumptions about ordering of object keys.

RFC 7159 specifies that JSON strings should be encoded in UTF8. It is therefore not possible for the JSON types to conform rigidly to the JSON specification unless the database encoding is UTF8. Attempts to directly include characters that cannot be represented in the database encoding will fail; conversely, characters that can be represented in the database encoding but not in UTF8 will be allowed.

RFC 7159 permits JSON strings to contain Unicode escape sequences denoted by \uXXXX. In the input function for the json type, Unicode escapes are allowed regardless of the database encoding, and are checked only for syntactic correctness (that is, that four hex digits follow \u). However, the input function for jsonb is stricter: it disallows Unicode escapes for characters that cannot be represented in the database encoding. The jsonb type also rejects \u0000 (because that cannot be represented in PostgreSQL's text type), and it insists that any use of Unicode surrogate pairs to designate characters outside the Unicode Basic Multilingual Plane be correct. Valid Unicode escapes are converted to the equivalent single character for storage; this includes folding surrogate pairs into a single character.

Many of the JSON processing functions described in Section 9.16 will convert Unicode escapes to regular characters, and will therefore throw the same types of errors just described even if their input is of type json not jsonb. The fact that the json input function does not make these checks may be considered a historical artifact, although it does allow for simple storage (without processing) of JSON Unicode escapes in a database encoding that does not support the represented characters.

When converting textual JSON input into jsonb, the primitive types described by RFC 7159 are effectively mapped onto native PostgreSQL types, as shown in Table 8.23. Therefore, there are some minor additional constraints on what constitutes valid jsonb data that do not apply to the json type, nor to JSON in the abstract, corresponding to limits on what can be represented by the underlying data type. Notably, jsonb will reject numbers that are outside the range of the PostgreSQL numeric data type, while json will not. Such implementation-defined restrictions are permitted by RFC 7159. However, in practice such problems are far more likely to occur in other implementations, as it is common to represent JSON's number primitive type as IEEE 754 double precision floating point (which RFC 7159 explicitly anticipates and allows for). When using JSON as an interchange format with such systems, the danger of losing numeric precision compared to data originally stored by PostgreSQL should be considered.

Conversely, as noted in the table there are some minor restrictions on the input format of JSON primitive types that do not apply to the corresponding PostgreSQL types.

Table 8.23. JSON Primitive Types and Corresponding PostgreSQL Types

The input/output syntax for the JSON data types is as specified in RFC 7159.

The following are all valid json (or jsonb) expressions:

As previously stated, when a JSON value is input and then printed without any additional processing, json outputs the same text that was input, while jsonb does not preserve semantically-insignificant details such as whitespace. For example, note the differences here:

One semantically-insignificant detail worth noting is that in jsonb, numbers will be printed according to the behavior of the underlying numeric type. In practice this means that numbers entered with E notation will be printed without it, for example:

However, jsonb will preserve trailing fractional zeroes, as seen in this example, even though those are semantically insignificant for purposes such as equality checks.

For the list of built-in functions and operators available for constructing and processing JSON values, see Section 9.16.

Representing data as JSON can be considerably more flexible than the traditional relational data model, which is compelling in environments where requirements are fluid. It is quite possible for both approaches to co-exist and complement each other within the same application. However, even for applications where maximal flexibility is desired, it is still recommended that JSON documents have a somewhat fixed structure. The structure is typically unenforced (though enforcing some business rules declaratively is possible), but having a predictable structure makes it easier to write queries that usefully summarize a set of “documents” (datums) in a table.

JSON data is subject to the same concurrency-control considerations as any other data type when stored in a table. Although storing large documents is practicable, keep in mind that any update acquires a row-level lock on the whole row. Consider limiting JSON documents to a manageable size in order to decrease lock contention among updating transactions. Ideally, JSON documents should each represent an atomic datum that business rules dictate cannot reasonably be further subdivided into smaller datums that could be modified independently.

Testing containment is an important capability of jsonb. There is no parallel set of facilities for the json type. Containment tests whether one jsonb document has contained within it another one. These examples return true except as noted:

The general principle is that the contained object must match the containing object as to structure and data contents, possibly after discarding some non-matching array elements or object key/value pairs from the containing object. But remember that the order of array elements is not significant when doing a containment match, and duplicate array elements are effectively considered only once.

As a special exception to the general principle that the structures must match, an array may contain a primitive value:

jsonb also has an existence operator, which is a variation on the theme of containment: it tests whether a string (given as a text value) appears as an object key or array element at the top level of the jsonb value. These examples return true except as noted:

JSON objects are better suited than arrays for testing containment or existence when there are many keys or elements involved, because unlike arrays they are internally optimized for searching, and do not need to be searched linearly.

Because JSON containment is nested, an appropriate query can skip explicit selection of sub-objects. As an example, suppose that we have a doc column containing objects at the top level, with most objects containing tags fields that contain arrays of sub-objects. This query finds entries in which sub-objects containing both "term":"paris" and "term":"food" appear, while ignoring any such keys outside the tags array:

One could accomplish the same thing with, say,

but that approach is less flexible, and often less efficient as well.

On the other hand, the JSON existence operator is not nested: it will only look for the specified key or array element at top level of the JSON value.

The various containment and existence operators, along with all other JSON operators and functions are documented in Section 9.16.

GIN indexes can be used to efficiently search for keys or key/value pairs occurring within a large number of jsonb documents (datums). Two GIN “operator classes” are provided, offering different performance and flexibility trade-offs.

The default GIN operator class for jsonb supports queries with the key-exists operators ?, ?| and ?&, the containment operator @>, and the jsonpath match operators @? and @@. (For details of the semantics that these operators implement, see Table 9.48.) An example of creating an index with this operator class is:

The non-default GIN operator class jsonb_path_ops does not support the key-exists operators, but it does support @>, @? and @@. An example of creating an index with this operator class is:

Consider the example of a table that stores JSON documents retrieved from a third-party web service, with a documented schema definition. A typical document is:

We store these documents in a table named api, in a jsonb column named jdoc. If a GIN index is created on this column, queries like the following can make use of the index:

However, the index could not be used for queries like the following, because though the operator ? is indexable, it is not applied directly to the indexed column jdoc:

Still, with appropriate use of expression indexes, the above query can use an index. If querying for particular items within the "tags" key is common, defining an index like this may be worthwhile:

Now, the WHERE clause jdoc -> 'tags' ? 'qui' will be recognized as an application of the indexable operator ? to the indexed expression jdoc -> 'tags'. (More information on expression indexes can be found in Section 11.7.)

Another approach to querying is to exploit containment, for example:

A simple GIN index on the jdoc column can support this query. But note that such an index will store copies of every key and value in the jdoc column, whereas the expression index of the previous example stores only data found under the tags key. While the simple-index approach is far more flexible (since it supports queries about any key), targeted expression indexes are likely to be smaller and faster to search than a simple index.

GIN indexes also support the @? and @@ operators, which perform jsonpath matching. Examples are

For these operators, a GIN index extracts clauses of the form accessors_chain == constant out of the jsonpath pattern, and does the index search based on the keys and values mentioned in these clauses. The accessors chain may include .key, [*], and [index] accessors. The jsonb_ops operator class also supports .* and .** accessors, but the jsonb_path_ops operator class does not.

Although the jsonb_path_ops operator class supports only queries with the @>, @? and @@ operators, it has notable performance advantages over the default operator class jsonb_ops. A jsonb_path_ops index is usually much smaller than a jsonb_ops index over the same data, and the specificity of searches is better, particularly when queries contain keys that appear frequently in the data. Therefore search operations typically perform better than with the default operator class.

The technical difference between a jsonb_ops and a jsonb_path_ops GIN index is that the former creates independent index items for each key and value in the data, while the latter creates index items only for each value in the data. [7] Basically, each jsonb_path_ops index item is a hash of the value and the key(s) leading to it; for example to index {"foo": {"bar": "baz"}}, a single index item would be created incorporating all three of foo, bar, and baz into the hash value. Thus a containment query looking for this structure would result in an extremely specific index search; but there is no way at all to find out whether foo appears as a key. On the other hand, a jsonb_ops index would create three index items representing foo, bar, and baz separately; then to do the containment query, it would look for rows containing all three of these items. While GIN indexes can perform such an AND search fairly efficiently, it will still be less specific and slower than the equivalent jsonb_path_ops search, especially if there are a very large number of rows containing any single one of the three index items.

A disadvantage of the jsonb_path_ops approach is that it produces no index entries for JSON structures not containing any values, such as {"a": {}}. If a search for documents containing such a structure is requested, it will require a full-index scan, which is quite slow. jsonb_path_ops is therefore ill-suited for applications that often perform such searches.

jsonb also supports btree and hash indexes. These are usually useful only if it's important to check equality of complete JSON documents. The btree ordering for jsonb datums is seldom of great interest, but for completeness it is:

with the exception that (for historical reasons) an empty top level array sorts less than null. Objects with equal numbers of pairs are compared in the order:

Note that object keys are compared in their storage order; in particular, since shorter keys are stored before longer keys, this can lead to results that might be unintuitive, such as:

Similarly, arrays with equal numbers of elements are compared in the order:

Primitive JSON values are compared using the same comparison rules as for the underlying PostgreSQL data type. Strings are compared using the default database collation.

The jsonb data type supports array-style subscripting expressions to extract and modify elements. Nested values can be indicated by chaining subscripting expressions, following the same rules as the path argument in the jsonb_set function. If a jsonb value is an array, numeric subscripts start at zero, and negative integers count backwards from the last element of the array. Slice expressions are not supported. The result of a subscripting expression is always of the jsonb data type.

UPDATE statements may use subscripting in the SET clause to modify jsonb values. Subscript paths must be traversable for all affected values insofar as they exist. For instance, the path val['a']['b']['c'] can be traversed all the way to c if every val, val['a'], and val['a']['b'] is an object. If any val['a'] or val['a']['b'] is not defined, it will be created as an empty object and filled as necessary. However, if any val itself or one of the intermediary values is defined as a non-object such as a string, number, or jsonb null, traversal cannot proceed so an error is raised and the transaction aborted.

An example of subscripting syntax:

jsonb assignment via subscripting handles a few edge cases differently from jsonb_set. When a source jsonb value is NULL, assignment via subscripting will proceed as if it was an empty JSON value of the type (object or array) implied by the subscript key:

If an index is specified for an array containing too few elements, NULL elements will be appended until the index is reachable and the value can be set.

A jsonb value will accept assignments to nonexistent subscript paths as long as the last existing element to be traversed is an object or array, as implied by the corresponding subscript (the element indicated by the last subscript in the path is not traversed and may be anything). Nested array and object structures will be created, and in the former case null-padded, as specified by the subscript path until the assigned value can be placed.

Additional extensions are available that implement transforms for the jsonb type for different procedural languages.

The extensions for PL/Perl are called jsonb_plperl and jsonb_plperlu. If you use them, jsonb values are mapped to Perl arrays, hashes, and scalars, as appropriate.

The extension for PL/Python is called jsonb_plpython3u. If you use it, jsonb values are mapped to Python dictionaries, lists, and scalars, as appropriate.

Of these extensions, jsonb_plperl is considered “trusted”, that is, it can be installed by non-superusers who have CREATE privilege on the current database. The rest require superuser privilege to install.

The jsonpath type implements support for the SQL/JSON path language in PostgreSQL to efficiently query JSON data. It provides a binary representation of the parsed SQL/JSON path expression that specifies the items to be retrieved by the path engine from the JSON data for further processing with the SQL/JSON query functions.

The semantics of SQL/JSON path predicates and operators generally follow SQL. At the same time, to provide a natural way of working with JSON data, SQL/JSON path syntax uses some JavaScript conventions:

Dot (.) is used for member access.

Square brackets ([]) are used for array access.

SQL/JSON arrays are 0-relative, unlike regular SQL arrays that start from 1.

Numeric literals in SQL/JSON path expressions follow JavaScript rules, which are different from both SQL and JSON in some minor details. For example, SQL/JSON path allows .1 and 1., which are invalid in JSON. Non-decimal integer literals and underscore separators are supported, for example, 1_000_000, 0x1EEE_FFFF, 0o273, 0b100101. In SQL/JSON path (and in JavaScript, but not in SQL proper), there must not be an underscore separator directly after the radix prefix.

An SQL/JSON path expression is typically written in an SQL query as an SQL character string literal, so it must be enclosed in single quotes, and any single quotes desired within the value must be doubled (see Section 4.1.2.1). Some forms of path expressions require string literals within them. These embedded string literals follow JavaScript/ECMAScript conventions: they must be surrounded by double quotes, and backslash escapes may be used within them to represent otherwise-hard-to-type characters. In particular, the way to write a double quote within an embedded string literal is \", and to write a backslash itself, you must write \\. Other special backslash sequences include those recognized in JavaScript strings: \b, \f, \n, \r, \t, \v for various ASCII control characters, \xNN for a character code written with only two hex digits, \uNNNN for a Unicode character identified by its 4-hex-digit code point, and \u{N...} for a Unicode character code point written with 1 to 6 hex digits.

A path expression consists of a sequence of path elements, which can be any of the following:

Path literals of JSON primitive types: Unicode text, numeric, true, false, or null.

Path variables listed in Table 8.24.

Accessor operators listed in Table 8.25.

jsonpath operators and methods listed in Section 9.16.2.3.

Parentheses, which can be used to provide filter expressions or define the order of path evaluation.

For details on using jsonpath expressions with SQL/JSON query functions, see Section 9.16.2.

Table 8.24. jsonpath Variables

Table 8.25. jsonpath Accessors

Member accessor that returns an object member with the specified key. If the key name matches some named variable starting with $ or does not meet the JavaScript rules for an identifier, it must be enclosed in double quotes to make it a string literal.

Wildcard member accessor that returns the values of all members located at the top level of the current object.

Recursive wildcard member accessor that processes all levels of the JSON hierarchy of the current object and returns all the member values, regardless of their nesting level. This is a PostgreSQL extension of the SQL/JSON standard.

.**{start_level to end_level}

Like .**, but selects only the specified levels of the JSON hierarchy. Nesting levels are specified as integers. Level zero corresponds to the current object. To access the lowest nesting level, you can use the last keyword. This is a PostgreSQL extension of the SQL/JSON standard.

Array element accessor. subscript can be given in two forms: index or start_index to end_index. The first form returns a single array element by its index. The second form returns an array slice by the range of indexes, including the elements that correspond to the provided start_index and end_index.

The specified index can be an integer, as well as an expression returning a single numeric value, which is automatically cast to integer. Index zero corresponds to the first array element. You can also use the last keyword to denote the last array element, which is useful for handling arrays of unknown length.

Wildcard array element accessor that returns all array elements.

[7] For this purpose, the term “value” includes array elements, though JSON terminology sometimes considers array elements distinct from values within objects.

**Examples:**

Example 1 (scala):
```scala
-- Simple scalar/primitive value
-- Primitive values can be numbers, quoted strings, true, false, or null
SELECT '5'::json;

-- Array of zero or more elements (elements need not be of same type)
SELECT '[1, 2, "foo", null]'::json;

-- Object containing pairs of keys and values
-- Note that object keys must always be quoted strings
SELECT '{"bar": "baz", "balance": 7.77, "active": false}'::json;

-- Arrays and objects can be nested arbitrarily
SELECT '{"foo": [true, "bar"], "tags": {"a": 1, "b": null}}'::json;
```

Example 2 (json):
```json
SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::json;
                      json
-------------------------------------------------
 {"bar": "baz", "balance": 7.77, "active":false}
(1 row)

SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::jsonb;
                      jsonb
--------------------------------------------------
 {"bar": "baz", "active": false, "balance": 7.77}
(1 row)
```

Example 3 (json):
```json
SELECT '{"reading": 1.230e-5}'::json, '{"reading": 1.230e-5}'::jsonb;
         json          |          jsonb
-----------------------+-------------------------
 {"reading": 1.230e-5} | {"reading": 0.00001230}
(1 row)
```

Example 4 (scala):
```scala
-- Simple scalar/primitive values contain only the identical value:
SELECT '"foo"'::jsonb @> '"foo"'::jsonb;

-- The array on the right side is contained within the one on the left:
SELECT '[1, 2, 3]'::jsonb @> '[1, 3]'::jsonb;

-- Order of array elements is not significant, so this is also true:
SELECT '[1, 2, 3]'::jsonb @> '[3, 1]'::jsonb;

-- Duplicate array elements don't matter either:
SELECT '[1, 2, 3]'::jsonb @> '[1, 2, 2]'::jsonb;

-- The object with a single pair on the right side is contained
-- within the object on the left side:
SELECT '{"product": "PostgreSQL", "version": 9.4, "jsonb": true}'::jsonb @> '{"version": 9.4}'::jsonb;

-- The array on the right side is not considered contained within the
-- array on the left, even though a similar array is nested within it:
SELECT '[1, 2, [1, 3]]'::jsonb @> '[1, 3]'::jsonb;  -- yields false

-- But with a layer of nesting, it is contained:
SELECT '[1, 2, [1, 3]]'::jsonb @> '[[1, 3]]'::jsonb;

-- Similarly, containment is not reported here:
SELECT '{"foo": {"bar": "baz"}}'::jsonb @> '{"bar": "baz"}'::jsonb;  -- yields false

-- A top-level key and an empty object is contained:
SELECT '{"foo": {"bar": "baz"}}'::jsonb @> '{"foo": {}}'::jsonb;
```

---

## 8.11. Text Search Types #

**URL:** https://www.postgresql.org/docs/current/datatype-textsearch.html

**Contents:**
- 8.11. Text Search Types #
  - 8.11.1. tsvector #
  - 8.11.2. tsquery #

PostgreSQL provides two data types that are designed to support full text search, which is the activity of searching through a collection of natural-language documents to locate those that best match a query. The tsvector type represents a document in a form optimized for text search; the tsquery type similarly represents a text query. Chapter 12 provides a detailed explanation of this facility, and Section 9.13 summarizes the related functions and operators.

A tsvector value is a sorted list of distinct lexemes, which are words that have been normalized to merge different variants of the same word (see Chapter 12 for details). Sorting and duplicate-elimination are done automatically during input, as shown in this example:

To represent lexemes containing whitespace or punctuation, surround them with quotes:

(We use dollar-quoted string literals in this example and the next one to avoid the confusion of having to double quote marks within the literals.) Embedded quotes and backslashes must be doubled:

Optionally, integer positions can be attached to lexemes:

A position normally indicates the source word's location in the document. Positional information can be used for proximity ranking. Position values can range from 1 to 16383; larger numbers are silently set to 16383. Duplicate positions for the same lexeme are discarded.

Lexemes that have positions can further be labeled with a weight, which can be A, B, C, or D. D is the default and hence is not shown on output:

Weights are typically used to reflect document structure, for example by marking title words differently from body words. Text search ranking functions can assign different priorities to the different weight markers.

It is important to understand that the tsvector type itself does not perform any word normalization; it assumes the words it is given are normalized appropriately for the application. For example,

For most English-text-searching applications the above words would be considered non-normalized, but tsvector doesn't care. Raw document text should usually be passed through to_tsvector to normalize the words appropriately for searching:

Again, see Chapter 12 for more detail.

A tsquery value stores lexemes that are to be searched for, and can combine them using the Boolean operators & (AND), | (OR), and ! (NOT), as well as the phrase search operator <-> (FOLLOWED BY). There is also a variant <N> of the FOLLOWED BY operator, where N is an integer constant that specifies the distance between the two lexemes being searched for. <-> is equivalent to <1>.

Parentheses can be used to enforce grouping of these operators. In the absence of parentheses, ! (NOT) binds most tightly, <-> (FOLLOWED BY) next most tightly, then & (AND), with | (OR) binding the least tightly.

Here are some examples:

Optionally, lexemes in a tsquery can be labeled with one or more weight letters, which restricts them to match only tsvector lexemes with one of those weights:

Also, lexemes in a tsquery can be labeled with * to specify prefix matching:

This query will match any word in a tsvector that begins with “super”.

Quoting rules for lexemes are the same as described previously for lexemes in tsvector; and, as with tsvector, any required normalization of words must be done before converting to the tsquery type. The to_tsquery function is convenient for performing such normalization:

Note that to_tsquery will process prefixes in the same way as other words, which means this comparison returns true:

because postgres gets stemmed to postgr:

which will match the stemmed form of postgraduate.

**Examples:**

Example 1 (sql):
```sql
SELECT 'a fat cat sat on a mat and ate a fat rat'::tsvector;
                      tsvector
----------------------------------------------------
 'a' 'and' 'ate' 'cat' 'fat' 'mat' 'on' 'rat' 'sat'
```

Example 2 (sql):
```sql
SELECT $$the lexeme '    ' contains spaces$$::tsvector;
                 tsvector
-------------------------------------------
 '    ' 'contains' 'lexeme' 'spaces' 'the'
```

Example 3 (sql):
```sql
SELECT $$the lexeme 'Joe''s' contains a quote$$::tsvector;
                    tsvector
------------------------------------------------
 'Joe''s' 'a' 'contains' 'lexeme' 'quote' 'the'
```

Example 4 (sql):
```sql
SELECT 'a:1 fat:2 cat:3 sat:4 on:5 a:6 mat:7 and:8 ate:9 a:10 fat:11 rat:12'::tsvector;
                                  tsvector
-------------------------------------------------------------------​------------
 'a':1,6,10 'and':8 'ate':9 'cat':3 'fat':2,11 'mat':7 'on':5 'rat':12 'sat':4
```

---

## 8.1. Numeric Types #

**URL:** https://www.postgresql.org/docs/current/datatype-numeric.html

**Contents:**
- 8.1. Numeric Types #
  - 8.1.1. Integer Types #
  - 8.1.2. Arbitrary Precision Numbers #
  - Note
  - Note
  - Note
  - 8.1.3. Floating-Point Types #
  - Note
  - Note
  - Note

Numeric types consist of two-, four-, and eight-byte integers, four- and eight-byte floating-point numbers, and selectable-precision decimals. Table 8.2 lists the available types.

Table 8.2. Numeric Types

The syntax of constants for the numeric types is described in Section 4.1.2. The numeric types have a full set of corresponding arithmetic operators and functions. Refer to Chapter 9 for more information. The following sections describe the types in detail.

The types smallint, integer, and bigint store whole numbers, that is, numbers without fractional components, of various ranges. Attempts to store values outside of the allowed range will result in an error.

The type integer is the common choice, as it offers the best balance between range, storage size, and performance. The smallint type is generally only used if disk space is at a premium. The bigint type is designed to be used when the range of the integer type is insufficient.

SQL only specifies the integer types integer (or int), smallint, and bigint. The type names int2, int4, and int8 are extensions, which are also used by some other SQL database systems.

The type numeric can store numbers with a very large number of digits. It is especially recommended for storing monetary amounts and other quantities where exactness is required. Calculations with numeric values yield exact results where possible, e.g., addition, subtraction, multiplication. However, calculations on numeric values are very slow compared to the integer types, or to the floating-point types described in the next section.

We use the following terms below: The precision of a numeric is the total count of significant digits in the whole number, that is, the number of digits to both sides of the decimal point. The scale of a numeric is the count of decimal digits in the fractional part, to the right of the decimal point. So the number 23.5141 has a precision of 6 and a scale of 4. Integers can be considered to have a scale of zero.

Both the maximum precision and the maximum scale of a numeric column can be configured. To declare a column of type numeric use the syntax:

The precision must be positive, while the scale may be positive or negative (see below). Alternatively:

selects a scale of 0. Specifying:

without any precision or scale creates an “unconstrained numeric” column in which numeric values of any length can be stored, up to the implementation limits. A column of this kind will not coerce input values to any particular scale, whereas numeric columns with a declared scale will coerce input values to that scale. (The SQL standard requires a default scale of 0, i.e., coercion to integer precision. We find this a bit useless. If you're concerned about portability, always specify the precision and scale explicitly.)

The maximum precision that can be explicitly specified in a numeric type declaration is 1000. An unconstrained numeric column is subject to the limits described in Table 8.2.

If the scale of a value to be stored is greater than the declared scale of the column, the system will round the value to the specified number of fractional digits. Then, if the number of digits to the left of the decimal point exceeds the declared precision minus the declared scale, an error is raised. For example, a column declared as

will round values to 1 decimal place and can store values between -99.9 and 99.9, inclusive.

Beginning in PostgreSQL 15, it is allowed to declare a numeric column with a negative scale. Then values will be rounded to the left of the decimal point. The precision still represents the maximum number of non-rounded digits. Thus, a column declared as

will round values to the nearest thousand and can store values between -99000 and 99000, inclusive. It is also allowed to declare a scale larger than the declared precision. Such a column can only hold fractional values, and it requires the number of zero digits just to the right of the decimal point to be at least the declared scale minus the declared precision. For example, a column declared as

will round values to 5 decimal places and can store values between -0.00999 and 0.00999, inclusive.

PostgreSQL permits the scale in a numeric type declaration to be any value in the range -1000 to 1000. However, the SQL standard requires the scale to be in the range 0 to precision. Using scales outside that range may not be portable to other database systems.

Numeric values are physically stored without any extra leading or trailing zeroes. Thus, the declared precision and scale of a column are maximums, not fixed allocations. (In this sense the numeric type is more akin to varchar(n) than to char(n).) The actual storage requirement is two bytes for each group of four decimal digits, plus three to eight bytes overhead.

In addition to ordinary numeric values, the numeric type has several special values:

Infinity -Infinity NaN

These are adapted from the IEEE 754 standard, and represent “infinity”, “negative infinity”, and “not-a-number”, respectively. When writing these values as constants in an SQL command, you must put quotes around them, for example UPDATE table SET x = '-Infinity'. On input, these strings are recognized in a case-insensitive manner. The infinity values can alternatively be spelled inf and -inf.

The infinity values behave as per mathematical expectations. For example, Infinity plus any finite value equals Infinity, as does Infinity plus Infinity; but Infinity minus Infinity yields NaN (not a number), because it has no well-defined interpretation. Note that an infinity can only be stored in an unconstrained numeric column, because it notionally exceeds any finite precision limit.

The NaN (not a number) value is used to represent undefined calculational results. In general, any operation with a NaN input yields another NaN. The only exception is when the operation's other inputs are such that the same output would be obtained if the NaN were to be replaced by any finite or infinite numeric value; then, that output value is used for NaN too. (An example of this principle is that NaN raised to the zero power yields one.)

In most implementations of the “not-a-number” concept, NaN is not considered equal to any other numeric value (including NaN). In order to allow numeric values to be sorted and used in tree-based indexes, PostgreSQL treats NaN values as equal, and greater than all non-NaN values.

The types decimal and numeric are equivalent. Both types are part of the SQL standard.

When rounding values, the numeric type rounds ties away from zero, while (on most machines) the real and double precision types round ties to the nearest even number. For example:

The data types real and double precision are inexact, variable-precision numeric types. On all currently supported platforms, these types are implementations of IEEE Standard 754 for Binary Floating-Point Arithmetic (single and double precision, respectively), to the extent that the underlying processor, operating system, and compiler support it.

Inexact means that some values cannot be converted exactly to the internal format and are stored as approximations, so that storing and retrieving a value might show slight discrepancies. Managing these errors and how they propagate through calculations is the subject of an entire branch of mathematics and computer science and will not be discussed here, except for the following points:

If you require exact storage and calculations (such as for monetary amounts), use the numeric type instead.

If you want to do complicated calculations with these types for anything important, especially if you rely on certain behavior in boundary cases (infinity, underflow), you should evaluate the implementation carefully.

Comparing two floating-point values for equality might not always work as expected.

On all currently supported platforms, the real type has a range of around 1E-37 to 1E+37 with a precision of at least 6 decimal digits. The double precision type has a range of around 1E-307 to 1E+308 with a precision of at least 15 digits. Values that are too large or too small will cause an error. Rounding might take place if the precision of an input number is too high. Numbers too close to zero that are not representable as distinct from zero will cause an underflow error.

By default, floating point values are output in text form in their shortest precise decimal representation; the decimal value produced is closer to the true stored binary value than to any other value representable in the same binary precision. (However, the output value is currently never exactly midway between two representable values, in order to avoid a widespread bug where input routines do not properly respect the round-to-nearest-even rule.) This value will use at most 17 significant decimal digits for float8 values, and at most 9 digits for float4 values.

This shortest-precise output format is much faster to generate than the historical rounded format.

For compatibility with output generated by older versions of PostgreSQL, and to allow the output precision to be reduced, the extra_float_digits parameter can be used to select rounded decimal output instead. Setting a value of 0 restores the previous default of rounding the value to 6 (for float4) or 15 (for float8) significant decimal digits. Setting a negative value reduces the number of digits further; for example -2 would round output to 4 or 13 digits respectively.

Any value of extra_float_digits greater than 0 selects the shortest-precise format.

Applications that wanted precise values have historically had to set extra_float_digits to 3 to obtain them. For maximum compatibility between versions, they should continue to do so.

In addition to ordinary numeric values, the floating-point types have several special values:

Infinity -Infinity NaN

These represent the IEEE 754 special values “infinity”, “negative infinity”, and “not-a-number”, respectively. When writing these values as constants in an SQL command, you must put quotes around them, for example UPDATE table SET x = '-Infinity'. On input, these strings are recognized in a case-insensitive manner. The infinity values can alternatively be spelled inf and -inf.

IEEE 754 specifies that NaN should not compare equal to any other floating-point value (including NaN). In order to allow floating-point values to be sorted and used in tree-based indexes, PostgreSQL treats NaN values as equal, and greater than all non-NaN values.

PostgreSQL also supports the SQL-standard notations float and float(p) for specifying inexact numeric types. Here, p specifies the minimum acceptable precision in binary digits. PostgreSQL accepts float(1) to float(24) as selecting the real type, while float(25) to float(53) select double precision. Values of p outside the allowed range draw an error. float with no precision specified is taken to mean double precision.

This section describes a PostgreSQL-specific way to create an autoincrementing column. Another way is to use the SQL-standard identity column feature, described at Section 5.3.

The data types smallserial, serial and bigserial are not true types, but merely a notational convenience for creating unique identifier columns (similar to the AUTO_INCREMENT property supported by some other databases). In the current implementation, specifying:

is equivalent to specifying:

Thus, we have created an integer column and arranged for its default values to be assigned from a sequence generator. A NOT NULL constraint is applied to ensure that a null value cannot be inserted. (In most cases you would also want to attach a UNIQUE or PRIMARY KEY constraint to prevent duplicate values from being inserted by accident, but this is not automatic.) Lastly, the sequence is marked as “owned by” the column, so that it will be dropped if the column or table is dropped.

Because smallserial, serial and bigserial are implemented using sequences, there may be "holes" or gaps in the sequence of values which appears in the column, even if no rows are ever deleted. A value allocated from the sequence is still "used up" even if a row containing that value is never successfully inserted into the table column. This may happen, for example, if the inserting transaction rolls back. See nextval() in Section 9.17 for details.

To insert the next value of the sequence into the serial column, specify that the serial column should be assigned its default value. This can be done either by excluding the column from the list of columns in the INSERT statement, or through the use of the DEFAULT key word.

The type names serial and serial4 are equivalent: both create integer columns. The type names bigserial and serial8 work the same way, except that they create a bigint column. bigserial should be used if you anticipate the use of more than 231 identifiers over the lifetime of the table. The type names smallserial and serial2 also work the same way, except that they create a smallint column.

The sequence created for a serial column is automatically dropped when the owning column is dropped. You can drop the sequence without dropping the column, but this will force removal of the column default expression.

**Examples:**

Example 1 (unknown):
```unknown
double precision
```

Example 2 (unknown):
```unknown
smallserial
```

Example 3 (unknown):
```unknown
NUMERIC(precision, scale)
```

Example 4 (unknown):
```unknown
NUMERIC(precision)
```

---

## 8.21. Pseudo-Types #

**URL:** https://www.postgresql.org/docs/current/datatype-pseudo.html

**Contents:**
- 8.21. Pseudo-Types #

The PostgreSQL type system contains a number of special-purpose entries that are collectively called pseudo-types. A pseudo-type cannot be used as a column data type, but it can be used to declare a function's argument or result type. Each of the available pseudo-types is useful in situations where a function's behavior does not correspond to simply taking or returning a value of a specific SQL data type. Table 8.27 lists the existing pseudo-types.

Table 8.27. Pseudo-Types

Functions coded in C (whether built-in or dynamically loaded) can be declared to accept or return any of these pseudo-types. It is up to the function author to ensure that the function will behave safely when a pseudo-type is used as an argument type.

Functions coded in procedural languages can use pseudo-types only as allowed by their implementation languages. At present most procedural languages forbid use of a pseudo-type as an argument type, and allow only void and record as a result type (plus trigger or event_trigger when the function is used as a trigger or event trigger). Some also support polymorphic functions using the polymorphic pseudo-types, which are shown above and discussed in detail in Section 36.2.5.

The internal pseudo-type is used to declare functions that are meant only to be called internally by the database system, and not by direct invocation in an SQL query. If a function has at least one internal-type argument then it cannot be called from SQL. To preserve the type safety of this restriction it is important to follow this coding rule: do not create any function that is declared to return internal unless it has at least one internal argument.

**Examples:**

Example 1 (unknown):
```unknown
anynonarray
```

Example 2 (unknown):
```unknown
anymultirange
```

Example 3 (unknown):
```unknown
anycompatible
```

Example 4 (unknown):
```unknown
anycompatiblearray
```

---

## 9.16. JSON Functions and Operators #

**URL:** https://www.postgresql.org/docs/current/functions-json.html

**Contents:**
- 9.16. JSON Functions and Operators #
  - 9.16.1. Processing and Creating JSON Data #
  - Note
  - Note
  - 9.16.2. The SQL/JSON Path Language #
    - 9.16.2.1. Deviations from the SQL Standard #
      - 9.16.2.1.1. Boolean Predicate Check Expressions #
  - Note
      - 9.16.2.1.2. Regular Expression Interpretation #
    - 9.16.2.2. Strict and Lax Modes #

This section describes:

functions and operators for processing and creating JSON data

the SQL/JSON path language

the SQL/JSON query functions

To provide native support for JSON data types within the SQL environment, PostgreSQL implements the SQL/JSON data model. This model comprises sequences of items. Each item can hold SQL scalar values, with an additional SQL/JSON null value, and composite data structures that use JSON arrays and objects. The model is a formalization of the implied data model in the JSON specification RFC 7159.

SQL/JSON allows you to handle JSON data alongside regular SQL data, with transaction support, including:

Uploading JSON data into the database and storing it in regular SQL columns as character or binary strings.

Generating JSON objects and arrays from relational data.

Querying JSON data using SQL/JSON query functions and SQL/JSON path language expressions.

To learn more about the SQL/JSON standard, see [sqltr-19075-6]. For details on JSON types supported in PostgreSQL, see Section 8.14.

Table 9.47 shows the operators that are available for use with JSON data types (see Section 8.14). In addition, the usual comparison operators shown in Table 9.1 are available for jsonb, though not for json. The comparison operators follow the ordering rules for B-tree operations outlined in Section 8.14.4. See also Section 9.21 for the aggregate function json_agg which aggregates record values as JSON, the aggregate function json_object_agg which aggregates pairs of values into a JSON object, and their jsonb equivalents, jsonb_agg and jsonb_object_agg.

Table 9.47. json and jsonb Operators

json -> integer → json

jsonb -> integer → jsonb

Extracts n'th element of JSON array (array elements are indexed from zero, but negative integers count from the end).

'[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json -> 2 → {"c":"baz"}

'[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json -> -3 → {"a":"foo"}

jsonb -> text → jsonb

Extracts JSON object field with the given key.

'{"a": {"b":"foo"}}'::json -> 'a' → {"b":"foo"}

json ->> integer → text

jsonb ->> integer → text

Extracts n'th element of JSON array, as text.

'[1,2,3]'::json ->> 2 → 3

jsonb ->> text → text

Extracts JSON object field with the given key, as text.

'{"a":1,"b":2}'::json ->> 'b' → 2

json #> text[] → json

jsonb #> text[] → jsonb

Extracts JSON sub-object at the specified path, where path elements can be either field keys or array indexes.

'{"a": {"b": ["foo","bar"]}}'::json #> '{a,b,1}' → "bar"

json #>> text[] → text

jsonb #>> text[] → text

Extracts JSON sub-object at the specified path as text.

'{"a": {"b": ["foo","bar"]}}'::json #>> '{a,b,1}' → bar

The field/element/path extraction operators return NULL, rather than failing, if the JSON input does not have the right structure to match the request; for example if no such key or array element exists.

Some further operators exist only for jsonb, as shown in Table 9.48. Section 8.14.4 describes how these operators can be used to effectively search indexed jsonb data.

Table 9.48. Additional jsonb Operators

jsonb @> jsonb → boolean

Does the first JSON value contain the second? (See Section 8.14.3 for details about containment.)

'{"a":1, "b":2}'::jsonb @> '{"b":2}'::jsonb → t

jsonb <@ jsonb → boolean

Is the first JSON value contained in the second?

'{"b":2}'::jsonb <@ '{"a":1, "b":2}'::jsonb → t

jsonb ? text → boolean

Does the text string exist as a top-level key or array element within the JSON value?

'{"a":1, "b":2}'::jsonb ? 'b' → t

'["a", "b", "c"]'::jsonb ? 'b' → t

jsonb ?| text[] → boolean

Do any of the strings in the text array exist as top-level keys or array elements?

'{"a":1, "b":2, "c":3}'::jsonb ?| array['b', 'd'] → t

jsonb ?& text[] → boolean

Do all of the strings in the text array exist as top-level keys or array elements?

'["a", "b", "c"]'::jsonb ?& array['a', 'b'] → t

jsonb || jsonb → jsonb

Concatenates two jsonb values. Concatenating two arrays generates an array containing all the elements of each input. Concatenating two objects generates an object containing the union of their keys, taking the second object's value when there are duplicate keys. All other cases are treated by converting a non-array input into a single-element array, and then proceeding as for two arrays. Does not operate recursively: only the top-level array or object structure is merged.

'["a", "b"]'::jsonb || '["a", "d"]'::jsonb → ["a", "b", "a", "d"]

'{"a": "b"}'::jsonb || '{"c": "d"}'::jsonb → {"a": "b", "c": "d"}

'[1, 2]'::jsonb || '3'::jsonb → [1, 2, 3]

'{"a": "b"}'::jsonb || '42'::jsonb → [{"a": "b"}, 42]

To append an array to another array as a single entry, wrap it in an additional layer of array, for example:

'[1, 2]'::jsonb || jsonb_build_array('[3, 4]'::jsonb) → [1, 2, [3, 4]]

Deletes a key (and its value) from a JSON object, or matching string value(s) from a JSON array.

'{"a": "b", "c": "d"}'::jsonb - 'a' → {"c": "d"}

'["a", "b", "c", "b"]'::jsonb - 'b' → ["a", "c"]

jsonb - text[] → jsonb

Deletes all matching keys or array elements from the left operand.

'{"a": "b", "c": "d"}'::jsonb - '{a,c}'::text[] → {}

jsonb - integer → jsonb

Deletes the array element with specified index (negative integers count from the end). Throws an error if JSON value is not an array.

'["a", "b"]'::jsonb - 1 → ["a"]

jsonb #- text[] → jsonb

Deletes the field or array element at the specified path, where path elements can be either field keys or array indexes.

'["a", {"b":1}]'::jsonb #- '{1,b}' → ["a", {}]

jsonb @? jsonpath → boolean

Does JSON path return any item for the specified JSON value? (This is useful only with SQL-standard JSON path expressions, not predicate check expressions, since those always return a value.)

'{"a":[1,2,3,4,5]}'::jsonb @? '$.a[*] ? (@ > 2)' → t

jsonb @@ jsonpath → boolean

Returns the result of a JSON path predicate check for the specified JSON value. (This is useful only with predicate check expressions, not SQL-standard JSON path expressions, since it will return NULL if the path result is not a single boolean value.)

'{"a":[1,2,3,4,5]}'::jsonb @@ '$.a[*] > 2' → t

The jsonpath operators @? and @@ suppress the following errors: missing object field or array element, unexpected JSON item type, datetime and numeric errors. The jsonpath-related functions described below can also be told to suppress these types of errors. This behavior might be helpful when searching JSON document collections of varying structure.

Table 9.49 shows the functions that are available for constructing json and jsonb values. Some functions in this table have a RETURNING clause, which specifies the data type returned. It must be one of json, jsonb, bytea, a character string type (text, char, or varchar), or a type that can be cast to json. By default, the json type is returned.

Table 9.49. JSON Creation Functions

to_json ( anyelement ) → json

to_jsonb ( anyelement ) → jsonb

Converts any SQL value to json or jsonb. Arrays and composites are converted recursively to arrays and objects (multidimensional arrays become arrays of arrays in JSON). Otherwise, if there is a cast from the SQL data type to json, the cast function will be used to perform the conversion;[a] otherwise, a scalar JSON value is produced. For any scalar other than a number, a Boolean, or a null value, the text representation will be used, with escaping as necessary to make it a valid JSON string value.

to_json('Fred said "Hi."'::text) → "Fred said \"Hi.\""

to_jsonb(row(42, 'Fred said "Hi."'::text)) → {"f1": 42, "f2": "Fred said \"Hi.\""}

array_to_json ( anyarray [, boolean ] ) → json

Converts an SQL array to a JSON array. The behavior is the same as to_json except that line feeds will be added between top-level array elements if the optional boolean parameter is true.

array_to_json('{{1,5},{99,100}}'::int[]) → [[1,5],[99,100]]

json_array ( [ { value_expression [ FORMAT JSON ] } [, ...] ] [ { NULL | ABSENT } ON NULL ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ])

json_array ( [ query_expression ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ])

Constructs a JSON array from either a series of value_expression parameters or from the results of query_expression, which must be a SELECT query returning a single column. If ABSENT ON NULL is specified, NULL values are ignored. This is always the case if a query_expression is used.

json_array(1,true,json '{"a":null}') → [1, true, {"a":null}]

json_array(SELECT * FROM (VALUES(1),(2)) t) → [1, 2]

row_to_json ( record [, boolean ] ) → json

Converts an SQL composite value to a JSON object. The behavior is the same as to_json except that line feeds will be added between top-level elements if the optional boolean parameter is true.

row_to_json(row(1,'foo')) → {"f1":1,"f2":"foo"}

json_build_array ( VARIADIC "any" ) → json

jsonb_build_array ( VARIADIC "any" ) → jsonb

Builds a possibly-heterogeneously-typed JSON array out of a variadic argument list. Each argument is converted as per to_json or to_jsonb.

json_build_array(1, 2, 'foo', 4, 5) → [1, 2, "foo", 4, 5]

json_build_object ( VARIADIC "any" ) → json

jsonb_build_object ( VARIADIC "any" ) → jsonb

Builds a JSON object out of a variadic argument list. By convention, the argument list consists of alternating keys and values. Key arguments are coerced to text; value arguments are converted as per to_json or to_jsonb.

json_build_object('foo', 1, 2, row(3,'bar')) → {"foo" : 1, "2" : {"f1":3,"f2":"bar"}}

json_object ( [ { key_expression { VALUE | ':' } value_expression [ FORMAT JSON [ ENCODING UTF8 ] ] }[, ...] ] [ { NULL | ABSENT } ON NULL ] [ { WITH | WITHOUT } UNIQUE [ KEYS ] ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ])

Constructs a JSON object of all the key/value pairs given, or an empty object if none are given. key_expression is a scalar expression defining the JSON key, which is converted to the text type. It cannot be NULL nor can it belong to a type that has a cast to the json type. If WITH UNIQUE KEYS is specified, there must not be any duplicate key_expression. Any pair for which the value_expression evaluates to NULL is omitted from the output if ABSENT ON NULL is specified; if NULL ON NULL is specified or the clause omitted, the key is included with value NULL.

json_object('code' VALUE 'P123', 'title': 'Jaws') → {"code" : "P123", "title" : "Jaws"}

json_object ( text[] ) → json

jsonb_object ( text[] ) → jsonb

Builds a JSON object out of a text array. The array must have either exactly one dimension with an even number of members, in which case they are taken as alternating key/value pairs, or two dimensions such that each inner array has exactly two elements, which are taken as a key/value pair. All values are converted to JSON strings.

json_object('{a, 1, b, "def", c, 3.5}') → {"a" : "1", "b" : "def", "c" : "3.5"}

json_object('{{a, 1}, {b, "def"}, {c, 3.5}}') → {"a" : "1", "b" : "def", "c" : "3.5"}

json_object ( keys text[], values text[] ) → json

jsonb_object ( keys text[], values text[] ) → jsonb

This form of json_object takes keys and values pairwise from separate text arrays. Otherwise it is identical to the one-argument form.

json_object('{a,b}', '{1,2}') → {"a": "1", "b": "2"}

json ( expression [ FORMAT JSON [ ENCODING UTF8 ]] [ { WITH | WITHOUT } UNIQUE [ KEYS ]] ) → json

Converts a given expression specified as text or bytea string (in UTF8 encoding) into a JSON value. If expression is NULL, an SQL null value is returned. If WITH UNIQUE is specified, the expression must not contain any duplicate object keys.

json('{"a":123, "b":[true,"foo"], "a":"bar"}') → {"a":123, "b":[true,"foo"], "a":"bar"}

json_scalar ( expression )

Converts a given SQL scalar value into a JSON scalar value. If the input is NULL, an SQL null is returned. If the input is number or a boolean value, a corresponding JSON number or boolean value is returned. For any other value, a JSON string is returned.

json_scalar(123.45) → 123.45

json_scalar(CURRENT_TIMESTAMP) → "2022-05-10T10:51:04.62128-04:00"

json_serialize ( expression [ FORMAT JSON [ ENCODING UTF8 ] ] [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ] )

Converts an SQL/JSON expression into a character or binary string. The expression can be of any JSON type, any character string type, or bytea in UTF8 encoding. The returned type used in RETURNING can be any character string type or bytea. The default is text.

json_serialize('{ "a" : 1 } ' RETURNING bytea) → \x7b20226122203a2031207d20

[a] For example, the hstore extension has a cast from hstore to json, so that hstore values converted via the JSON creation functions will be represented as JSON objects, not as primitive string values.

Table 9.50 details SQL/JSON facilities for testing JSON.

Table 9.50. SQL/JSON Testing Functions

expression IS [ NOT ] JSON [ { VALUE | SCALAR | ARRAY | OBJECT } ] [ { WITH | WITHOUT } UNIQUE [ KEYS ] ]

This predicate tests whether expression can be parsed as JSON, possibly of a specified type. If SCALAR or ARRAY or OBJECT is specified, the test is whether or not the JSON is of that particular type. If WITH UNIQUE KEYS is specified, then any object in the expression is also tested to see if it has duplicate keys.

Table 9.51 shows the functions that are available for processing json and jsonb values.

Table 9.51. JSON Processing Functions

json_array_elements ( json ) → setof json

jsonb_array_elements ( jsonb ) → setof jsonb

Expands the top-level JSON array into a set of JSON values.

select * from json_array_elements('[1,true, [2,false]]') →

json_array_elements_text ( json ) → setof text

jsonb_array_elements_text ( jsonb ) → setof text

Expands the top-level JSON array into a set of text values.

select * from json_array_elements_text('["foo", "bar"]') →

json_array_length ( json ) → integer

jsonb_array_length ( jsonb ) → integer

Returns the number of elements in the top-level JSON array.

json_array_length('[1,2,3,{"f1":1,"f2":[5,6]},4]') → 5

jsonb_array_length('[]') → 0

json_each ( json ) → setof record ( key text, value json )

jsonb_each ( jsonb ) → setof record ( key text, value jsonb )

Expands the top-level JSON object into a set of key/value pairs.

select * from json_each('{"a":"foo", "b":"bar"}') →

json_each_text ( json ) → setof record ( key text, value text )

jsonb_each_text ( jsonb ) → setof record ( key text, value text )

Expands the top-level JSON object into a set of key/value pairs. The returned values will be of type text.

select * from json_each_text('{"a":"foo", "b":"bar"}') →

json_extract_path ( from_json json, VARIADIC path_elems text[] ) → json

jsonb_extract_path ( from_json jsonb, VARIADIC path_elems text[] ) → jsonb

Extracts JSON sub-object at the specified path. (This is functionally equivalent to the #> operator, but writing the path out as a variadic list can be more convenient in some cases.)

json_extract_path('{"f2":{"f3":1},"f4":{"f5":99,"f6":"foo"}}', 'f4', 'f6') → "foo"

json_extract_path_text ( from_json json, VARIADIC path_elems text[] ) → text

jsonb_extract_path_text ( from_json jsonb, VARIADIC path_elems text[] ) → text

Extracts JSON sub-object at the specified path as text. (This is functionally equivalent to the #>> operator.)

json_extract_path_text('{"f2":{"f3":1},"f4":{"f5":99,"f6":"foo"}}', 'f4', 'f6') → foo

json_object_keys ( json ) → setof text

jsonb_object_keys ( jsonb ) → setof text

Returns the set of keys in the top-level JSON object.

select * from json_object_keys('{"f1":"abc","f2":{"f3":"a", "f4":"b"}}') →

json_populate_record ( base anyelement, from_json json ) → anyelement

jsonb_populate_record ( base anyelement, from_json jsonb ) → anyelement

Expands the top-level JSON object to a row having the composite type of the base argument. The JSON object is scanned for fields whose names match column names of the output row type, and their values are inserted into those columns of the output. (Fields that do not correspond to any output column name are ignored.) In typical use, the value of base is just NULL, which means that any output columns that do not match any object field will be filled with nulls. However, if base isn't NULL then the values it contains will be used for unmatched columns.

To convert a JSON value to the SQL type of an output column, the following rules are applied in sequence:

A JSON null value is converted to an SQL null in all cases.

If the output column is of type json or jsonb, the JSON value is just reproduced exactly.

If the output column is a composite (row) type, and the JSON value is a JSON object, the fields of the object are converted to columns of the output row type by recursive application of these rules.

Likewise, if the output column is an array type and the JSON value is a JSON array, the elements of the JSON array are converted to elements of the output array by recursive application of these rules.

Otherwise, if the JSON value is a string, the contents of the string are fed to the input conversion function for the column's data type.

Otherwise, the ordinary text representation of the JSON value is fed to the input conversion function for the column's data type.

While the example below uses a constant JSON value, typical use would be to reference a json or jsonb column laterally from another table in the query's FROM clause. Writing json_populate_record in the FROM clause is good practice, since all of the extracted columns are available for use without duplicate function calls.

create type subrowtype as (d int, e text); create type myrowtype as (a int, b text[], c subrowtype);

select * from json_populate_record(null::myrowtype, '{"a": 1, "b": ["2", "a b"], "c": {"d": 4, "e": "a b c"}, "x": "foo"}') →

jsonb_populate_record_valid ( base anyelement, from_json json ) → boolean

Function for testing jsonb_populate_record. Returns true if the input jsonb_populate_record would finish without an error for the given input JSON object; that is, it's valid input, false otherwise.

create type jsb_char2 as (a char(2));

select jsonb_populate_record_valid(NULL::jsb_char2, '{"a": "aaa"}'); →

select * from jsonb_populate_record(NULL::jsb_char2, '{"a": "aaa"}') q; →

select jsonb_populate_record_valid(NULL::jsb_char2, '{"a": "aa"}'); →

select * from jsonb_populate_record(NULL::jsb_char2, '{"a": "aa"}') q; →

json_populate_recordset ( base anyelement, from_json json ) → setof anyelement

jsonb_populate_recordset ( base anyelement, from_json jsonb ) → setof anyelement

Expands the top-level JSON array of objects to a set of rows having the composite type of the base argument. Each element of the JSON array is processed as described above for json[b]_populate_record.

create type twoints as (a int, b int);

select * from json_populate_recordset(null::twoints, '[{"a":1,"b":2}, {"a":3,"b":4}]') →

json_to_record ( json ) → record

jsonb_to_record ( jsonb ) → record

Expands the top-level JSON object to a row having the composite type defined by an AS clause. (As with all functions returning record, the calling query must explicitly define the structure of the record with an AS clause.) The output record is filled from fields of the JSON object, in the same way as described above for json[b]_populate_record. Since there is no input record value, unmatched columns are always filled with nulls.

create type myrowtype as (a int, b text);

select * from json_to_record('{"a":1,"b":[1,2,3],"c":[1,2,3],"e":"bar","r": {"a": 123, "b": "a b c"}}') as x(a int, b text, c int[], d text, r myrowtype) →

json_to_recordset ( json ) → setof record

jsonb_to_recordset ( jsonb ) → setof record

Expands the top-level JSON array of objects to a set of rows having the composite type defined by an AS clause. (As with all functions returning record, the calling query must explicitly define the structure of the record with an AS clause.) Each element of the JSON array is processed as described above for json[b]_populate_record.

select * from json_to_recordset('[{"a":1,"b":"foo"}, {"a":"2","c":"bar"}]') as x(a int, b text) →

jsonb_set ( target jsonb, path text[], new_value jsonb [, create_if_missing boolean ] ) → jsonb

Returns target with the item designated by path replaced by new_value, or with new_value added if create_if_missing is true (which is the default) and the item designated by path does not exist. All earlier steps in the path must exist, or the target is returned unchanged. As with the path oriented operators, negative integers that appear in the path count from the end of JSON arrays. If the last path step is an array index that is out of range, and create_if_missing is true, the new value is added at the beginning of the array if the index is negative, or at the end of the array if it is positive.

jsonb_set('[{"f1":1,"f2":null},2,null,3]', '{0,f1}', '[2,3,4]', false) → [{"f1": [2, 3, 4], "f2": null}, 2, null, 3]

jsonb_set('[{"f1":1,"f2":null},2]', '{0,f3}', '[2,3,4]') → [{"f1": 1, "f2": null, "f3": [2, 3, 4]}, 2]

jsonb_set_lax ( target jsonb, path text[], new_value jsonb [, create_if_missing boolean [, null_value_treatment text ]] ) → jsonb

If new_value is not NULL, behaves identically to jsonb_set. Otherwise behaves according to the value of null_value_treatment which must be one of 'raise_exception', 'use_json_null', 'delete_key', or 'return_target'. The default is 'use_json_null'.

jsonb_set_lax('[{"f1":1,"f2":null},2,null,3]', '{0,f1}', null) → [{"f1": null, "f2": null}, 2, null, 3]

jsonb_set_lax('[{"f1":99,"f2":null},2]', '{0,f3}', null, true, 'return_target') → [{"f1": 99, "f2": null}, 2]

jsonb_insert ( target jsonb, path text[], new_value jsonb [, insert_after boolean ] ) → jsonb

Returns target with new_value inserted. If the item designated by the path is an array element, new_value will be inserted before that item if insert_after is false (which is the default), or after it if insert_after is true. If the item designated by the path is an object field, new_value will be inserted only if the object does not already contain that key. All earlier steps in the path must exist, or the target is returned unchanged. As with the path oriented operators, negative integers that appear in the path count from the end of JSON arrays. If the last path step is an array index that is out of range, the new value is added at the beginning of the array if the index is negative, or at the end of the array if it is positive.

jsonb_insert('{"a": [0,1,2]}', '{a, 1}', '"new_value"') → {"a": [0, "new_value", 1, 2]}

jsonb_insert('{"a": [0,1,2]}', '{a, 1}', '"new_value"', true) → {"a": [0, 1, "new_value", 2]}

json_strip_nulls ( target json [,strip_in_arrays boolean ] ) → json

jsonb_strip_nulls ( target jsonb [,strip_in_arrays boolean ] ) → jsonb

Deletes all object fields that have null values from the given JSON value, recursively. If strip_in_arrays is true (the default is false), null array elements are also stripped. Otherwise they are not stripped. Bare null values are never stripped.

json_strip_nulls('[{"f1":1, "f2":null}, 2, null, 3]') → [{"f1":1},2,null,3]

jsonb_strip_nulls('[1,2,null,3,4]', true) → [1,2,3,4]

jsonb_path_exists ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → boolean

Checks whether the JSON path returns any item for the specified JSON value. (This is useful only with SQL-standard JSON path expressions, not predicate check expressions, since those always return a value.) If the vars argument is specified, it must be a JSON object, and its fields provide named values to be substituted into the jsonpath expression. If the silent argument is specified and is true, the function suppresses the same errors as the @? and @@ operators do.

jsonb_path_exists('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2, "max":4}') → t

jsonb_path_match ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → boolean

Returns the SQL boolean result of a JSON path predicate check for the specified JSON value. (This is useful only with predicate check expressions, not SQL-standard JSON path expressions, since it will either fail or return NULL if the path result is not a single boolean value.) The optional vars and silent arguments act the same as for jsonb_path_exists.

jsonb_path_match('{"a":[1,2,3,4,5]}', 'exists($.a[*] ? (@ >= $min && @ <= $max))', '{"min":2, "max":4}') → t

jsonb_path_query ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → setof jsonb

Returns all JSON items returned by the JSON path for the specified JSON value. For SQL-standard JSON path expressions it returns the JSON values selected from target. For predicate check expressions it returns the result of the predicate check: true, false, or null. The optional vars and silent arguments act the same as for jsonb_path_exists.

select * from jsonb_path_query('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2, "max":4}') →

jsonb_path_query_array ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → jsonb

Returns all JSON items returned by the JSON path for the specified JSON value, as a JSON array. The parameters are the same as for jsonb_path_query.

jsonb_path_query_array('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2, "max":4}') → [2, 3, 4]

jsonb_path_query_first ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → jsonb

Returns the first JSON item returned by the JSON path for the specified JSON value, or NULL if there are no results. The parameters are the same as for jsonb_path_query.

jsonb_path_query_first('{"a":[1,2,3,4,5]}', '$.a[*] ? (@ >= $min && @ <= $max)', '{"min":2, "max":4}') → 2

jsonb_path_exists_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → boolean

jsonb_path_match_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → boolean

jsonb_path_query_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → setof jsonb

jsonb_path_query_array_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → jsonb

jsonb_path_query_first_tz ( target jsonb, path jsonpath [, vars jsonb [, silent boolean ]] ) → jsonb

These functions act like their counterparts described above without the _tz suffix, except that these functions support comparisons of date/time values that require timezone-aware conversions. The example below requires interpretation of the date-only value 2015-08-02 as a timestamp with time zone, so the result depends on the current TimeZone setting. Due to this dependency, these functions are marked as stable, which means these functions cannot be used in indexes. Their counterparts are immutable, and so can be used in indexes; but they will throw errors if asked to make such comparisons.

jsonb_path_exists_tz('["2015-08-01 12:00:00-05"]', '$[*] ? (@.datetime() < "2015-08-02".datetime())') → t

jsonb_pretty ( jsonb ) → text

Converts the given JSON value to pretty-printed, indented text.

jsonb_pretty('[{"f1":1,"f2":null}, 2]') →

json_typeof ( json ) → text

jsonb_typeof ( jsonb ) → text

Returns the type of the top-level JSON value as a text string. Possible types are object, array, string, number, boolean, and null. (The null result should not be confused with an SQL NULL; see the examples.)

json_typeof('-123.4') → number

json_typeof('null'::json) → null

json_typeof(NULL::json) IS NULL → t

SQL/JSON path expressions specify item(s) to be retrieved from a JSON value, similarly to XPath expressions used for access to XML content. In PostgreSQL, path expressions are implemented as the jsonpath data type and can use any elements described in Section 8.14.7.

JSON query functions and operators pass the provided path expression to the path engine for evaluation. If the expression matches the queried JSON data, the corresponding JSON item, or set of items, is returned. If there is no match, the result will be NULL, false, or an error, depending on the function. Path expressions are written in the SQL/JSON path language and can include arithmetic expressions and functions.

A path expression consists of a sequence of elements allowed by the jsonpath data type. The path expression is normally evaluated from left to right, but you can use parentheses to change the order of operations. If the evaluation is successful, a sequence of JSON items is produced, and the evaluation result is returned to the JSON query function that completes the specified computation.

To refer to the JSON value being queried (the context item), use the $ variable in the path expression. The first element of a path must always be $. It can be followed by one or more accessor operators, which go down the JSON structure level by level to retrieve sub-items of the context item. Each accessor operator acts on the result(s) of the previous evaluation step, producing zero, one, or more output items from each input item.

For example, suppose you have some JSON data from a GPS tracker that you would like to parse, such as:

(The above example can be copied-and-pasted into psql to set things up for the following examples. Then psql will expand :'json' into a suitably-quoted string constant containing the JSON value.)

To retrieve the available track segments, you need to use the .key accessor operator to descend through surrounding JSON objects, for example:

To retrieve the contents of an array, you typically use the [*] operator. The following example will return the location coordinates for all the available track segments:

Here we started with the whole JSON input value ($), then the .track accessor selected the JSON object associated with the "track" object key, then the .segments accessor selected the JSON array associated with the "segments" key within that object, then the [*] accessor selected each element of that array (producing a series of items), then the .location accessor selected the JSON array associated with the "location" key within each of those objects. In this example, each of those objects had a "location" key; but if any of them did not, the .location accessor would have simply produced no output for that input item.

To return the coordinates of the first segment only, you can specify the corresponding subscript in the [] accessor operator. Recall that JSON array indexes are 0-relative:

The result of each path evaluation step can be processed by one or more of the jsonpath operators and methods listed in Section 9.16.2.3. Each method name must be preceded by a dot. For example, you can get the size of an array:

More examples of using jsonpath operators and methods within path expressions appear below in Section 9.16.2.3.

A path can also contain filter expressions that work similarly to the WHERE clause in SQL. A filter expression begins with a question mark and provides a condition in parentheses:

Filter expressions must be written just after the path evaluation step to which they should apply. The result of that step is filtered to include only those items that satisfy the provided condition. SQL/JSON defines three-valued logic, so the condition can produce true, false, or unknown. The unknown value plays the same role as SQL NULL and can be tested for with the is unknown predicate. Further path evaluation steps use only those items for which the filter expression returned true.

The functions and operators that can be used in filter expressions are listed in Table 9.53. Within a filter expression, the @ variable denotes the value being considered (i.e., one result of the preceding path step). You can write accessor operators after @ to retrieve component items.

For example, suppose you would like to retrieve all heart rate values higher than 130. You can achieve this as follows:

To get the start times of segments with such values, you have to filter out irrelevant segments before selecting the start times, so the filter expression is applied to the previous step, and the path used in the condition is different:

You can use several filter expressions in sequence, if required. The following example selects start times of all segments that contain locations with relevant coordinates and high heart rate values:

Using filter expressions at different nesting levels is also allowed. The following example first filters all segments by location, and then returns high heart rate values for these segments, if available:

You can also nest filter expressions within each other. This example returns the size of the track if it contains any segments with high heart rate values, or an empty sequence otherwise:

PostgreSQL's implementation of the SQL/JSON path language has the following deviations from the SQL/JSON standard.

As an extension to the SQL standard, a PostgreSQL path expression can be a Boolean predicate, whereas the SQL standard allows predicates only within filters. While SQL-standard path expressions return the relevant element(s) of the queried JSON value, predicate check expressions return the single three-valued jsonb result of the predicate: true, false, or null. For example, we could write this SQL-standard filter expression:

The similar predicate check expression simply returns true, indicating that a match exists:

Predicate check expressions are required in the @@ operator (and the jsonb_path_match function), and should not be used with the @? operator (or the jsonb_path_exists function).

There are minor differences in the interpretation of regular expression patterns used in like_regex filters, as described in Section 9.16.2.4.

When you query JSON data, the path expression may not match the actual JSON data structure. An attempt to access a non-existent member of an object or element of an array is defined as a structural error. SQL/JSON path expressions have two modes of handling structural errors:

lax (default) — the path engine implicitly adapts the queried data to the specified path. Any structural errors that cannot be fixed as described below are suppressed, producing no match.

strict — if a structural error occurs, an error is raised.

Lax mode facilitates matching of a JSON document and path expression when the JSON data does not conform to the expected schema. If an operand does not match the requirements of a particular operation, it can be automatically wrapped as an SQL/JSON array, or unwrapped by converting its elements into an SQL/JSON sequence before performing the operation. Also, comparison operators automatically unwrap their operands in lax mode, so you can compare SQL/JSON arrays out-of-the-box. An array of size 1 is considered equal to its sole element. Automatic unwrapping is not performed when:

The path expression contains type() or size() methods that return the type and the number of elements in the array, respectively.

The queried JSON data contain nested arrays. In this case, only the outermost array is unwrapped, while all the inner arrays remain unchanged. Thus, implicit unwrapping can only go one level down within each path evaluation step.

For example, when querying the GPS data listed above, you can abstract from the fact that it stores an array of segments when using lax mode:

In strict mode, the specified path must exactly match the structure of the queried JSON document, so using this path expression will cause an error:

To get the same result as in lax mode, you have to explicitly unwrap the segments array:

The unwrapping behavior of lax mode can lead to surprising results. For instance, the following query using the .** accessor selects every HR value twice:

This happens because the .** accessor selects both the segments array and each of its elements, while the .HR accessor automatically unwraps arrays when using lax mode. To avoid surprising results, we recommend using the .** accessor only in strict mode. The following query selects each HR value just once:

The unwrapping of arrays can also lead to unexpected results. Consider this example, which selects all the location arrays:

As expected it returns the full arrays. But applying a filter expression causes the arrays to be unwrapped to evaluate each item, returning only the items that match the expression:

This despite the fact that the full arrays are selected by the path expression. Use strict mode to restore selecting the arrays:

Table 9.52 shows the operators and methods available in jsonpath. Note that while the unary operators and methods can be applied to multiple values resulting from a preceding path step, the binary operators (addition etc.) can only be applied to single values. In lax mode, methods applied to an array will be executed for each value in the array. The exceptions are .type() and .size(), which apply to the array itself.

Table 9.52. jsonpath Operators and Methods

number + number → number

jsonb_path_query('[2]', '$[0] + 3') → 5

Unary plus (no operation); unlike addition, this can iterate over multiple values

jsonb_path_query_array('{"x": [2,3,4]}', '+ $.x') → [2, 3, 4]

number - number → number

jsonb_path_query('[2]', '7 - $[0]') → 5

Negation; unlike subtraction, this can iterate over multiple values

jsonb_path_query_array('{"x": [2,3,4]}', '- $.x') → [-2, -3, -4]

number * number → number

jsonb_path_query('[4]', '2 * $[0]') → 8

number / number → number

jsonb_path_query('[8.5]', '$[0] / 2') → 4.2500000000000000

number % number → number

jsonb_path_query('[32]', '$[0] % 10') → 2

value . type() → string

Type of the JSON item (see json_typeof)

jsonb_path_query_array('[1, "2", {}]', '$[*].type()') → ["number", "string", "object"]

value . size() → number

Size of the JSON item (number of array elements, or 1 if not an array)

jsonb_path_query('{"m": [11, 15]}', '$.m.size()') → 2

value . boolean() → boolean

Boolean value converted from a JSON boolean, number, or string

jsonb_path_query_array('[1, "yes", false]', '$[*].boolean()') → [true, true, false]

value . string() → string

String value converted from a JSON boolean, number, string, or datetime

jsonb_path_query_array('[1.23, "xyz", false]', '$[*].string()') → ["1.23", "xyz", "false"]

jsonb_path_query('"2023-08-15 12:34:56"', '$.timestamp().string()') → "2023-08-15T12:34:56"

value . double() → number

Approximate floating-point number converted from a JSON number or string

jsonb_path_query('{"len": "1.9"}', '$.len.double() * 2') → 3.8

number . ceiling() → number

Nearest integer greater than or equal to the given number

jsonb_path_query('{"h": 1.3}', '$.h.ceiling()') → 2

number . floor() → number

Nearest integer less than or equal to the given number

jsonb_path_query('{"h": 1.7}', '$.h.floor()') → 1

number . abs() → number

Absolute value of the given number

jsonb_path_query('{"z": -0.3}', '$.z.abs()') → 0.3

value . bigint() → bigint

Big integer value converted from a JSON number or string

jsonb_path_query('{"len": "9876543219"}', '$.len.bigint()') → 9876543219

value . decimal( [ precision [ , scale ] ] ) → decimal

Rounded decimal value converted from a JSON number or string (precision and scale must be integer values)

jsonb_path_query('1234.5678', '$.decimal(6, 2)') → 1234.57

value . integer() → integer

Integer value converted from a JSON number or string

jsonb_path_query('{"len": "12345"}', '$.len.integer()') → 12345

value . number() → numeric

Numeric value converted from a JSON number or string

jsonb_path_query('{"len": "123.45"}', '$.len.number()') → 123.45

string . datetime() → datetime_type (see note)

Date/time value converted from a string

jsonb_path_query('["2015-8-1", "2015-08-12"]', '$[*] ? (@.datetime() < "2015-08-2".datetime())') → "2015-8-1"

string . datetime(template) → datetime_type (see note)

Date/time value converted from a string using the specified to_timestamp template

jsonb_path_query_array('["12:30", "18:40"]', '$[*].datetime("HH24:MI")') → ["12:30:00", "18:40:00"]

string . date() → date

Date value converted from a string

jsonb_path_query('"2023-08-15"', '$.date()') → "2023-08-15"

string . time() → time without time zone

Time without time zone value converted from a string

jsonb_path_query('"12:34:56"', '$.time()') → "12:34:56"

string . time(precision) → time without time zone

Time without time zone value converted from a string, with fractional seconds adjusted to the given precision

jsonb_path_query('"12:34:56.789"', '$.time(2)') → "12:34:56.79"

string . time_tz() → time with time zone

Time with time zone value converted from a string

jsonb_path_query('"12:34:56 +05:30"', '$.time_tz()') → "12:34:56+05:30"

string . time_tz(precision) → time with time zone

Time with time zone value converted from a string, with fractional seconds adjusted to the given precision

jsonb_path_query('"12:34:56.789 +05:30"', '$.time_tz(2)') → "12:34:56.79+05:30"

string . timestamp() → timestamp without time zone

Timestamp without time zone value converted from a string

jsonb_path_query('"2023-08-15 12:34:56"', '$.timestamp()') → "2023-08-15T12:34:56"

string . timestamp(precision) → timestamp without time zone

Timestamp without time zone value converted from a string, with fractional seconds adjusted to the given precision

jsonb_path_query('"2023-08-15 12:34:56.789"', '$.timestamp(2)') → "2023-08-15T12:34:56.79"

string . timestamp_tz() → timestamp with time zone

Timestamp with time zone value converted from a string

jsonb_path_query('"2023-08-15 12:34:56 +05:30"', '$.timestamp_tz()') → "2023-08-15T12:34:56+05:30"

string . timestamp_tz(precision) → timestamp with time zone

Timestamp with time zone value converted from a string, with fractional seconds adjusted to the given precision

jsonb_path_query('"2023-08-15 12:34:56.789 +05:30"', '$.timestamp_tz(2)') → "2023-08-15T12:34:56.79+05:30"

object . keyvalue() → array

The object's key-value pairs, represented as an array of objects containing three fields: "key", "value", and "id"; "id" is a unique identifier of the object the key-value pair belongs to

jsonb_path_query_array('{"x": "20", "y": 32}', '$.keyvalue()') → [{"id": 0, "key": "x", "value": "20"}, {"id": 0, "key": "y", "value": 32}]

The result type of the datetime() and datetime(template) methods can be date, timetz, time, timestamptz, or timestamp. Both methods determine their result type dynamically.

The datetime() method sequentially tries to match its input string to the ISO formats for date, timetz, time, timestamptz, and timestamp. It stops on the first matching format and emits the corresponding data type.

The datetime(template) method determines the result type according to the fields used in the provided template string.

The datetime() and datetime(template) methods use the same parsing rules as the to_timestamp SQL function does (see Section 9.8), with three exceptions. First, these methods don't allow unmatched template patterns. Second, only the following separators are allowed in the template string: minus sign, period, solidus (slash), comma, apostrophe, semicolon, colon and space. Third, separators in the template string must exactly match the input string.

If different date/time types need to be compared, an implicit cast is applied. A date value can be cast to timestamp or timestamptz, timestamp can be cast to timestamptz, and time to timetz. However, all but the first of these conversions depend on the current TimeZone setting, and thus can only be performed within timezone-aware jsonpath functions. Similarly, other date/time-related methods that convert strings to date/time types also do this casting, which may involve the current TimeZone setting. Therefore, these conversions can also only be performed within timezone-aware jsonpath functions.

Table 9.53 shows the available filter expression elements.

Table 9.53. jsonpath Filter Expression Elements

value == value → boolean

Equality comparison (this, and the other comparison operators, work on all JSON scalar values)

jsonb_path_query_array('[1, "a", 1, 3]', '$[*] ? (@ == 1)') → [1, 1]

jsonb_path_query_array('[1, "a", 1, 3]', '$[*] ? (@ == "a")') → ["a"]

value != value → boolean

value <> value → boolean

Non-equality comparison

jsonb_path_query_array('[1, 2, 1, 3]', '$[*] ? (@ != 1)') → [2, 3]

jsonb_path_query_array('["a", "b", "c"]', '$[*] ? (@ <> "b")') → ["a", "c"]

value < value → boolean

jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ < 2)') → [1]

value <= value → boolean

Less-than-or-equal-to comparison

jsonb_path_query_array('["a", "b", "c"]', '$[*] ? (@ <= "b")') → ["a", "b"]

value > value → boolean

Greater-than comparison

jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ > 2)') → [3]

value >= value → boolean

Greater-than-or-equal-to comparison

jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ >= 2)') → [2, 3]

jsonb_path_query('[{"name": "John", "parent": false}, {"name": "Chris", "parent": true}]', '$[*] ? (@.parent == true)') → {"name": "Chris", "parent": true}

jsonb_path_query('[{"name": "John", "parent": false}, {"name": "Chris", "parent": true}]', '$[*] ? (@.parent == false)') → {"name": "John", "parent": false}

JSON constant null (note that, unlike in SQL, comparison to null works normally)

jsonb_path_query('[{"name": "Mary", "job": null}, {"name": "Michael", "job": "driver"}]', '$[*] ? (@.job == null) .name') → "Mary"

boolean && boolean → boolean

jsonb_path_query('[1, 3, 7]', '$[*] ? (@ > 1 && @ < 5)') → 3

boolean || boolean → boolean

jsonb_path_query('[1, 3, 7]', '$[*] ? (@ < 1 || @ > 5)') → 7

jsonb_path_query('[1, 3, 7]', '$[*] ? (!(@ < 5))') → 7

boolean is unknown → boolean

Tests whether a Boolean condition is unknown.

jsonb_path_query('[-1, 2, 7, "foo"]', '$[*] ? ((@ > 0) is unknown)') → "foo"

string like_regex string [ flag string ] → boolean

Tests whether the first operand matches the regular expression given by the second operand, optionally with modifications described by a string of flag characters (see Section 9.16.2.4).

jsonb_path_query_array('["abc", "abd", "aBdC", "abdacb", "babc"]', '$[*] ? (@ like_regex "^ab.*c")') → ["abc", "abdacb"]

jsonb_path_query_array('["abc", "abd", "aBdC", "abdacb", "babc"]', '$[*] ? (@ like_regex "^ab.*c" flag "i")') → ["abc", "aBdC", "abdacb"]

string starts with string → boolean

Tests whether the second operand is an initial substring of the first operand.

jsonb_path_query('["John Smith", "Mary Stone", "Bob Johnson"]', '$[*] ? (@ starts with "John")') → "John Smith"

exists ( path_expression ) → boolean

Tests whether a path expression matches at least one SQL/JSON item. Returns unknown if the path expression would result in an error; the second example uses this to avoid a no-such-key error in strict mode.

jsonb_path_query('{"x": [1, 2], "y": [2, 4]}', 'strict $.* ? (exists (@ ? (@[*] > 2)))') → [2, 4]

jsonb_path_query_array('{"value": 41}', 'strict $ ? (exists (@.name)) .name') → []

SQL/JSON path expressions allow matching text to a regular expression with the like_regex filter. For example, the following SQL/JSON path query would case-insensitively match all strings in an array that start with an English vowel:

The optional flag string may include one or more of the characters i for case-insensitive match, m to allow ^ and $ to match at newlines, s to allow . to match a newline, and q to quote the whole pattern (reducing the behavior to a simple substring match).

The SQL/JSON standard borrows its definition for regular expressions from the LIKE_REGEX operator, which in turn uses the XQuery standard. PostgreSQL does not currently support the LIKE_REGEX operator. Therefore, the like_regex filter is implemented using the POSIX regular expression engine described in Section 9.7.3. This leads to various minor discrepancies from standard SQL/JSON behavior, which are cataloged in Section 9.7.3.8. Note, however, that the flag-letter incompatibilities described there do not apply to SQL/JSON, as it translates the XQuery flag letters to match what the POSIX engine expects.

Keep in mind that the pattern argument of like_regex is a JSON path string literal, written according to the rules given in Section 8.14.7. This means in particular that any backslashes you want to use in the regular expression must be doubled. For example, to match string values of the root document that contain only digits:

SQL/JSON functions JSON_EXISTS(), JSON_QUERY(), and JSON_VALUE() described in Table 9.54 can be used to query JSON documents. Each of these functions apply a path_expression (an SQL/JSON path query) to a context_item (the document). See Section 9.16.2 for more details on what the path_expression can contain. The path_expression can also reference variables, whose values are specified with their respective names in the PASSING clause that is supported by each function. context_item can be a jsonb value or a character string that can be successfully cast to jsonb.

Table 9.54. SQL/JSON Query Functions

Returns true if the SQL/JSON path_expression applied to the context_item yields any items, false otherwise.

The ON ERROR clause specifies the behavior if an error occurs during path_expression evaluation. Specifying ERROR will cause an error to be thrown with the appropriate message. Other options include returning boolean values FALSE or TRUE or the value UNKNOWN which is actually an SQL NULL. The default when no ON ERROR clause is specified is to return the boolean value FALSE.

JSON_EXISTS(jsonb '{"key1": [1,2,3]}', 'strict $.key1[*] ? (@ > $x)' PASSING 2 AS x) → t

JSON_EXISTS(jsonb '{"a": [1,2,3]}', 'lax $.a[5]' ERROR ON ERROR) → f

JSON_EXISTS(jsonb '{"a": [1,2,3]}', 'strict $.a[5]' ERROR ON ERROR) →

Returns the result of applying the SQL/JSON path_expression to the context_item.

By default, the result is returned as a value of type jsonb, though the RETURNING clause can be used to return as some other type to which it can be successfully coerced.

If the path expression may return multiple values, it might be necessary to wrap those values using the WITH WRAPPER clause to make it a valid JSON string, because the default behavior is to not wrap them, as if WITHOUT WRAPPER were specified. The WITH WRAPPER clause is by default taken to mean WITH UNCONDITIONAL WRAPPER, which means that even a single result value will be wrapped. To apply the wrapper only when multiple values are present, specify WITH CONDITIONAL WRAPPER. Getting multiple values in result will be treated as an error if WITHOUT WRAPPER is specified.

If the result is a scalar string, by default, the returned value will be surrounded by quotes, making it a valid JSON value. It can be made explicit by specifying KEEP QUOTES. Conversely, quotes can be omitted by specifying OMIT QUOTES. To ensure that the result is a valid JSON value, OMIT QUOTES cannot be specified when WITH WRAPPER is also specified.

The ON EMPTY clause specifies the behavior if evaluating path_expression yields an empty set. The ON ERROR clause specifies the behavior if an error occurs when evaluating path_expression, when coercing the result value to the RETURNING type, or when evaluating the ON EMPTY expression if the path_expression evaluation returns an empty set.

For both ON EMPTY and ON ERROR, specifying ERROR will cause an error to be thrown with the appropriate message. Other options include returning an SQL NULL, an empty array (EMPTY [ARRAY]), an empty object (EMPTY OBJECT), or a user-specified expression (DEFAULT expression) that can be coerced to jsonb or the type specified in RETURNING. The default when ON EMPTY or ON ERROR is not specified is to return an SQL NULL value.

JSON_QUERY(jsonb '[1,[2,3],null]', 'lax $[*][$off]' PASSING 1 AS off WITH CONDITIONAL WRAPPER) → 3

JSON_QUERY(jsonb '{"a": "[1, 2]"}', 'lax $.a' OMIT QUOTES) → [1, 2]

JSON_QUERY(jsonb '{"a": "[1, 2]"}', 'lax $.a' RETURNING int[] OMIT QUOTES ERROR ON ERROR) →

Returns the result of applying the SQL/JSON path_expression to the context_item.

Only use JSON_VALUE() if the extracted value is expected to be a single SQL/JSON scalar item; getting multiple values will be treated as an error. If you expect that extracted value might be an object or an array, use the JSON_QUERY function instead.

By default, the result, which must be a single scalar value, is returned as a value of type text, though the RETURNING clause can be used to return as some other type to which it can be successfully coerced.

The ON ERROR and ON EMPTY clauses have similar semantics as mentioned in the description of JSON_QUERY, except the set of values returned in lieu of throwing an error is different.

Note that scalar strings returned by JSON_VALUE always have their quotes removed, equivalent to specifying OMIT QUOTES in JSON_QUERY.

JSON_VALUE(jsonb '"123.45"', '$' RETURNING float) → 123.45

JSON_VALUE(jsonb '"03:04 2015-02-01"', '$.datetime("HH24:MI YYYY-MM-DD")' RETURNING date) → 2015-02-01

JSON_VALUE(jsonb '[1,2]', 'strict $[$off]' PASSING 1 as off) → 2

JSON_VALUE(jsonb '[1,2]', 'strict $[*]' DEFAULT 9 ON ERROR) → 9

The context_item expression is converted to jsonb by an implicit cast if the expression is not already of type jsonb. Note, however, that any parsing errors that occur during that conversion are thrown unconditionally, that is, are not handled according to the (specified or implicit) ON ERROR clause.

JSON_VALUE() returns an SQL NULL if path_expression returns a JSON null, whereas JSON_QUERY() returns the JSON null as is.

JSON_TABLE is an SQL/JSON function which queries JSON data and presents the results as a relational view, which can be accessed as a regular SQL table. You can use JSON_TABLE inside the FROM clause of a SELECT, UPDATE, or DELETE and as data source in a MERGE statement.

Taking JSON data as input, JSON_TABLE uses a JSON path expression to extract a part of the provided data to use as a row pattern for the constructed view. Each SQL/JSON value given by the row pattern serves as source for a separate row in the constructed view.

To split the row pattern into columns, JSON_TABLE provides the COLUMNS clause that defines the schema of the created view. For each column, a separate JSON path expression can be specified to be evaluated against the row pattern to get an SQL/JSON value that will become the value for the specified column in a given output row.

JSON data stored at a nested level of the row pattern can be extracted using the NESTED PATH clause. Each NESTED PATH clause can be used to generate one or more columns using the data from a nested level of the row pattern. Those columns can be specified using a COLUMNS clause that looks similar to the top-level COLUMNS clause. Rows constructed from NESTED COLUMNS are called child rows and are joined against the row constructed from the columns specified in the parent COLUMNS clause to get the row in the final view. Child columns themselves may contain a NESTED PATH specification thus allowing to extract data located at arbitrary nesting levels. Columns produced by multiple NESTED PATHs at the same level are considered to be siblings of each other and their rows after joining with the parent row are combined using UNION.

The rows produced by JSON_TABLE are laterally joined to the row that generated them, so you do not have to explicitly join the constructed view with the original table holding JSON data.

Each syntax element is described below in more detail.

The context_item specifies the input document to query, the path_expression is an SQL/JSON path expression defining the query, and json_path_name is an optional name for the path_expression. The optional PASSING clause provides data values for the variables mentioned in the path_expression. The result of the input data evaluation using the aforementioned elements is called the row pattern, which is used as the source for row values in the constructed view.

The COLUMNS clause defining the schema of the constructed view. In this clause, you can specify each column to be filled with an SQL/JSON value obtained by applying a JSON path expression against the row pattern. json_table_column has the following variants:

Adds an ordinality column that provides sequential row numbering starting from 1. Each NESTED PATH (see below) gets its own counter for any nested ordinality columns.

Inserts an SQL/JSON value obtained by applying path_expression against the row pattern into the view's output row after coercing it to specified type.

Specifying FORMAT JSON makes it explicit that you expect the value to be a valid json object. It only makes sense to specify FORMAT JSON if type is one of bpchar, bytea, character varying, name, json, jsonb, text, or a domain over these types.

Optionally, you can specify WRAPPER and QUOTES clauses to format the output. Note that specifying OMIT QUOTES overrides FORMAT JSON if also specified, because unquoted literals do not constitute valid json values.

Optionally, you can use ON EMPTY and ON ERROR clauses to specify whether to throw the error or return the specified value when the result of JSON path evaluation is empty and when an error occurs during JSON path evaluation or when coercing the SQL/JSON value to the specified type, respectively. The default for both is to return a NULL value.

This clause is internally turned into and has the same semantics as JSON_VALUE or JSON_QUERY. The latter if the specified type is not a scalar type or if either of FORMAT JSON, WRAPPER, or QUOTES clause is present.

Inserts a boolean value obtained by applying path_expression against the row pattern into the view's output row after coercing it to specified type.

The value corresponds to whether applying the PATH expression to the row pattern yields any values.

The specified type should have a cast from the boolean type.

Optionally, you can use ON ERROR to specify whether to throw the error or return the specified value when an error occurs during JSON path evaluation or when coercing SQL/JSON value to the specified type. The default is to return a boolean value FALSE.

This clause is internally turned into and has the same semantics as JSON_EXISTS.

Extracts SQL/JSON values from nested levels of the row pattern, generates one or more columns as defined by the COLUMNS subclause, and inserts the extracted SQL/JSON values into those columns. The json_table_column expression in the COLUMNS subclause uses the same syntax as in the parent COLUMNS clause.

The NESTED PATH syntax is recursive, so you can go down multiple nested levels by specifying several NESTED PATH subclauses within each other. It allows to unnest the hierarchy of JSON objects and arrays in a single function invocation rather than chaining several JSON_TABLE expressions in an SQL statement.

In each variant of json_table_column described above, if the PATH clause is omitted, path expression $.name is used, where name is the provided column name.

The optional json_path_name serves as an identifier of the provided path_expression. The name must be unique and distinct from the column names.

The optional ON ERROR can be used to specify how to handle errors when evaluating the top-level path_expression. Use ERROR if you want the errors to be thrown and EMPTY to return an empty table, that is, a table containing 0 rows. Note that this clause does not affect the errors that occur when evaluating columns, for which the behavior depends on whether the ON ERROR clause is specified against a given column.

In the examples that follow, the following table containing JSON data will be used:

The following query shows how to use JSON_TABLE to turn the JSON objects in the my_films table to a view containing columns for the keys kind, title, and director contained in the original JSON along with an ordinality column:

The following is a modified version of the above query to show the usage of PASSING arguments in the filter specified in the top-level JSON path expression and the various options for the individual columns:

The following is a modified version of the above query to show the usage of NESTED PATH for populating title and director columns, illustrating how they are joined to the parent columns id and kind:

The following is the same query but without the filter in the root path:

The following shows another query using a different JSON object as input. It shows the UNION "sibling join" between NESTED paths $.movies[*] and $.books[*] and also the usage of FOR ORDINALITY column at NESTED levels (columns movie_id, book_id, and author_id):

**Examples:**

Example 1 (unknown):
```unknown
json_object_agg
```

Example 2 (unknown):
```unknown
jsonb_object_agg
```

Example 3 (json):
```json
'[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json -> 2
```

Example 4 (json):
```json
{"c":"baz"}
```

---

## 8.10. Bit String Types #

**URL:** https://www.postgresql.org/docs/current/datatype-bit.html

**Contents:**
- 8.10. Bit String Types #
  - Note

Bit strings are strings of 1's and 0's. They can be used to store or visualize bit masks. There are two SQL bit types: bit(n) and bit varying(n), where n is a positive integer.

bit type data must match the length n exactly; it is an error to attempt to store shorter or longer bit strings. bit varying data is of variable length up to the maximum length n; longer strings will be rejected. Writing bit without a length is equivalent to bit(1), while bit varying without a length specification means unlimited length.

If one explicitly casts a bit-string value to bit(n), it will be truncated or zero-padded on the right to be exactly n bits, without raising an error. Similarly, if one explicitly casts a bit-string value to bit varying(n), it will be truncated on the right if it is more than n bits.

Refer to Section 4.1.2.5 for information about the syntax of bit string constants. Bit-logical operators and string manipulation functions are available; see Section 9.6.

Example 8.3. Using the Bit String Types

A bit string value requires 1 byte for each group of 8 bits, plus 5 or 8 bytes overhead depending on the length of the string (but long values may be compressed or moved out-of-line, as explained in Section 8.3 for character strings).

**Examples:**

Example 1 (unknown):
```unknown
bit varying(n)
```

Example 2 (unknown):
```unknown
bit varying
```

Example 3 (unknown):
```unknown
bit varying
```

Example 4 (unknown):
```unknown
bit varying(n)
```

---

## 8.13. XML Type #

**URL:** https://www.postgresql.org/docs/current/datatype-xml.html

**Contents:**
- 8.13. XML Type #
  - 8.13.1. Creating XML Values #
  - 8.13.2. Encoding Handling #
  - Caution
  - 8.13.3. Accessing XML Values #

The xml data type can be used to store XML data. Its advantage over storing XML data in a text field is that it checks the input values for well-formedness, and there are support functions to perform type-safe operations on it; see Section 9.15. Use of this data type requires the installation to have been built with configure --with-libxml.

The xml type can store well-formed “documents”, as defined by the XML standard, as well as “content” fragments, which are defined by reference to the more permissive “document node” of the XQuery and XPath data model. Roughly, this means that content fragments can have more than one top-level element or character node. The expression xmlvalue IS DOCUMENT can be used to evaluate whether a particular xml value is a full document or only a content fragment.

Limits and compatibility notes for the xml data type can be found in Section D.3.

To produce a value of type xml from character data, use the function xmlparse:

While this is the only way to convert character strings into XML values according to the SQL standard, the PostgreSQL-specific syntaxes:

The xml type does not validate input values against a document type declaration (DTD), even when the input value specifies a DTD. There is also currently no built-in support for validating against other XML schema languages such as XML Schema.

The inverse operation, producing a character string value from xml, uses the function xmlserialize:

type can be character, character varying, or text (or an alias for one of those). Again, according to the SQL standard, this is the only way to convert between type xml and character types, but PostgreSQL also allows you to simply cast the value.

The INDENT option causes the result to be pretty-printed, while NO INDENT (which is the default) just emits the original input string. Casting to a character type likewise produces the original string.

When a character string value is cast to or from type xml without going through XMLPARSE or XMLSERIALIZE, respectively, the choice of DOCUMENT versus CONTENT is determined by the “XML option” session configuration parameter, which can be set using the standard command:

or the more PostgreSQL-like syntax

The default is CONTENT, so all forms of XML data are allowed.

Care must be taken when dealing with multiple character encodings on the client, server, and in the XML data passed through them. When using the text mode to pass queries to the server and query results to the client (which is the normal mode), PostgreSQL converts all character data passed between the client and the server and vice versa to the character encoding of the respective end; see Section 23.3. This includes string representations of XML values, such as in the above examples. This would ordinarily mean that encoding declarations contained in XML data can become invalid as the character data is converted to other encodings while traveling between client and server, because the embedded encoding declaration is not changed. To cope with this behavior, encoding declarations contained in character strings presented for input to the xml type are ignored, and content is assumed to be in the current server encoding. Consequently, for correct processing, character strings of XML data must be sent from the client in the current client encoding. It is the responsibility of the client to either convert documents to the current client encoding before sending them to the server, or to adjust the client encoding appropriately. On output, values of type xml will not have an encoding declaration, and clients should assume all data is in the current client encoding.

When using binary mode to pass query parameters to the server and query results back to the client, no encoding conversion is performed, so the situation is different. In this case, an encoding declaration in the XML data will be observed, and if it is absent, the data will be assumed to be in UTF-8 (as required by the XML standard; note that PostgreSQL does not support UTF-16). On output, data will have an encoding declaration specifying the client encoding, unless the client encoding is UTF-8, in which case it will be omitted.

Needless to say, processing XML data with PostgreSQL will be less error-prone and more efficient if the XML data encoding, client encoding, and server encoding are the same. Since XML data is internally processed in UTF-8, computations will be most efficient if the server encoding is also UTF-8.

Some XML-related functions may not work at all on non-ASCII data when the server encoding is not UTF-8. This is known to be an issue for xmltable() and xpath() in particular.

The xml data type is unusual in that it does not provide any comparison operators. This is because there is no well-defined and universally useful comparison algorithm for XML data. One consequence of this is that you cannot retrieve rows by comparing an xml column against a search value. XML values should therefore typically be accompanied by a separate key field such as an ID. An alternative solution for comparing XML values is to convert them to character strings first, but note that character string comparison has little to do with a useful XML comparison method.

Since there are no comparison operators for the xml data type, it is not possible to create an index directly on a column of this type. If speedy searches in XML data are desired, possible workarounds include casting the expression to a character string type and indexing that, or indexing an XPath expression. Of course, the actual query would have to be adjusted to search by the indexed expression.

The text-search functionality in PostgreSQL can also be used to speed up full-document searches of XML data. The necessary preprocessing support is, however, not yet available in the PostgreSQL distribution.

**Examples:**

Example 1 (unknown):
```unknown
configure --with-libxml
```

Example 2 (unknown):
```unknown
xmlvalue IS DOCUMENT
```

Example 3 (unknown):
```unknown
XMLPARSE ( { DOCUMENT | CONTENT } value)
```

Example 4 (xml):
```xml
XMLPARSE (DOCUMENT '<?xml version="1.0"?><book><title>Manual</title><chapter>...</chapter></book>')
XMLPARSE (CONTENT 'abc<foo>bar</foo><bar>foo</bar>')
```

---

## 8.3. Character Types #

**URL:** https://www.postgresql.org/docs/current/datatype-character.html

**Contents:**
- 8.3. Character Types #
  - Tip

Table 8.4. Character Types

Table 8.4 shows the general-purpose character types available in PostgreSQL.

SQL defines two primary character types: character varying(n) and character(n), where n is a positive integer. Both of these types can store strings up to n characters (not bytes) in length. An attempt to store a longer string into a column of these types will result in an error, unless the excess characters are all spaces, in which case the string will be truncated to the maximum length. (This somewhat bizarre exception is required by the SQL standard.) However, if one explicitly casts a value to character varying(n) or character(n), then an over-length value will be truncated to n characters without raising an error. (This too is required by the SQL standard.) If the string to be stored is shorter than the declared length, values of type character will be space-padded; values of type character varying will simply store the shorter string.

In addition, PostgreSQL provides the text type, which stores strings of any length. Although the text type is not in the SQL standard, several other SQL database management systems have it as well. text is PostgreSQL's native string data type, in that most built-in functions operating on strings are declared to take or return text not character varying. For many purposes, character varying acts as though it were a domain over text.

The type name varchar is an alias for character varying, while bpchar (with length specifier) and char are aliases for character. The varchar and char aliases are defined in the SQL standard; bpchar is a PostgreSQL extension.

If specified, the length n must be greater than zero and cannot exceed 10,485,760. If character varying (or varchar) is used without length specifier, the type accepts strings of any length. If bpchar lacks a length specifier, it also accepts strings of any length, but trailing spaces are semantically insignificant. If character (or char) lacks a specifier, it is equivalent to character(1).

Values of type character are physically padded with spaces to the specified width n, and are stored and displayed that way. However, trailing spaces are treated as semantically insignificant and disregarded when comparing two values of type character. In collations where whitespace is significant, this behavior can produce unexpected results; for example SELECT 'a '::CHAR(2) collate "C" < E'a\n'::CHAR(2) returns true, even though C locale would consider a space to be greater than a newline. Trailing spaces are removed when converting a character value to one of the other string types. Note that trailing spaces are semantically significant in character varying and text values, and when using pattern matching, that is LIKE and regular expressions.

The characters that can be stored in any of these data types are determined by the database character set, which is selected when the database is created. Regardless of the specific character set, the character with code zero (sometimes called NUL) cannot be stored. For more information refer to Section 23.3.

The storage requirement for a short string (up to 126 bytes) is 1 byte plus the actual string, which includes the space padding in the case of character. Longer strings have 4 bytes of overhead instead of 1. Long strings are compressed by the system automatically, so the physical requirement on disk might be less. Very long values are also stored in background tables so that they do not interfere with rapid access to shorter column values. In any case, the longest possible character string that can be stored is about 1 GB. (The maximum value that will be allowed for n in the data type declaration is less than that. It wouldn't be useful to change this because with multibyte character encodings the number of characters and bytes can be quite different. If you desire to store long strings with no specific upper limit, use text or character varying without a length specifier, rather than making up an arbitrary length limit.)

There is no performance difference among these three types, apart from increased storage space when using the blank-padded type, and a few extra CPU cycles to check the length when storing into a length-constrained column. While character(n) has performance advantages in some other database systems, there is no such advantage in PostgreSQL; in fact character(n) is usually the slowest of the three because of its additional storage costs. In most situations text or character varying should be used instead.

Refer to Section 4.1.2.1 for information about the syntax of string literals, and to Chapter 9 for information about available operators and functions.

Example 8.1. Using the Character Types

The char_length function is discussed in Section 9.4.

There are two other fixed-length character types in PostgreSQL, shown in Table 8.5. These are not intended for general-purpose use, only for use in the internal system catalogs. The name type is used to store identifiers. Its length is currently defined as 64 bytes (63 usable characters plus terminator) but should be referenced using the constant NAMEDATALEN in C source code. The length is set at compile time (and is therefore adjustable for special uses); the default maximum length might change in a future release. The type "char" (note the quotes) is different from char(1) in that it only uses one byte of storage, and therefore can store only a single ASCII character. It is used in the system catalogs as a simplistic enumeration type.

Table 8.5. Special Character Types

**Examples:**

Example 1 (unknown):
```unknown
character varying(n)
```

Example 2 (unknown):
```unknown
character(n)
```

Example 3 (unknown):
```unknown
character varying(n)
```

Example 4 (unknown):
```unknown
character(n)
```

---

## 8.12. UUID Type #

**URL:** https://www.postgresql.org/docs/current/datatype-uuid.html

**Contents:**
- 8.12. UUID Type #

The data type uuid stores Universally Unique Identifiers (UUID) as defined by RFC 9562, ISO/IEC 9834-8:2005, and related standards. (Some systems refer to this data type as a globally unique identifier, or GUID, instead.) This identifier is a 128-bit quantity that is generated by an algorithm chosen to make it very unlikely that the same identifier will be generated by anyone else in the known universe using the same algorithm. Therefore, for distributed systems, these identifiers provide a better uniqueness guarantee than sequence generators, which are only unique within a single database.

RFC 9562 defines 8 different UUID versions. Each version has specific requirements for generating new UUID values, and each version provides distinct benefits and drawbacks. PostgreSQL provides native support for generating UUIDs using the UUIDv4 and UUIDv7 algorithms. Alternatively, UUID values can be generated outside of the database using any algorithm. The data type uuid can be used to store any UUID, regardless of the origin and the UUID version.

A UUID is written as a sequence of lower-case hexadecimal digits, in several groups separated by hyphens, specifically a group of 8 digits followed by three groups of 4 digits followed by a group of 12 digits, for a total of 32 digits representing the 128 bits. An example of a UUID in this standard form is:

PostgreSQL also accepts the following alternative forms for input: use of upper-case digits, the standard format surrounded by braces, omitting some or all hyphens, adding a hyphen after any group of four digits. Examples are:

Output is always in the standard form.

See Section 9.14 for how to generate a UUID in PostgreSQL.

**Examples:**

Example 1 (unknown):
```unknown
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
```

Example 2 (json):
```json
A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11
{a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11}
a0eebc999c0b4ef8bb6d6bb9bd380a11
a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11
{a0eebc99-9c0b4ef8-bb6d6bb9-bd380a11}
```

---

## 8.4. Binary Data Types #

**URL:** https://www.postgresql.org/docs/current/datatype-binary.html

**Contents:**
- 8.4. Binary Data Types #
  - 8.4.1. bytea Hex Format #
  - 8.4.2. bytea Escape Format #

The bytea data type allows storage of binary strings; see Table 8.6.

Table 8.6. Binary Data Types

A binary string is a sequence of octets (or bytes). Binary strings are distinguished from character strings in two ways. First, binary strings specifically allow storing octets of value zero and other “non-printable” octets (usually, octets outside the decimal range 32 to 126). Character strings disallow zero octets, and also disallow any other octet values and sequences of octet values that are invalid according to the database's selected character set encoding. Second, operations on binary strings process the actual bytes, whereas the processing of character strings depends on locale settings. In short, binary strings are appropriate for storing data that the programmer thinks of as “raw bytes”, whereas character strings are appropriate for storing text.

The bytea type supports two formats for input and output: “hex” format and PostgreSQL's historical “escape” format. Both of these are always accepted on input. The output format depends on the configuration parameter bytea_output; the default is hex. (Note that the hex format was introduced in PostgreSQL 9.0; earlier versions and some tools don't understand it.)

The SQL standard defines a different binary string type, called BLOB or BINARY LARGE OBJECT. The input format is different from bytea, but the provided functions and operators are mostly the same.

The “hex” format encodes binary data as 2 hexadecimal digits per byte, most significant nibble first. The entire string is preceded by the sequence \x (to distinguish it from the escape format). In some contexts, the initial backslash may need to be escaped by doubling it (see Section 4.1.2.1). For input, the hexadecimal digits can be either upper or lower case, and whitespace is permitted between digit pairs (but not within a digit pair nor in the starting \x sequence). The hex format is compatible with a wide range of external applications and protocols, and it tends to be faster to convert than the escape format, so its use is preferred.

The “escape” format is the traditional PostgreSQL format for the bytea type. It takes the approach of representing a binary string as a sequence of ASCII characters, while converting those bytes that cannot be represented as an ASCII character into special escape sequences. If, from the point of view of the application, representing bytes as characters makes sense, then this representation can be convenient. But in practice it is usually confusing because it fuzzes up the distinction between binary strings and character strings, and also the particular escape mechanism that was chosen is somewhat unwieldy. Therefore, this format should probably be avoided for most new applications.

When entering bytea values in escape format, octets of certain values must be escaped, while all octet values can be escaped. In general, to escape an octet, convert it into its three-digit octal value and precede it by a backslash. Backslash itself (octet decimal value 92) can alternatively be represented by double backslashes. Table 8.7 shows the characters that must be escaped, and gives the alternative escape sequences where applicable.

Table 8.7. bytea Literal Escaped Octets

The requirement to escape non-printable octets varies depending on locale settings. In some instances you can get away with leaving them unescaped.

The reason that single quotes must be doubled, as shown in Table 8.7, is that this is true for any string literal in an SQL command. The generic string-literal parser consumes the outermost single quotes and reduces any pair of single quotes to one data character. What the bytea input function sees is just one single quote, which it treats as a plain data character. However, the bytea input function treats backslashes as special, and the other behaviors shown in Table 8.7 are implemented by that function.

In some contexts, backslashes must be doubled compared to what is shown above, because the generic string-literal parser will also reduce pairs of backslashes to one data character; see Section 4.1.2.1.

Bytea octets are output in hex format by default. If you change bytea_output to escape, “non-printable” octets are converted to their equivalent three-digit octal value and preceded by one backslash. Most “printable” octets are output by their standard representation in the client character set, e.g.:

The octet with decimal value 92 (backslash) is doubled in the output. Details are in Table 8.8.

Table 8.8. bytea Output Escaped Octets

Depending on the front end to PostgreSQL you use, you might have additional work to do in terms of escaping and unescaping bytea strings. For example, you might also have to escape line feeds and carriage returns if your interface automatically translates these.

**Examples:**

Example 1 (unknown):
```unknown
BINARY LARGE OBJECT
```

Example 2 (sql):
```sql
SET bytea_output = 'hex';

SELECT '\xDEADBEEF'::bytea;
   bytea
------------
 \xdeadbeef
```

Example 3 (julia):
```julia
'\000'::bytea
```

Example 4 (julia):
```julia
''''::bytea
```

---

## 8.19. Object Identifier Types #

**URL:** https://www.postgresql.org/docs/current/datatype-oid.html

**Contents:**
- 8.19. Object Identifier Types #
  - Note

Object identifiers (OIDs) are used internally by PostgreSQL as primary keys for various system tables. Type oid represents an object identifier. There are also several alias types for oid, each named regsomething. Table 8.26 shows an overview.

The oid type is currently implemented as an unsigned four-byte integer. Therefore, it is not large enough to provide database-wide uniqueness in large databases, or even in large individual tables.

The oid type itself has few operations beyond comparison. It can be cast to integer, however, and then manipulated using the standard integer operators. (Beware of possible signed-versus-unsigned confusion if you do this.)

The OID alias types have no operations of their own except for specialized input and output routines. These routines are able to accept and display symbolic names for system objects, rather than the raw numeric value that type oid would use. The alias types allow simplified lookup of OID values for objects. For example, to examine the pg_attribute rows related to a table mytable, one could write:

While that doesn't look all that bad by itself, it's still oversimplified. A far more complicated sub-select would be needed to select the right OID if there are multiple tables named mytable in different schemas. The regclass input converter handles the table lookup according to the schema path setting, and so it does the “right thing” automatically. Similarly, casting a table's OID to regclass is handy for symbolic display of a numeric OID.

Table 8.26. Object Identifier Types

All of the OID alias types for objects that are grouped by namespace accept schema-qualified names, and will display schema-qualified names on output if the object would not be found in the current search path without being qualified. For example, myschema.mytable is acceptable input for regclass (if there is such a table). That value might be output as myschema.mytable, or just mytable, depending on the current search path. The regproc and regoper alias types will only accept input names that are unique (not overloaded), so they are of limited use; for most uses regprocedure or regoperator are more appropriate. For regoperator, unary operators are identified by writing NONE for the unused operand.

The input functions for these types allow whitespace between tokens, and will fold upper-case letters to lower case, except within double quotes; this is done to make the syntax rules similar to the way object names are written in SQL. Conversely, the output functions will use double quotes if needed to make the output be a valid SQL identifier. For example, the OID of a function named Foo (with upper case F) taking two integer arguments could be entered as ' "Foo" ( int, integer ) '::regprocedure. The output would look like "Foo"(integer,integer). Both the function name and the argument type names could be schema-qualified, too.

Many built-in PostgreSQL functions accept the OID of a table, or another kind of database object, and for convenience are declared as taking regclass (or the appropriate OID alias type). This means you do not have to look up the object's OID by hand, but can just enter its name as a string literal. For example, the nextval(regclass) function takes a sequence relation's OID, so you could call it like this:

When you write the argument of such a function as an unadorned literal string, it becomes a constant of type regclass (or the appropriate type). Since this is really just an OID, it will track the originally identified object despite later renaming, schema reassignment, etc. This “early binding” behavior is usually desirable for object references in column defaults and views. But sometimes you might want “late binding” where the object reference is resolved at run time. To get late-binding behavior, force the constant to be stored as a text constant instead of regclass:

The to_regclass() function and its siblings can also be used to perform run-time lookups. See Table 9.76.

Another practical example of use of regclass is to look up the OID of a table listed in the information_schema views, which don't supply such OIDs directly. One might for example wish to call the pg_relation_size() function, which requires the table OID. Taking the above rules into account, the correct way to do that is

The quote_ident() function will take care of double-quoting the identifiers where needed. The seemingly easier

is not recommended, because it will fail for tables that are outside your search path or have names that require quoting.

An additional property of most of the OID alias types is the creation of dependencies. If a constant of one of these types appears in a stored expression (such as a column default expression or view), it creates a dependency on the referenced object. For example, if a column has a default expression nextval('my_seq'::regclass), PostgreSQL understands that the default expression depends on the sequence my_seq, so the system will not let the sequence be dropped without first removing the default expression. The alternative of nextval('my_seq'::text) does not create a dependency. (regrole is an exception to this property. Constants of this type are not allowed in stored expressions.)

Another identifier type used by the system is xid, or transaction (abbreviated xact) identifier. This is the data type of the system columns xmin and xmax. Transaction identifiers are 32-bit quantities. In some contexts, a 64-bit variant xid8 is used. Unlike xid values, xid8 values increase strictly monotonically and cannot be reused in the lifetime of a database cluster. See Section 67.1 for more details.

A third identifier type used by the system is cid, or command identifier. This is the data type of the system columns cmin and cmax. Command identifiers are also 32-bit quantities.

A final identifier type used by the system is tid, or tuple identifier (row identifier). This is the data type of the system column ctid. A tuple ID is a pair (block number, tuple index within block) that identifies the physical location of the row within its table.

(The system columns are further explained in Section 5.6.)

**Examples:**

Example 1 (unknown):
```unknown
regsomething
```

Example 2 (unknown):
```unknown
pg_attribute
```

Example 3 (sql):
```sql
SELECT * FROM pg_attribute WHERE attrelid = 'mytable'::regclass;
```

Example 4 (sql):
```sql
SELECT * FROM pg_attribute
  WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = 'mytable');
```

---

## 8.9. Network Address Types #

**URL:** https://www.postgresql.org/docs/current/datatype-net-types.html

**Contents:**
- 8.9. Network Address Types #
  - 8.9.1. inet #
  - 8.9.2. cidr #
  - 8.9.3. inet vs. cidr #
  - Tip
  - 8.9.4. macaddr #
  - 8.9.5. macaddr8 #

PostgreSQL offers data types to store IPv4, IPv6, and MAC addresses, as shown in Table 8.21. It is better to use these types instead of plain text types to store network addresses, because these types offer input error checking and specialized operators and functions (see Section 9.12).

Table 8.21. Network Address Types

When sorting inet or cidr data types, IPv4 addresses will always sort before IPv6 addresses, including IPv4 addresses encapsulated or mapped to IPv6 addresses, such as ::10.2.3.4 or ::ffff:10.4.3.2.

The inet type holds an IPv4 or IPv6 host address, and optionally its subnet, all in one field. The subnet is represented by the number of network address bits present in the host address (the “netmask”). If the netmask is 32 and the address is IPv4, then the value does not indicate a subnet, only a single host. In IPv6, the address length is 128 bits, so 128 bits specify a unique host address. Note that if you want to accept only networks, you should use the cidr type rather than inet.

The input format for this type is address/y where address is an IPv4 or IPv6 address and y is the number of bits in the netmask. If the /y portion is omitted, the netmask is taken to be 32 for IPv4 or 128 for IPv6, so the value represents just a single host. On display, the /y portion is suppressed if the netmask specifies a single host.

The cidr type holds an IPv4 or IPv6 network specification. Input and output formats follow Classless Internet Domain Routing conventions. The format for specifying networks is address/y where address is the network's lowest address represented as an IPv4 or IPv6 address, and y is the number of bits in the netmask. If y is omitted, it is calculated using assumptions from the older classful network numbering system, except it will be at least large enough to include all of the octets written in the input. It is an error to specify a network address that has bits set to the right of the specified netmask.

Table 8.22 shows some examples.

Table 8.22. cidr Type Input Examples

The essential difference between inet and cidr data types is that inet accepts values with nonzero bits to the right of the netmask, whereas cidr does not. For example, 192.168.0.1/24 is valid for inet but not for cidr.

If you do not like the output format for inet or cidr values, try the functions host, text, and abbrev.

The macaddr type stores MAC addresses, known for example from Ethernet card hardware addresses (although MAC addresses are used for other purposes as well). Input is accepted in the following formats:

These examples all specify the same address. Upper and lower case is accepted for the digits a through f. Output is always in the first of the forms shown.

IEEE Standard 802-2001 specifies the second form shown (with hyphens) as the canonical form for MAC addresses, and specifies the first form (with colons) as used with bit-reversed, MSB-first notation, so that 08-00-2b-01-02-03 = 10:00:D4:80:40:C0. This convention is widely ignored nowadays, and it is relevant only for obsolete network protocols (such as Token Ring). PostgreSQL makes no provisions for bit reversal; all accepted formats use the canonical LSB order.

The remaining five input formats are not part of any standard.

The macaddr8 type stores MAC addresses in EUI-64 format, known for example from Ethernet card hardware addresses (although MAC addresses are used for other purposes as well). This type can accept both 6 and 8 byte length MAC addresses and stores them in 8 byte length format. MAC addresses given in 6 byte format will be stored in 8 byte length format with the 4th and 5th bytes set to FF and FE, respectively. Note that IPv6 uses a modified EUI-64 format where the 7th bit should be set to one after the conversion from EUI-48. The function macaddr8_set7bit is provided to make this change. Generally speaking, any input which is comprised of pairs of hex digits (on byte boundaries), optionally separated consistently by one of ':', '-' or '.', is accepted. The number of hex digits must be either 16 (8 bytes) or 12 (6 bytes). Leading and trailing whitespace is ignored. The following are examples of input formats that are accepted:

These examples all specify the same address. Upper and lower case is accepted for the digits a through f. Output is always in the first of the forms shown.

The last six input formats shown above are not part of any standard.

To convert a traditional 48 bit MAC address in EUI-48 format to modified EUI-64 format to be included as the host portion of an IPv6 address, use macaddr8_set7bit as shown:

**Examples:**

Example 1 (unknown):
```unknown
abbrev(cidr)
```

Example 2 (unknown):
```unknown
abbrev(cidr)
```

Example 3 (unknown):
```unknown
192.168.0.1/24
```

Example 4 (json):
```json
'08:00:2b:01:02:03'
```

---

## 8.8. Geometric Types #

**URL:** https://www.postgresql.org/docs/current/datatype-geometric.html

**Contents:**
- 8.8. Geometric Types #
  - 8.8.1. Points #
  - 8.8.2. Lines #
  - 8.8.3. Line Segments #
  - 8.8.4. Boxes #
  - 8.8.5. Paths #
  - 8.8.6. Polygons #
  - 8.8.7. Circles #

Geometric data types represent two-dimensional spatial objects. Table 8.20 shows the geometric types available in PostgreSQL.

Table 8.20. Geometric Types

In all these types, the individual coordinates are stored as double precision (float8) numbers.

A rich set of functions and operators is available to perform various geometric operations such as scaling, translation, rotation, and determining intersections. They are explained in Section 9.11.

Points are the fundamental two-dimensional building block for geometric types. Values of type point are specified using either of the following syntaxes:

where x and y are the respective coordinates, as floating-point numbers.

Points are output using the first syntax.

Lines are represented by the linear equation Ax + By + C = 0, where A and B are not both zero. Values of type line are input and output in the following form:

Alternatively, any of the following forms can be used for input:

where (x1,y1) and (x2,y2) are two different points on the line.

Line segments are represented by pairs of points that are the endpoints of the segment. Values of type lseg are specified using any of the following syntaxes:

where (x1,y1) and (x2,y2) are the end points of the line segment.

Line segments are output using the first syntax.

Boxes are represented by pairs of points that are opposite corners of the box. Values of type box are specified using any of the following syntaxes:

where (x1,y1) and (x2,y2) are any two opposite corners of the box.

Boxes are output using the second syntax.

Any two opposite corners can be supplied on input, but the values will be reordered as needed to store the upper right and lower left corners, in that order.

Paths are represented by lists of connected points. Paths can be open, where the first and last points in the list are considered not connected, or closed, where the first and last points are considered connected.

Values of type path are specified using any of the following syntaxes:

where the points are the end points of the line segments comprising the path. Square brackets ([]) indicate an open path, while parentheses (()) indicate a closed path. When the outermost parentheses are omitted, as in the third through fifth syntaxes, a closed path is assumed.

Paths are output using the first or second syntax, as appropriate.

Polygons are represented by lists of points (the vertices of the polygon). Polygons are very similar to closed paths; the essential semantic difference is that a polygon is considered to include the area within it, while a path is not.

An important implementation difference between polygons and paths is that the stored representation of a polygon includes its smallest bounding box. This speeds up certain search operations, although computing the bounding box adds overhead while constructing new polygons.

Values of type polygon are specified using any of the following syntaxes:

where the points are the end points of the line segments comprising the boundary of the polygon.

Polygons are output using the first syntax.

Circles are represented by a center point and radius. Values of type circle are specified using any of the following syntaxes:

where (x,y) is the center point and r is the radius of the circle.

Circles are output using the first syntax.

**Examples:**

Example 1 (unknown):
```unknown
double precision
```

Example 2 (unknown):
```unknown
( x , y )
  x , y
```

Example 3 (json):
```json
{ A, B, C }
```

Example 4 (json):
```json
[ ( x1 , y1 ) , ( x2 , y2 ) ]
( ( x1 , y1 ) , ( x2 , y2 ) )
  ( x1 , y1 ) , ( x2 , y2 )
    x1 , y1   ,   x2 , y2
```

---

## 8.6. Boolean Type #

**URL:** https://www.postgresql.org/docs/current/datatype-boolean.html

**Contents:**
- 8.6. Boolean Type #

PostgreSQL provides the standard SQL type boolean; see Table 8.19. The boolean type can have several states: “true”, “false”, and a third state, “unknown”, which is represented by the SQL null value.

Table 8.19. Boolean Data Type

Boolean constants can be represented in SQL queries by the SQL key words TRUE, FALSE, and NULL.

The datatype input function for type boolean accepts these string representations for the “true” state:

and these representations for the “false” state:

Unique prefixes of these strings are also accepted, for example t or n. Leading or trailing whitespace is ignored, and case does not matter.

The datatype output function for type boolean always emits either t or f, as shown in Example 8.2.

Example 8.2. Using the boolean Type

The key words TRUE and FALSE are the preferred (SQL-compliant) method for writing Boolean constants in SQL queries. But you can also use the string representations by following the generic string-literal constant syntax described in Section 4.1.2.7, for example 'yes'::boolean.

Note that the parser automatically understands that TRUE and FALSE are of type boolean, but this is not so for NULL because that can have any type. So in some contexts you might have to cast NULL to boolean explicitly, for example NULL::boolean. Conversely, the cast can be omitted from a string-literal Boolean value in contexts where the parser can deduce that the literal must be of type boolean.

**Examples:**

Example 1 (sql):
```sql
CREATE TABLE test1 (a boolean, b text);
INSERT INTO test1 VALUES (TRUE, 'sic est');
INSERT INTO test1 VALUES (FALSE, 'non est');
SELECT * FROM test1;
 a |    b
---+---------
 t | sic est
 f | non est

SELECT * FROM test1 WHERE a;
 a |    b
---+---------
 t | sic est
```

Example 2 (julia):
```julia
'yes'::boolean
```

Example 3 (yaml):
```yaml
NULL::boolean
```

---

## 8.5. Date/Time Types #

**URL:** https://www.postgresql.org/docs/current/datatype-datetime.html

**Contents:**
- 8.5. Date/Time Types #
  - Note
  - 8.5.1. Date/Time Input #
    - 8.5.1.1. Dates #
    - 8.5.1.2. Times #
    - 8.5.1.3. Time Stamps #
    - 8.5.1.4. Special Values #
  - Caution
  - 8.5.2. Date/Time Output #
  - Note

PostgreSQL supports the full set of SQL date and time types, shown in Table 8.9. The operations available on these data types are described in Section 9.9. Dates are counted according to the Gregorian calendar, even in years before that calendar was introduced (see Section B.6 for more information).

Table 8.9. Date/Time Types

The SQL standard requires that writing just timestamp be equivalent to timestamp without time zone, and PostgreSQL honors that behavior. timestamptz is accepted as an abbreviation for timestamp with time zone; this is a PostgreSQL extension.

time, timestamp, and interval accept an optional precision value p which specifies the number of fractional digits retained in the seconds field. By default, there is no explicit bound on precision. The allowed range of p is from 0 to 6.

The interval type has an additional option, which is to restrict the set of stored fields by writing one of these phrases:

Note that if both fields and p are specified, the fields must include SECOND, since the precision applies only to the seconds.

The type time with time zone is defined by the SQL standard, but the definition exhibits properties which lead to questionable usefulness. In most cases, a combination of date, time, timestamp without time zone, and timestamp with time zone should provide a complete range of date/time functionality required by any application.

Date and time input is accepted in almost any reasonable format, including ISO 8601, SQL-compatible, traditional POSTGRES, and others. For some formats, ordering of day, month, and year in date input is ambiguous and there is support for specifying the expected ordering of these fields. Set the DateStyle parameter to MDY to select month-day-year interpretation, DMY to select day-month-year interpretation, or YMD to select year-month-day interpretation.

PostgreSQL is more flexible in handling date/time input than the SQL standard requires. See Appendix B for the exact parsing rules of date/time input and for the recognized text fields including months, days of the week, and time zones.

Remember that any date or time literal input needs to be enclosed in single quotes, like text strings. Refer to Section 4.1.2.7 for more information. SQL requires the following syntax

where p is an optional precision specification giving the number of fractional digits in the seconds field. Precision can be specified for time, timestamp, and interval types, and can range from 0 to 6. If no precision is specified in a constant specification, it defaults to the precision of the literal value (but not more than 6 digits).

Table 8.10 shows some possible inputs for the date type.

Table 8.10. Date Input

The time-of-day types are time [ (p) ] without time zone and time [ (p) ] with time zone. time alone is equivalent to time without time zone.

Valid input for these types consists of a time of day followed by an optional time zone. (See Table 8.11 and Table 8.12.) If a time zone is specified in the input for time without time zone, it is silently ignored. You can also specify a date but it will be ignored, except when you use a time zone name that involves a daylight-savings rule, such as America/New_York. In this case specifying the date is required in order to determine whether standard or daylight-savings time applies. The appropriate time zone offset is recorded in the time with time zone value and is output as stored; it is not adjusted to the active time zone.

Table 8.11. Time Input

Table 8.12. Time Zone Input

Refer to Section 8.5.3 for more information on how to specify time zones.

Valid input for the time stamp types consists of the concatenation of a date and a time, followed by an optional time zone, followed by an optional AD or BC. (Alternatively, AD/BC can appear before the time zone, but this is not the preferred ordering.) Thus:

are valid values, which follow the ISO 8601 standard. In addition, the common format:

The SQL standard differentiates timestamp without time zone and timestamp with time zone literals by the presence of a “+” or “-” symbol and time zone offset after the time. Hence, according to the standard,

is a timestamp without time zone, while

is a timestamp with time zone. PostgreSQL never examines the content of a literal string before determining its type, and therefore will treat both of the above as timestamp without time zone. To ensure that a literal is treated as timestamp with time zone, give it the correct explicit type:

In a value that has been determined to be timestamp without time zone, PostgreSQL will silently ignore any time zone indication. That is, the resulting value is derived from the date/time fields in the input string, and is not adjusted for time zone.

For timestamp with time zone values, an input string that includes an explicit time zone will be converted to UTC (Universal Coordinated Time) using the appropriate offset for that time zone. If no time zone is stated in the input string, then it is assumed to be in the time zone indicated by the system's TimeZone parameter, and is converted to UTC using the offset for the timezone zone. In either case, the value is stored internally as UTC, and the originally stated or assumed time zone is not retained.

When a timestamp with time zone value is output, it is always converted from UTC to the current timezone zone, and displayed as local time in that zone. To see the time in another time zone, either change timezone or use the AT TIME ZONE construct (see Section 9.9.4).

Conversions between timestamp without time zone and timestamp with time zone normally assume that the timestamp without time zone value should be taken or given as timezone local time. A different time zone can be specified for the conversion using AT TIME ZONE.

PostgreSQL supports several special date/time input values for convenience, as shown in Table 8.13. The values infinity and -infinity are specially represented inside the system and will be displayed unchanged; but the others are simply notational shorthands that will be converted to ordinary date/time values when read. (In particular, now and related strings are converted to a specific time value as soon as they are read.) All of these values need to be enclosed in single quotes when used as constants in SQL commands.

Table 8.13. Special Date/Time Inputs

The following SQL-compatible functions can also be used to obtain the current time value for the corresponding data type: CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP, LOCALTIME, LOCALTIMESTAMP. (See Section 9.9.5.) Note that these are SQL functions and are not recognized in data input strings.

While the input strings now, today, tomorrow, and yesterday are fine to use in interactive SQL commands, they can have surprising behavior when the command is saved to be executed later, for example in prepared statements, views, and function definitions. The string can be converted to a specific time value that continues to be used long after it becomes stale. Use one of the SQL functions instead in such contexts. For example, CURRENT_DATE + 1 is safer than 'tomorrow'::date.

The output format of the date/time types can be set to one of the four styles ISO 8601, SQL (Ingres), traditional POSTGRES (Unix date format), or German. The default is the ISO format. (The SQL standard requires the use of the ISO 8601 format. The name of the “SQL” output format is a historical accident.) Table 8.14 shows examples of each output style. The output of the date and time types is generally only the date or time part in accordance with the given examples. However, the POSTGRES style outputs date-only values in ISO format.

Table 8.14. Date/Time Output Styles

ISO 8601 specifies the use of uppercase letter T to separate the date and time. PostgreSQL accepts that format on input, but on output it uses a space rather than T, as shown above. This is for readability and for consistency with RFC 3339 as well as some other database systems.

In the SQL and POSTGRES styles, day appears before month if DMY field ordering has been specified, otherwise month appears before day. (See Section 8.5.1 for how this setting also affects interpretation of input values.) Table 8.15 shows examples.

Table 8.15. Date Order Conventions

In the ISO style, the time zone is always shown as a signed numeric offset from UTC, with positive sign used for zones east of Greenwich. The offset will be shown as hh (hours only) if it is an integral number of hours, else as hh:mm if it is an integral number of minutes, else as hh:mm:ss. (The third case is not possible with any modern time zone standard, but it can appear when working with timestamps that predate the adoption of standardized time zones.) In the other date styles, the time zone is shown as an alphabetic abbreviation if one is in common use in the current zone. Otherwise it appears as a signed numeric offset in ISO 8601 basic format (hh or hhmm). The alphabetic abbreviations shown in these styles are taken from the IANA time zone database entry currently selected by the TimeZone run-time parameter; they are not affected by the timezone_abbreviations setting.

The date/time style can be selected by the user using the SET datestyle command, the DateStyle parameter in the postgresql.conf configuration file, or the PGDATESTYLE environment variable on the server or client.

The formatting function to_char (see Section 9.8) is also available as a more flexible way to format date/time output.

Time zones, and time-zone conventions, are influenced by political decisions, not just earth geometry. Time zones around the world became somewhat standardized during the 1900s, but continue to be prone to arbitrary changes, particularly with respect to daylight-savings rules. PostgreSQL uses the widely-used IANA (Olson) time zone database for information about historical time zone rules. For times in the future, the assumption is that the latest known rules for a given time zone will continue to be observed indefinitely far into the future.

PostgreSQL endeavors to be compatible with the SQL standard definitions for typical usage. However, the SQL standard has an odd mix of date and time types and capabilities. Two obvious problems are:

Although the date type cannot have an associated time zone, the time type can. Time zones in the real world have little meaning unless associated with a date as well as a time, since the offset can vary through the year with daylight-saving time boundaries.

The default time zone is specified as a constant numeric offset from UTC. It is therefore impossible to adapt to daylight-saving time when doing date/time arithmetic across DST boundaries.

To address these difficulties, we recommend using date/time types that contain both date and time when using time zones. We do not recommend using the type time with time zone (though it is supported by PostgreSQL for legacy applications and for compliance with the SQL standard). PostgreSQL assumes your local time zone for any type containing only date or time.

All timezone-aware dates and times are stored internally in UTC. They are converted to local time in the zone specified by the TimeZone configuration parameter before being displayed to the client.

PostgreSQL allows you to specify time zones in three different forms:

A full time zone name, for example America/New_York. The recognized time zone names are listed in the pg_timezone_names view (see Section 53.34). PostgreSQL uses the widely-used IANA time zone data for this purpose, so the same time zone names are also recognized by other software.

A time zone abbreviation, for example PST. Such a specification merely defines a particular offset from UTC, in contrast to full time zone names which can imply a set of daylight savings transition rules as well. The recognized abbreviations are listed in the pg_timezone_abbrevs view (see Section 53.33). You cannot set the configuration parameters TimeZone or log_timezone to a time zone abbreviation, but you can use abbreviations in date/time input values and with the AT TIME ZONE operator.

In addition to the timezone names and abbreviations, PostgreSQL will accept POSIX-style time zone specifications, as described in Section B.5. This option is not normally preferable to using a named time zone, but it may be necessary if no suitable IANA time zone entry is available.

In short, this is the difference between abbreviations and full names: abbreviations represent a specific offset from UTC, whereas many of the full names imply a local daylight-savings time rule, and so have two possible UTC offsets. As an example, 2014-06-04 12:00 America/New_York represents noon local time in New York, which for this particular date was Eastern Daylight Time (UTC-4). So 2014-06-04 12:00 EDT specifies that same time instant. But 2014-06-04 12:00 EST specifies noon Eastern Standard Time (UTC-5), regardless of whether daylight savings was nominally in effect on that date.

The sign in POSIX-style time zone specifications has the opposite meaning of the sign in ISO-8601 datetime values. For example, the POSIX time zone for 2014-06-04 12:00+04 would be UTC-4.

To complicate matters, some jurisdictions have used the same timezone abbreviation to mean different UTC offsets at different times; for example, in Moscow MSK has meant UTC+3 in some years and UTC+4 in others. PostgreSQL interprets such abbreviations according to whatever they meant (or had most recently meant) on the specified date; but, as with the EST example above, this is not necessarily the same as local civil time on that date.

In all cases, timezone names and abbreviations are recognized case-insensitively. (This is a change from PostgreSQL versions prior to 8.2, which were case-sensitive in some contexts but not others.)

Neither timezone names nor abbreviations are hard-wired into the server; they are obtained from configuration files stored under .../share/timezone/ and .../share/timezonesets/ of the installation directory (see Section B.4).

The TimeZone configuration parameter can be set in the file postgresql.conf, or in any of the other standard ways described in Chapter 19. There are also some special ways to set it:

The SQL command SET TIME ZONE sets the time zone for the session. This is an alternative spelling of SET TIMEZONE TO with a more SQL-spec-compatible syntax.

The PGTZ environment variable is used by libpq clients to send a SET TIME ZONE command to the server upon connection.

interval values can be written using the following verbose syntax:

where quantity is a number (possibly signed); unit is microsecond, millisecond, second, minute, hour, day, week, month, year, decade, century, millennium, or abbreviations or plurals of these units; direction can be ago or empty. The at sign (@) is optional noise. The amounts of the different units are implicitly added with appropriate sign accounting. ago negates all the fields. This syntax is also used for interval output, if IntervalStyle is set to postgres_verbose.

Quantities of days, hours, minutes, and seconds can be specified without explicit unit markings. For example, '1 12:59:10' is read the same as '1 day 12 hours 59 min 10 sec'. Also, a combination of years and months can be specified with a dash; for example '200-10' is read the same as '200 years 10 months'. (These shorter forms are in fact the only ones allowed by the SQL standard, and are used for output when IntervalStyle is set to sql_standard.)

Interval values can also be written as ISO 8601 time intervals, using either the “format with designators” of the standard's section 4.4.3.2 or the “alternative format” of section 4.4.3.3. The format with designators looks like this:

The string must start with a P, and may include a T that introduces the time-of-day units. The available unit abbreviations are given in Table 8.16. Units may be omitted, and may be specified in any order, but units smaller than a day must appear after T. In particular, the meaning of M depends on whether it is before or after T.

Table 8.16. ISO 8601 Interval Unit Abbreviations

In the alternative format:

the string must begin with P, and a T separates the date and time parts of the interval. The values are given as numbers similar to ISO 8601 dates.

When writing an interval constant with a fields specification, or when assigning a string to an interval column that was defined with a fields specification, the interpretation of unmarked quantities depends on the fields. For example INTERVAL '1' YEAR is read as 1 year, whereas INTERVAL '1' means 1 second. Also, field values “to the right” of the least significant field allowed by the fields specification are silently discarded. For example, writing INTERVAL '1 day 2:03:04' HOUR TO MINUTE results in dropping the seconds field, but not the day field.

According to the SQL standard all fields of an interval value must have the same sign, so a leading negative sign applies to all fields; for example the negative sign in the interval literal '-1 2:03:04' applies to both the days and hour/minute/second parts. PostgreSQL allows the fields to have different signs, and traditionally treats each field in the textual representation as independently signed, so that the hour/minute/second part is considered positive in this example. If IntervalStyle is set to sql_standard then a leading sign is considered to apply to all fields (but only if no additional signs appear). Otherwise the traditional PostgreSQL interpretation is used. To avoid ambiguity, it's recommended to attach an explicit sign to each field if any field is negative.

Internally, interval values are stored as three integral fields: months, days, and microseconds. These fields are kept separate because the number of days in a month varies, while a day can have 23 or 25 hours if a daylight savings time transition is involved. An interval input string that uses other units is normalized into this format, and then reconstructed in a standardized way for output, for example:

Here weeks, which are understood as “7 days”, have been kept separate, while the smaller and larger time units were combined and normalized.

Input field values can have fractional parts, for example '1.5 weeks' or '01:02:03.45'. However, because interval internally stores only integral fields, fractional values must be converted into smaller units. Fractional parts of units greater than months are rounded to be an integer number of months, e.g. '1.5 years' becomes '1 year 6 mons'. Fractional parts of weeks and days are computed to be an integer number of days and microseconds, assuming 30 days per month and 24 hours per day, e.g., '1.75 months' becomes 1 mon 22 days 12:00:00. Only seconds will ever be shown as fractional on output.

Table 8.17 shows some examples of valid interval input.

Table 8.17. Interval Input

As previously explained, PostgreSQL stores interval values as months, days, and microseconds. For output, the months field is converted to years and months by dividing by 12. The days field is shown as-is. The microseconds field is converted to hours, minutes, seconds, and fractional seconds. Thus months, minutes, and seconds will never be shown as exceeding the ranges 0–11, 0–59, and 0–59 respectively, while the displayed years, days, and hours fields can be quite large. (The justify_days and justify_hours functions can be used if it is desirable to transpose large days or hours values into the next higher field.)

The output format of the interval type can be set to one of the four styles sql_standard, postgres, postgres_verbose, or iso_8601, using the command SET intervalstyle. The default is the postgres format. Table 8.18 shows examples of each output style.

The sql_standard style produces output that conforms to the SQL standard's specification for interval literal strings, if the interval value meets the standard's restrictions (either year-month only or day-time only, with no mixing of positive and negative components). Otherwise the output looks like a standard year-month literal string followed by a day-time literal string, with explicit signs added to disambiguate mixed-sign intervals.

The output of the postgres style matches the output of PostgreSQL releases prior to 8.4 when the DateStyle parameter was set to ISO.

The output of the postgres_verbose style matches the output of PostgreSQL releases prior to 8.4 when the DateStyle parameter was set to non-ISO output.

The output of the iso_8601 style matches the “format with designators” described in section 4.4.3.2 of the ISO 8601 standard.

Table 8.18. Interval Output Style Examples

**Examples:**

Example 1 (unknown):
```unknown
timestamp [ (p) ] [ without time zone ]
```

Example 2 (unknown):
```unknown
timestamp [ (p) ] with time zone
```

Example 3 (unknown):
```unknown
time [ (p) ] [ without time zone ]
```

Example 4 (unknown):
```unknown
time [ (p) ] with time zone
```

---

## 8.20. pg_lsn Type #

**URL:** https://www.postgresql.org/docs/current/datatype-pg-lsn.html

**Contents:**
- 8.20. pg_lsn Type #

The pg_lsn data type can be used to store LSN (Log Sequence Number) data which is a pointer to a location in the WAL. This type is a representation of XLogRecPtr and an internal system type of PostgreSQL.

Internally, an LSN is a 64-bit integer, representing a byte position in the write-ahead log stream. It is printed as two hexadecimal numbers of up to 8 digits each, separated by a slash; for example, 16/B374D848. The pg_lsn type supports the standard comparison operators, like = and >. Two LSNs can be subtracted using the - operator; the result is the number of bytes separating those write-ahead log locations. Also the number of bytes can be added into and subtracted from LSN using the +(pg_lsn,numeric) and -(pg_lsn,numeric) operators, respectively. Note that the calculated LSN should be in the range of pg_lsn type, i.e., between 0/0 and FFFFFFFF/FFFFFFFF.

**Examples:**

Example 1 (unknown):
```unknown
16/B374D848
```

Example 2 (unknown):
```unknown
+(pg_lsn,numeric)
```

Example 3 (unknown):
```unknown
-(pg_lsn,numeric)
```

Example 4 (unknown):
```unknown
FFFFFFFF/FFFFFFFF
```

---

## 8.7. Enumerated Types #

**URL:** https://www.postgresql.org/docs/current/datatype-enum.html

**Contents:**
- 8.7. Enumerated Types #
  - 8.7.1. Declaration of Enumerated Types #
  - 8.7.2. Ordering #
  - 8.7.3. Type Safety #
  - 8.7.4. Implementation Details #

Enumerated (enum) types are data types that comprise a static, ordered set of values. They are equivalent to the enum types supported in a number of programming languages. An example of an enum type might be the days of the week, or a set of status values for a piece of data.

Enum types are created using the CREATE TYPE command, for example:

Once created, the enum type can be used in table and function definitions much like any other type:

The ordering of the values in an enum type is the order in which the values were listed when the type was created. All standard comparison operators and related aggregate functions are supported for enums. For example:

Each enumerated data type is separate and cannot be compared with other enumerated types. See this example:

If you really need to do something like that, you can either write a custom operator or add explicit casts to your query:

Enum labels are case sensitive, so 'happy' is not the same as 'HAPPY'. White space in the labels is significant too.

Although enum types are primarily intended for static sets of values, there is support for adding new values to an existing enum type, and for renaming values (see ALTER TYPE). Existing values cannot be removed from an enum type, nor can the sort ordering of such values be changed, short of dropping and re-creating the enum type.

An enum value occupies four bytes on disk. The length of an enum value's textual label is limited by the NAMEDATALEN setting compiled into PostgreSQL; in standard builds this means at most 63 bytes.

The translations from internal enum values to textual labels are kept in the system catalog pg_enum. Querying this catalog directly can be useful.

**Examples:**

Example 1 (typescript):
```typescript
CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
```

Example 2 (sql):
```sql
CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
CREATE TABLE person (
    name text,
    current_mood mood
);
INSERT INTO person VALUES ('Moe', 'happy');
SELECT * FROM person WHERE current_mood = 'happy';
 name | current_mood
------+--------------
 Moe  | happy
(1 row)
```

Example 3 (sql):
```sql
INSERT INTO person VALUES ('Larry', 'sad');
INSERT INTO person VALUES ('Curly', 'ok');
SELECT * FROM person WHERE current_mood > 'sad';
 name  | current_mood
-------+--------------
 Moe   | happy
 Curly | ok
(2 rows)

SELECT * FROM person WHERE current_mood > 'sad' ORDER BY current_mood;
 name  | current_mood
-------+--------------
 Curly | ok
 Moe   | happy
(2 rows)

SELECT name
FROM person
WHERE current_mood = (SELECT MIN(current_mood) FROM person);
 name
-------
 Larry
(1 row)
```

Example 4 (sql):
```sql
CREATE TYPE happiness AS ENUM ('happy', 'very happy', 'ecstatic');
CREATE TABLE holidays (
    num_weeks integer,
    happiness happiness
);
INSERT INTO holidays(num_weeks,happiness) VALUES (4, 'happy');
INSERT INTO holidays(num_weeks,happiness) VALUES (6, 'very happy');
INSERT INTO holidays(num_weeks,happiness) VALUES (8, 'ecstatic');
INSERT INTO holidays(num_weeks,happiness) VALUES (2, 'sad');
ERROR:  invalid input value for enum happiness: "sad"
SELECT person.name, holidays.num_weeks FROM person, holidays
  WHERE person.current_mood = holidays.happiness;
ERROR:  operator does not exist: mood = happiness
```

---

## 8.2. Monetary Types #

**URL:** https://www.postgresql.org/docs/current/datatype-money.html

**Contents:**
- 8.2. Monetary Types #

The money type stores a currency amount with a fixed fractional precision; see Table 8.3. The fractional precision is determined by the database's lc_monetary setting. The range shown in the table assumes there are two fractional digits. Input is accepted in a variety of formats, including integer and floating-point literals, as well as typical currency formatting, such as '$1,000.00'. Output is generally in the latter form but depends on the locale.

Table 8.3. Monetary Types

Since the output of this data type is locale-sensitive, it might not work to load money data into a database that has a different setting of lc_monetary. To avoid problems, before restoring a dump into a new database make sure lc_monetary has the same or equivalent value as in the database that was dumped.

Values of the numeric, int, and bigint data types can be cast to money. Conversion from the real and double precision data types can be done by casting to numeric first, for example:

However, this is not recommended. Floating point numbers should not be used to handle money due to the potential for rounding errors.

A money value can be cast to numeric without loss of precision. Conversion to other types could potentially lose precision, and must also be done in two stages:

Division of a money value by an integer value is performed with truncation of the fractional part towards zero. To get a rounded result, divide by a floating-point value, or cast the money value to numeric before dividing and back to money afterwards. (The latter is preferable to avoid risking precision loss.) When a money value is divided by another money value, the result is double precision (i.e., a pure number, not money); the currency units cancel each other out in the division.

**Examples:**

Example 1 (perl):
```perl
'$1,000.00'
```

Example 2 (unknown):
```unknown
lc_monetary
```

Example 3 (unknown):
```unknown
lc_monetary
```

Example 4 (unknown):
```unknown
double precision
```

---
