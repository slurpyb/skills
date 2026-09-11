## Query Parameters

**URL:** https://fastapi.tiangolo.com/tutorial/query-params/

**Contents:**
- Query Parameters¶
- Defaults¶
- Optional parameters¶
- Query parameter type conversion¶
- Multiple path and query parameters¶
- Required query parameters¶

When you declare other function parameters that are not part of the path parameters, they are automatically interpreted as "query" parameters.

The query is the set of key-value pairs that go after the ? in a URL, separated by & characters.

For example, in the URL:

...the query parameters are:

As they are part of the URL, they are "naturally" strings.

But when you declare them with Python types (in the example above, as int), they are converted to that type and validated against it.

All the same processes that apply to path parameters also apply to query parameters:

As query parameters are not a fixed part of a path, they can be optional and can have default values.

In the example above they have default values of skip=0 and limit=10.

So, going to the URL:

would be the same as going to:

But if you go to, for example:

The parameter values in your function will be:

The same way, you can declare optional query parameters, by setting their default to None:

In this case, the function parameter q will be optional, and will be None by default.

Also notice that FastAPI is smart enough to notice that the path parameter item_id is a path parameter and q is not, so, it's a query parameter.

You can also declare bool types, and they will be converted:

In this case, if you go to:

or any other case variation (uppercase, first letter in uppercase, etc), your function will see the parameter short with a bool value of True. Otherwise as False.

You can declare multiple path parameters and query parameters at the same time, FastAPI knows which is which.

And you don't have to declare them in any specific order.

They will be detected by name:

When you declare a default value for non-path parameters (for now, we have only seen query parameters), then it is not required.

If you don't want to add a specific value but just make it optional, set the default as None.

But when you want to make a query parameter required, you can just not declare any default value:

Here the query parameter needy is a required query parameter of type str.

If you open in your browser a URL like:

...without adding the required parameter needy, you will see an error like:

As needy is a required parameter, you would need to set it in the URL:

And of course, you can define some parameters as required, some as having a default value, and some entirely optional:

In this case, there are 3 query parameters:

You could also use Enums the same way as with Path Parameters.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10):
    return fake_items_db[skip : skip + limit]
```

Example 2 (sass):
```sass
http://127.0.0.1:8000/items/?skip=0&limit=10
```

Example 3 (yaml):
```yaml
http://127.0.0.1:8000/items/
```

Example 4 (sass):
```sass
http://127.0.0.1:8000/items/?skip=0&limit=10
```

---

