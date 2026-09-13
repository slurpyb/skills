## Request Body

**URL:** https://fastapi.tiangolo.com/tutorial/body/

**Contents:**
- Request Body¶
- Import Pydantic's BaseModel¶
- Create your data model¶
- Declare it as a parameter¶
- Results¶
- Automatic docs¶
- Editor support¶
- Use the model¶
- Request body + path parameters¶
- Request body + path + query parameters¶

When you need to send data from a client (let's say, a browser) to your API, you send it as a request body.

A request body is data sent by the client to your API. A response body is the data your API sends to the client.

Your API almost always has to send a response body. But clients don't necessarily need to send request bodies all the time, sometimes they only request a path, maybe with some query parameters, but don't send a body.

To declare a request body, you use Pydantic models with all their power and benefits.

To send data, you should use one of: POST (the most common), PUT, DELETE or PATCH.

Sending a body with a GET request has an undefined behavior in the specifications, nevertheless, it is supported by FastAPI, only for very complex/extreme use cases.

As it is discouraged, the interactive docs with Swagger UI won't show the documentation for the body when using GET, and proxies in the middle might not support it.

First, you need to import BaseModel from pydantic:

Then you declare your data model as a class that inherits from BaseModel.

Use standard Python types for all the attributes:

The same as when declaring query parameters, when a model attribute has a default value, it is not required. Otherwise, it is required. Use None to make it just optional.

For example, this model above declares a JSON "object" (or Python dict) like:

...as description and tax are optional (with a default value of None), this JSON "object" would also be valid:

To add it to your path operation, declare it the same way you declared path and query parameters:

...and declare its type as the model you created, Item.

With just that Python type declaration, FastAPI will:

The JSON Schemas of your models will be part of your OpenAPI generated schema, and will be shown in the interactive API docs:

And will also be used in the API docs inside each path operation that needs them:

In your editor, inside your function you will get type hints and completion everywhere (this wouldn't happen if you received a dict instead of a Pydantic model):

You also get error checks for incorrect type operations:

This is not by chance, the whole framework was built around that design.

And it was thoroughly tested at the design phase, before any implementation, to ensure it would work with all the editors.

There were even some changes to Pydantic itself to support this.

The previous screenshots were taken with Visual Studio Code.

But you would get the same editor support with PyCharm and most of the other Python editors:

If you use PyCharm as your editor, you can use the Pydantic PyCharm Plugin.

It improves editor support for Pydantic models, with:

Inside of the function, you can access all the attributes of the model object directly:

You can declare path parameters and request body at the same time.

FastAPI will recognize that the function parameters that match path parameters should be taken from the path, and that function parameters that are declared to be Pydantic models should be taken from the request body.

You can also declare body, path and query parameters, all at the same time.

FastAPI will recognize each of them and take the data from the correct place.

The function parameters will be recognized as follows:

FastAPI will know that the value of q is not required because of the default value = None.

The str | None is not used by FastAPI to determine that the value is not required, it will know it's not required because it has a default value of = None.

But adding the type annotations will allow your editor to give you better support and detect errors.

If you don't want to use Pydantic models, you can also use Body parameters. See the docs for Body - Multiple Parameters: Singular values in body.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

Example 2 (python):
```python
from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

Example 3 (json):
```json
{
    "name": "Foo",
    "description": "An optional description",
    "price": 45.2,
    "tax": 3.5
}
```

Example 4 (json):
```json
{
    "name": "Foo",
    "price": 45.2
}
```

---

