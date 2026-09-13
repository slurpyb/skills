## Response Status Code

**URL:** https://fastapi.tiangolo.com/tutorial/response-status-code/

**Contents:**
- Response Status Code¶
- About HTTP status codes¶
- Shortcut to remember the names¶
- Changing the default¶

The same way you can specify a response model, you can also declare the HTTP status code used for the response with the parameter status_code in any of the path operations:

Notice that status_code is a parameter of the "decorator" method (get, post, etc). Not of your path operation function, like all the parameters and body.

The status_code parameter receives a number with the HTTP status code.

status_code can alternatively also receive an IntEnum, such as Python's http.HTTPStatus.

Some response codes (see the next section) indicate that the response does not have a body.

FastAPI knows this, and will produce OpenAPI docs that state there is no response body.

If you already know what HTTP status codes are, skip to the next section.

In HTTP, you send a numeric status code of 3 digits as part of the response.

These status codes have an associated name to help recognize them, but the important part is the number.

To know more about each status code and which code is for what, check the MDN documentation about HTTP status codes.

Let's see the previous example again:

201 is the status code for "Created".

But you don't have to memorize what each of these codes mean.

You can use the convenience variables from fastapi.status.

They are just a convenience, they hold the same number, but that way you can use the editor's autocomplete to find them:

You could also use from starlette import status.

FastAPI provides the same starlette.status as fastapi.status just as a convenience for you, the developer. But it comes directly from Starlette.

Later, in the Advanced User Guide, you will see how to return a different status code than the default you are declaring here.

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.post("/items/", status_code=201)
async def create_item(name: str):
    return {"name": name}
```

Example 2 (python):
```python
from fastapi import FastAPI

app = FastAPI()


@app.post("/items/", status_code=201)
async def create_item(name: str):
    return {"name": name}
```

Example 3 (python):
```python
from fastapi import FastAPI, status

app = FastAPI()


@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(name: str):
    return {"name": name}
```

---

