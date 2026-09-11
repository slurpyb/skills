## Bigger Applications - Multiple Files

**URL:** https://fastapi.tiangolo.com/tutorial/bigger-applications/

**Contents:**
- Bigger Applications - Multiple Files¶
- An example file structure¶
- APIRouter¶
  - Import APIRouter¶
  - Path operations with APIRouter¶
- Dependencies¶
- Another module with APIRouter¶
  - Import the dependencies¶
    - How relative imports work¶
  - Add some custom tags, responses, and dependencies¶

If you are building an application or a web API, it's rarely the case that you can put everything in a single file.

FastAPI provides a convenience tool to structure your application while keeping all the flexibility.

If you come from Flask, this would be the equivalent of Flask's Blueprints.

Let's say you have a file structure like this:

There are several __init__.py files: one in each directory or subdirectory.

This is what allows importing code from one file into another.

For example, in app/main.py you could have a line like:

The same file structure with comments:

Let's say the file dedicated to handling just users is the submodule at /app/routers/users.py.

You want to have the path operations related to your users separated from the rest of the code, to keep it organized.

But it's still part of the same FastAPI application/web API (it's part of the same "Python Package").

You can create the path operations for that module using APIRouter.

You import it and create an "instance" the same way you would with the class FastAPI:

And then you use it to declare your path operations.

Use it the same way you would use the FastAPI class:

You can think of APIRouter as a "mini FastAPI" class.

All the same options are supported.

All the same parameters, responses, dependencies, tags, etc.

In this example, the variable is called router, but you can name it however you want.

We are going to include this APIRouter in the main FastAPI app, but first, let's check the dependencies and another APIRouter.

We see that we are going to need some dependencies used in several places of the application.

So we put them in their own dependencies module (app/dependencies.py).

We will now use a simple dependency to read a custom X-Token header:

We are using an invented header to simplify this example.

But in real cases you will get better results using the integrated Security utilities.

Let's say you also have the endpoints dedicated to handling "items" from your application in the module at app/routers/items.py.

You have path operations for:

It's all the same structure as with app/routers/users.py.

But we want to be smarter and simplify the code a bit.

We know all the path operations in this module have the same:

So, instead of adding all that to each path operation, we can add it to the APIRouter.

As the path of each path operation has to start with /, like in:

...the prefix must not include a final /.

So, the prefix in this case is /items.

We can also add a list of tags and extra responses that will be applied to all the path operations included in this router.

And we can add a list of dependencies that will be added to all the path operations in the router and will be executed/solved for each request made to them.

Note that, much like dependencies in path operation decorators, no value will be passed to your path operation function.

The end result is that the item paths are now:

Having dependencies in the APIRouter can be used, for example, to require authentication for a whole group of path operations. Even if the dependencies are not added individually to each one of them.

The prefix, tags, responses, and dependencies parameters are (as in many other cases) just a feature from FastAPI to help you avoid code duplication.

This code lives in the module app.routers.items, the file app/routers/items.py.

And we need to get the dependency function from the module app.dependencies, the file app/dependencies.py.

So we use a relative import with .. for the dependencies:

If you know perfectly how imports work, continue to the next section below.

A single dot ., like in:

But that file doesn't exist, our dependencies are in a file at app/dependencies.py.

Remember what our app/file structure looks like:

The two dots .., like in:

That works correctly! 🎉

The same way, if we had used three dots ..., like in:

That would refer to some package above app/, with its own file __init__.py, etc. But we don't have that. So, that would throw an error in our example. 🚨

But now you know how it works, so you can use relative imports in your own apps no matter how complex they are. 🤓

We are not adding the prefix /items nor the tags=["items"] to each path operation because we added them to the APIRouter.

But we can still add more tags that will be applied to a specific path operation, and also some extra responses specific to that path operation:

This last path operation will have the combination of tags: ["items", "custom"].

And it will also have both responses in the documentation, one for 404 and one for 403.

Now, let's see the module at app/main.py.

Here's where you import and use the class FastAPI.

This will be the main file in your application that ties everything together.

And as most of your logic will now live in its own specific module, the main file will be quite simple.

You import and create a FastAPI class as normally.

And we can even declare global dependencies that will be combined with the dependencies for each APIRouter:

Now we import the other submodules that have APIRouters:

As the files app/routers/users.py and app/routers/items.py are submodules that are part of the same Python package app, we can use a single dot . to import them using "relative imports".

The module items will have a variable router (items.router). This is the same one we created in the file app/routers/items.py, it's an APIRouter object.

And then we do the same for the module users.

We could also import them like:

The first version is a "relative import":

The second version is an "absolute import":

To learn more about Python Packages and Modules, read the official Python documentation about Modules.

We are importing the submodule items directly, instead of importing just its variable router.

This is because we also have another variable named router in the submodule users.

If we had imported one after the other, like:

the router from users would overwrite the one from items and we wouldn't be able to use them at the same time.

So, to be able to use both of them in the same file, we import the submodules directly:

Now, let's include the routers from the submodules users and items:

users.router contains the APIRouter inside of the file app/routers/users.py.

And items.router contains the APIRouter inside of the file app/routers/items.py.

With app.include_router() we can add each APIRouter to the main FastAPI application.

It will include all the routes from that router as part of it.

FastAPI keeps the original APIRouter and its APIRoutes active when the router is included in the main application.

That means custom APIRouter and APIRoute subclasses can still participate after the router is included.

You don't have to worry about performance when including routers.

This is designed to be lightweight and to avoid adding overhead to each request.

So it won't affect performance. ⚡

Now, let's imagine your organization gave you the app/internal/admin.py file.

It contains an APIRouter with some admin path operations that your organization shares between several projects.

For this example it will be super simple. But let's say that because it is shared with other projects in the organization, we cannot modify it and add a prefix, dependencies, tags, etc. directly to the APIRouter:

But we still want to set a custom prefix when including the APIRouter so that all its path operations start with /admin, we want to secure it with the dependencies we already have for this project, and we want to include tags and responses.

We can declare all that without having to modify the original APIRouter by passing those parameters to app.include_router():

That way, the original APIRouter will stay unmodified, so we can still share that same app/internal/admin.py file with other projects in the organization.

The result is that in our app, each of the path operations from the admin module will have:

But that will only affect that APIRouter in our app, not in any other code that uses it.

So, for example, other projects could use the same APIRouter with a different authentication method.

We can also add path operations directly to the FastAPI app.

Here we do it... just to show that we can 🤷:

and it will work correctly, together with all the other path operations added with app.include_router().

Very Technical Details

Note: this is a very technical detail that you probably can just skip.

The APIRouters are not "mounted", they are not isolated from the rest of the application.

This is because we want to include their path operations in the OpenAPI schema and the user interfaces.

FastAPI keeps the original routers and path operations active, and combines the router prefixes, dependencies, tags, responses, and other metadata when handling requests and generating OpenAPI.

As your FastAPI app object lives in app/main.py, you can configure the entrypoint in your pyproject.toml file like this:

that is equivalent to importing like:

That way the fastapi command will know where to find your app.

You could also pass the path to the command, like:

But you would have to remember to pass the correct path every time you call the fastapi command.

Additionally, other tools might not be able to find it, for example the VS Code Extension or FastAPI Cloud, so it is recommended to use the entrypoint in pyproject.toml.

And open the docs at http://127.0.0.1:8000/docs.

You will see the automatic API docs, including the paths from all the submodules, using the correct paths (and prefixes) and the correct tags:

You can also use .include_router() multiple times with the same router using different prefixes.

This could be useful, for example, to expose the same API under different prefixes, e.g. /api/v1 and /api/latest.

This is an advanced usage that you might not really need, but it's there in case you do.

The same way you can include an APIRouter in a FastAPI application, you can include an APIRouter in another APIRouter using:

You can do this before or after including router in the FastAPI app. FastAPI will still include the path operations from other_router in routing and OpenAPI.

The same applies to path operations added later to the routers. They will be visible through the earlier inclusion too.

Avoid directly mutating router.routes after including a router. FastAPI treats router inclusion as live, so the original router and its routes remain part of routing and OpenAPI generation.

Use documented APIs such as path operation decorators and .include_router() to add routes and routers.

Treat router.routes as a lower-level route tree that can contain route definitions and included routers, and avoid relying on it as a flat list of final path operations.

**Examples:**

Example 1 (swift):
```swift
.
├── app
│   ├── __init__.py
│   ├── main.py
│   ├── dependencies.py
│   └── routers
│   │   ├── __init__.py
│   │   ├── items.py
│   │   └── users.py
│   └── internal
│       ├── __init__.py
│       └── admin.py
```

Example 2 (sql):
```sql
from app.routers import items
```

Example 3 (swift):
```swift
.
├── app                  # "app" is a Python package
│   ├── __init__.py      # this file makes "app" a "Python package"
│   ├── main.py          # "main" module, e.g. import app.main
│   ├── dependencies.py  # "dependencies" module, e.g. import app.dependencies
│   └── routers          # "routers" is a "Python subpackage"
│   │   ├── __init__.py  # makes "routers" a "Python subpackage"
│   │   ├── items.py     # "items" submodule, e.g. import app.routers.items
│   │   └── users.py     # "users" submodule, e.g. import app.routers.users
│   └── internal         # "internal" is a "Python subpackage"
│       ├── __init__.py  # makes "internal" a "Python subpackage"
│       └── admin.py     # "admin" submodule, e.g. import app.internal.admin
```

Example 4 (python):
```python
from fastapi import APIRouter

router = APIRouter()


@router.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}


@router.get("/users/{username}", tags=["users"])
async def read_user(username: str):
    return {"username": username}
```

---

