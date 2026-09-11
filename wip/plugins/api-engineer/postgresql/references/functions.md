# Postgresql_Docs - Functions

**Pages:** 1

---

## Chapter 9. Functions and Operators

**URL:** https://www.postgresql.org/docs/current/functions.html

**Contents:**
- Chapter 9. Functions and Operators

PostgreSQL provides a large number of functions and operators for the built-in data types. This chapter describes most of them, although additional special-purpose functions appear in relevant sections of the manual. Users can also define their own functions and operators, as described in Part V. The psql commands \df and \do can be used to list all available functions and operators, respectively.

The notation used throughout this chapter to describe the argument and result data types of a function or operator is like this:

which says that the function repeat takes one text and one integer argument and returns a result of type text. The right arrow is also used to indicate the result of an example, thus:

If you are concerned about portability then note that most of the functions and operators described in this chapter, with the exception of the most trivial arithmetic and comparison operators and some explicitly marked functions, are not specified by the SQL standard. Some of this extended functionality is present in other SQL database management systems, and in many cases this functionality is compatible and consistent between the various implementations.

**Examples:**

Example 1 (unknown):
```unknown
AT TIME ZONE
```

Example 2 (unknown):
```unknown
repeat ( text, integer ) → text
```

Example 3 (unknown):
```unknown
repeat('Pg', 4) → PgPgPgPg
```

---
